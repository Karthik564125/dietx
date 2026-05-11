const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres.myjdxnsmtxmyjptxthll:Karthik564125@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres' });

pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user'")
  .then(res => {
    console.log(res.rows);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
