const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool
  .connect()
  .then(() => console.log("Db connected"))
  .catch((e) => console.log("Db connection failed!", "\n", e));

module.exports = pool;
