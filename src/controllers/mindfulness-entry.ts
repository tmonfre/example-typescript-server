import { RowDataPacket, ResultSetHeader, Connection } from 'mysql2/promise';

import Tables from '../models';
import { ResultWithModel } from '../models/db';
import { MindfulnessEntryTable, MindfulnessEntryModel } from '../models/mindfulness-entry';

import { NotFoundError } from '../types/errors';

export interface IMindfulnessEntryController {
  getAllEntries(): Promise<Array<MindfulnessEntryModel>>
}

class MindfulnessEntryController implements IMindfulnessEntryController {
  private table: MindfulnessEntryTable

  constructor(dbConnection: Connection) {
    const {
      MindfulnessEntries: mindfulnessEntryTable,
    } = Tables.getInstantiatedTables(dbConnection);

    this.table = <MindfulnessEntryTable> mindfulnessEntryTable;
  }

  /**
   * @description retrieves all entry objects
   * @returns {Promise<Array<MindfulnessEntryModel>>} array of entry objects
  */
  public async getAllEntries(): Promise<Array<MindfulnessEntryModel>> {
    const query = await this.table.fetchAll();

    const rows = <RowDataPacket[]> query[0];
    const result = rows.map((row) => <MindfulnessEntryModel> row);

    return result;
  }

  /**
   * @description retrieves entry object with specified id
   * @param id entry id
   * @returns {Promise<UserModel>} matching user object
  */
  public async getEntryById(id: string): Promise<MindfulnessEntryModel> {
    const query = await this.table.fetchById(id);

    const rows = <RowDataPacket[]> query[0];
    const result = <MindfulnessEntryModel> rows[0];

    if (result) return result;
    throw new NotFoundError(id);
  }

  /**
   * @description retrieves entry objects for specified user id
   * @param userId user id
   * @returns {Promise<UserModel>} matching user object
  */
  public async getEntriesForUserId(userId: string): Promise<Array<MindfulnessEntryModel>> {
    const query = await this.table.fetchByUserId(userId);

    const rows = <RowDataPacket[]> query[0];
    const result = rows.map((row) => <MindfulnessEntryModel> row);

    return result;
  }

  /**
   * @description creates entry
   * @param userId user id
   * @param questionGrateful answer to gratefulness question
   * @param questionServiceSelf answer to service self question
   * @param questionServiceOthers answer to service others question
   * @returns {Promise<ResultSetHeader>} result of insert command
  */
  public async createEntry(
    userId: string,
    questionGrateful: string,
    questionServiceSelf: string,
    questionServiceOthers: string,
  ): Promise<ResultWithModel> {
    const { uuid, query } = await this.table.insert({
      userId,
      questionGrateful,
      questionServiceSelf,
      questionServiceOthers,
    });

    const entry = await this.getEntryById(uuid);

    return { model: entry, result: <ResultSetHeader> query[0] };
  }

  /**
   * @description updates provided fields in entry object
   * @param id user id
   * @param fields object with fields to update on entry object
   * @returns {Promise<ResultSetHeader>} result of update command
  */
  public async updateEntryById(
    id: string,
    fields: Record<string, unknown>,
  ): Promise<ResultWithModel> {
    // check if not found
    await this.getEntryById(id);

    // perform update then grab updated object
    const query = await this.table.updateById(id, fields);
    const user = await this.getEntryById(id);

    return { model: user, result: <ResultSetHeader> query[0] };
  }

  /**
   * @description deletes entry with provided id
   * @param id entry id
   * @returns {Promise<ResultSetHeader>} result of delete command
  */
  public async deleteEntryById(id: string): Promise<ResultSetHeader> {
    const query = await this.table.deleteById(id);
    return <ResultSetHeader> query[0];
  }

  /**
   * @description deletes all entries
   * @returns {Promise<ResultSetHeader>} result of delete command
  */
  public async deleteAllEntries(): Promise<ResultSetHeader> {
    const query = await this.table.deleteAll();
    return <ResultSetHeader> query[0];
  }
}

export default MindfulnessEntryController;
