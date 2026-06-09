const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL not set in .env');
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function run() {
  try {
    console.log('Dropping nutrition columns (protein, carbs, fats) from public.foodlog if they exist...');
    await pool.query(`ALTER TABLE IF EXISTS public."foodlog"
      DROP COLUMN IF EXISTS protein,
      DROP COLUMN IF EXISTS carbs,
      DROP COLUMN IF EXISTS fats;`);

    console.log('Verifying columns in public.foodlog...');
    const res = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'foodlog'
      ORDER BY ordinal_position;
    `);

    console.log('Columns currently in public.foodlog:');
    res.rows.forEach(r => console.log('-', r.column_name));

    await pool.end();
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Error running migration:', err);
    await pool.end();
    process.exit(1);
  }
}

run();
