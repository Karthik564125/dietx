const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres.myjdxnsmtxmyjptxthll:Karthik564125@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres' });

pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'user'")
  .then(res => {
    console.log("Columns:", res.rows.map(r => r.column_name));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
