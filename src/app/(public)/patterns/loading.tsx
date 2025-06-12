import { PatternGrid } from '@/components/patterns/PatternGrid';
import { CategorySkeleton } from '@/components/patterns/PatternSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-6 w-full max-w-3xl" />
        <Skeleton className="h-6 w-5/6 max-w-3xl mt-2" />
      </div>
      
      <PatternGrid columns={4}>
        {Array.from({ length: 8 }).map((_, i) => (
          <CategorySkeleton key={i} />
        ))}
      </PatternGrid>
    </div>
  );
}