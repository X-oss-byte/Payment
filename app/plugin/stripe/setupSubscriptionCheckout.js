require('dotenv').config()
const readline = require('readline')
const { promisify } = require('util')
const fs = require('fs')
const stripe = require('stripe')(process.env.STRIPE_SK)

const appendToFileSync = (file, data, successMsg = 'File Updated') => {
  return fs.promises.appendFile(file, data, 'utf8').then((err) => {
    if (err) throw err
    console.log(successMsg)
  })
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = promisify((message, fn) =>
  rl.question(message, (result) => fn(null, result))
)
// process.env.STRIPE_SK
const subscriptionCheckoutSetup = async () => {
  // Create products

  const priceList = [
    {
      currency: 'zar',
      unit_amount: 20000,
      recurring: {
        interval: 'month',
      },
      product_data: {
        id: 'prod_rw10X1Y2Z3001bxxb',
        name: 'Weekly Basket - 2 People',
      },
    },
    {
      currency: 'zar',
      unit_amount: 35000,
      recurring: {
        interval: 'month',
      },
      product_data: {
        id: 'prod_rw20Z3Y2X1002axxa',
        name: 'Weekly Basket - 4 People',
      },
    },
  ]

  const getPortalConfig = (prices) => {
    return {
      business_profile: {
        privacy_policy_url: 'https://example.com/privacy',
        terms_of_service_url: 'https://example.com/terms',
      },
      features: {
        invoice_history: {
          enabled: true,
        },
        payment_method_update: {
          enabled: true,
        },
        subscription_cancel: {
          cancellation_reason: {
            enabled: true,
            options: ['too_expensive', 'other'],
          },
          enabled: false,
          mode: 'at_period_end',
          proration_behavior: 'none',
        },
        subscription_update: {
          default_allowed_updates: ['price'],
          products: [
            {
              prices: [prices[0].id],
              product: prices[0].product,
            },
            {
              prices: [prices[1].id],
              product: prices[1].product,
            },
          ],
          enabled: true,
          proration_behavior: 'none',
        },
      },
    }
  }

  // TODO Check if productid exists
  try {
    await stripe.products.retrieve('prod_rw10X1Y2Z3001bxxb')
    console.log('Skipping Product Creation...')
    console.log('Skipping Customer Portal configuration...')
  } catch (err) {
    const priceResults = []

    console.log('Creating redwoodjs-stripe test Products and Prices')

    for (const price of priceList) {
      const result = await stripe.prices.create(price)
      priceResults.push(result)
    }

    // TODO: Add prompt to ask to configure Customer Portal
    console.log('Configuring Customer Portal')
    const configuration = await stripe.billingPortal.configurations.create(
      getPortalConfig(priceResults)
    )

    // Save config id to env
    await appendToFileSync(
      '.env',
      `STRIPE_PORTAL_ID=${configuration.id}\n`,
      'Stripe Customer Portal id has been added to .env'
    )

    return
  }

  // Scaffold out Customer Portal
  // fix command for payment generation
  // Scaffold out StripeCart
  // Generate functions
  // Refactor
}

subscriptionCheckoutSetup()