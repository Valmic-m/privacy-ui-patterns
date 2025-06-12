import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

interface CopyResult {
  totalCopied: number;
  totalSkipped: number;
  errors: string[];
}

const SCRAPER_DIR = path.join(process.cwd(), 'privacy_ui_scraper', 'privacy_ui_screenshots');
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'screenshots');
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

async function ensureDirectory(dirPath: string): Promise<void> {
  if (!existsSync(dirPath)) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function copyFile(source: string, destination: string): Promise<boolean> {
  try {
    // Skip if destination already exists
    if (existsSync(destination)) {
      return false;
    }
    
    await fs.copyFile(source, destination);
    return true;
  } catch (error) {
    console.error(`Error copying ${source} to ${destination}:`, error);
    throw error;
  }
}

async function copyScreenshots(sourceDir: string, destDir: string, result: CopyResult): Promise<void> {
  try {
    const entries = await fs.readdir(sourceDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);
      const destPath = path.join(destDir, entry.name);
      
      if (entry.isDirectory()) {
        await ensureDirectory(destPath);
        await copyScreenshots(sourcePath, destPath, result);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (IMAGE_EXTENSIONS.includes(ext)) {
          try {
            const copied = await copyFile(sourcePath, destPath);
            if (copied) {
              result.totalCopied++;
              console.log(`Copied: ${entry.name}`);
            } else {
              result.totalSkipped++;
              console.log(`Skipped (exists): ${entry.name}`);
            }
          } catch (error) {
            result.errors.push(`Failed to copy ${sourcePath}: ${error}`);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${sourceDir}:`, error);
    throw error;
  }
}

async function createGitignore(): Promise<void> {
  const gitignorePath = path.join(PUBLIC_DIR, '.gitignore');
  const content = '# Ignore all screenshot files\n*\n!.gitignore\n';
  
  try {
    await fs.writeFile(gitignorePath, content);
    console.log('Created .gitignore in screenshots directory');
  } catch (error) {
    console.error('Error creating .gitignore:', error);
  }
}

async function main(): Promise<void> {
  console.log('Starting screenshot copy process...');
  console.log(`Source: ${SCRAPER_DIR}`);
  console.log(`Destination: ${PUBLIC_DIR}`);
  
  // Check if source directory exists
  if (!existsSync(SCRAPER_DIR)) {
    console.error(`Error: Source directory not found: ${SCRAPER_DIR}`);
    process.exit(1);
  }
  
  // Create destination directory
  await ensureDirectory(PUBLIC_DIR);
  
  const result: CopyResult = {
    totalCopied: 0,
    totalSkipped: 0,
    errors: []
  };
  
  try {
    // Copy all screenshots
    await copyScreenshots(SCRAPER_DIR, PUBLIC_DIR, result);
    
    // Create .gitignore
    await createGitignore();
    
    // Print summary
    console.log('\n=== Copy Complete ===');
    console.log(`Total copied: ${result.totalCopied}`);
    console.log(`Total skipped: ${result.totalSkipped}`);
    console.log(`Total processed: ${result.totalCopied + result.totalSkipped}`);
    
    if (result.errors.length > 0) {
      console.error('\nErrors encountered:');
      result.errors.forEach(error => console.error(`- ${error}`));
    }
    
  } catch (error) {
    console.error('Fatal error during copy process:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);