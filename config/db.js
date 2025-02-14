const { Pool } = require("pg");
require("dotenv").config();

// Configurações do banco de dados
const pool = new Pool(process.env.DATABASE_URL);

module.exports = pool;
