import "reflect-metadata";
import { createConnection, getConnection } from "typeorm";
import { Commands } from "./entity/Commands";
import { Command, MsgData } from "../module/types";

export class DataBase {
    private static async init(): Promise<void> {
        try {
            await createConnection();
            console.log("Connection created!");
        }catch (error) {
            console.log('Error connection!', error);
        }
    }

    private static async checkConnection(): Promise<void> {
        try {
            getConnection();
        }catch (e) {
            await DataBase.init();
        }
    }

    public async getCardList(): Promise<Command[]> {
        await DataBase.checkConnection();
        return await getConnection()
            .createQueryBuilder()
            .select("commands")
            .from(Commands, "commands")
            .where("commands.forChat = 'all'")
            .andWhere("commands.type = 'card'")
            .andWhere("commands.isActive = true")
            .getMany();
    }

    public async getCommand(msgData: MsgData): Promise<Command[]> {
        await DataBase.checkConnection();
        return await getConnection()
            .createQueryBuilder()
            .select("commands")
            .from(Commands, "commands")
            .where("(commands.command = :text OR commands.alias = :text)",{ text: msgData.text })
            .andWhere("(commands.forChat = :chatId OR commands.forChat = 'all')",{ chatId: msgData.chatId })
            .andWhere("commands.isActive = true")
            .getMany();
    }
}