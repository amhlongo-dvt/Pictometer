export type Email = `${string}@${string}.${string}`;

export type MessageType = "system" | "user";

export interface DBEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}



export interface DBUser extends DBEntity {
    name: string;
    email: Email;
    password: string;
}

export interface DBChat extends DBEntity {
    ownerId: DBUser['id'];
    name: string;
}

export interface DBMessage extends DBEntity {
    chatId: DBChat['id'];
    imageId: DBImage['id'];
    imageUrl: string;
}

export interface DBImage extends DBEntity{
    ownerId: DBUser['id'];
    filename: string;
    contentType: string;
    size: number;
    s3key: string;
}

export type DBCreateUser = Pick<DBUser, 'name' | 'email' | 'password'>;

export type DBCreateChat = Pick<DBChat, 'ownerId' | 'name'>;

export type DBCreateMessage = Pick<DBMessage, 'chatId' | 'imageId' | 'imageUrl'>;

export type DBCreateImage = Pick<DBImage, 'ownerId'  | 'contentType' | 'filename' | 's3key' | 'size'>
