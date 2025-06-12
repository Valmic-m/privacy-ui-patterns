'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

// This page now redirects to the main pattern for the category
export default function CategoryPatternsPage() {
  const router = useRouter();
  const params = useParams();
  const categorySlug = params?.category as string;
  
  useEffect(() => {
    async function fetchAndRedirect() {
      try {
        const res = await fetch(`/api/categories/${categorySlug}/main-pattern`);
        const data = await res.json();
        
        if (data.success && data.data) {
          // Redirect to the main pattern
          router.replace(`/patterns/${categorySlug}/${data.data.pattern.slug}`);
        } else {
          // If no pattern found, redirect back to catalogue
          router.replace('/patterns');
        }
      } catch (error) {
        // On error, redirect back to catalogue
        router.replace('/patterns');
      }
    }
    
    if (categorySlug) {
      fetchAndRedirect();
    }
  }, [categorySlug, router]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}