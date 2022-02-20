// import secret token
import { TG_TOKEN } from '../../secret';

import { get_commands } from "../module/commands";
import { MsgData } from "../module/types";
import { Message } from "./types";

const TelegramApi = require('node-telegram-bot-api');
const bot = new TelegramApi(TG_TOKEN, {polling: true});

bot.on('message', async (msg: Message) => {
    const text: string = msg.text.toLowerCase();
    const chatId: number = msg.chat.id;
    const msgData: MsgData = {
        text,
        chatId,
        image: '',
        buttons: [],
        action: 'message',
    };
    const data: MsgData = await get_commands(msgData);

    sendMessage(data);
})

function sendMessage(msgData : MsgData): void {
    if (msgData.image) {
        bot.sendPhoto(msgData.chatId, 'src/static/' + msgData.image,{
            reply_markup: {
                inline_keyboard: setKeyboard(msgData.buttons)
            },
            caption: msgData.text || '',
        });
        return
    }

    if (msgData.text) {
        bot.sendMessage(msgData.chatId, msgData.text, {
            reply_markup: {
                inline_keyboard: setKeyboard(msgData.buttons)
            }
        });
        return;
    }
    bot.sendSticker(msgData.chatId, 'src/tg-bot/stickers/stick_bot.webp');
}

function setKeyboard(cardList: string[]) {
    const buttonList = cardList.map(item => {
        return {
            text: item,
            callback_data: JSON.stringify({ type: 'card', title: item }),
        }
    })

    const keyboard = []
    for(let i = 0; buttonList.length > 0; i++){
        const t = buttonList.splice(0,3);
        keyboard.push(t);
    }
    return keyboard || [];
}

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
    const action = JSON.parse(callbackQuery.data);
    const msg = callbackQuery.message;

    const text: string = action.title.toLowerCase();
    const chatId: number = msg.chat.id;
    const msgData: MsgData = {
        text,
        chatId,
        image: '',
        buttons: [],
        action: 'button',
    };
    const data: MsgData = await get_commands(msgData);
    sendMessage(data);
});
