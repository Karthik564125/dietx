const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

async function run() {
  try {
    console.log("Checking and adding phone column to 'user' table...");
    await pool.query('ALTER TABLE "public"."user" ADD COLUMN IF NOT EXISTS "phone" TEXT;');
    
    console.log("Creating 'NutritionPlanPurchase' table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "public"."NutritionPlanPurchase" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "razorpayOrderId" TEXT NOT NULL,
        "razorpayPaymentId" TEXT NOT NULL,
        "amount" INTEGER NOT NULL,
        "status" TEXT NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating 'foodlog' table if missing...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.foodlog (
        id TEXT PRIMARY KEY,
        userid TEXT,
        date TEXT,
        name TEXT,
        quantity DOUBLE PRECISION,
        calories INTEGER,
        -- deprecated nutrition columns removed; store minimal fields only
        mealtype TEXT,
        unit TEXT,
        time TEXT,
        createdat TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database schema updated successfully.");
    process.exit(0);
  } catch(err) {
    console.error("Error updating database schema:", err);
    process.exit(1);
  }
}
run();
