import { Connection } from 'mysql2/promise';

import DB, { DBTable, Query, QueryWithUUID } from './db';
import { DBTableNames } from '../constants';

interface MindfulnessEntryModel {
  id?: string
  userId: string
  questionGrateful: string
  questionServiceSelf: string
  questionServiceOthers: string
  createdDate?: Date
}

class MindfulnessEntryTable implements DBTable {
    public tableName = DBTableNames.MindfulnessEntries

    private dbConnection: Connection

    constructor(dbConnection: Connection) {
      this.dbConnection = dbConnection;
    }

    public async initialize(): Promise<Query> {
      const queryString = `
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id VARCHAR(36) PRIMARY KEY,
                userId VARCHAR(36),
                questionGrateful VARCHAR(280),
                questionServiceSelf VARCHAR(280),
                questionServiceOthers VARCHAR(280),
                createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

      return this.dbConnection.query(queryString);
    }

    /**
     * @description fetches all entries
     * @returns {Promise<Query>} promise-wrapped query
     */
    public async fetchAll(): Promise<Query> {
      const queryString = `SELECT * FROM ${this.tableName};`;
      return this.dbConnection.query(queryString);
    }

    /**
     * @description fetches entry by id
     * @returns {Promise<Query>} promise-wrapped query
     */
    public async fetchById(id: string): Promise<Query> {
      const queryString = `SELECT * FROM ${this.tableName} WHERE id=?;`;
      return this.dbConnection.query(queryString, [id]);
    }

    /**
     * @description fetches user by user id
     * @returns {Promise<Query>} promise-wrapped query
     */
    public async fetchByUserId(userId: string): Promise<Query> {
      const queryString = `SELECT * FROM ${this.tableName} WHERE userId=?;`;
      return this.dbConnection.query(queryString, [userId]);
    }

    /**
     * @description creates a single entry
     * @param userId user id
     * @param questionGrateful answer to gratefulness question
     * @param questionServiceSelf answer to service self question
     * @param questionServiceOthers answer to service others question
     * @returns {Promise<Query>} promise-wrapped query
     */
    public async insert(object: MindfulnessEntryModel): Promise<QueryWithUUID> {
      const uuid = await DB.generateUUID();

      const queryString = `
        INSERT INTO ${this.tableName}
        (id, userId, questionGrateful, questionServiceSelf, questionServiceOthers)
        VALUES (?, ?, ?, ?, ?);
    `;

      const query = await this.dbConnection.query(queryString, [
        uuid,
        object.userId,
        object.questionGrateful,
        object.questionServiceSelf,
        object.questionServiceOthers,
      ]);

      return {
        uuid,
        query,
      };
    }

    /**
     * @description updates entry object by id
     * @param id entry id
     * @param fields entry object fields to update
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
     * @description deletes entry by id
     * @param id entry id
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
  MindfulnessEntryModel,
  MindfulnessEntryTable,
};
