import mysql from 'mysql2';
import Connection from 'mysql2/typings/mysql/lib/Connection';

class DB {
  private static connection: Connection;

  public static getConnection(): Connection {
    if (!DB.connection) {
      DB.connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
    }

    return DB.connection;
  }
}

export default DB;
