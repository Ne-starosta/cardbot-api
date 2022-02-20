export interface MsgData {
    text: string,
    image: string,
    chatId: number,
    action: string,
    buttons: string[] | [],
}

export interface Command {
    id: number,
    command: string,
    alias: string,
    forChat: string,
    responseFile: string,
    responseText: string,
    type: string,
    isActive: boolean,
    ownerId: string,
    createdDate: Date,
}
