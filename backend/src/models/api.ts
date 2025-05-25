import type{
    DBUser,
    DBChat,
    DBMessage,
    DBCreateUser,
    DBCreateChat,
    DBCreateMessage,
    DBImage,
    DBCreateImage
} from "./db";

export type APICreateUser = DBCreateUser;
export type APIUser = Omit<DBUser, "password">;

export type APICreateChat = DBCreateChat;
export type APIChat = DBChat;

export type APICreateMessage = DBCreateMessage;
export type APIMessage = DBMessage;

export type APICreateImage = DBCreateImage;
export type APImage = DBImage;
