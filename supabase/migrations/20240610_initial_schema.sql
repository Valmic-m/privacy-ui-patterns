-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- Enums
CREATE TYPE submission_type AS ENUM ('example', 'template', 'new_pattern');
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE action_type AS ENUM ('download', 'external_click');

-- Pattern Categories (pre-seeded, admin-only management)
CREATE TABLE pattern_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  icon VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_categories_slug ON pattern_categories(slug);
CREATE INDEX idx_categories_order ON pattern_categories(order_index);

-- Patterns
CREATE TABLE patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES pattern_categories(id) ON DELETE RESTRICT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  explanation TEXT NOT NULL,
  relevance TEXT NOT NULL,
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  pbd_alignment JSONB NOT NULL DEFAULT '{}'::jsonb,
  nielsen_alignment JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Examples
CREATE TABLE examples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pattern_id UUID NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
  company VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  use_case TEXT NOT NULL,
  description TEXT,
  why_selected TEXT NOT NULL,
  screenshot_url TEXT NOT NULL,
  cropped_screenshot_url TEXT,
  source_url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pattern_id UUID NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  figma_file_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  download_count INTEGER DEFAULT 0,
  external_click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template Analytics
CREATE TABLE template_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  action_type action_type NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_hash VARCHAR(64),
  user_agent VARCHAR(500),
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pattern_id UUID REFERENCES patterns(id) ON DELETE SET NULL,
  category_id UUID REFERENCES pattern_categories(id) ON DELETE SET NULL,
  submission_type submission_type NOT NULL,
  data JSONB NOT NULL,
  justification TEXT NOT NULL,
  status submission_status DEFAULT 'pending',
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT justification_min_length CHECK (char_length(justification) >= 100)
);

-- Contributors
CREATE TABLE contributors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  contribution_count INTEGER DEFAULT 0,
  badge_level VARCHAR(50) DEFAULT 'pioneer',
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create all necessary indexes
CREATE INDEX idx_patterns_category ON patterns(category_id);
CREATE INDEX idx_patterns_slug ON patterns(slug);
CREATE INDEX idx_patterns_created ON patterns(created_at DESC);
CREATE INDEX idx_examples_pattern ON examples(pattern_id);
CREATE INDEX idx_examples_created ON examples(created_at DESC);
CREATE INDEX idx_templates_pattern ON templates(pattern_id);
CREATE INDEX idx_templates_downloads ON templates(download_count DESC);
CREATE INDEX idx_analytics_template ON template_analytics(template_id);
CREATE INDEX idx_analytics_action ON template_analytics(action_type);
CREATE INDEX idx_analytics_created ON template_analytics(created_at DESC);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_type ON submissions(submission_type);
CREATE INDEX idx_submissions_created ON submissions(created_at DESC);
CREATE INDEX idx_contributors_user ON contributors(user_id);
CREATE INDEX idx_contributors_count ON contributors(contribution_count DESC);

-- Full-text search
CREATE INDEX idx_patterns_search ON patterns USING gin(
  to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(explanation, ''))
);

-- Row Level Security (RLS)
ALTER TABLE pattern_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributors ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public read access
CREATE POLICY "Public read access" ON pattern_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON patterns FOR SELECT USING (true);
CREATE POLICY "Public read access" ON examples FOR SELECT USING (true);
CREATE POLICY "Public read access" ON templates FOR SELECT USING (true);
CREATE POLICY "Public read access" ON contributors FOR SELECT USING (true);

-- Admin write access (requires admin role)
CREATE POLICY "Admin write access" ON pattern_categories FOR ALL 
  USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin write access" ON patterns FOR ALL 
  USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin write access" ON examples FOR ALL 
  USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin write access" ON templates FOR ALL 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Authenticated users can submit
CREATE POLICY "Authenticated users can submit" ON submissions FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can view their own submissions
CREATE POLICY "Users view own submissions" ON submissions FOR SELECT 
  USING (auth.uid() = submitted_by OR auth.jwt() ->> 'role' = 'admin');

-- Analytics write for authenticated users
CREATE POLICY "Track analytics" ON template_analytics FOR INSERT 
  WITH CHECK (true);