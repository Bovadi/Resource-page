/*
  # Fix existing perfect_for data format

  1. Data Cleanup
    - Convert any plain text perfect_for fields to proper JSON arrays
    - Handle cases where data might be malformed
    - Ensure all perfect_for fields are valid JSON

  2. Data Migration
    - Update existing records with proper JSON formatting
    - Set empty arrays for null values
    - Convert text entries to JSON arrays
*/

-- First, let's see what data we have and fix any malformed JSON
UPDATE content 
SET perfect_for = '[]'::jsonb 
WHERE perfect_for IS NULL;

-- Convert any text-based perfect_for entries to JSON arrays
-- This handles cases where data might be stored as plain text
UPDATE content 
SET perfect_for = jsonb_build_array(perfect_for::text)
WHERE perfect_for IS NOT NULL 
  AND jsonb_typeof(perfect_for) = 'string'
  AND perfect_for::text != '[]';

-- Ensure all perfect_for fields are arrays (not objects or other types)
UPDATE content 
SET perfect_for = '[]'::jsonb
WHERE perfect_for IS NOT NULL 
  AND jsonb_typeof(perfect_for) != 'array';

-- Add some sample data for existing courses if they don't have perfect_for data
UPDATE content 
SET perfect_for = jsonb_build_array(
  'Supporting new team members',
  'Coaching parents at home', 
  'Improving implementation in the classroom',
  'Making behavior plans more approachable for everyone'
)
WHERE type = 'course' 
  AND title ILIKE '%visual%bip%'
  AND (perfect_for IS NULL OR perfect_for = '[]'::jsonb);

-- Add sample data for other courses
UPDATE content 
SET perfect_for = jsonb_build_array(
  'Professional development',
  'Skill building workshops',
  'Team training sessions'
)
WHERE type = 'course' 
  AND (perfect_for IS NULL OR perfect_for = '[]'::jsonb)
  AND title NOT ILIKE '%visual%bip%';

-- Verify the data is properly formatted
-- This query should return only 'array' types
SELECT title, jsonb_typeof(perfect_for) as data_type, perfect_for 
FROM content 
WHERE perfect_for IS NOT NULL;