import express from 'express'
import axios from 'axios'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const base = 'https://api-m.sandbox.paypal.com'

// console.log(process.env.PAYPAL_CLIENT_ID , process.env.PAYPAL_CLIENT_SECRET);
// Get PayPal Access Token
async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64')

  const { data } = await axios.post(
    `${base}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )

  return data.access_token
}

// Create Order
app.post('/api/paypal/create-order', async (req, res) => {
  const { amount } = req.body // e.g., { amount: '9.99' }
  const accessToken = await getAccessToken()

  const { data } = await axios.post(
    `${base}/v2/checkout/orders`,
    {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount
          }
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )
  
  res.json(data)
})

// Capture Order
app.post('/api/paypal/capture-order/:orderID', async (req, res) => {
  const { orderID } = req.params
  const accessToken = await getAccessToken()

  const { data } = await axios.post(
    `${base}/v2/checkout/orders/${orderID}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )
  console.log(data);
  res.json(data)
})

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'))
