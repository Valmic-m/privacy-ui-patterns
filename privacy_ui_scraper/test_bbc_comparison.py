#!/usr/bin/env python3

"""Test script to re-capture BBC with improved privacy banner detection."""

import asyncio
import logging
from pathlib import Path
from screenshot_capture import ScreenshotCapture

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

async def test_bbc_with_privacy_banner():
    """Test capturing BBC specifically with privacy banner detection."""
    
    # Use the actual output directory structure
    output_dir = Path("privacy_ui_screenshots")
    bbc_folder = output_dir / "01_Cookie Consent Banners"
    bbc_folder.mkdir(parents=True, exist_ok=True)
    
    capture = ScreenshotCapture(output_dir)
    
    try:
        await capture.initialize()
        print("\n🔍 Testing BBC.com with improved privacy banner detection...")
        print("Settings: EU locale (en-GB), London geolocation, cookies cleared")
        
        # Capture BBC with improved settings
        success, message = await capture.capture_screenshot(
            "https://www.bbc.com",
            "example_1_BBC.png",
            bbc_folder
        )
        
        print(f"\n📸 BBC Screenshot Result:")
        print(f"✅ Success: {success}")
        print(f"📝 Message: {message}")
        
        if success:
            screenshot_path = bbc_folder / "example_1_BBC.png"
            print(f"💾 Screenshot saved to: {screenshot_path}")
            
            # Check file size
            file_size = screenshot_path.stat().st_size
            print(f"📏 File size: {file_size:,} bytes ({file_size / 1024 / 1024:.1f} MB)")
        else:
            print(f"❌ Failed to capture screenshot: {message}")
        
    except Exception as e:
        print(f"💥 Error: {e}")
        
    finally:
        await capture.cleanup()
        print("\n🧹 Browser cleaned up")

if __name__ == "__main__":
    asyncio.run(test_bbc_with_privacy_banner())