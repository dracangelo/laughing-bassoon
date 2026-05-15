import mysql from "mysql2/promise";

const globalForMysql = globalThis as unknown as { pool?: mysql.Pool };

export const pool = globalForMysql.pool ?? mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

if (process.env.NODE_ENV !== "production") {
  globalForMysql.pool = pool;
}
