-- Update the Category table structure
-- Add the new columns
ALTER TABLE "Category" ADD COLUMN "min_age" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Category" ADD COLUMN "max_age" INTEGER;

-- Make description NOT NULL
ALTER TABLE "Category" ALTER COLUMN "description" SET NOT NULL;

-- Clear existing data (if any)
DELETE FROM "Category";

-- Insert data for youth categories
INSERT INTO "Category" ("id", "name", "description", "min_age", "max_age") VALUES
(gen_random_uuid(), 'U8', 'Children under 8 years old', 0, 7),
(gen_random_uuid(), 'U10', 'Children aged 8 to 10 years', 8, 9),
(gen_random_uuid(), 'U12', 'Children aged 10 to 12 years', 10, 11),
(gen_random_uuid(), 'U14', 'Young cadets (12–14 years)', 12, 13),
(gen_random_uuid(), 'U16', 'Cadets (14–16 years)', 14, 15),
(gen_random_uuid(), 'U18', 'Junior athletes (16–18 years)', 16, 17),
(gen_random_uuid(), 'U20', 'Junior athletes (18–20 years)', 18, 19),
(gen_random_uuid(), 'U23', 'Young seniors (20–23 years)', 20, 22);

-- Insert data for seniors and masters (veterans)
INSERT INTO "Category" ("id", "name", "description", "min_age", "max_age") VALUES
(gen_random_uuid(), 'SEN', 'Senior athletes (typically 20–34 years)', 20, 34),
(gen_random_uuid(), 'V35', 'Masters athletes (35–39 years)', 35, 39),
(gen_random_uuid(), 'V40', 'Masters athletes (40–44 years)', 40, 44),
(gen_random_uuid(), 'V45', 'Masters athletes (45–49 years)', 45, 49),
(gen_random_uuid(), 'V50', 'Masters athletes (50–54 years)', 50, 54),
(gen_random_uuid(), 'V55', 'Masters athletes (55–59 years)', 55, 59),
(gen_random_uuid(), 'V60', 'Masters athletes (60–64 years)', 60, 64),
(gen_random_uuid(), 'V65', 'Masters athletes (65–69 years)', 65, 69),
(gen_random_uuid(), 'V70', 'Masters athletes (70–74 years)', 70, 74),
(gen_random_uuid(), 'V75', 'Masters athletes (75–79 years)', 75, 79),
(gen_random_uuid(), 'V80', 'Masters athletes (80+ years)', 80, NULL);
