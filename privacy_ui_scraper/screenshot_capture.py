import asyncio
import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from playwright.async_api import async_playwright, Page, Browser
import json

from config import (
    VIEWPORT, USER_AGENT, HEADLESS, TIMEOUT, SCREENSHOT_TIMEOUT,
    DELAY_BETWEEN_REQUESTS, MAX_RETRIES, RESUME_MODE
)

logger = logging.getLogger(__name__)

class ScreenshotCapture:
    def __init__(self, output_dir: Path):
        self.output_dir = output_dir
        self.browser: Optional[Browser] = None
        self.results: List[Dict] = []
        
    async def initialize(self):
        """Initialize the Playwright browser."""
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=HEADLESS,
            args=['--disable-blink-features=AutomationControlled']
        )
        logger.info("Browser initialized")
    
    async def cleanup(self):
        """Clean up browser resources."""
        if self.browser:
            await self.browser.close()
        if hasattr(self, 'playwright'):
            await self.playwright.stop()
        logger.info("Browser cleaned up")
    
    async def capture_screenshot(
        self, 
        url: str, 
        filename: str, 
        folder_path: Path,
        attempt: int = 1
    ) -> Tuple[bool, str]:
        """Capture a screenshot of the given URL."""
        if RESUME_MODE and (folder_path / filename).exists():
            logger.info(f"Skipping existing screenshot: {filename}")
            return True, "Already exists"
        
        context = None
        page = None
        
        try:
            # Create new context with EU settings to trigger GDPR banners
            context = await self.browser.new_context(
                viewport=VIEWPORT,
                user_agent=USER_AGENT,
                locale='en-GB',  # UK locale for GDPR
                timezone_id='Europe/London',
                geolocation={'latitude': 51.5074, 'longitude': -0.1278},  # London coordinates
                permissions=['geolocation'],
                extra_http_headers={
                    'Accept-Language': 'en-GB,en;q=0.9'
                }
            )
            
            page = await context.new_page()
            
            # Clear any existing cookies to trigger consent banners
            await context.clear_cookies()
            
            # Navigate to URL
            logger.info(f"Navigating to {url} (attempt {attempt}/{MAX_RETRIES})")
            await page.goto(url, wait_until='domcontentloaded', timeout=TIMEOUT)
            
            # Wait for privacy banners to appear
            await page.wait_for_timeout(3000)
            
            # Look for cookie/privacy banners before doing anything else
            banner_found = await self._wait_for_privacy_banners(page)
            
            if not banner_found:
                # Try refreshing to trigger banners
                await page.reload(wait_until='domcontentloaded')
                await page.wait_for_timeout(2000)
                await self._wait_for_privacy_banners(page)
            
            # Check for error pages before taking screenshot
            page_title = await page.title()
            page_content = await page.content()
            
            # Common error page indicators
            error_indicators = [
                "404", "not found", "page not found", "error 404",
                "oops", "something went wrong", "page doesn't exist",
                "sign in required", "login required", "access denied"
            ]
            
            is_error_page = any(indicator in page_title.lower() or indicator in page_content.lower()[:1000] 
                              for indicator in error_indicators)
            
            if is_error_page:
                logger.warning(f"Error page detected for {url}: {page_title}")
                return False, f"Error page: {page_title}"
            
            # Take screenshot
            screenshot_path = folder_path / filename
            await page.screenshot(
                path=str(screenshot_path),
                full_page=True,
                timeout=SCREENSHOT_TIMEOUT
            )
            
            # Check screenshot file size (very small files are usually error pages)
            file_size = screenshot_path.stat().st_size
            if file_size < 30000:  # Less than 30KB is suspicious
                logger.warning(f"Very small screenshot ({file_size} bytes) for {url} - possible error page")
            
            logger.info(f"Successfully captured screenshot: {filename} ({file_size:,} bytes)")
            return True, "Success"
            
        except Exception as e:
            error_msg = f"Error capturing {url}: {str(e)}"
            logger.error(error_msg)
            
            if attempt < MAX_RETRIES:
                await asyncio.sleep(DELAY_BETWEEN_REQUESTS)
                return await self.capture_screenshot(url, filename, folder_path, attempt + 1)
            
            return False, str(e)
            
        finally:
            if page:
                await page.close()
            if context:
                await context.close()
    
    async def _wait_for_privacy_banners(self, page: Page) -> bool:
        """Wait for privacy banners to appear and return True if found."""
        # Common selectors for privacy banners
        banner_selectors = [
            '[id*="cookie"]',
            '[class*="cookie"]',
            '[id*="consent"]',
            '[class*="consent"]',
            '[id*="privacy"]',
            '[class*="privacy"]',
            '[id*="gdpr"]',
            '[class*="gdpr"]',
            '[role="dialog"]',
            '[role="banner"]',
            '.cookie-banner',
            '.consent-banner',
            '.privacy-notice',
            '#cookie-notice',
            '#consent-notice',
            '.cmp-banner',
            '[data-testid*="cookie"]',
            '[data-testid*="consent"]'
        ]
        
        for selector in banner_selectors:
            try:
                element = await page.wait_for_selector(selector, timeout=2000)
                if element and await element.is_visible():
                    logger.info(f"Found privacy banner with selector: {selector}")
                    return True
            except:
                continue
        
        return False
    
    async def _handle_cookie_banners(self, page: Page):
        """Try to handle common cookie consent banners (DO NOT CLICK - just detect)."""
        # Just wait to see if banners appear, but don't click them
        # We want to capture the banners in screenshots
        await page.wait_for_timeout(1000)
    
    async def capture_pattern_screenshots(
        self,
        pattern_number: int,
        pattern_name: str,
        examples: List[Dict]
    ) -> Dict:
        """Capture all screenshots for a privacy pattern."""
        # Create folder
        folder_name = f"{pattern_number:02d}_{pattern_name.replace(' ', '_').replace('/', '_')}"
        folder_path = self.output_dir / folder_name
        folder_path.mkdir(parents=True, exist_ok=True)
        
        results = {
            "pattern_number": pattern_number,
            "pattern_name": pattern_name,
            "folder": folder_name,
            "examples": []
        }
        
        for example in examples:
            filename = f"example_{example['example_number']}_{example['company'].replace(' ', '_').replace('/', '_')}.png"
            
            # Add delay between requests
            if example['example_number'] > 1:
                await asyncio.sleep(DELAY_BETWEEN_REQUESTS)
            
            success, message = await self.capture_screenshot(
                example['url'],
                filename,
                folder_path
            )
            
            result = {
                **example,
                "screenshot_file": filename if success else None,
                "timestamp": datetime.now().isoformat(),
                "success": success,
                "error": message if not success else None
            }
            
            results["examples"].append(result)
            
        # Save metadata
        await self._save_pattern_metadata(folder_path, results)
        
        return results
    
    async def _save_pattern_metadata(self, folder_path: Path, results: Dict):
        """Save metadata.json and README.md for a pattern."""
        # Save metadata.json
        metadata_path = folder_path / "metadata.json"
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        # Create README.md
        readme_content = f"""# {results['pattern_name']}

Privacy UI pattern #{results['pattern_number']}

## Examples

"""
        for example in results['examples']:
            status = "" if example['success'] else "L"
            readme_content += f"### Example {example['example_number']}: {example['company']} {status}\n"
            readme_content += f"- **URL**: {example['url']}\n"
            readme_content += f"- **Title**: {example['title']}\n"
            readme_content += f"- **Use Case**: {example['use_case']}\n"
            if example['success']:
                readme_content += f"- **Screenshot**: [{example['screenshot_file']}](./{example['screenshot_file']})\n"
            else:
                readme_content += f"- **Error**: {example.get('error', 'Unknown error')}\n"
            readme_content += "\n"
        
        readme_path = folder_path / "README.md"
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(readme_content)
    
    def get_summary(self) -> Dict:
        """Get summary of all captures."""
        total_patterns = len(self.results)
        total_examples = sum(len(r['examples']) for r in self.results)
        successful = sum(1 for r in self.results for e in r['examples'] if e['success'])
        failed = total_examples - successful
        
        return {
            "total_patterns": total_patterns,
            "total_examples": total_examples,
            "successful_captures": successful,
            "failed_captures": failed,
            "success_rate": f"{(successful/total_examples)*100:.1f}%" if total_examples > 0 else "0%"
        }