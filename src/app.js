'use strict'

const TeleBot = require('telebot')
const cfg = require('../config')

const BOT_NAME = '@MagicEightBallBot'
const CHAT_TYPE_PRIVATE = 'private'

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
    const chatId = msg.chat && msg.chat.id
    const isChatPrivate = msg.chat && msg.chat.type === CHAT_TYPE_PRIVATE
    const msgId = msg.message_id
    const msgText = msg.text.trim()
    const isMsgNotEmpty = !!msgText.replace(`${BOT_NAME}`, '').trim().length

    if (!(
            isMsgNotEmpty && (isChatPrivate || ~msgText.indexOf(BOT_NAME))
        )) return

    sendRandomMessage(chatId)
        .then(() => sendPrediction(chatId, msgId))
})

bot.on('inlineQuery', msg => {
    const answers = bot.answerList(msg.id, {cacheTime: 0, personal: true})

    return bot.answerQuery(answers)
})

// bot.on('inlineQuery', msg => {
//     let query = msg.query.trim()
//
//     if (!query) return
//
//     query = query.replace(/\?+$/, '') + '?'
//
//     const answers = bot.answerList(msg.id, {cacheTime: 0, personal: true})
//
//     answers.addArticle({
//         id: 'query',
//         title: 'Ask:',
//         description: query,
//         message_text: query,
//         thumb_url: cfg.staticUrl + 'img/ball.png'
//     })
//
//     return bot.answerQuery(answers)
// })

/**
 *
 * @param chatId
 * @param msgId
 */
function sendPrediction(chatId, msgId) {
    setTimeout(() => {
        bot
            .sendPhoto(chatId, getRandomImage(), {
                reply: msgId
            })
            .catch(err => {
                console.log(err)
            })
    }, 1500)
}

/**
 *
 * @param chatId
 * @returns {Promise}
 */
function sendRandomMessage(chatId) {
    const botMsg = getRandomMessage()

    return bot.sendMessage(chatId, botMsg)
}

function getRandomMessage() {
    const replies = [
        'Let me see...',
        'Shaking...',
        'Interesting...',
        'Give me a moment...'
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
