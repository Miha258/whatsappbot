const { OpenAI } = require('openai')
require('dotenv').config()

const threadByUser = {}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const assistantIdToUse = process.env.ASSISTANT_ID
async function getAnswer(userId, message) {
  const runInstance = await createRun(userId, message)
  await retrieveRun(userId, runInstance)
  const allMessages = await openai.beta.threads.messages.list(
    threadByUser[userId]
  )
  return allMessages.data[0].content[0].text.value
}

async function createRun(userId, message) {
  if (!threadByUser[userId]){
    const thread = await openai.beta.threads.create()
    console.log("New thread created with ID: ", thread.id, "\n")
    threadByUser[userId] = thread.id
  }

  const threadMessage = await openai.beta.threads.messages.create(
    threadByUser[userId],
    {
      role: "user",
      content: message,
    }
  )
  console.log("This is the message object: ", threadMessage, "\n")
  const runInstance = await openai.beta.threads.runs.create(
    threadByUser[userId],
    {
      assistant_id: assistantIdToUse,
      tools: [
        { type: "code_interpreter" }
      ],
    }
  )
  console.log("This is the run object: ", runInstance, "\n")
  return runInstance
}

async function retrieveRun(userId, runInstance) {
  while (runInstance.status !== "completed") {
    runInstance = await openai.beta.threads.runs.retrieve(
      threadByUser[userId],
      runInstance.id
    )

    console.log(`Run status: ${runInstance.status}`)
    if (runInstance.status === "completed") {
      console.log("\n")
      break
    }
  }
}

module.exports = {
  getAnswer
}