// import secret token
import { CONFIG_DATABASE } from '../../secret';

import { Command, MsgData } from "../module/types";
import { Connection } from "mysql2";
const mysql = require('mysql2/promise');

export class DataBase {
    private static connection: Connection;

    private static async init(): Promise<void> {
        try {
            DataBase.connection = await mysql.createConnection(CONFIG_DATABASE);
        }catch (error) {
            console.log('Error connection!', error);
        }
    }

    private static async delete(): Promise<void> {
        try {
            await DataBase.connection.end();
        }catch (error) {
            console.log('Error deleted!', error);
        }
    }

    public async getCardList(): Promise<Command[]> {
        await DataBase.init();
        const sql = "SELECT * FROM `commands` WHERE `forChat` = ? AND `type` = ? AND `isActive` = ?"
        const data = ['all', 'card', true];
        const rows = await DataBase.connection.execute(sql, data);
        await DataBase.delete();
        return rows[0];
    }

    public async getCommand(msgData: MsgData): Promise<Command[]> {
        await DataBase.init();
        const sql = "SELECT * FROM `commands` WHERE (`command` = ? OR `alias` = ?) AND (`forChat` = ? OR `forChat` = ?) AND `isActive` = ?"
        const data = [msgData.text, msgData.text, msgData.chatId, 'all', true];
        const rows = await DataBase.connection.execute(sql, data);
        await DataBase.delete();
        return rows[0];
    }
}
