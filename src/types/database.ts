export interface Source {
  title: string;
  url: string;
  type: 'academic' | 'industry' | 'regulatory' | 'blog';
}

export interface PbdPrinciple {
  id: string;
  name: string;
  description?: string;
}

export interface NielsenHeuristic {
  id: string;
  name: string;
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
}