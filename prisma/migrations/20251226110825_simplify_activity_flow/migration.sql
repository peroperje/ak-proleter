/*
  Warnings:

  - You are about to drop the column `type` on the `Activity` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_resultId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "type";

-- DropEnum
DROP TYPE "ActivityAction";

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Custom Triggers for Activity Feed (Simplified)
-- 1. Function for Event triggers
CREATE OR REPLACE FUNCTION fn_event_activity_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO "Activity" ("id", "metadata", "eventId", "createdAt")
        VALUES (gen_random_uuid(), 
                jsonb_build_object('title', NEW.title, 'location', NEW.location, 'startDate', NEW."startDate"), 
                NEW.id, NOW());
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE "Activity" 
        SET "metadata" = jsonb_build_object('title', NEW.title, 'location', NEW.location, 'startDate', NEW."startDate"),
            "createdAt" = NOW()
        WHERE "eventId" = NEW.id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 2. Function for Result triggers
CREATE OR REPLACE FUNCTION fn_result_activity_trigger()
RETURNS TRIGGER AS $$
DECLARE
    athlete_name TEXT;
    discipline_name TEXT;
BEGIN
    SELECT name INTO athlete_name FROM "Athlete" WHERE id = NEW."athleteId";
    SELECT name INTO discipline_name FROM "Discipline" WHERE id = NEW."disciplineId";

    IF (TG_OP = 'INSERT') THEN
        INSERT INTO "Activity" ("id", "metadata", "resultId", "createdAt")
        VALUES (gen_random_uuid(), 
                jsonb_build_object('athleteName', athlete_name, 'disciplineName', discipline_name, 'score', NEW.score), 
                NEW.id, NOW());
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE "Activity"
        SET "metadata" = jsonb_build_object('athleteName', athlete_name, 'disciplineName', discipline_name, 'score', NEW.score),
            "createdAt" = NOW()
        WHERE "resultId" = NEW.id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Re-apply triggers to remove the DELETE part (handled by CASCADE)
DROP TRIGGER IF EXISTS tr_event_activity_delete ON "Event";
DROP TRIGGER IF EXISTS tr_result_activity_delete ON "Result";
