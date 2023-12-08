const qrcode = require('qrcode-terminal')
const { Client, LocalAuth } = require('whatsapp-web.js')
const { getAnswer } = require('./gpt')
const fs = require('fs')
const { spawn } = require('child_process');


class BotManager extends Client {
    constructor(options) {
        super(options)
        const filename = 'contacts.txt'
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, '');
            console.log(`File ${filename} created successfully`)
        }
        fs.readFile(filename, 'utf-8', (err, buffer) => {
            if (err){
                console.log(err)
                return err
            }
            this._contacts = buffer.split('\n')
        })
    }

    async sendMessageToAll() {
        if (this._contacts) {
            for (let contact of this._contacts){
                const answer = "Привет. Вам скутер на Пхукете по классным ценам интересен?"
                await client.sendMessage(`${contact}@c.us`, answer)
            }
        }
    }

    get contacts() {
        return this._contacts
    }
}
 
const client = new BotManager({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox']
    }

})

client.on('qr', qr => {
    qrcode.generate(qr, {small: true})
})

client.on('ready', async () => {
    await client.sendMessageToAll()
    console.log('Client is ready!')
})

client.on('message', async message => {
    try {
        const answer = await getAnswer(message.from, message.body)
        await message.reply(answer)
    } catch {
        console.log('can`t run new thread.ERROR')
    }
})

client.initialize()
const server = spawn('node', ['server.js'])
server.stdout.on('data', (data) => {
    console.log(`server: ${data}`)
})
