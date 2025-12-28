CREATE OR REPLACE FUNCTION fn_result_activity_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_athlete_name TEXT;
    v_discipline_name TEXT;
    v_unit_symbol TEXT;
    v_event_title TEXT;
    v_event_location TEXT;
    v_event_type "EventType";
    v_event_startDate TIMESTAMP;
    v_event_endDate TIMESTAMP;
    v_metadata JSONB;
BEGIN
    -- Fetch related data needed for ResultCard
    SELECT a.name INTO v_athlete_name FROM "Athlete" a WHERE a.id = NEW."athleteId";
    
    SELECT d.name, u.symbol INTO v_discipline_name, v_unit_symbol 
    FROM "Discipline" d 
    LEFT JOIN "MeasurementUnit" u ON d."unitId" = u.id 
    WHERE d.id = NEW."disciplineId";
    
    -- Fetch all necessary Event details for ResultCard
    SELECT e.title, e.location, e."startDate", e."endDate", e.type
    INTO v_event_title, v_event_location, v_event_startDate, v_event_endDate, v_event_type
    FROM "Event" e WHERE e.id = NEW."eventId";

    -- Construct metadata matching ResultCard needs
    v_metadata := jsonb_build_object(
        'athleteName', v_athlete_name,
        'disciplineName', v_discipline_name,
        'score', NEW.score,
        'unitSymbol', v_unit_symbol,
        'eventId', NEW."eventId",
        'title', v_event_title,
        'location', v_event_location,
        'startDate', v_event_startDate,
        'endDate', v_event_endDate,
        'type', v_event_type
    );

    IF (TG_OP = 'INSERT') THEN
        INSERT INTO "Activity" ("id", "resultId", "eventId", "metadata", "createdAt")
        VALUES (gen_random_uuid(), NEW.id, NULL, v_metadata, NOW()); 
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE "Activity"
        SET "metadata" = v_metadata
        WHERE "resultId" = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;