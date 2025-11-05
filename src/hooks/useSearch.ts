import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';

interface SearchResult {
  patterns: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  examples: Array<{
    id: string;
    company: string;
    title: string;
    pattern: {
      id: string;
      title: string;
      slug: string;
      category: {
        id: string;
        name: string;
        slug: string;
      };
    };
  }>;
}

interface SearchResponse {
  success: boolean;
  data?: SearchResult;
  error?: string;
}

export function useSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);
  
  return useQuery<SearchResponse>({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        return {
          success: true,
          data: {
            patterns: [],
            examples: []
          }
        };
      }
      
      const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      if (!res.ok) {
        throw new Error('Failed to search');
      }
      return res.json();
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}