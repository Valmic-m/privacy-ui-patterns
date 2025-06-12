#!/usr/bin/env python3

"""Validate captured screenshots to identify error pages and broken URLs."""

import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

async def validate_screenshot_quality():
    """Check screenshots for common error indicators."""
    
    screenshot_dir = Path("privacy_ui_screenshots")
    results = []
    
    # Look for pattern folders
    pattern_folders = [f for f in screenshot_dir.iterdir() if f.is_dir() and f.name.startswith(('01_', '03_', '04_', '06_', '07_', '08_', '09_'))]
    
    print(f"\n🔍 Validating {len(pattern_folders)} completed patterns...")
    
    for folder in sorted(pattern_folders):
        print(f"\n📁 {folder.name}")
        
        # Check metadata.json for URLs and success status
        metadata_file = folder / "metadata.json"
        if metadata_file.exists():
            with open(metadata_file) as f:
                metadata = json.load(f)
            
            for example in metadata.get("examples", []):
                filename = example.get("screenshot_file")
                if filename and (folder / filename).exists():
                    file_size = (folder / filename).stat().st_size
                    url = example.get("url", "")
                    success = example.get("success", False)
                    
                    # Flag suspicious patterns
                    suspicious = []
                    if file_size < 50000:  # Very small files might be error pages
                        suspicious.append("small_file")
                    if not success:
                        suspicious.append("failed_capture")
                    if "404" in filename.lower() or "error" in filename.lower():
                        suspicious.append("error_filename")
                    
                    status = "⚠️" if suspicious else "✅"
                    print(f"  {status} {filename:<40} {file_size:>8,} bytes | {url[:50]}...")
                    
                    if suspicious:
                        print(f"      Issues: {', '.join(suspicious)}")
                    
                    results.append({
                        "pattern": folder.name,
                        "filename": filename,
                        "url": url,
                        "file_size": file_size,
                        "success": success,
                        "suspicious": suspicious
                    })
    
    # Summary
    total = len(results)
    suspicious_count = len([r for r in results if r["suspicious"]])
    small_files = len([r for r in results if r["file_size"] < 50000])
    
    print(f"\n📊 VALIDATION SUMMARY")
    print(f"Total screenshots: {total}")
    print(f"Suspicious captures: {suspicious_count}")
    print(f"Very small files (<50KB): {small_files}")
    print(f"Success rate: {((total - suspicious_count) / total * 100):.1f}%")
    
    # List most suspicious
    very_suspicious = [r for r in results if len(r["suspicious"]) > 1 or r["file_size"] < 20000]
    if very_suspicious:
        print(f"\n🚨 MOST SUSPICIOUS CAPTURES:")
        for r in very_suspicious:
            print(f"  {r['pattern']}/{r['filename']} - {r['file_size']:,} bytes - {r['url'][:60]}...")

if __name__ == "__main__":
    asyncio.run(validate_screenshot_quality())