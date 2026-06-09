const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    console.log('Ensuring index foodlog_userid_date_idx...');
    await pool.query('CREATE INDEX IF NOT EXISTS foodlog_userid_date_idx ON public."foodlog" (userid, date);');
    console.log('Index ensured.');
  } catch (err) {
    console.error('Error ensuring index:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
