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
  category: {
    id: string;
    name: string;
    slug: string;
  };
  created_at: string;
  updated_at: string;
}

interface PatternsResponse {
  success: boolean;
  data?: Pattern[];
  error?: string;
  pagination?: {
    limit: number;
    offset: number;
  };
}

interface UsePatternsOptions {
  categoryId?: string;
  limit?: number;
  offset?: number;
}

export function usePatterns(options: UsePatternsOptions = {}) {
  const { categoryId, limit = 50, offset = 0 } = options;
  
  const queryParams = new URLSearchParams();
  if (categoryId) queryParams.append('category_id', categoryId);
  queryParams.append('limit', limit.toString());
  queryParams.append('offset', offset.toString());
  
  return useQuery<PatternsResponse>({
    queryKey: ['patterns', categoryId, limit, offset],
    queryFn: async () => {
      const res = await fetch(`/api/patterns?${queryParams}`);
      if (!res.ok) {
        throw new Error('Failed to fetch patterns');
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}