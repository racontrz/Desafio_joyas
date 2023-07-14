const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.User,
  host: process.env.Host,
  database: process.env.Database,
  password: process.env.Password,
  allowExitOnIdle: true
});

module.exports = pool