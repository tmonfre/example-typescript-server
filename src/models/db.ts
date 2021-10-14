import mysql, {
  Connection,
  RowDataPacket,
  OkPacket,
  ResultSetHeader,
  FieldPacket,
} from 'mysql2/promise';

import { UserModel } from './user';
import { MindfulnessEntryModel } from './mindfulness-entry';

type Model = UserModel | MindfulnessEntryModel | Record<string, unknown>

export type Query = Array<Array<RowDataPacket> | Array<Array<RowDataPacket>> |
  OkPacket | Array<OkPacket> | ResultSetHeader | Array<FieldPacket>>

export type QueryWithUUID = {
  uuid: string
  query: Query
}

export type ResultWithModel = {
  result: ResultSetHeader
  model: Model
}

export interface DBTable {
  tableName: string
  initialize(dbConnection: Connection): Promise<Query>
  fetchAll(): Promise<Query>
  fetchById(id: string): Promise<Query>
  insert(object: Model): Promise<QueryWithUUID>
  updateById(id: string, object: Record<string, unknown>): Promise<Query>
  deleteById(id: string): Promise<Query>
  deleteAll(): Promise<Query>
}

class DB {
  private static connection: Connection;

  /**
   * @description retrieves singleton connection to database
   * @returns {Promise<Connection>} database connection object
   */
  public static async getConnection(): Promise<Connection> {
    if (!DB.connection) {
      DB.connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
    }

    return DB.connection;
  }

  /**
   * @description generates UUID to be used in insert commands
   * @returns {Promise<ResultSetHeader>} output of UUID creation
   */
  public static async generateUUID(): Promise<string> {
    const connection = await this.getConnection();

    const queryString = 'SELECT UUID();';
    const result = <Array<Record<string, string>>> (await connection.query(queryString))[0];

    return result[0]['UUID()'];
  }
}

export default DB;
