-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "type" "ActivityAction" NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" TEXT,
    "resultId" TEXT,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_activityId_key" ON "Like"("userId", "activityId");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Custom Triggers for Activity Feed
-- 1. Function for Event triggers
CREATE OR REPLACE FUNCTION fn_event_activity_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO "Activity" ("id", "type", "metadata", "eventId", "createdAt")
        VALUES (gen_random_uuid(), 'CREATE', 
                jsonb_build_object('title', NEW.title, 'location', NEW.location, 'startDate', NEW."startDate"), 
                NEW.id, NOW());
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO "Activity" ("id", "type", "metadata", "eventId", "createdAt")
        VALUES (gen_random_uuid(), 'UPDATE', 
                jsonb_build_object('title', NEW.title, 'location', NEW.location, 'startDate', NEW."startDate"), 
                NEW.id, NOW());
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO "Activity" ("id", "type", "metadata", "eventId", "createdAt")
        VALUES (gen_random_uuid(), 'DELETE', 
                jsonb_build_object('title', OLD.title, 'location', OLD.location, 'startDate', OLD."startDate"), 
                NULL, NOW());
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 2. Triggers for Event table
DROP TRIGGER IF EXISTS tr_event_activity_insert ON "Event";
CREATE TRIGGER tr_event_activity_insert
AFTER INSERT ON "Event"
FOR EACH ROW EXECUTE FUNCTION fn_event_activity_trigger();

DROP TRIGGER IF EXISTS tr_event_activity_update ON "Event";
CREATE TRIGGER tr_event_activity_update
AFTER UPDATE ON "Event"
FOR EACH ROW EXECUTE FUNCTION fn_event_activity_trigger();

DROP TRIGGER IF EXISTS tr_event_activity_delete ON "Event";
CREATE TRIGGER tr_event_activity_delete
BEFORE DELETE ON "Event"
FOR EACH ROW EXECUTE FUNCTION fn_event_activity_trigger();


-- 3. Function for Result triggers
CREATE OR REPLACE FUNCTION fn_result_activity_trigger()
RETURNS TRIGGER AS $$
DECLARE
    athlete_name TEXT;
    discipline_name TEXT;
BEGIN
    SELECT name INTO athlete_name FROM "Athlete" WHERE id = COALESCE(NEW."athleteId", OLD."athleteId");
    SELECT name INTO discipline_name FROM "Discipline" WHERE id = COALESCE(NEW."disciplineId", OLD."disciplineId");

    IF (TG_OP = 'INSERT') THEN
        INSERT INTO "Activity" ("id", "type", "metadata", "resultId", "createdAt")
        VALUES (gen_random_uuid(), 'CREATE', 
                jsonb_build_object('athleteName', athlete_name, 'disciplineName', discipline_name, 'score', NEW.score), 
                NEW.id, NOW());
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO "Activity" ("id", "type", "metadata", "resultId", "createdAt")
        VALUES (gen_random_uuid(), 'UPDATE', 
                jsonb_build_object('athleteName', athlete_name, 'disciplineName', discipline_name, 'score', NEW.score), 
                NEW.id, NOW());
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO "Activity" ("id", "type", "metadata", "resultId", "createdAt")
        VALUES (gen_random_uuid(), 'DELETE', 
                jsonb_build_object('athleteName', athlete_name, 'disciplineName', discipline_name, 'score', OLD.score), 
                NULL, NOW());
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 4. Triggers for Result table
DROP TRIGGER IF EXISTS tr_result_activity_insert ON "Result";
CREATE TRIGGER tr_result_activity_insert
AFTER INSERT ON "Result"
FOR EACH ROW EXECUTE FUNCTION fn_result_activity_trigger();

DROP TRIGGER IF EXISTS tr_result_activity_update ON "Result";
CREATE TRIGGER tr_result_activity_update
AFTER UPDATE ON "Result"
FOR EACH ROW EXECUTE FUNCTION fn_result_activity_trigger();

DROP TRIGGER IF EXISTS tr_result_activity_delete ON "Result";
CREATE TRIGGER tr_result_activity_delete
BEFORE DELETE ON "Result"
FOR EACH ROW EXECUTE FUNCTION fn_result_activity_trigger();
