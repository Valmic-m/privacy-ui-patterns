import { useQuery } from '@tanstack/react-query';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  order_index: number;
  icon: string;
  pattern_count: number;
  main_pattern_slug?: string | null;
  created_at: string;
  updated_at: string;
}

interface CategoriesResponse {
  success: boolean;
  data?: Category[];
  error?: string;
}

export function useCategories() {
  return useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) {
        throw new Error('Failed to fetch categories');
      }
      return res.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}