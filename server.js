const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const { exec } = require('child_process')

const app = express()
const PORT = 3000

app.use(bodyParser.json())
app.get('/add/:phone', (req, res) => {
  const phoneNumber = req.params.phone

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' })
  }

  if (!currentPhoneNumbers.includes(phoneNumberToRemove)){
    return res.json({ message: 'Can`t found phone number to remove' })
  }

  if (!phoneNumberToRemove) {
    return res.status(400).json({ error: 'Phone number is required.' })
  }
  fs.appendFileSync('contacts.txt', `\n${phoneNumber}`)

  res.json({ message: 'Phone number added successfully.' })
})

app.get('/remove/:phone', (req, res) => {
  const phoneNumberToRemove = req.params.phone

  if (!phoneNumberToRemove) {
    return res.status(400).json({ error: 'Phone number is required.' })
  }

  const currentPhoneNumbers = fs.readFileSync('contacts.txt', 'utf8').split('\n')
  if (!currentPhoneNumbers.includes(phoneNumberToRemove)){
    return res.json({ message: 'Can`t found phone number to remove' })
  }
  
  const updatedPhoneNumbers = currentPhoneNumbers.filter(number => number !== phoneNumberToRemove)
  fs.writeFileSync('contacts.txt', updatedPhoneNumbers.join('\n'))
  res.json({ message: 'Phone number removed successfully.' })
})

app.get('/list', (req, res) => {
    const phoneNumbers = fs.readFileSync('contacts.txt', 'utf8').split('\n').filter(Boolean)
    res.json({ phoneNumbers })
})

app.get('/restart', (req, res) => {
    const bashScriptPath = './restart.sh'
    exec(`bash ${bashScriptPath}`, (error, stdout, stderr) => {
    if (error) {
        res.json({ message: `Error executing Bash script: ${error}`})
        return
    }
        res.json({ message: `Bot restarted!`})
    })
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
