const randomstring = require('randomstring')

class Bot {
  constructor(type) {
    this.type = type
    if (type === 'LEX') {
      this.initiate = initiateLex
      this.message = messageLex
    } else if (type === 'DIALOG_FLOW') {
      this.initiate = initiateDialogFlow
      this.message = messageDialogFlow
    }
  }
}

// Lex methods

function initiateLex(user) {
  const aws = require('aws-sdk')

  this.service = new aws.LexRuntime({region: 'us-east-1'})
  return `${user.id}-${randomstring.generate()}`
}

function messageLex(sessionUserId, text, callback) {
  this.service.postText(
    {
      botAlias: process.env.BOT_ALIAS,
      botName: process.env.BOT_NAME,
      userId: sessionUserId,
      inputText: text,
      sessionAttributes: {
        sessionUserId
        // enter user data here, calorie goals, currentCalories, weight, etc.
      }
    },
    callback
  )
}

// Dialogflow methods

function initiateDialogFlow(user) {
  const dialogflow = require('dialogflow')

  this.service = new dialogflow.SessionsClient()
  return this.service.sessionPath(
    process.env.PROJECT_ID,
    `${user.id}-${randomstring.generate()}`
  )
}

function messageDialogFlow(sessionUserId, text, callback) {
  this.service
    .detectIntent({
      session: sessionUserId,
      queryInput: {
        text: {
          text,
          languageCode: 'en-US'
        }
      }
    })
    .then(responses => {
      callback(null, responses)
    })
    .catch(err => callback(err))
}

module.exports = new Bot(process.env.BOT)
