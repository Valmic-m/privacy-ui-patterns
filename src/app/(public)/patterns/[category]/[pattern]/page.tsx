'use client';

import { use, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { usePattern } from '@/hooks/usePattern';
import { usePatterns } from '@/hooks/usePatterns';
import { AlertCircle, ArrowLeft, ExternalLink, Shield, Eye, BookOpen, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface PageParams {
  category: string;
  pattern: string;
}

export default function PatternDetailPage() {
  const params = useParams();
  const categorySlug = params?.category as string;
  const patternSlug = params?.pattern as string;
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  
  // First get patterns to find the pattern ID by slug
  const { data: patternsResponse } = usePatterns();
  const patternId = patternsResponse?.data?.find(
    p => p.slug === patternSlug && p.category?.slug === categorySlug
  )?.id;
  
  const { data: response, isLoading, error } = usePattern(patternId);
  const pattern = response?.data;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mb-2" />
          <Skeleton className="h-6 w-2/3 max-w-2xl" />
        </div>
        
        <Tabs defaultValue="explanation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="explanation" className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading pattern</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load pattern details. Please try again later.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!pattern) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Pattern not found.</p>
          <Link href="/patterns">
            <Button variant="outline" className="mt-4">
              Back to Patterns
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const pbdAlignments = Object.entries(pattern.pbd_alignment || {})
    .filter(([_, value]) => value)
    .map(([key]) => key.replace(/_/g, ' '));
    
  const nielsenAlignments = Object.entries(pattern.nielsen_alignment || {})
    .filter(([_, value]) => value)
    .map(([key]) => key.replace(/_/g, ' '));
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Link href="/patterns">
          <Button variant="ghost" className="mb-4 -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pattern Catalogue
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-privacy-blue to-privacy-purple bg-clip-text text-transparent">
          {pattern.title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {pattern.description}
        </p>
        
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {pattern.examples?.length || 0} real-world examples
            </span>
          </div>
          {pbdAlignments.length > 0 && (
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-privacy-blue" />
              <span className="text-muted-foreground">
                Privacy by Design aligned
              </span>
            </div>
          )}
          {nielsenAlignments.length > 0 && (
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-privacy-purple" />
              <span className="text-muted-foreground">
                Nielsen's Heuristics aligned
              </span>
            </div>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="explanation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="explanation">Explanation</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="explanation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Why This Pattern Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>{pattern.explanation}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Relevance & Implementation</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>{pattern.relevance}</p>
            </CardContent>
          </Card>
          
          {(pbdAlignments.length > 0 || nielsenAlignments.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Design Principle Alignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pbdAlignments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Privacy by Design Principles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {pbdAlignments.map((principle) => (
                        <Badge key={principle} variant="secondary">
                          {principle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {nielsenAlignments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Nielsen's Heuristics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {nielsenAlignments.map((heuristic) => (
                        <Badge key={heuristic} variant="secondary">
                          {heuristic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {pattern.sources && pattern.sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sources & References</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {pattern.sources.map((source: any, index: number) => (
                    <li key={index}>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-privacy-blue hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="examples" className="space-y-6">
          {pattern.examples && pattern.examples.length > 0 ? (
            <div className="grid gap-6">
              {pattern.examples.map((example) => (
                <Card key={example.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{example.company}</CardTitle>
                        <CardDescription className="mt-2">
                          {example.title}
                        </CardDescription>
                      </div>
                      <a 
                        href={example.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-privacy-blue hover:text-privacy-purple transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Use Case</h4>
                      <p className="text-muted-foreground">{example.use_case}</p>
                    </div>
                    
                    {example.description && (
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-muted-foreground">{example.description}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium mb-2">Why This Example?</h4>
                      <p className="text-muted-foreground">{example.why_selected}</p>
                    </div>
                    
                    {example.screenshot_url && (
                      <div className="pt-4">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setSelectedExample(
                            selectedExample === example.id ? null : example.id
                          )}
                        >
                          {selectedExample === example.id ? 'Hide' : 'View'} Screenshot
                        </Button>
                        
                        {selectedExample === example.id && (
                          <div className="mt-4 rounded-lg overflow-hidden border">
                            <div className="relative aspect-video bg-muted">
                              {/* In production, this would load the actual screenshot */}
                              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                Screenshot: {example.screenshot_url}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  No examples available for this pattern yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Figma templates for this pattern are coming soon.
              </p>
              <Badge variant="outline">Stage 3 - Coming Soon</Badge>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}