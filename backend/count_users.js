const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres.myjdxnsmtxmyjptxthll:Karthik564125@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres' });

pool.query('SELECT COUNT(*) FROM "user"')
  .then(res => {
    console.log("User count:", res.rows[0].count);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
