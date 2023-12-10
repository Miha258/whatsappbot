const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const { client } = require('./client')
const path = require('path')
const fileUpload = require('express-fileupload')
const { exec } = require('child_process')

const app = express()
const PORT = 3000

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'static'))
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(bodyParser.json())
app.use(fileUpload())

app.get('/add', (req, res) => {
  res.render('upload')
})

app.post('/add', (req, res) => {
  try {
    if (!req.files || !req.files.phoneNumbersFile) {
      return res.status(400).json({ error: 'Please choose a file to upload.' });
    }

    const uploadedFile = req.files.phoneNumbersFile;
    const phoneNumbers = uploadedFile.data.toString().split('\n');
    phoneNumbers.forEach(phoneNumber => {
      if (phoneNumber.trim() !== '') {
        fs.appendFileSync('contacts.txt', `\n${phoneNumber.trim()}`);
      }
    });

    res.json({ message: 'Phone numbers added successfully.' });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
    try {
      const script = `bash ${__dirname}/restart.sh`
      exec(script).addListener('message', message => console.log(message))
      res.json({ message: 'Bot restarted!'})
    } catch(e) {
        res.json({message: `An error occured: ${e}`})
    }
})


app.get('/greetings', (req, res) => {
  res.json(client.getGreetings())
})


app.get('/addGreet', (req, res) => {
  res.render('greet')
})


app.post('/addGreet', (req, res) => {
  const { text } = req.body
  const greetings = client.getGreetings()
  const newGreeting = {
    id: greetings.length + 1,
    text: text,
  }

  greetings.push(newGreeting)
  fs.writeFileSync('./greetings.json', JSON.stringify(greetings, null, 2))
  res.status(201).json({ message: 'Greeting added successfully!' })
})


app.get('/removeGreet/:id', (req, res) => {
  const { id } = req.params
  const greetings = client.getGreetings()
  const index = greetings.findIndex((greeting) => greeting.id === parseInt(id))

  if (index !== -1) {
    greetings.splice(index, 1)[0]
    fs.writeFileSync('./greetings.json', JSON.stringify(greetings, null, 2))
    res.redirect('/greetings')
  } else {
    res.status(404).json({ message: 'Greeting not found' })
  }
})

app.listen(PORT, '::', () => {
  console.log(`Server is running on port ${PORT}`)
})