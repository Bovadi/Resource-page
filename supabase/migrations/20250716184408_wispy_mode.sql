/*
  # Content Labeling and Filtering System

  1. New Tables
    - `content_labels` - Store available labels/categories for navigation filtering
    - `content_label_assignments` - Many-to-many relationship between content and labels

  2. Security
    - Enable RLS on both new tables
    - Public can read labels and assignments
    - Authenticated users can manage labels and assignments

  3. Features
    - Support for multiple labels per content item
    - Hierarchical label structure with display order
    - Efficient filtering with proper indexing
*/

-- Create content_labels table for navigation menu labels
CREATE TABLE IF NOT EXISTS content_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly version of name
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content_label_assignments table for many-to-many relationship
CREATE TABLE IF NOT EXISTS content_label_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES content_labels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_id, label_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_labels_active ON content_labels(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_content_labels_slug ON content_labels(slug);
CREATE INDEX IF NOT EXISTS idx_content_label_assignments_content ON content_label_assignments(content_id);
CREATE INDEX IF NOT EXISTS idx_content_label_assignments_label ON content_label_assignments(label_id);

-- Enable Row Level Security
ALTER TABLE content_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_label_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for content_labels table
CREATE POLICY "Public can read active labels" 
  ON content_labels FOR SELECT TO public 
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage labels" 
  ON content_labels FOR ALL TO authenticated 
  USING (true);

-- Create policies for content_label_assignments table
CREATE POLICY "Public can read label assignments" 
  ON content_label_assignments FOR SELECT TO public 
  USING (true);

CREATE POLICY "Authenticated users can manage label assignments" 
  ON content_label_assignments FOR ALL TO authenticated 
  USING (true);

-- Insert default labels based on current navigation menu
INSERT INTO content_labels (name, slug, display_order, description) VALUES
  ('Welcome Start here', 'welcome-start-here', 1, 'Getting started content and introductory materials'),
  ('Developing FBA & BIPs', 'developing-fba-bips', 2, 'Functional Behavior Assessment and Behavior Intervention Plan resources'),
  ('Print your Behavior Guide!', 'print-behavior-guide', 3, 'Printable behavior guides and reference materials'),
  ('Stakeholder Support Guides', 'stakeholder-support-guides', 4, 'Resources for supporting stakeholders and team members'),
  ('Visual Supports', 'visual-supports', 5, 'Visual aids, charts, and communication tools'),
  ('Resources for Stakeholders', 'resources-for-stakeholders', 6, 'Additional materials for parents, teachers, and caregivers'),
  ('Video Collection', 'video-collection', 7, 'Video tutorials, demonstrations, and educational content')
ON CONFLICT (slug) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_content_labels_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_content_labels_updated_at
  BEFORE UPDATE ON content_labels
  FOR EACH ROW
  EXECUTE FUNCTION update_content_labels_updated_at();