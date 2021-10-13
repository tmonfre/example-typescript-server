import { Connection } from 'mysql2/promise';

import DB, { DBTable, Query, QueryWithUUID } from './db';
import { DBTableNames } from '../constants';

interface UserModel {
  id?: string
  firstName: string
  lastName: string
  email: string
  saltedPassword?: string
  isAdmin?: boolean
  createdDate?: Date
}

class UserTable implements DBTable {
    public tableName = DBTableNames.Users

    private dbConnection: Connection

    constructor(dbConnection: Connection) {
      this.dbConnection = dbConnection;
    }

    public async initialize(): Promise<Query> {
      const queryString = `
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id VARCHAR(36) PRIMARY KEY,
                firstName VARCHAR(50),
                lastName VARCHAR(50),
                email VARCHAR(50),
                saltedPassword VARCHAR(65) NOT NULL,
                isAdmin BOOLEAN DEFAULT FALSE,
                createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

      return this.dbConnection.query(queryString);
    }

    /**
     * @description fetches all users
     * @returns {Promise<Query>} promise-wrapped query
     */
    public async fetchAll(): Promise<Query> {
      const queryString = `SELECT * FROM ${this.tableName};`;
      return this.dbConnection.query(queryString);
    }

    /**
     * @description fetches user by id
     * @returns {Promise<Query>} promise-wrapped query
     */
    public async fetchById(id: string): Promise<Query> {
      const queryString = `SELECT * FROM ${this.tableName} WHERE id=?;`;
      return this.dbConnection.query(queryString, [id]);
    }

    /**
     * @description creates a single user
     * @param firstName user first name
     * @param lastName user last name
     * @param email user email
     * @param saltedPassword salted and hashed password for user
     * @returns {Promise<Query>} promise-wrapped query
     */
    public async insert(object: UserModel): Promise<QueryWithUUID> {
      const uuid = await DB.generateUUID();

      const queryString = `
        INSERT INTO ${this.tableName} 
        (id, firstName, lastName, email, saltedPassword)
        VALUES (?, ?, ?, ?, ?);
    `;

      const query = await this.dbConnection.query(queryString, [
        uuid,
        object.firstName,
        object.lastName,
        object.email,
        object.saltedPassword,
      ]);

      return {
        uuid,
        query,
      };
    }

    /**
     * @description updates user object by user id
     * @param id user id
     * @param fields user object fields to update
     * @returns {Promise<Query>} promise-wrapped query
     */
    public async updateById(id: string, fields: Record<string, unknown>): Promise<Query> {
      const queryString = `
        UPDATE ${this.tableName}
        SET ${Object.keys(fields).map((field) => `${field}=?`).join(', ')}
        WHERE id=?;
      `;
      return this.dbConnection.query(queryString, [...Object.values(fields), id]);
    }

    /**
     * @description deletes user by user id
     * @param id user id
     * @returns {Promise<Query>} promise-wrapped query
     */
    public async deleteById(id: string): Promise<Query> {
      const queryString = `DELETE FROM ${this.tableName} WHERE id=?;`;
      return this.dbConnection.query(queryString, [id]);
    }

    /**
     * @description deletes all users
     * @returns {Promise<Query>} promise-wrapped query
     */
    public async deleteAll(): Promise<Query> {
      const queryString = `TRUNCATE ${this.tableName};`;
      return this.dbConnection.query(queryString);
    }
}

export {
  UserModel,
  UserTable,
};
