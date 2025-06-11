#!/usr/bin/env python3

"""Quick test of sites likely to have good privacy banners."""

import asyncio
import logging
from pathlib import Path
from screenshot_capture import ScreenshotCapture
import time

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

async def test_quick_privacy_sites():
    """Test sites that should load quickly and show privacy banners."""
    
    # Sites more likely to work well
    test_sites = [
        {
            "name": "ICO_UK",
            "url": "https://ico.org.uk",
            "description": "UK privacy regulator - clean, fast site"
        },
        {
            "name": "Guardian",
            "url": "https://www.theguardian.com", 
            "description": "UK newspaper with privacy banner"
        },
        {
            "name": "Apple_Privacy",
            "url": "https://www.apple.com/legal/privacy/",
            "description": "Apple privacy policy page"
        },
        {
            "name": "Mozilla_Privacy",
            "url": "https://www.mozilla.org/privacy/",
            "description": "Mozilla privacy notice"
        }
    ]
    
    output_dir = Path("privacy_banner_tests")
    output_dir.mkdir(exist_ok=True)
    
    capture = ScreenshotCapture(output_dir)
    results = []
    
    try:
        await capture.initialize()
        print("\n🔍 Quick Privacy Banner Test")
        print("=" * 40)
        
        for i, site in enumerate(test_sites, 1):
            print(f"\n📸 {i}/{len(test_sites)} {site['name']}")
            print(f"🌐 {site['url']}")
            
            start_time = time.time()
            
            success, message = await capture.capture_screenshot(
                site['url'],
                f"{site['name']}_test.png",
                output_dir
            )
            
            duration = time.time() - start_time
            
            if success:
                screenshot_path = output_dir / f"{site['name']}_test.png"
                file_size = screenshot_path.stat().st_size
                print(f"✅ Success! {file_size/1024/1024:.1f} MB in {duration:.1f}s")
            else:
                print(f"❌ Failed: {message} ({duration:.1f}s)")
            
            results.append({
                "name": site['name'],
                "success": success,
                "duration": duration,
                "message": message
            })
            
            # Small delay
            await asyncio.sleep(1)
        
        # Quick summary
        print(f"\n📊 Results: {sum(1 for r in results if r['success'])}/{len(results)} successful")
        for r in results:
            status = "✅" if r['success'] else "❌"
            print(f"{status} {r['name']:<15} {r['duration']:<5.1f}s")
        
    finally:
        await capture.cleanup()

if __name__ == "__main__":
    asyncio.run(test_quick_privacy_sites())