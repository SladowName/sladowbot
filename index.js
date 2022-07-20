const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
require('dotenv').config();

const bot = new TelegramApi(process.env.TELEGRAM_API_TOKEN, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Now i guess number about 1 to 9');
    const randomNumber = Math.floor(Math.random()*10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Go',gameOptions);
}

const start = async () => {
    await bot.setMyCommands([
        { command: '/start', description: 'First link' },
        { command: '/info', description: 'Info about user' },
        { command: '/game', description: 'Play to game' },
    ])

    bot.on( 'message', async message => {
        const text = message.text;
        const chatId = message.chat.id;

        if (text === '/start') {
            await bot.sendMessage(chatId, 'https://tlgrm.ru/_/stickers/553/d0f/553d0fe9-6e6d-4c5e-b48e-8efa8b86e5f3/2.jpg')
            return bot.sendMessage(chatId, `You are welcome`);
        }
        if (text === '/info') {
            return  bot.sendMessage(chatId, `Your name ${message.from.first_name} ${message.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'I dont understand you');
    })

    bot.on('callback_query', async message => {
        const data = message.data;
        const chatId = message.message.chat.id;

        if(data ==='again') {
            return startGame(chatId);
        }
        if (data === chats[chatId].toString()) {
            return await bot.sendMessage(chatId, 'Congratulation you win', againOptions);
        } else {
            return await bot.sendMessage(chatId, `You lost bot choose ${chats[chatId]}`, againOptions);
        }
    })
}

start();