import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, Shield, Cookie, Database, Eye, Fingerprint, Baby, Layout, ToggleLeft, FileText, EyeOff, Smartphone, AlertTriangle, Zap, Download, Clock } from 'lucide-react';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    pattern_count: number;
    main_pattern_slug?: string | null;
  };
}

const iconMap: Record<string, LucideIcon> = {
  'shield': Shield,
  'cookie': Cookie,
  'database': Database,
  'eye': Eye,
  'fingerprint': Fingerprint,
  'baby': Baby,
  'layout-dashboard': Layout,
  'toggle-left': ToggleLeft,
  'file-text': FileText,
  'eye-off': EyeOff,
  'smartphone': Smartphone,
  'alert-triangle': AlertTriangle,
  'zap': Zap,
  'download': Download,
  'clock': Clock,
  'trash-2': AlertTriangle,
  'check-square': Shield,
};

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Shield;
  
  // Link directly to the main pattern if it exists, otherwise to the category
  const href = category.main_pattern_slug 
    ? `/patterns/${category.slug}/${category.main_pattern_slug}`
    : `/patterns/${category.slug}`;
  
  return (
    <Link href={href}>
      <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-privacy-blue/30 hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-privacy-blue/10 to-privacy-purple/10 group-hover:from-privacy-blue/20 group-hover:to-privacy-purple/20 transition-all duration-300">
              <Icon className="w-6 h-6 text-privacy-blue" />
            </div>
          </div>
          <CardTitle className="text-xl group-hover:text-privacy-blue transition-colors">
            {category.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2">
            {category.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}