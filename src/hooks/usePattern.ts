import { useQuery } from '@tanstack/react-query';

interface Example {
  id: string;
  pattern_id: string;
  company: string;
  title: string;
  use_case: string;
  description: string;
  why_selected: string;
  screenshot_url: string;
  cropped_screenshot_url?: string;
  source_url: string;
  metadata: Record<string, any>;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface PatternDetail {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  explanation: string;
  relevance: string;
  sources: any[];
  pbd_alignment: Record<string, any>;
  nielsen_alignment: Record<string, any>;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
  examples: Example[];
  created_at: string;
  updated_at: string;
}

interface PatternResponse {
  success: boolean;
  data?: PatternDetail;
  error?: string;
}

export function usePattern(id: string | undefined) {
  return useQuery<PatternResponse>({
    queryKey: ['pattern', id],
    queryFn: async () => {
      if (!id) throw new Error('Pattern ID is required');
      
      const res = await fetch(`/api/patterns/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Pattern not found');
        }
        throw new Error('Failed to fetch pattern');
      }
      return res.json();
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}