import { RowDataPacket, ResultSetHeader, Connection } from 'mysql2/promise';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jwt-simple';

import Tables from '../models';
import { ResultWithModel } from '../models/db';
import { UserTable, UserModel } from '../models/user';
import { AuthCredentials } from '../utils/auth';

import { NotFoundError, UnauthorizedError, BaseError } from '../types/errors';

export interface IUserController {
  getAllUsers(): Promise<Array<UserModel>>
  getUserById(id: string): Promise<UserModel>
  getUserByEmail(email: string): Promise<UserModel>
  createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<ResultWithModel>
  updateUserById(
    userId: string,
    fields: Record<string, unknown>,
  ): Promise<ResultWithModel>
  updateUserByEmail(
    email: string,
    fields: Record<string, unknown>,
  ): Promise<ResultWithModel>
  deleteUserById(userId: string): Promise<ResultSetHeader>
  deleteUserByEmail(email: string): Promise<ResultSetHeader>
  deleteAllUsers(): Promise<ResultSetHeader>
  isAuthedUser(credentials: AuthCredentials): Promise<UserModel>
  tokenForUser(userId: string): string
}

class UserController implements IUserController {
  private table: UserTable

  constructor(dbConnection: Connection) {
    const { Users: userTable } = Tables.getInstantiatedTables(dbConnection);
    this.table = <UserTable> userTable;
  }

  /**
   * @description retrieves all user objects
   * @returns {Promise<Array<UserModel>>} array of user objects
  */
  public async getAllUsers(): Promise<Array<UserModel>> {
    const query = await this.table.fetchAll();

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
    const query = await this.table.fetchById(id);

    const rows = <RowDataPacket[]> query[0];
    const result = <UserModel> rows[0];

    if (result) return result;
    throw new NotFoundError(id);
  }

  /**
   * @description retrieves user object with specified email
   * @param email user email
   * @returns {Promise<UserModel>} matching user object
  */
  public async getUserByEmail(email: string): Promise<UserModel> {
    const query = await this.table.fetchByEmail(email);

    const rows = <RowDataPacket[]> query[0];
    const result = <UserModel> rows[0];

    if (result) return result;
    throw new NotFoundError(email);
  }

  /**
   * @description creates user
   * @param firstName user first name
   * @param lastName user last name
   * @param email user email
   * @param password user-provided password
   * @returns {Promise<ResultSetHeader>} result of insert command
  */
  public async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<ResultWithModel> {
    return new Promise<ResultWithModel>((resolve, reject) => {
      // generate salt
      bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS || '10', 10), (saltError, salt) => {
        if (saltError) {
          reject(new BaseError('Error generating salt', { error: saltError }));
        }

        // hash user-provided password
        bcrypt.hash(password, salt, null, async (hashError, hash) => {
          if (hashError) {
            reject(new BaseError('Error hashing user-provided password', { error: hashError }));
          } else {
            try {
              const { uuid, query } = await this.table.insert({
                firstName,
                lastName,
                email,
                saltedPassword: hash,
              });

              const user = await this.getUserById(uuid);

              resolve({ model: user, result: <ResultSetHeader> query[0] });
            } catch (err) {
              reject(err);
            }
          }
        });
      });
    });
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
    const query = await this.table.updateById(userId, fields);
    const user = await this.getUserById(userId);

    return { model: user, result: <ResultSetHeader> query[0] };
  }

  /**
   * @description updates provided fields in user object
   * @param userId user email
   * @param fields object with fields to update on user object
   * @returns {Promise<ResultSetHeader>} result of update command
  */
  public async updateUserByEmail(
    email: string,
    fields: Record<string, unknown>,
  ): Promise<ResultWithModel> {
    // check if not found
    await this.getUserByEmail(email);

    // perform update then grab updated object
    const query = await this.table.updateByEmail(email, fields);
    const user = await this.getUserByEmail(email);

    return { model: user, result: <ResultSetHeader> query[0] };
  }

  /**
   * @description deletes user with provided id
   * @param userId user id
   * @returns {Promise<ResultSetHeader>} result of delete command
  */
  public async deleteUserById(userId: string): Promise<ResultSetHeader> {
    const query = await this.table.deleteById(userId);
    return <ResultSetHeader> query[0];
  }

  /**
   * @description deletes user with provided email
   * @param email user email
   * @returns {Promise<ResultSetHeader>} result of delete command
  */
  public async deleteUserByEmail(email: string): Promise<ResultSetHeader> {
    const query = await this.table.deleteByEmail(email);
    return <ResultSetHeader> query[0];
  }

  /**
   * @description deletes all users
   * @returns {Promise<ResultSetHeader>} result of delete command
  */
  public async deleteAllUsers(): Promise<ResultSetHeader> {
    const query = await this.table.deleteAll();
    return <ResultSetHeader> query[0];
  }

  /**
   * @description auths user by salting/hashing provided password & cross-referencing with db
   * @param credentials auth credentials object (email, password)
   * @returns {Promise<UserModel>} matching user if correct auth
   */
  public async isAuthedUser(credentials: AuthCredentials): Promise<UserModel> {
    let user: UserModel;

    try {
      user = await this.getUserByEmail(credentials.email);
    } catch (error) {
      throw new NotFoundError(credentials.email);
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(credentials.password, user.saltedPassword, (error, result) => {
        if (error) reject(error);
        if (result) resolve(user);
        else reject(new UnauthorizedError(`Unauthorized for email ${credentials.email}`));
      });
    });
  }

  /**
   * @description generates auth token for given user id
   * @param userId user id
   * @returns jwt token
   */
  // eslint-disable-next-line class-methods-use-this
  public tokenForUser(userId: string): string {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: userId, iat: timestamp }, process.env.AUTH_SECRET || 'secret');
  }
}

export default UserController;
