import { Link, routes, useParams } from '@redwoodjs/router'
import { useEffect } from 'react'
// import {retrieveCheckoutSession} from '../../../../plugin/stripe/lib/index.js'

const HomePage = () => {
// const { success, sessionId } = useParams()


//   useEffect(() => {
//     const fetchSessionData = async () => {
//       let sessionData
//       if (success === 'true') {
//         sessionData = await retrieveCheckoutSession(sessionId)
//         console.log(sessionData)
//       }
//     }
//     fetchSessionData()
//   }, [success])

  return (
    <>
      <h2>Produce for Sale</h2>
      <p>A list of products from Stripe</p>

      <h2>Farmer's Table Subscription</h2>
      <p>Get a weekly basket of seasonal fruits & veggies grown on The Farm</p>
    </>
  )
}

export default HomePage
