-- Simplify Result trigger to update existing activity if present, preserving createdAt
CREATE OR REPLACE FUNCTION fn_result_activity_trigger()
RETURNS TRIGGER AS $$
DECLARE
    athlete_name TEXT;
    discipline_name TEXT;
    evt_title TEXT;
    evt_location TEXT;
    evt_start_date TIMESTAMP;
    existing_activity_id TEXT;
BEGIN
    SELECT name INTO athlete_name FROM "Athlete" WHERE id = NEW."athleteId";
    SELECT name INTO discipline_name FROM "Discipline" WHERE id = NEW."disciplineId";
    SELECT title, location, "startDate" INTO evt_title, evt_location, evt_start_date 
    FROM "Event" WHERE id = NEW."eventId";

    IF (TG_OP = 'INSERT') THEN
        -- Check if there's already an Activity for this event (without resultId)
        SELECT id INTO existing_activity_id 
        FROM "Activity" 
        WHERE "eventId" = NEW."eventId" AND "resultId" IS NULL
        LIMIT 1;
        
        IF existing_activity_id IS NOT NULL THEN
            -- Update existing activity to point to this result
            -- Crucially: we DO NOT update "createdAt" so it doesn't jump in the timeline
            UPDATE "Activity"
            SET "resultId" = NEW.id,
                "metadata" = jsonb_build_object(
                    'athleteName', athlete_name, 
                    'disciplineName', discipline_name, 
                    'score', NEW.score,
                    'title', evt_title,
                    'location', evt_location,
                    'startDate', evt_start_date
                )
            WHERE id = existing_activity_id;
        ELSE
            -- Create new activity
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
                NEW.id, NEW."eventId", NOW());
        END IF;

    ELSIF (TG_OP = 'UPDATE') THEN
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
