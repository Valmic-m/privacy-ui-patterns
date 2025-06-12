'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ExternalLink, ImageOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface ExampleScreenshotProps {
  screenshot_url: string;
  alt: string;
  company: string;
  source_url?: string;
}

export function ExampleScreenshot({
  screenshot_url,
  alt,
  company,
  source_url
}: ExampleScreenshotProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    console.warn(`Failed to load image: ${screenshot_url}`);
  };

  return (
    <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10">
      <div className="relative aspect-video bg-white/5">
        {isLoading && !hasError && (
          <Skeleton className="absolute inset-0 bg-white/10" />
        )}
        
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
            <ImageOff className="w-12 h-12 mb-2" />
            <p className="text-sm">Failed to load image</p>
            <p className="text-xs mt-1">{company}</p>
          </div>
        ) : (
          <Image
            src={screenshot_url}
            alt={alt}
            fill
            className="object-contain"
            onLoadingComplete={handleLoadingComplete}
            onError={handleError}
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
      
      <div className="p-4 space-y-2">
        <h4 className="font-medium text-white">{company}</h4>
        {source_url && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-white/70 hover:text-white"
            asChild
          >
            <a
              href={source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View live example
            </a>
          </Button>
        )}
      </div>
    </Card>
  );
}