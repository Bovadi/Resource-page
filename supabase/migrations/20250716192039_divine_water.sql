/*
  # Add Dynamic Content Fields

  1. Database Schema Updates
    - Add `description` field to content table for main descriptive text
    - Add `perfect_for` field to content table for "Perfect for" list items
    - Add indexes for better query performance

  2. Data Structure
    - `description` stores the main course/resource description text
    - `perfect_for` stores JSON array of bullet points for "Perfect for" section
    - Both fields support rich text content and are searchable

  3. Backward Compatibility
    - Fields are nullable to support existing content
    - Migration includes sample data for existing courses
*/

-- Add new fields to content table
ALTER TABLE content 
ADD COLUMN IF NOT EXISTS description_long TEXT,
ADD COLUMN IF NOT EXISTS perfect_for JSONB DEFAULT '[]'::jsonb;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_description_long ON content USING gin(to_tsvector('english', description_long));
CREATE INDEX IF NOT EXISTS idx_content_perfect_for ON content USING gin(perfect_for);

-- Add sample data for existing courses
UPDATE content 
SET 
  description_long = 'Visual BIPs (Behavior Intervention Plans) help parents and staff feel more confident and consistent by providing step-by-step visuals of what to do. Create, customize, and share plans in minutes—no graphic design skills needed.',
  perfect_for = '[
    "Supporting new team members",
    "Coaching parents at home", 
    "Improving implementation in the classroom",
    "Making behavior plans more approachable for everyone"
  ]'::jsonb
WHERE type = 'course' 
AND title ILIKE '%visual bip%'
AND (description_long IS NULL OR perfect_for = '[]'::jsonb);

-- Add sample data for other courses if they exist
UPDATE content 
SET 
  description_long = COALESCE(description_long, description || ' - Comprehensive training course designed to enhance your professional skills and knowledge.'),
  perfect_for = COALESCE(
    NULLIF(perfect_for, '[]'::jsonb),
    '[
      "Professional development",
      "Skill enhancement",
      "Career advancement",
      "Continuing education requirements"
    ]'::jsonb
  )
WHERE type = 'course' 
AND (description_long IS NULL OR perfect_for = '[]'::jsonb);

-- Add sample data for resources
UPDATE content 
SET 
  description_long = COALESCE(description_long, description || ' - Downloadable resource to support your professional practice.'),
  perfect_for = COALESCE(
    NULLIF(perfect_for, '[]'::jsonb),
    '[
      "Quick reference",
      "Professional documentation",
      "Client support materials",
      "Training resources"
    ]'::jsonb
  )
WHERE type = 'resource' 
AND (description_long IS NULL OR perfect_for = '[]'::jsonb);

-- Add comment for documentation
COMMENT ON COLUMN content.description_long IS 'Extended description text for detailed content information';
COMMENT ON COLUMN content.perfect_for IS 'JSON array of bullet points describing what the content is perfect for';