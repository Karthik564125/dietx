-- Migration: Add missing Postgres tables and columns for deployment
-- IMPORTANT: Backup your database before running this script.

BEGIN;

-- 1) Ensure columns in public.user
ALTER TABLE IF EXISTS public."user"
  ADD COLUMN IF NOT EXISTS "activitylevel" TEXT,
  ADD COLUMN IF NOT EXISTS "age" INTEGER,
  ADD COLUMN IF NOT EXISTS "bmi" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "dailycalories" INTEGER,
  ADD COLUMN IF NOT EXISTS "gender" TEXT,
  ADD COLUMN IF NOT EXISTS "height" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "heightunit" TEXT,
  ADD COLUMN IF NOT EXISTS "profilecomplete" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "weight" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "weightunit" TEXT;

-- 2) Daily tracking columns
ALTER TABLE IF EXISTS public."user"
  ADD COLUMN IF NOT EXISTS "lastentrydate" TEXT,
  ADD COLUMN IF NOT EXISTS "sleephours" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "waterintake" INTEGER NOT NULL DEFAULT 0;

-- 3) Phone column
ALTER TABLE IF EXISTS public."user"
  ADD COLUMN IF NOT EXISTS "phone" TEXT;

-- 4) NutritionPlanPurchase table
CREATE TABLE IF NOT EXISTS public."NutritionPlanPurchase" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  "razorpayOrderId" TEXT NOT NULL,
  "razorpayPaymentId" TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  "planName" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5) FoodLog table
CREATE TABLE IF NOT EXISTS public."foodlog" (
  id TEXT PRIMARY KEY,
  userid TEXT,
  date TEXT,
  name TEXT,
  quantity DOUBLE PRECISION,
  calories INTEGER,
  -- minimal nutrition fields (we store only calories by design)
  -- protein/carbs/fats removed as per request
  mealtype TEXT,
  unit TEXT,
  time TEXT,
  createdat TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index to support queries by user and date
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'foodlog_userid_date_idx' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX foodlog_userid_date_idx ON public."foodlog" (userid, date);
  END IF;
END$$;

COMMIT;

-- End of migration
