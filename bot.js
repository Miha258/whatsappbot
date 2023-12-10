const qrcode = require('qrcode-terminal')
const { client } = require('./client')
const { getAnswer } = require('./gpt')


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
        console.log('Can`t run new thread.ERROR')
    }
})

client.initialize()
