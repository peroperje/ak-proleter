
-- Update existing records to have 'male' as gender
UPDATE "Profile" SET "gender" = 'male' WHERE "gender" IS NULL;

-- Make the column required with a default value
ALTER TABLE "Profile" ALTER COLUMN "gender" SET NOT NULL,
                      ALTER COLUMN "gender" SET DEFAULT 'male';
