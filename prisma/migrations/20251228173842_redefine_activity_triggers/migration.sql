-- Drop old triggers and functions to ensure a clean slate
DROP TRIGGER IF EXISTS trigger_result_activity ON "Result";
DROP TRIGGER IF EXISTS trigger_event_activity ON "Event";
DROP FUNCTION IF EXISTS fn_result_activity_trigger CASCADE;
DROP FUNCTION IF EXISTS fn_event_activity_trigger CASCADE;

-- Create function for Result -> Activity
CREATE OR REPLACE FUNCTION fn_result_activity_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_athlete_name TEXT;
    v_discipline_name TEXT;
    v_unit_symbol TEXT;
    v_event_title TEXT;
    v_event_location TEXT;
    v_event_date TIMESTAMP;
    v_metadata JSONB;
BEGIN
    -- Fetch related data needed for ResultCard
    -- We need Athlete name
    SELECT a.name INTO v_athlete_name FROM "Athlete" a WHERE a.id = NEW."athleteId";
    
    -- We need Discipline name and unit symbol
    SELECT d.name, u.symbol INTO v_discipline_name, v_unit_symbol 
    FROM "Discipline" d 
    LEFT JOIN "MeasurementUnit" u ON d."unitId" = u.id 
    WHERE d.id = NEW."disciplineId";
    
    -- We need Event details (title, location, date)
    -- Even though Activity.eventId will be NULL, we store this snapshot in metadata
    SELECT e.title, e.location, e."startDate" INTO v_event_title, v_event_location, v_event_date
    FROM "Event" e WHERE e.id = NEW."eventId";

    -- Construct metadata matching ResultCard needs
    v_metadata := jsonb_build_object(
        'athleteName', v_athlete_name,
        'disciplineName', v_discipline_name,
        'score', NEW.score,
        'unitSymbol', v_unit_symbol,
        'title', v_event_title,
        'location', v_event_location,
        'startDate', v_event_date
    );

    IF (TG_OP = 'INSERT') THEN
        -- Insert new Activity
        -- resultId is set to NEW.id
        -- eventId is deliberately NULL as per instructions
        INSERT INTO "Activity" ("id", "resultId", "eventId", "metadata", "createdAt")
        VALUES (gen_random_uuid(), NEW.id, NULL, v_metadata, NOW()); 
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Update existing Activity linked to this Result
        -- Only update metadata, createdAt remains unchanged
        UPDATE "Activity"
        SET "metadata" = v_metadata
        WHERE "resultId" = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Trigger for Result
CREATE TRIGGER trigger_result_activity
AFTER INSERT OR UPDATE ON "Result"
FOR EACH ROW
EXECUTE FUNCTION fn_result_activity_trigger();


-- Create function for Event -> Activity
CREATE OR REPLACE FUNCTION fn_event_activity_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_metadata JSONB;
BEGIN
    -- Construct metadata matching EventCard needs
    v_metadata := jsonb_build_object(
        'title', NEW.title,
        'location', NEW.location,
        'startDate', NEW."startDate",
        'endDate', NEW."endDate",
        'description', NEW.description
    );

    IF (TG_OP = 'INSERT') THEN
        -- Insert new Activity
        -- eventId is set to NEW.id
        -- resultId is deliberately NULL as per instructions
        INSERT INTO "Activity" ("id", "eventId", "resultId", "metadata", "createdAt")
        VALUES (gen_random_uuid(), NEW.id, NULL, v_metadata, NOW());
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Update existing Activity linked to this Event
        -- Only update metadata, createdAt remains unchanged
        UPDATE "Activity"
        SET "metadata" = v_metadata
        WHERE "eventId" = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Trigger for Event
CREATE TRIGGER trigger_event_activity
AFTER INSERT OR UPDATE ON "Event"
FOR EACH ROW
EXECUTE FUNCTION fn_event_activity_trigger();