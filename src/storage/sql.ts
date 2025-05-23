import type { Pool } from "pg";
import type {
    DBChat,
    DBCreateChat,
    DBCreateMessage,
    DBCreateUser,
    DBMessage,
    DBUser,
    DBCreateImage,
    DBImage
} from "../models/db";

import type { IDatabaseResource } from "./types";

export class UserSQLResource implements IDatabaseResource<DBUser, DBCreateUser> {
    pool: Pool;
    constructor(pool: Pool) {
        this.pool = pool;
    }

    async create(data: DBCreateUser): Promise<DBUser> {
        const query = 'INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3) RETURNING *';
        const values = [data.name, data.email, data.password];
        const result = await this.pool.query(query, values);
        return result.rows[0] as DBUser;
    }

    async delete(id: string): Promise<DBUser | null> {
        const query = 'DELETE FROM "user" WHERE id = $1 RETURNING *';
        const values = [id];
        const result = await this.pool.query(query, values);
        return result.rowCount ?? 0 > 0 ? result.rows[0] as DBUser : null;
    }
    async get(id: string): Promise<DBUser | null> {
        const query = 'SELECT * FROM "user" WHERE id = $1';
        const values = [id];
        const result = await this.pool.query(query, values);
        return result.rowCount ?? 0 > 0 ? result.rows[0] as DBUser : null;
    }
    async find(data: Partial<DBUser>): Promise<DBUser | null> {
       return this.findByFields(data, false)
    }
    async findAll(data: Partial<DBUser>): Promise<DBUser[]> {
       return this.findByFields(data, true)
    }
    async update(id: string, data: Partial<DBUser>): Promise<DBUser | null> {
        const fields: string[] = [];
        const values = [] ;
        
        Object.keys(data).forEach((key, index) => {
            fields.push(`"${key}" = $${index + 1}`);
            values.push(data[key as keyof DBUser]);
        });

        values.push(id);

        const setClause = fields.join(', ');
        const query = `UPDATE \"user\" SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
        const result = await this.pool.query(query, values);
        return result.rowCount ?? 0 > 0 ? (result.rows[0] as DBUser) : null;
    }

    private async findByFields<T extends (DBUser | null) | DBUser[]> (
        data: Partial<DBUser>, 
        all: boolean = false
    ): Promise<T> {
        const fields: string[] = [];
        const values: unknown[] = [];
        
        Object.entries(data).forEach(([key, value], index) => {
            fields.push(`"${key}" = $${index + 1}`);
            values.push(data[key as keyof DBUser]);
        });

        const whereClause = fields.length > 0 ? `WHERE ${fields.join(' AND ')}` : '';
        const query = `SELECT * FROM \"user\" ${whereClause}`;

        const result = await this.pool.query(query, values);
        return all ? (result.rows as T) 
                    : result.rowCount ?? 0 > 0 
                    ? result.rows[0] as T 
                    : (null as T)
    }   
}

export class ChatSQLResource implements IDatabaseResource<DBChat, DBCreateChat> {
    pool: Pool;
    constructor(pool: Pool) {
        this.pool = pool;
    }
    
    async create(data: DBCreateChat): Promise<DBChat> {
        const query = 'INSERT INTO chat (name, "ownerId") VALUES ($1, $2) RETURNING *';
        const values = [data.name, data.ownerId];
        const result = await this.pool.query(query, values);
        return result.rows[0] as DBChat;
    }

    async delete(id: string): Promise<DBChat | null> {
        const query = 'DELETE FROM "chat" WHERE id = $1 RETURNING *';
        const values = [id];
        const result = await this.pool.query(query, values);
        return result.rowCount ?? 0 > 0 ? (result.rows[0] as DBChat) : null;
    }

    async get(id: string): Promise<DBChat | null> {
        const query = 'SELECT * FROM "chat" WHERE id = $1';
        const values = [id];
        const result = await this.pool.query(query, values);
        return result.rowCount ?? 0 > 0 ? result.rows[0] as DBChat : null;
    }

    async find(data: Partial<DBChat>): Promise<DBChat | null> {
        return this.findByFields(data, false)
    }

    async findAll(data: Partial<DBChat>): Promise<DBChat[]> {
        return this.findByFields(data, true)
    }

    private async findByFields<T extends (DBChat | null) | DBChat[]> (
        data: Partial<DBChat>, 
        all: boolean = false
    ): Promise<T> {
        const fields: string[] = [];
        const values: unknown[] = [];
        
        Object.entries(data).forEach(([key, value], index) => {
            fields.push(`"${key}" = $${index + 1}`);
            values.push(data[key as keyof DBChat]);
        });

        const whereClause = fields.length > 0 ? `WHERE ${fields.join(' AND ')}` : '';
        const query = `SELECT * FROM "chat" ${whereClause}`;

        const result = await this.pool.query(query, values);
        return all ? (result.rows as T) 
                    : result.rowCount ?? 0 > 0 
                    ? result.rows[0] as T 
                    : (null as T)
    }

    async update(id: string, data: Partial<DBChat>): Promise<DBChat | null> {
        const fields: string[] = [];
        const values = [] ;
        
        Object.keys(data).forEach((key, index) => {
            fields.push(`"${key}" = $${index + 1}`);
            values.push(data[key as keyof DBChat]);
        });

        values.push(id);

        const setClause = fields.join(', ');
        const query = `UPDATE "chat" SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
        const result = await this.pool.query(query, values);
        return result.rowCount ?? 0 > 0 ? (result.rows[0] as DBChat) : null;
    }
}

export class MessageSQLResorce implements IDatabaseResource<DBMessage, DBCreateMessage> {
    pool: Pool;
    constructor(pool: Pool) {
        this.pool = pool;
    }
    
    async create(data: DBCreateMessage): Promise<DBMessage> {
        const query = 'INSERT INTO "message" ("chatId", type, message) VALUES ($1, $2, $3) RETURNING *';
        const values = [data.chatId, data.type, data.message];
        const result = await this.pool.query(query, values);
        return result.rows[0] as DBMessage;
    }

    async delete(id: string): Promise<DBMessage | null> {
        const query = 'DELETE FROM "message" WHERE id = $1 RETURNING *';
        const values = [id];
        const result = await this.pool.query(query, values);
        return result.rowCount ?? 0 > 0 ? (result.rows[0] as DBMessage) : null;
    }

    async get(id: string): Promise<DBMessage | null> {
        const query = 'SELECT * FROM "message" WHERE id = $1';
        const values = [id];
        const result = await this.pool.query(query, values);
        return result.rowCount ?? 0 > 0 ? (result.rows[0] as DBMessage) : null;
    }

    async find(data: Partial<DBMessage>): Promise<DBMessage | null> {
        return this.findByFields(data, false)
    }

    async findAll(data: Partial<DBMessage>): Promise<DBMessage[]> {
        return this.findByFields(data, true)
    }

    private async findByFields<T extends (DBMessage | null) | DBMessage[]> (
        data: Partial<DBMessage>, 
        all: boolean = false
    ): Promise<T> {
        const fields: string[] = [];
        const values: unknown[] = [];
        
        Object.entries(data).forEach(([key, value], index) => {
            fields.push(`"${key}" = $${index + 1}`);
            values.push(data[key as keyof DBMessage]);
        });

        const whereClause = fields.length > 0 ? `WHERE ${fields.join(' AND ')}` : '';
        const query = `SELECT * FROM "message" ${whereClause}`;

        const result = await this.pool.query(query, values);
        return all ? (result.rows as T) 
                    : result.rowCount ?? 0 > 0 
                    ? result.rows[0] as T 
                    : (null as T)
    }

    async update(id: string, data: Partial<DBMessage>): Promise<DBMessage | null> {
        const fields: string[] = [];
        const values = [] ;
        
        Object.keys(data).forEach((key, index) => {
            fields.push(`"${key}" = $${index + 1}`);
            values.push(data[key as keyof DBMessage]);
        });

        values.push(id);

        const setClause = fields.join(', ');
        const query = `UPDATE "message" SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
        const result = await this.pool.query(query, values);
        return result.rowCount ?? 0 > 0 ? (result.rows[0] as DBMessage) : null;
    }
}

export class ImageSQLResource implements IDatabaseResource<DBImage, DBCreateImage> {
    pool: Pool;
    constructor(pool: Pool) {
        this.pool = pool;
    }
    
    async create(data: DBCreateImage): Promise<DBImage> {
        const query = 'INSERT INTO "image" (ownerId, filename, contentType, size, s3key) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [data.ownerId, data.filename, data.contentType, data.size, data.s3key];
        const result = await this.pool.query(query, values);
        return result.rows[0] as DBImage;
    }

    async delete(id: string): Promise<DBImage | null> {
        const query = 'DELETE FROM "image" WHERE id = $1 RETURNING *';
        const values = [id];
        const result = await this.pool.query(query, values);
        return result.rowCount ?? 0 > 0 ? (result.rows[0] as DBImage) : null;
    }

    async get(id: string): Promise<DBImage | null> {
        const query = 'SELECT * FROM "image" WHERE id = $1';
        const values = [id];
        const result = await this.pool.query(query, values);
        return result.rowCount ?? 0 > 0 ? (result.rows[0] as DBImage) : null;
    }

    async find(data: Partial<DBImage>): Promise<DBImage | null> {
        return this.findByFields(data, false);
    }

    async findAll(data: Partial<DBImage>): Promise<DBImage[]> {
        return this.findByFields(data, true);
    }

    private async findByFields<T extends (DBImage | null) | DBImage[]> (
        data: Partial<DBImage>, 
        all: boolean = false
    ): Promise<T> {
        const fields: string[] = [];
        const values: unknown[] = [];
        
        Object.entries(data).forEach(([key, value], index) => {
            fields.push(`"${key}" = $${index + 1}`);
            values.push(data[key as keyof DBImage]);
        });

        const whereClause = fields.length > 0 ? `WHERE ${fields.join(' AND ')}` : '';
        const query = `SELECT * FROM "image" ${whereClause}`;

        const result = await this.pool.query(query, values);
        return all ? (result.rows as T) 
                    : result.rowCount ?? 0 > 0 
                    ? result.rows[0] as T 
                    : (null as T);
    }

    async update(id: string, data: Partial<DBCreateImage>): Promise<DBImage | null> {
        const fields: string[] = [];
        const values = [] ;
        
        Object.keys(data).forEach((key, index) => {
            fields.push(`"${key}" = $${index + 1}`);
            values.push(data[key as keyof DBCreateImage]);
        });

        values.push(id);

        const setClause = fields.join(', ');
        const query = `UPDATE "image" SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
        const result = await this.pool.query(query, values);
        return result.rowCount ?? 0 > 0 ? (result.rows[0] as DBImage) : null;
    }
}