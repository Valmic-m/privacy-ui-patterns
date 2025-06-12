import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PUBLIC_SCREENSHOTS_DIR = path.join(process.cwd(), 'public', 'screenshots');

interface FixResult {
  totalChecked: number;
  totalFixed: number;
  totalNotFound: number;
  errors: string[];
}

async function getAllScreenshots(): Promise<Map<string, string>> {
  const screenshotMap = new Map<string, string>();
  
  async function scanDirectory(dirPath: string, relativePath: string = ''): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativeEntryPath = path.join(relativePath, entry.name);
        
        if (entry.isDirectory()) {
          await scanDirectory(fullPath, relativeEntryPath);
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
          // Store both the normalized key and the actual file path
          const normalizedKey = entry.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          screenshotMap.set(normalizedKey, `/screenshots/${relativeEntryPath}`);
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error);
    }
  }
  
  await scanDirectory(PUBLIC_SCREENSHOTS_DIR);
  return screenshotMap;
}

function normalizeForMatching(filename: string): string {
  return filename.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function findBestMatch(targetUrl: string, screenshotMap: Map<string, string>): Promise<string | null> {
  // Extract filename from URL
  const filename = path.basename(targetUrl);
  const normalizedTarget = normalizeForMatching(filename);
  
  // Direct match
  if (screenshotMap.has(normalizedTarget)) {
    return screenshotMap.get(normalizedTarget)!;
  }
  
  // Partial match - find the best match
  let bestMatch: string | null = null;
  let bestScore = 0;
  
  for (const [normalizedKey, actualPath] of screenshotMap.entries()) {
    // Calculate similarity score
    let score = 0;
    const minLength = Math.min(normalizedTarget.length, normalizedKey.length);
    
    for (let i = 0; i < minLength; i++) {
      if (normalizedTarget[i] === normalizedKey[i]) {
        score++;
      } else {
        break;
      }
    }
    
    // Boost score if the filename contains key parts
    const targetParts = normalizedTarget.split(/\d+/);
    const keyParts = normalizedKey.split(/\d+/);
    
    for (const part of targetParts) {
      if (part.length > 3 && normalizedKey.includes(part)) {
        score += part.length;
      }
    }
    
    if (score > bestScore && score > normalizedTarget.length * 0.5) {
      bestScore = score;
      bestMatch = actualPath;
    }
  }
  
  return bestMatch;
}

async function fixScreenshotUrls(): Promise<void> {
  console.log('Starting screenshot URL fix...');
  
  // Get all available screenshots
  console.log('Scanning screenshot directory...');
  const screenshotMap = await getAllScreenshots();
  console.log(`Found ${screenshotMap.size} screenshot files`);
  
  // Get all examples from database
  const { data: examples, error: fetchError } = await supabase
    .from('examples')
    .select('id, company, screenshot_url')
    .order('id');
  
  if (fetchError) {
    console.error('Failed to fetch examples:', fetchError);
    return;
  }
  
  const result: FixResult = {
    totalChecked: 0,
    totalFixed: 0,
    totalNotFound: 0,
    errors: []
  };
  
  for (const example of examples || []) {
    result.totalChecked++;
    
    try {
      // Check if current URL works
      const currentPath = path.join(process.cwd(), 'public', example.screenshot_url);
      
      if (existsSync(currentPath)) {
        console.log(`✓ ${example.company} - URL already works`);
        continue;
      }
      
      // Try to find a matching file
      const matchedUrl = await findBestMatch(example.screenshot_url, screenshotMap);
      
      if (matchedUrl) {
        // Update the database
        const { error: updateError } = await supabase
          .from('examples')
          .update({ screenshot_url: matchedUrl })
          .eq('id', example.id);
        
        if (updateError) {
          result.errors.push(`Failed to update ${example.company}: ${updateError.message}`);
        } else {
          result.totalFixed++;
          console.log(`🔧 ${example.company} - Fixed: ${example.screenshot_url} → ${matchedUrl}`);
        }
      } else {
        result.totalNotFound++;
        console.log(`❌ ${example.company} - No match found for: ${example.screenshot_url}`);
      }
      
    } catch (error) {
      result.errors.push(`Error processing ${example.company}: ${error}`);
    }
  }
  
  console.log('\n=== Fix Complete ===');
  console.log(`Total checked: ${result.totalChecked}`);
  console.log(`Total fixed: ${result.totalFixed}`);
  console.log(`Total not found: ${result.totalNotFound}`);
  console.log(`Success rate: ${((result.totalChecked - result.totalNotFound) / result.totalChecked * 100).toFixed(1)}%`);
  
  if (result.errors.length > 0) {
    console.error('\nErrors encountered:');
    result.errors.forEach(error => console.error(`- ${error}`));
  }
}

// Run the fix
fixScreenshotUrls().catch(console.error);