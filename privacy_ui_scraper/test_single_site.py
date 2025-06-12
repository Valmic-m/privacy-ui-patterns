#!/usr/bin/env python3

"""Test script to capture a single site screenshot with privacy banner detection."""

import asyncio
import logging
from pathlib import Path
from screenshot_capture import ScreenshotCapture

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

async def test_bbc_screenshot():
    """Test capturing BBC with privacy banner."""
    output_dir = Path("test_screenshots")
    output_dir.mkdir(exist_ok=True)
    
    capture = ScreenshotCapture(output_dir)
    
    try:
        await capture.initialize()
        
        # Test BBC specifically
        success, message = await capture.capture_screenshot(
            "https://www.bbc.com",
            "test_bbc_privacy_banner.png",
            output_dir
        )
        
        print(f"\nBBC Screenshot Result:")
        print(f"Success: {success}")
        print(f"Message: {message}")
        
        if success:
            print(f"Screenshot saved to: {output_dir / 'test_bbc_privacy_banner.png'}")
        
    finally:
        await capture.cleanup()

if __name__ == "__main__":
    asyncio.run(test_bbc_screenshot())