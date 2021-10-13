import { RowDataPacket, ResultSetHeader, Connection } from 'mysql2/promise';

import Tables from '../models';
import { ResultWithModel } from '../models/db';
import { UserTable, UserModel } from '../models/user';

import { NotFoundError } from '../types/errors';

class UserController {
  private userTable: UserTable

  constructor(dbConnection: Connection) {
    const { Users: userTable } = Tables.getInstantiatedTables(dbConnection);
    this.userTable = <UserTable> userTable;
  }

  /**
 * @description retrieves all user objects
 * @returns {Promise<Array<UserModel>>} array of user objects
 */
  public async getAllUsers(): Promise<Array<UserModel>> {
    const query = await this.userTable.fetchAll();

    const rows = <RowDataPacket[]> query[0];
    const users = rows.map((row) => <UserModel> row);

    return users;
  }

  /**
 * @description retrieves user object with specified id
 * @param id user id
 * @returns {Promise<UserModel>} matching user object
 */
  public async getUserById(id: string): Promise<UserModel> {
    const query = await this.userTable.fetchById(id);

    const rows = <RowDataPacket[]> query[0];
    const result = <UserModel> rows[0];

    if (result) return result;
    throw new NotFoundError(id);
  }

  /**
 * @description creates user
 * @param firstName user first name
 * @param lastName user last name
 * @param email user email
 * @param saltedPassword user salted password
 * @returns {Promise<ResultSetHeader>} result of insert command
 */
  public async createUser(
    firstName: string,
    lastName: string,
    email: string,
    saltedPassword: string,
  ): Promise<ResultWithModel> {
    const { uuid, query } = await this.userTable.insert({
      firstName,
      lastName,
      email,
      saltedPassword,
    });

    const user = await this.getUserById(uuid);

    return { model: user, result: <ResultSetHeader> query[0] };
  }

  /**
 * @description updates provided fields in user object
 * @param userId user id
 * @param fields object with fields to update on user object
 * @returns {Promise<ResultSetHeader>} result of update command
 */
  public async updateUserById(
    userId: string,
    fields: Record<string, unknown>,
  ): Promise<ResultWithModel> {
    // check if not found
    await this.getUserById(userId);

    // perform update then grab updated object
    const query = await this.userTable.updateById(userId, fields);
    const user = await this.getUserById(userId);

    return { model: user, result: <ResultSetHeader> query[0] };
  }

  /**
 * @description deletes user with provided id
 * @param userId user id
 * @returns {Promise<ResultSetHeader>} result of delete command
 */
  public async deleteUserById(userId: string): Promise<ResultSetHeader> {
    const query = await this.userTable.deleteById(userId);
    return <ResultSetHeader> query[0];
  }

  /**
 * @description deletes all users
 * @returns {Promise<ResultSetHeader>} result of delete command
 */
  public async deleteAllUsers(): Promise<ResultSetHeader> {
    const query = await this.userTable.deleteAll();
    return <ResultSetHeader> query[0];
  }
}

export default UserController;
