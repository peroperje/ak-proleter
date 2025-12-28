-- Update Result trigger to ALWAYS use Event's creation time for new timeline items
CREATE OR REPLACE FUNCTION fn_result_activity_trigger()
RETURNS TRIGGER AS $$
DECLARE
    athlete_name TEXT;
    discipline_name TEXT;
    evt_title TEXT;
    evt_location TEXT;
    evt_start_date TIMESTAMP;
    evt_created_at TIMESTAMP;
    existing_activity_id TEXT;
BEGIN
    SELECT name INTO athlete_name FROM "Athlete" WHERE id = NEW."athleteId";
    SELECT name INTO discipline_name FROM "Discipline" WHERE id = NEW."disciplineId";
    -- Allow fetching event creation time to ensure all results stay grouped with the event on the timeline
    SELECT title, location, "startDate", "createdAt" INTO evt_title, evt_location, evt_start_date, evt_created_at 
    FROM "Event" WHERE id = NEW."eventId";

    IF (TG_OP = 'INSERT') THEN
        -- Check if there's already an Activity for this event (without resultId)
        SELECT id INTO existing_activity_id 
        FROM "Activity" 
        WHERE "eventId" = NEW."eventId" AND "resultId" IS NULL
        LIMIT 1;
        
        IF existing_activity_id IS NOT NULL THEN
            -- Update existing activity to point to this result
            -- Preserve original createdAt (which matches Event createdAt)
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
            -- Create new activity for this subsequent result.
            -- CRITICAL: Use evt_created_at instead of NOW() so it doesn't jump to the top of the timeline.
            -- This ensures "Event appears on Timeline only when created".
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
                NEW.id, NEW."eventId", evt_created_at);
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
