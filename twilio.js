const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const { getAnswer } = require('./gpt')

const app = express()
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)


app.post('/webhook', async (req, res) => {
    const message = req.body.Body
    const sender = req.body.From
    try {
      const answer = await getAnswer(sender, message)
      
      client.messages.create({
        from: 'whatsapp:+14155238886',
        body: answer,
        to: sender
      })
      .then(message => console.log(message.sid))
      res.send('Received your message')
    } catch (e) {
      client.messages.create({
        from: 'whatsapp:+14155238886',
        body: "Please wait for response...",
        to: sender
      })
      .then(message => console.log(message.sid))
      res.send('Wait for response error')
    }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})