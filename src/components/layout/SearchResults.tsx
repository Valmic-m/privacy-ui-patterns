import { useRouter } from 'next/navigation';
import { Search, FileText, Image as ImageIcon } from 'lucide-react';

interface SearchResultsProps {
  results: {
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
  };
  onClose: () => void;
}

export function SearchResults({ results, onClose }: SearchResultsProps) {
  const router = useRouter();
  
  const hasResults = results.patterns.length > 0 || results.examples.length > 0;
  
  const handlePatternClick = (pattern: any) => {
    router.push(`/patterns/${pattern.category.slug}/${pattern.slug}`);
    onClose();
  };
  
  const handleExampleClick = (example: any) => {
    router.push(`/patterns/${example.pattern.category.slug}/${example.pattern.slug}`);
    onClose();
  };
  
  if (!hasResults) {
    return (
      <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50 p-4">
        <div className="text-center text-muted-foreground">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No results found</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
      {results.patterns.length > 0 && (
        <div className="p-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">
            Patterns
          </h3>
          {results.patterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => handlePatternClick(pattern)}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-start gap-3"
            >
              <FileText className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">{pattern.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {pattern.category.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {results.examples.length > 0 && (
        <div className="p-2 border-t">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">
            Examples
          </h3>
          {results.examples.map((example) => (
            <button
              key={example.id}
              onClick={() => handleExampleClick(example)}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-start gap-3"
            >
              <ImageIcon className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">{example.company}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {example.pattern.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}