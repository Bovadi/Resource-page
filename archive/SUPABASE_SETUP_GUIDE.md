# Comprehensive Supabase Implementation Guide

## Overview
This guide will help you set up a complete backend system for your course and resource management application using Supabase. No coding experience required!

---

## Part 1: Initial Supabase Setup

### Step 1: Create Your Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with your email or GitHub account
4. Click "New Project"
5. Choose your organization
6. Enter project details:
   - **Name**: "Course Management System" (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
7. Click "Create new project"
8. Wait 2-3 minutes for setup to complete

### Step 2: Connect to Your Application
1. In your Bolt project, click "Connect to Supabase" (top-right corner)
2. Enter your Supabase project URL and API key:
   - Find these in your Supabase dashboard under "Settings" → "API"
   - **Project URL**: Looks like `https://your-project.supabase.co`
   - **Anon Key**: Long string starting with `eyJ...`
3. Click "Connect"

---

## Part 2: Database Structure Setup

### Understanding Your Database Tables

Your application needs 4 main tables to store different types of information:

#### Table 1: Categories
**Purpose**: Organize your content into groups
**What it stores**:
- Category names (like "Behavior Strategies", "Visual Supports")
- Descriptions of each category
- When categories were created

#### Table 2: Content
**Purpose**: Store your courses and resources
**What it stores**:
- Course/resource titles
- Descriptions
- Video URLs (for courses)
- Test URLs (for courses)
- Publication status (draft, published, archived)
- Which category it belongs to

#### Table 3: Images
**Purpose**: Store information about uploaded images
**What it stores**:
- Original filename
- Where the image is stored
- Image dimensions (width/height)
- File size
- Alternative text for accessibility

#### Table 4: Content-Images
**Purpose**: Connect content with their images
**What it stores**:
- Which content item an image belongs to
- Which image is the main thumbnail
- Order of images for content with multiple images

### Step 3: Create Database Tables

1. In your Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. **IMPORTANT**: Check if tables already exist by going to "Table Editor" first
   - If you see tables named `categories`, `content`, `images`, and `content_images`, **SKIP to Step 4**
   - If no tables exist, copy and paste this setup code:

```sql
-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content table
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('course', 'resource')),
  category_id UUID REFERENCES categories(id),
  video_url TEXT,
  test_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create images table
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content-images relationship table
CREATE TABLE content_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_id, image_id)
);
```

4. Click "Run" to create all tables

**Note**: If you get an error saying tables already exist, that's normal - just continue to the next step.
---

## Part 3: Security Setup (Row Level Security)

### Why Security Matters
Row Level Security (RLS) controls who can see and modify your data. We'll set it up so:
- **Everyone** can view published content
- **Only you** (when logged in) can add, edit, or delete content

### Step 4: Enable Security Policies

1. In SQL Editor, create a new query with this code:

**IMPORTANT**: If you get errors about policies already existing, use this modified code instead:

```sql
-- Enable Row Level Security on all tables (skip if already enabled)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (this prevents errors)
DROP POLICY IF EXISTS "Public can read categories" ON categories;
DROP POLICY IF EXISTS "Public can read published content" ON content;
DROP POLICY IF EXISTS "Public can read images" ON images;
DROP POLICY IF EXISTS "Public can read content-image relationships" ON content_images;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can manage content" ON content;
DROP POLICY IF EXISTS "Authenticated users can manage images" ON images;
DROP POLICY IF EXISTS "Authenticated users can manage content-image relationships" ON content_images;

-- Create fresh policies
CREATE POLICY "Public can read categories" ON categories FOR SELECT TO public USING (true);
CREATE POLICY "Public can read published content" ON content FOR SELECT TO public USING (status = 'published');
CREATE POLICY "Public can read images" ON images FOR SELECT TO public USING (true);
CREATE POLICY "Public can read content-image relationships" ON content_images FOR SELECT TO public USING (true);

-- Allow authenticated users to manage everything
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage content" ON content FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage images" ON images FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage content-image relationships" ON content_images FOR ALL TO authenticated USING (true);
```

**Alternative Simple Code** (if you're getting errors):

```sql
-- Enable Row Level Security on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_images ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read published content
CREATE POLICY IF NOT EXISTS "Public can read categories" ON categories FOR SELECT TO public USING (true);
CREATE POLICY IF NOT EXISTS "Public can read published content" ON content FOR SELECT TO public USING (status = 'published');
CREATE POLICY IF NOT EXISTS "Public can read images" ON images FOR SELECT TO public USING (true);
CREATE POLICY IF NOT EXISTS "Public can read content-image relationships" ON content_images FOR SELECT TO public USING (true);

-- Allow authenticated users to manage everything
CREATE POLICY IF NOT EXISTS "Authenticated users can manage categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Authenticated users can manage content" ON content FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Authenticated users can manage images" ON images FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Authenticated users can manage content-image relationships" ON content_images FOR ALL TO authenticated USING (true);
```

2. Click "Run"

**What to do if you still get errors:**
1. Go to "Authentication" → "Policies" in your Supabase dashboard
2. You should see your policies already listed there
3. If they exist and work, you can skip this step entirely
4. Your application should work fine with the existing policies
---

## Part 4: File Storage Setup

### Step 5: Create Storage Bucket for Images

1. Go to "Storage" in your Supabase dashboard
2. Click "Create a new bucket"
3. Enter bucket details:
   - **Name**: `images`
   - **Public bucket**: Toggle ON (this allows images to be viewed publicly)
4. Click "Create bucket"

### Step 6: Set Storage Policies

1. Click on your "images" bucket
2. Go to "Policies" tab
3. Click "Add policy"
4. Choose "Custom policy"
5. Enter policy details:
   - **Policy name**: "Public can view images"
   - **Allowed operation**: SELECT
   - **Target roles**: public
6. Click "Save"

7. Add another policy:
   - **Policy name**: "Authenticated users can upload images"
   - **Allowed operation**: INSERT
   - **Target roles**: authenticated
8. Click "Save"

---

## Part 5: Adding Sample Data

### Step 7: Create Sample Categories

1. Go to "Table Editor" in Supabase
2. Select "categories" table
3. Click "Insert" → "Insert row"
4. Add these categories one by one:

**Category 1:**
- name: `Behavior Strategies`
- description: `Evidence-based approaches for behavior intervention`

**Category 2:**
- name: `Visual Supports`
- description: `Visual aids and communication tools`

**Category 3:**
- name: `Parent Resources`
- description: `Materials and guides for parents and caregivers`

### Step 8: Add Sample Content

1. Select "content" table
2. Click "Insert" → "Insert row"
3. Add sample course:

**Sample Course:**
- title: `Creating Visual BIPs for Confident Parent & Staff Support`
- description: `Learn to create effective visual behavior intervention plans`
- type: `course`
- video_url: `https://example.com/course-video.mp4` (replace with real URL)
- test_url: `https://example.com/course-test` (replace with real URL)
- status: `published`

**Sample Resource:**
- title: `5-4-3-2-1 Calm Visual Poster`
- description: `Downloadable poster for calming strategies`
- type: `resource`
- status: `published`

---

## Part 6: Using Your Application

### Step 9: Access Admin Features

1. In your application, click the "Admin" button (top-right)
2. You'll see the Content Management interface
3. Here you can:
   - **Add new courses and resources**
   - **Upload images** (drag and drop)
   - **Edit existing content**
   - **Change publication status**

### Step 10: Adding Content Through the App

**To Add a New Course:**
1. Click "Add Content" in admin panel
2. Fill in the form:
   - **Title**: Your course name
   - **Description**: What the course covers
   - **Type**: Select "Course"
   - **Status**: Choose "Published" to make it visible
   - **Video URL**: Link to your course video
   - **Test URL**: Link to your course test
3. **Upload Images**: Drag image files into the upload area
4. Click "Create"

**To Add a New Resource:**
1. Click "Add Content"
2. Fill in the form:
   - **Title**: Resource name
   - **Description**: What the resource contains
   - **Type**: Select "Resource"
   - **Status**: Choose "Published"
3. **Upload Images**: Add thumbnail images
4. Click "Create"

---

## Part 7: Understanding Data Flow

### How Your Data Works:

1. **Content Creation**: When you add a course/resource, it's stored in the `content` table
2. **Image Upload**: Images are uploaded to Supabase Storage and metadata saved in `images` table
3. **Linking**: The `content_images` table connects your content with its images
4. **Display**: Your app reads this data and shows it to users
5. **Course Modal**: When users click a course, it loads the video URL and related resources

### What Happens When Users Interact:

- **Browse Resources**: App queries `content` table for published resources
- **View Course**: App loads course details and associated images
- **Start Course**: Modal displays video from stored URL
- **Supporting Materials**: App finds related resources to show below video

---

## Part 8: Maintenance and Management

### Regular Tasks:

**Weekly:**
- Check storage usage in Supabase dashboard
- Review and publish draft content
- Update course videos if needed

**Monthly:**
- Clean up unused images in storage
- Review content performance
- Update resource materials

### Troubleshooting Common Issues:

**Images Not Loading:**
1. Check if storage bucket is public
2. Verify image URLs in the images table
3. Ensure storage policies allow public access

**Content Not Appearing:**
1. Check if content status is "published"
2. Verify content exists in database
3. Check if security policies allow access

**Video Not Playing:**
1. Verify video URL is correct and accessible
2. Check if video format is supported by browsers
3. Ensure video hosting service allows embedding

---

## Part 9: Scaling Your Application

### As Your Content Grows:

**Storage Management:**
- Monitor storage usage in Supabase dashboard
- Optimize image sizes before uploading
- Consider upgrading Supabase plan if needed

**Performance Optimization:**
- Keep image file sizes reasonable (under 2MB)
- Use appropriate video hosting (YouTube, Vimeo)
- Regularly archive old content

**Content Organization:**
- Create more specific categories as needed
- Use consistent naming conventions
- Maintain clear descriptions for all content

---

## Part 10: Backup and Security

### Protecting Your Data:

**Regular Backups:**
1. Go to Supabase "Settings" → "Database"
2. Use "Backup" feature for important data
3. Export content regularly as CSV files

**Security Best Practices:**
- Never share your database password
- Regularly review access policies
- Monitor usage in Supabase dashboard
- Keep your Supabase project updated

---

## Summary

You now have a complete backend system that:
- ✅ Stores all your courses and resources
- ✅ Manages image uploads and storage
- ✅ Provides secure access control
- ✅ Supports your application's features
- ✅ Scales with your content needs

Your application can now handle real data, user interactions, and content management without any additional coding required!

---

## Part 11: Content Labels and Download System Setup

### Step 11: Create Content Labels Tables

If you're experiencing errors about missing `content_labels` or `content_label_assignments` tables, run this SQL in your Supabase SQL Editor:

**First, create the missing tables:**

```sql
-- Create content_labels table
CREATE TABLE IF NOT EXISTS content_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content_label_assignments table
CREATE TABLE IF NOT EXISTS content_label_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES content_labels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_id, label_id)
);

-- Create download_logs table
CREATE TABLE IF NOT EXISTS download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  user_id UUID,
  download_url TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_labels_active ON content_labels(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_content_labels_slug ON content_labels(slug);
CREATE INDEX IF NOT EXISTS idx_content_label_assignments_content ON content_label_assignments(content_id);
CREATE INDEX IF NOT EXISTS idx_content_label_assignments_label ON content_label_assignments(label_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_resource ON download_logs(resource_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_user ON download_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_created ON download_logs(created_at);

-- Add download_url column to content table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'content' AND column_name = 'download_url'
  ) THEN
    ALTER TABLE content ADD COLUMN download_url TEXT;
    COMMENT ON COLUMN content.download_url IS 'URL for downloadable resources - must be validated and from allowed domains';
  END IF;
END $$;
```

**Then, set up Row Level Security policies:**

```sql
-- Enable RLS for new tables
ALTER TABLE content_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_label_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for content_labels
CREATE POLICY "Public can read active labels" ON content_labels 
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Authenticated users can manage labels" ON content_labels 
  FOR ALL TO authenticated USING (true);

-- Create policies for content_label_assignments
CREATE POLICY "Public can read label assignments" ON content_label_assignments 
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can manage label assignments" ON content_label_assignments 
  FOR ALL TO authenticated USING (true);

-- Create policies for download_logs
CREATE POLICY "Authenticated users can insert download logs" ON download_logs 
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can read download logs" ON download_logs 
  FOR SELECT TO authenticated USING (true);
```

**Finally, add some sample labels:**

```sql
-- Insert sample navigation labels
INSERT INTO content_labels (name, description, slug, display_order) VALUES
  ('Welcome Start here', 'Getting started content', 'welcome-start-here', 1),
  ('Developing FBA & BIPs', 'Functional Behavior Assessment and Behavior Intervention Plans', 'developing-fba-bips', 2),
  ('Stakeholder Support Guides', 'Resources for supporting stakeholders', 'stakeholder-support-guides', 3),
  ('Visual Supports', 'Visual aids and communication tools', 'visual-supports', 4),
  ('Resources for Stakeholders', 'Additional stakeholder resources', 'resources-for-stakeholders', 5)
ON CONFLICT (slug) DO NOTHING;
```

### Troubleshooting Labels System:

**If you still get errors:**
1. Check that all tables exist in "Table Editor"
2. Verify policies are created in "Authentication" → "Policies"
3. Refresh your application after running the SQL
4. Check browser console for any remaining errors

For support, refer to [Supabase Documentation](https://supabase.com/docs) or contact your development team.