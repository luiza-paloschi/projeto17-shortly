import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.DATABASE_URL)

const { Pool } = pg;

const configDatabase = {
  connectionString: process.env.DATABASE_URL,
  ...(process.env.NODE_ENV === "production" && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
};

const db = new Pool(configDatabase);

export default db;