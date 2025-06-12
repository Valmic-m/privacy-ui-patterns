import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export function PatternSkeleton() {
  return (
    <Card className="h-full animate-pulse">
      <CardHeader>
        <div className="h-6 bg-muted rounded-md w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded-md" />
          <div className="h-4 bg-muted rounded-md w-5/6" />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4 border-t">
        <div className="h-4 bg-muted rounded-md w-24" />
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded-md w-16" />
          <div className="h-6 bg-muted rounded-md w-16" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function CategorySkeleton() {
  return (
    <Card className="h-full animate-pulse">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="w-12 h-12 bg-muted rounded-xl" />
          <div className="h-4 bg-muted rounded-md w-20" />
        </div>
        <div className="h-6 bg-muted rounded-md w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded-md" />
          <div className="h-4 bg-muted rounded-md w-5/6" />
        </div>
      </CardContent>
    </Card>
  );
}