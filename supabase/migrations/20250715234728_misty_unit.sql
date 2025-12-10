/*
  # Add Download Functionality

  1. New Tables
    - `download_logs` - Track download attempts and statistics

  2. Schema Updates
    - Add `download_url` field to content table

  3. Security
    - Enable RLS on download_logs table
    - Add policies for authenticated access
*/

-- Add download_url field to content table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'content' AND column_name = 'download_url'
  ) THEN
    ALTER TABLE content ADD COLUMN download_url TEXT;
  END IF;
END $$;

-- Create download_logs table for tracking downloads
CREATE TABLE IF NOT EXISTS download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  user_id UUID,
  download_url TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_download_logs_resource ON download_logs(resource_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_user ON download_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_created ON download_logs(created_at);

-- Enable Row Level Security
ALTER TABLE download_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for download_logs table
CREATE POLICY "Authenticated users can read download logs" 
  ON download_logs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert download logs" 
  ON download_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Update content table policies to include download_url
DROP POLICY IF EXISTS "Public can read published content" ON content;
CREATE POLICY "Public can read published content" 
  ON content FOR SELECT TO public 
  USING (status = 'published');

-- Add comment to document the download_url field
COMMENT ON COLUMN content.download_url IS 'URL for downloadable resources - must be validated and from allowed domains';