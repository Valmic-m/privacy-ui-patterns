#!/usr/bin/env python3

"""Test script to capture multiple sites with improved privacy banner detection."""

import asyncio
import logging
from pathlib import Path
from screenshot_capture import ScreenshotCapture
import time

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

async def test_privacy_banner_sites():
    """Test capturing multiple sites known for privacy banners."""
    
    # Test sites from the privacy patterns
    test_sites = [
        {
            "name": "BBC",
            "url": "https://www.bbc.com",
            "description": "UK media site - should show GDPR banner"
        },
        {
            "name": "NY_Times", 
            "url": "https://www.nytimes.com",
            "description": "US news site with EU GDPR compliance"
        },
        {
            "name": "Guardian",
            "url": "https://www.theguardian.com", 
            "description": "UK newspaper with privacy banner"
        },
        {
            "name": "ICO",
            "url": "https://ico.org.uk",
            "description": "UK privacy regulator - model example"
        }
    ]
    
    # Create test output directory
    output_dir = Path("privacy_banner_tests")
    output_dir.mkdir(exist_ok=True)
    
    capture = ScreenshotCapture(output_dir)
    results = []
    
    try:
        await capture.initialize()
        print("\n🔍 Testing Multiple Sites for Privacy Banner Detection")
        print("=" * 60)
        print("Settings: EU locale (en-GB), London geolocation, cookies cleared")
        print("")
        
        for i, site in enumerate(test_sites, 1):
            print(f"📸 {i}/{len(test_sites)} Testing {site['name']}...")
            print(f"🌐 URL: {site['url']}")
            print(f"📝 Expected: {site['description']}")
            
            start_time = time.time()
            
            # Capture screenshot
            success, message = await capture.capture_screenshot(
                site['url'],
                f"{site['name']}_privacy_test.png",
                output_dir
            )
            
            duration = time.time() - start_time
            
            result = {
                "name": site['name'],
                "url": site['url'],
                "success": success,
                "message": message,
                "duration": duration
            }
            results.append(result)
            
            if success:
                screenshot_path = output_dir / f"{site['name']}_privacy_test.png"
                file_size = screenshot_path.stat().st_size
                print(f"✅ Success! File: {file_size:,} bytes ({file_size/1024/1024:.1f} MB)")
            else:
                print(f"❌ Failed: {message}")
            
            print(f"⏱️  Duration: {duration:.1f}s")
            print("-" * 40)
            
            # Small delay between requests
            if i < len(test_sites):
                await asyncio.sleep(2)
        
        # Summary
        print("\n📊 SUMMARY RESULTS")
        print("=" * 60)
        successful = sum(1 for r in results if r['success'])
        print(f"✅ Successful captures: {successful}/{len(results)}")
        print(f"❌ Failed captures: {len(results) - successful}/{len(results)}")
        print("")
        
        for result in results:
            status = "✅" if result['success'] else "❌"
            print(f"{status} {result['name']:<12} | {result['duration']:<5.1f}s | {result['message']}")
        
        print(f"\n💾 Screenshots saved to: {output_dir}")
        print("🔍 Check the screenshots to see which privacy banners were captured!")
        
    except Exception as e:
        print(f"💥 Error: {e}")
        import traceback
        traceback.print_exc()
        
    finally:
        await capture.cleanup()
        print("\n🧹 Browser cleaned up")

if __name__ == "__main__":
    asyncio.run(test_privacy_banner_sites())