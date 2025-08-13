ALTER TABLE loaner_car 
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE loaner_car 
SET is_deleted = FALSE 
WHERE is_deleted IS NULL;