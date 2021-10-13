import { Connection } from 'mysql2/promise';
import { DBTable, Query } from './db';
import { UserModel, UserTable } from './user';

type AllTables = UserTable | DBTable

/**
 * static singleton class to hold instantiated tables
 */
export default class Tables {
    private static instantiatedTables: Record<string, AllTables>

    /**
     * @description initializes all models (creates DB tables if they do not exist)
    */
    public static async initializeAllTables(dbConnection: Connection):
    Promise<{ connection: Connection, tables: Array<Query>}> {
      const instantiatedTables = this.getInstantiatedTables(dbConnection);

      const tables = await Promise.all(
        Object.values(instantiatedTables).map((table) => table.initialize(dbConnection)),
      );

      return {
        connection: dbConnection,
        tables,
      };
    }

    /**
     * @description retrieves all instantiated models (will instantiate if not yet created)
     * @returns {Record<string, DBModel>} object mapping table name to corresponding DBModel object
     */
    public static getInstantiatedTables(dbConnection: Connection): Record<string, AllTables> {
      if (!this.instantiatedTables) {
        const tables = [
          new UserTable(dbConnection),
        ];

        this.instantiatedTables = tables.reduce((
          result: Record<string, AllTables>,
          table: AllTables,
        ) => ({
          ...result,
          [table.tableName]: table,
        }), {});
      }

      return this.instantiatedTables;
    }
}

export {
  UserModel,
};
