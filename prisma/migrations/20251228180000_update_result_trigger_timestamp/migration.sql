-- Fix Result trigger to preserve createdAt when replacing event activity
CREATE OR REPLACE FUNCTION fn_result_activity_trigger()
RETURNS TRIGGER AS $$
DECLARE
    athlete_name TEXT;
    discipline_name TEXT;
    evt_title TEXT;
    evt_location TEXT;
    evt_start_date TIMESTAMP;
    existing_activity_id TEXT;
    existing_created_at TIMESTAMP; -- New variable to store original creation time
BEGIN
    SELECT name INTO athlete_name FROM "Athlete" WHERE id = NEW."athleteId";
    SELECT name INTO discipline_name FROM "Discipline" WHERE id = NEW."disciplineId";
    SELECT title, location, "startDate" INTO evt_title, evt_location, evt_start_date 
    FROM "Event" WHERE id = NEW."eventId";

    IF (TG_OP = 'INSERT') THEN
        -- Check if there's already an Activity for this event (without resultId)
        -- AND capture its createdAt
        SELECT id, "createdAt" INTO existing_activity_id, existing_created_at
        FROM "Activity" 
        WHERE "eventId" = NEW."eventId" AND "resultId" IS NULL
        LIMIT 1;
        
        -- If exists, delete it since we're creating a result activity
        IF existing_activity_id IS NOT NULL THEN
            DELETE FROM "Activity" WHERE id = existing_activity_id;
        END IF;
        
        -- Create the result activity
        INSERT INTO "Activity" ("id", "metadata", "resultId", "eventId", "createdAt")
        VALUES (gen_random_uuid(), 
                jsonb_build_object(
                    'athleteName', athlete_name, 
                    'disciplineName', discipline_name, 
                    'score', NEW.score,
                    'title', evt_title,
                    'location', evt_location,
                    'startDate', evt_start_date
                ), 
                NEW.id, NEW."eventId", COALESCE(existing_created_at, NOW())); -- Use existing timestamp if available, otherwise NOW()
    ELSIF (TG_OP = 'UPDATE') THEN
        -- DO NOT update createdAt to preserve original timeline order
        UPDATE "Activity"
        SET "metadata" = jsonb_build_object(
                    'athleteName', athlete_name, 
                    'disciplineName', discipline_name, 
                    'score', NEW.score,
                    'title', evt_title,
                    'location', evt_location,
                    'startDate', evt_start_date
                ),
            "eventId" = NEW."eventId"
        WHERE "resultId" = NEW.id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
