'use strict'

const TeleBot = require('telebot')
const cfg = require('../config')

const bot = new TeleBot({
    token: cfg.token,
    webhook: {
        url: cfg.webhook,
        port: process.env.PORT || cfg.port
    }
})

bot.use(require('./modules/ask.js'))

bot.on('/start', msg => {
    const userId = msg.from.id

    return bot.sendMessage(userId, 'Ask me anything...')
})

bot.on('text', msg => {
    console.log(msg)
})

bot.on('inlineQuery', msg => {
    console.log(msg)

    // const messageId = msg.id
    const chatId = msg.from.id
    const query = msg.query

    const answers = bot.answerList(msg.id, {cacheTime: 0, personal: true})

    answers.addArticle({
        id: 'query',
        title: 'Ask:',
        description: `${ query }?`,
        message_text: getRandomMessage(),
        thumb_url: cfg.staticUrl + 'img/ball.png'
    })

    sendPrediction(chatId, query)

    return bot.answerQuery(answers)
})

function sendPrediction(chatId, caption) {
    setTimeout(() => {
        bot
            .sendPhoto(chatId, getRandomImage(), {
                caption
            })
            .catch(err => {
                console.log(err)
            })
    }, 1500)
}

function getRandomMessage() {
    const replies = [
        "Let me see...",
        "Shaking...",
        "Interesting..."
    ]

    const index = Math.floor(Math.random() * replies.length)

    return replies[index]
}

function getRandomImage() {
    const min = 1
    const max = 20
    const rand = Math.floor(Math.random() * (max - min + 1)) + min

    return cfg.staticUrl + 'img/' + rand + '.png'
}

module.exports = bot.connect.bind(bot)
