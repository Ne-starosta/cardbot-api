import { DataBase } from "../../database";
import { MsgData, Command } from "../types";

export async function get_commands(msgData: MsgData): Promise<MsgData> {
    const DB = await new DataBase();
    if (msgData.text.toLowerCase() === 'карты') {
        return await getCardList(DB, msgData);
    }

    const commandList = await DB.getCommand(msgData);
    const bestCommand = getBestCommand(commandList, msgData.text);

    return bestCommand ?
        {
            ...msgData,
            text: bestCommand.responseText || '',
            image: bestCommand.responseFile || '',
        } :
        {
            ...msgData,
            text: '',
            image: '',
        }
}

function getBestCommand(items: Command[], searchText: string): Command {
    const privateCommandList = items.filter(item => item.forChat !== 'all');
    const publicCommandList = items.filter(item => item.forChat === 'all');

    const bestPrivateCommandList = privateCommandList.filter(item => item.command === searchText);
    const notBestPrivateCommandList = privateCommandList.filter(item => item.alias === searchText);

    const bestPublicCommandList = publicCommandList.filter(item => item.command === searchText);
    const notBestPublicCommandList = publicCommandList.filter(item => item.alias === searchText);

    const bestPrivateCommand = bestPrivateCommandList.length
        ? randomItem(bestPrivateCommandList)
        : randomItem(notBestPrivateCommandList);

    const bestPublicCommand = bestPublicCommandList.length
        ? randomItem(bestPublicCommandList)
        : randomItem(notBestPublicCommandList);

    return bestPrivateCommand || bestPublicCommand;
}

function randomItem(items: Command[]): Command {
    const index = Math.floor(Math.random() * items.length);
    return items[index];
}

async function getCardList(DB: DataBase, msgData: MsgData): Promise<MsgData> {
    const responseList = await DB.getCardList();
    const cardList = responseList.map(item => item.command);
    const uniqueList = Array.from(new Set(cardList));

    return {
        ...msgData,
        text: 'Список карт',
        image: '',
        buttons: uniqueList || [],
    }
}