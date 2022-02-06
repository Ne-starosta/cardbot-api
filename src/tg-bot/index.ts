import { TOKEN } from "./config";
import { get_commands } from "../module/commands";
import { MsgData } from "../module/types";

const TelegramApi = require('node-telegram-bot-api');
const bot = new TelegramApi(TOKEN, {polling: true});

bot.on('message', async msg => {
    const text: string = msg.text;
    const chatId: string = msg.chat.id;
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

