import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Eye } from 'lucide-react';

interface PatternCardProps {
  pattern: {
    id: string;
    category_id: string;
    title: string;
    slug: string;
    description: string;
    example_count: number;
    pbd_alignment: Record<string, any>;
    nielsen_alignment: Record<string, any>;
    category?: {
      slug: string;
      name: string;
    };
  };
  categorySlug?: string;
}

export function PatternCard({ pattern, categorySlug }: PatternCardProps) {
  const href = categorySlug 
    ? `/patterns/${categorySlug}/${pattern.slug}`
    : `/patterns/${pattern.category?.slug}/${pattern.slug}`;
  
  const pbdCount = Object.values(pattern.pbd_alignment || {}).filter(Boolean).length;
  const nielsenCount = Object.values(pattern.nielsen_alignment || {}).filter(Boolean).length;
  
  return (
    <Link href={href}>
      <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-privacy-blue/30 hover:-translate-y-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg group-hover:text-privacy-blue transition-colors line-clamp-2">
            {pattern.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground text-sm line-clamp-3">
            {pattern.description}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{pattern.example_count} examples</span>
          </div>
          <div className="flex gap-2">
            {pbdCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                PbD
              </Badge>
            )}
            {nielsenCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Nielsen
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}