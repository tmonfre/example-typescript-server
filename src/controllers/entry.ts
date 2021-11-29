import { RowDataPacket, ResultSetHeader, Connection } from 'mysql2/promise';

import Tables from '../models';
import { ResultWithModel } from '../models/db';
import { EntryTable, EntryModel } from '../models/entry';

import { NotFoundError } from '../types/errors';

class EntryController {
  private table: EntryTable

  constructor(dbConnection: Connection) {
    const {
      Entries: entryTable,
    } = Tables.getInstantiatedTables(dbConnection);

    this.table = <EntryTable> entryTable;
  }

  /**
   * @description retrieves all entry objects
   * @returns {Promise<Array<EntryModel>>} array of entry objects
  */
  public async getAllEntries(): Promise<Array<EntryModel>> {
    const query = await this.table.fetchAll();

    const rows = <RowDataPacket[]> query[0];
    const result = rows.map((row) => <EntryModel> row);

    return result;
  }

  /**
   * @description retrieves entry object with specified id
   * @param id entry id
   * @returns {Promise<EntryModel>} matching entry object
  */
  public async getEntryById(id: string): Promise<EntryModel> {
    const query = await this.table.fetchById(id);

    const rows = <RowDataPacket[]> query[0];
    const result = <EntryModel> rows[0];

    if (result) return result;
    throw new NotFoundError(id);
  }

  /**
   * @description retrieves entry objects for specified user id
   * @param userId user id
   * @returns {Promise<EntryModel>} matching entry object
  */
  public async getEntriesForUserId(userId: string): Promise<Array<EntryModel>> {
    const query = await this.table.fetchByUserId(userId);

    const rows = <RowDataPacket[]> query[0];
    const result = rows.map((row) => <EntryModel> row);

    return result;
  }

  /**
   * @description creates entry
   * @param userId user id
   * @param exampleValue example string value
   * @returns {Promise<ResultSetHeader>} result of insert command
  */
  public async createEntry(userId: string, exampleValue: string): Promise<ResultWithModel> {
    const { uuid, query } = await this.table.insert({
      userId,
      exampleValue,
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

export default EntryController;
