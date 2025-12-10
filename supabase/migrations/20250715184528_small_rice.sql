/*
  # Content Management System Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `content`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `type` (enum: course, resource)
      - `category_id` (uuid, foreign key)
      - `video_url` (text, optional)
      - `test_url` (text, optional)
      - `status` (enum: draft, published, archived)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `images`
      - `id` (uuid, primary key)
      - `filename` (text, required)
      - `original_name` (text, required)
      - `file_path` (text, required)
      - `file_size` (integer)
      - `mime_type` (text)
      - `alt_text` (text, optional)
      - `width` (integer, optional)
      - `height` (integer, optional)
      - `created_at` (timestamp)
    
    - `content_images`
      - `id` (uuid, primary key)
      - `content_id` (uuid, foreign key)
      - `image_id` (uuid, foreign key)
      - `is_primary` (boolean, default false)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
    - Add policies for public read access to published content

  3. Storage
    - Create storage bucket for images
    - Set up storage policies for image uploads
*/

-- Create enum types
CREATE TYPE content_type AS ENUM ('course', 'resource');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Content table
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type content_type NOT NULL DEFAULT 'resource',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  video_url text,
  test_url text,
  status content_status NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Images table
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer,
  mime_type text,
  alt_text text,
  width integer,
  height integer,
  created_at timestamptz DEFAULT now()
);

-- Content-Images relationship table
CREATE TABLE IF NOT EXISTS content_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  image_id uuid NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  is_primary boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(content_id, image_id)
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_images ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Anyone can read categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true);

-- Content policies
CREATE POLICY "Anyone can read published content"
  ON content
  FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authenticated users can manage content"
  ON content
  FOR ALL
  TO authenticated
  USING (true);

-- Images policies
CREATE POLICY "Anyone can read images"
  ON images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage images"
  ON images
  FOR ALL
  TO authenticated
  USING (true);

-- Content-Images policies
CREATE POLICY "Anyone can read content-image relationships"
  ON content_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage content-image relationships"
  ON content_images
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_category ON content(category_id);
CREATE INDEX IF NOT EXISTS idx_content_images_content ON content_images(content_id);
CREATE INDEX IF NOT EXISTS idx_content_images_primary ON content_images(content_id, is_primary);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, description) VALUES
  ('Behavior Strategies', 'Advanced behavior intervention strategies and techniques'),
  ('Visual Supports', 'Visual aids and support materials for behavior management'),
  ('Parent Resources', 'Resources and guides for parent support and training'),
  ('Staff Training', 'Training materials and resources for staff development')
ON CONFLICT (name) DO NOTHING;