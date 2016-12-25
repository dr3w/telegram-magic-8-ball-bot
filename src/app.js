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

bot.on('inlineQuery', msg => {
    let query = msg.query;

    console.log(`inline query: ${ query }`);

    const answers = bot.answerList(msg.id, {cacheTime: 0, personal:true});

    answers.addArticle({
        id: 'query',
        title: 'Ask:',
        description: `${ query }`,
        message_text: getRandomMessage(),
        // thumb_url: 'https://f9e8507b.ngrok.io/src/img/ball.png'
    });

    return bot.answerQuery(answers)
})

function getRandomMessage() {
    const replies = [
        "Let me see...",
        "Shaking...",
        "Interesting..."
    ]

    const index = Math.floor(Math.random() * replies.length)

    return replies[index]
}

module.exports = bot.connect.bind(bot)
