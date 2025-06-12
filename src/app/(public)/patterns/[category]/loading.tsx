import { PatternGrid } from '@/components/patterns/PatternGrid';
import { PatternSkeleton } from '@/components/patterns/PatternSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-40 mb-4" />
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-6 w-full max-w-3xl" />
      </div>
      
      <PatternGrid>
        {Array.from({ length: 6 }).map((_, i) => (
          <PatternSkeleton key={i} />
        ))}
      </PatternGrid>
    </div>
  );
}