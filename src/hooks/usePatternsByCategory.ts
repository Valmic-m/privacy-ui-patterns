import { useQuery } from '@tanstack/react-query';

interface Pattern {
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
  example_count: number;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  order_index: number;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface PatternsByCategoryResponse {
  success: boolean;
  data?: {
    category: Category;
    patterns: Pattern[];
  };
  error?: string;
  pagination?: {
    limit: number;
    offset: number;
  };
}

interface UsePatternsByCategoryOptions {
  limit?: number;
  offset?: number;
}

export function usePatternsByCategory(
  slug: string | undefined,
  options: UsePatternsByCategoryOptions = {}
) {
  const { limit = 20, offset = 0 } = options;
  
  const queryParams = new URLSearchParams();
  queryParams.append('limit', limit.toString());
  queryParams.append('offset', offset.toString());
  
  return useQuery<PatternsByCategoryResponse>({
    queryKey: ['patterns', 'category', slug, limit, offset],
    queryFn: async () => {
      if (!slug) throw new Error('Category slug is required');
      
      const res = await fetch(`/api/patterns/category/${slug}?${queryParams}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Category not found');
        }
        throw new Error('Failed to fetch patterns');
      }
      return res.json();
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}