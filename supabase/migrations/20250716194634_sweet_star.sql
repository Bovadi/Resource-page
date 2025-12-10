/*
  # Add Perfect For Field to Content Table

  1. Database Changes
    - Add `perfect_for` JSONB column to content table
    - Add index for better query performance
    - Add sample data for existing content

  2. Data Structure
    - JSONB array of strings for bullet points
    - Flexible structure for future enhancements
    - Proper indexing for search capabilities
*/

-- Add perfect_for column to content table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'content' AND column_name = 'perfect_for'
  ) THEN
    ALTER TABLE content ADD COLUMN perfect_for JSONB DEFAULT '[]'::jsonb;
    COMMENT ON COLUMN content.perfect_for IS 'JSON array of bullet points describing what the content is perfect for';
  END IF;
END $$;

-- Add index for better performance on perfect_for queries
CREATE INDEX IF NOT EXISTS idx_content_perfect_for ON content USING gin (perfect_for);

-- Add sample data for existing courses
UPDATE content 
SET perfect_for = '[
  "Supporting new team members",
  "Coaching parents at home", 
  "Improving implementation in the classroom",
  "Making behavior plans more approachable for everyone"
]'::jsonb
WHERE type = 'course' AND perfect_for = '[]'::jsonb;

-- Add sample data for resources
UPDATE content 
SET perfect_for = '[
  "Quick reference during sessions",
  "Training new staff members",
  "Parent education materials",
  "Classroom implementation guides"
]'::jsonb
WHERE type = 'resource' AND perfect_for = '[]'::jsonb;