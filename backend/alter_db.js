const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres.myjdxnsmtxmyjptxthll:Karthik564125@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres' });

async function run() {
  try {
    await pool.query('ALTER TABLE "public"."user" ALTER COLUMN profilecomplete DROP DEFAULT');
    await pool.query('ALTER TABLE "public"."user" ALTER COLUMN profilecomplete TYPE boolean USING (profilecomplete != 0)');
    await pool.query('ALTER TABLE "public"."user" ALTER COLUMN profilecomplete SET DEFAULT false');
    console.log("Column altered successfully.");
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}
run();
