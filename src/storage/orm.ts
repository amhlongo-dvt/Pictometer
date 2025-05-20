import type {PrismaClient} from "@prisma/client";

import type {
    DBChat,
    DBCreateChat,
    DBCreateMessage,
    DBCreateUser,
    DBMessage,
    DBUser,
} from "../models/db";

import type {IDatabaseResource} from "./types";

export class UserDBResource implements IDatabaseResource<DBUser, DBCreateUser> {
    prisma: PrismaClient;
    
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async create(data: DBCreateUser): Promise<DBUser> {
        const user = await this.prisma.user.create({
            data: {...data}
        })
        return user as DBUser;
    }

    async delete(id: string): Promise<DBUser | null> {
        const user = await this.prisma.user.delete({
            where: {id: id}
        })
        return user as DBUser;
    }

    async get(id: string): Promise<DBUser | null> {
        const user = await this.prisma.user.findFirst({
            where: {id: id}
        })
        return user as DBUser | null;
    }

    async find(data: Partial<DBUser>): Promise<DBUser | null> {
        const user = await this.prisma.user.findFirst({
            where: {...data}
        })
        return user as DBUser | null;
    }

    async findAll(data: Partial<DBUser>): Promise<DBUser[]> {
        const users = await this.prisma.user.findMany({
            where: {...data}
        })
        return users as DBUser[];
    }

    async update(id: string, data: Partial<DBUser>): Promise<DBUser | null>{
        const updateUser = await this.prisma.user.update({
            where: {
                id,
            },
            data
        })
        return updateUser as DBUser | null;
    }
}



