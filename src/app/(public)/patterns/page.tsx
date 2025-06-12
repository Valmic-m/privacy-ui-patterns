'use client';

import { useCategories } from '@/hooks/useCategories';
import { CategoryCard } from '@/components/patterns/CategoryCard';
import { PatternGrid } from '@/components/patterns/PatternGrid';
import { CategorySkeleton } from '@/components/patterns/PatternSkeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PatternsPage() {
  const { data: response, isLoading, error } = useCategories();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-privacy-blue to-privacy-purple bg-clip-text text-transparent">
          Privacy UI Patterns
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Explore our comprehensive collection of privacy-focused UI patterns, organized by category. 
          Each pattern includes real-world examples, implementation guidelines, and alignment with 
          Privacy by Design principles.
        </p>
      </div>
      
      {isLoading && (
        <PatternGrid columns={4}>
          {Array.from({ length: 8 }).map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </PatternGrid>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading categories</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load pattern categories. Please try again later.'}
          </AlertDescription>
        </Alert>
      )}
      
      {response?.success && response.data && (
        <PatternGrid columns={4}>
          {response.data.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </PatternGrid>
      )}
      
      {response?.success && (!response.data || response.data.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No pattern categories found. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
}