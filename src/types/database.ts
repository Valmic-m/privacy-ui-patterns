// Database type definitions for Privacy UI Pattern Library

export interface Source {
  title: string;
  url: string;
  type: 'academic' | 'industry' | 'regulatory' | 'blog';
}

export interface PbdPrinciple {
  id: string;
  name: string;
  abbr: string;
  description?: string;
}

export interface NielsenHeuristic {
  id: string;
  name: string;
  abbr: string;
  description?: string;
}

export interface PatternCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order_index: number;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface Pattern {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string | null;
  explanation: string;
  relevance: string;
  sources: Source[];
  pbd_alignment: PbdPrinciple[];
  nielsen_alignment: NielsenHeuristic[];
  created_at: string;
  updated_at: string;
  category?: PatternCategory;
  examples?: Example[];
  templates?: Template[];
}

export interface Example {
  id: string;
  pattern_id: string;
  company: string;
  title: string;
  use_case: string;
  description: string | null;
  why_selected: string;
  screenshot_url: string;
  cropped_screenshot_url: string | null;
  source_url: string;
  metadata: Record<string, any>;
  display_order: number;
  created_at: string;
  updated_at: string;
  pattern?: Pattern;
}

export interface Template {
  id: string;
  pattern_id: string;
  title: string;
  description: string | null;
  figma_file_url: string;
  thumbnail_url: string;
  download_count: number;
  external_click_count: number;
  created_at: string;
  updated_at: string;
  pattern?: Pattern;
}

export interface Submission {
  id: string;
  pattern_id: string | null;
  category_id: string | null;
  submission_type: 'example' | 'template' | 'new_pattern';
  data: Record<string, any>;
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_by: string | null;
  reviewed_by: string | null;
  review_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  category?: PatternCategory;
  pattern?: Pattern;
}

export interface Contributor {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  contribution_count: number;
  badge_level: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateAnalytics {
  id: string;
  template_id: string;
  action_type: 'download' | 'external_click';
  user_id: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
  template?: Template;
}

// Utility types for API responses
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// Search and filter types
export interface PatternSearchParams {
  q?: string;
  category?: string;
  sort?: 'alphabetical' | 'newest' | 'most_examples';
  page?: number;
  limit?: number;
}

export interface AdminStats {
  total_patterns: number;
  total_examples: number;
  total_templates: number;
  pending_submissions: number;
  total_contributors: number;
  total_downloads: number;
  recent_activity: {
    new_submissions: number;
    new_contributors: number;
    template_downloads: number;
  };
}

// Badge system types
export interface BadgeLevel {
  level: number;
  name: string;
  icon: string;
  required_contributions: number;
}

export const BADGE_LEVELS: BadgeLevel[] = [
  { level: 1, name: 'Privacy Pioneer', icon: 'shield-check', required_contributions: 1 },
  { level: 2, name: 'Guardian', icon: 'shield-star', required_contributions: 5 },
  { level: 3, name: 'Sentinel', icon: 'shield-badge', required_contributions: 10 },
  { level: 4, name: 'Master Investigator', icon: 'shield-crown', required_contributions: 25 },
];

// Database schema type (for use with Supabase generated types)
export interface Database {
  public: {
    Tables: {
      pattern_categories: {
        Row: PatternCategory;
        Insert: Omit<PatternCategory, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PatternCategory, 'id' | 'created_at' | 'updated_at'>>;
      };
      patterns: {
        Row: Pattern;
        Insert: Omit<Pattern, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Pattern, 'id' | 'created_at' | 'updated_at'>>;
      };
      examples: {
        Row: Example;
        Insert: Omit<Example, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Example, 'id' | 'created_at' | 'updated_at'>>;
      };
      templates: {
        Row: Template;
        Insert: Omit<Template, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Template, 'id' | 'created_at' | 'updated_at'>>;
      };
      submissions: {
        Row: Submission;
        Insert: Omit<Submission, 'id' | 'created_at'>;
        Update: Partial<Omit<Submission, 'id' | 'created_at'>>;
      };
      contributors: {
        Row: Contributor;
        Insert: Omit<Contributor, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Contributor, 'id' | 'created_at' | 'updated_at'>>;
      };
      template_analytics: {
        Row: TemplateAnalytics;
        Insert: Omit<TemplateAnalytics, 'id' | 'created_at'>;
        Update: Partial<Omit<TemplateAnalytics, 'id' | 'created_at'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      submission_type: 'example' | 'template' | 'new_pattern';
      submission_status: 'pending' | 'approved' | 'rejected';
      action_type: 'download' | 'external_click';
    };
  };
}