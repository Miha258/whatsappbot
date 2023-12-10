const { Client, LocalAuth } = require('whatsapp-web.js')
const fs = require('fs')
const filename = 'contacts.txt'

class BotManager extends Client {
    constructor(options) {
        super(options)
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, '');
            console.log(`File ${filename} created successfully`)
        }
    }
    
    getGreetings(){
        try {
          let greetings = fs.readFileSync('./greetings.json', {encoding: 'utf8'})
          greetings = JSON.parse(greetings)
          return greetings
        } catch (err) {
          return { message: `Error: ${err}` }
        }
    }

    async sendMessageByPhone(phone, text, delay) {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                await client.sendMessage(`${phone}@c.us`, text)
                resolve()
            }, delay)
        })
    }

    async sendMessageToAll() {
        try {
            let contacts = fs.readFileSync(filename, { encoding: 'utf-8' })
            const greetings = this.getGreetings()

            if (contacts) {
                contacts = contacts.split('\n')

                for (let contact of contacts) {
                    const answer = greetings[Math.floor(Math.random() * greetings.length)]
                    const randomDelay = Math.floor(Math.random() * (5000 - 1000 + 1)) + 10000
                    await this.sendMessageByPhone(contact, answer.text, randomDelay)
                }
            }
        } catch (error) {
            console.error('Error reading file:', error);
        }
    }

}
 
const client = new BotManager({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox']
    }

})

module.exports = { client }