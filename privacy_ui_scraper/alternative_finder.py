#!/usr/bin/env python3

"""Find alternative screenshots for broken URLs using web search."""

import asyncio
import json
import logging
from pathlib import Path
from playwright.async_api import async_playwright
import re

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

class AlternativeFinder:
    def __init__(self):
        self.browser = None
        self.alternatives_found = []
    
    async def initialize(self):
        """Initialize browser for searches."""
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=False)  # Visible for verification
        
    async def cleanup(self):
        """Clean up browser resources."""
        if self.browser:
            await self.browser.close()
        if hasattr(self, 'playwright'):
            await self.playwright.stop()
    
    async def search_for_privacy_ui(self, company: str, pattern_type: str, description: str):
        """Search for privacy UI screenshots for a specific company/pattern."""
        
        # Create search queries
        search_queries = [
            f"{company} privacy settings screenshot",
            f"{company} cookie consent banner",
            f"{company} {pattern_type} privacy UI",
            f"{company} GDPR consent interface",
            f"site:{company.lower().replace(' ', '')}.com privacy settings"
        ]
        
        results = []
        
        context = await self.browser.new_context()
        page = await context.new_page()
        
        try:
            for query in search_queries:
                print(f"🔍 Searching: {query}")
                
                # Search on Google Images
                search_url = f"https://www.google.com/search?q={query}&tbm=isch"
                await page.goto(search_url, timeout=30000)
                await page.wait_for_timeout(2000)
                
                # Get first few image results
                images = await page.query_selector_all('img[data-src]')
                
                for i, img in enumerate(images[:3]):  # First 3 results
                    try:
                        src = await img.get_attribute('data-src') or await img.get_attribute('src')
                        alt = await img.get_attribute('alt') or ''
                        
                        if src and 'privacy' in alt.lower():
                            # Try to find the source page
                            parent_link = await img.query_selector('xpath=ancestor::a')
                            source_url = ""
                            if parent_link:
                                source_url = await parent_link.get_attribute('href') or ""
                            
                            results.append({
                                "image_url": src,
                                "alt_text": alt,
                                "source_url": source_url,
                                "search_query": query
                            })
                            
                    except Exception as e:
                        continue
                
                await page.wait_for_timeout(1000)  # Rate limiting
        
        except Exception as e:
            print(f"Search error: {e}")
        
        finally:
            await context.close()
        
        return results
    
    async def find_alternatives_for_broken_urls(self):
        """Find alternatives for URLs that produced small/error screenshots."""
        
        # Load validation results if available
        validation_file = Path("url_validation_results.json")
        broken_urls = []
        
        # Also check for small screenshots from our validation
        validation_results = self.load_validation_results()
        
        suspicious_screenshots = [
            {"company": "Google Takeout", "pattern": "Data Access", "description": "Data export interface"},
            {"company": "Google Ad Settings", "pattern": "Third-Party Controls", "description": "Ad personalization toggles"},
            {"company": "Apple Health", "pattern": "Contextual Consent", "description": "Health data sharing consent"}
        ]
        
        print(f"🔍 Finding alternatives for {len(suspicious_screenshots)} problematic captures...")
        
        alternatives = {}
        
        for item in suspicious_screenshots:
            print(f"\n📱 Searching for: {item['company']} - {item['pattern']}")
            
            results = await self.search_for_privacy_ui(
                item['company'], 
                item['pattern'], 
                item['description']
            )
            
            if results:
                alternatives[f"{item['company']}_{item['pattern']}"] = {
                    "original_issue": "Small screenshot / likely error page",
                    "alternatives": results,
                    "pattern": item['pattern'],
                    "description": item['description']
                }
                
                print(f"  ✅ Found {len(results)} alternatives")
                for result in results[:2]:  # Show first 2
                    print(f"    🔗 {result['alt_text'][:60]}...")
                    print(f"    📸 {result['image_url'][:80]}...")
                    if result['source_url']:
                        print(f"    🌐 {result['source_url'][:80]}...")
            else:
                print(f"  ❌ No alternatives found")
        
        # Save alternatives
        with open("alternative_screenshots.json", "w") as f:
            json.dump(alternatives, f, indent=2)
        
        print(f"\n💾 Saved alternatives to alternative_screenshots.json")
        return alternatives
    
    def load_validation_results(self):
        """Load previous validation results if available."""
        validation_file = Path("validation_results.json")
        if validation_file.exists():
            with open(validation_file) as f:
                return json.load(f)
        return {}
    
    async def search_specific_patterns(self):
        """Search for specific privacy UI patterns that are commonly needed."""
        
        high_value_searches = [
            {"query": "cookie consent banner examples GDPR", "type": "Cookie Consent"},
            {"query": "privacy dashboard settings interface", "type": "Privacy Settings"},
            {"query": "iOS permission dialog camera microphone", "type": "iOS Permissions"},
            {"query": "Android runtime permissions screenshot", "type": "Android Permissions"},
            {"query": "data deletion account settings UI", "type": "Data Deletion"},
            {"query": "biometric privacy settings face ID", "type": "Biometric Privacy"},
            {"query": "children privacy controls parental", "type": "Child Privacy"}
        ]
        
        print(f"🎯 Searching for high-value privacy UI patterns...")
        
        context = await self.browser.new_context()
        page = await context.new_page()
        
        pattern_results = {}
        
        try:
            for search in high_value_searches:
                print(f"\n🔍 Pattern: {search['type']}")
                print(f"🔎 Query: {search['query']}")
                
                # Search Google Images
                search_url = f"https://www.google.com/search?q={search['query']}&tbm=isch"
                await page.goto(search_url, timeout=30000)
                await page.wait_for_timeout(2000)
                
                # Get image results with source information
                images = await page.query_selector_all('img[data-src]')
                
                results = []
                for img in images[:5]:  # Top 5 results
                    try:
                        src = await img.get_attribute('data-src') or await img.get_attribute('src')
                        alt = await img.get_attribute('alt') or ''
                        
                        if src and len(alt) > 10:  # Has meaningful alt text
                            # Find source link
                            parent_link = await img.query_selector('xpath=ancestor::a[1]')
                            source_url = ""
                            if parent_link:
                                href = await parent_link.get_attribute('href')
                                if href and href.startswith('http'):
                                    source_url = href
                            
                            results.append({
                                "image_url": src,
                                "alt_text": alt,
                                "source_url": source_url,
                                "relevance_score": self.calculate_relevance(alt, search['query'])
                            })
                    except:
                        continue
                
                # Sort by relevance
                results.sort(key=lambda x: x['relevance_score'], reverse=True)
                pattern_results[search['type']] = results[:3]  # Top 3
                
                print(f"  ✅ Found {len(results)} results")
                await page.wait_for_timeout(1000)
        
        finally:
            await context.close()
        
        # Save pattern results
        with open("privacy_pattern_alternatives.json", "w") as f:
            json.dump(pattern_results, f, indent=2)
        
        print(f"\n💾 Saved pattern alternatives to privacy_pattern_alternatives.json")
        return pattern_results
    
    def calculate_relevance(self, alt_text: str, query: str) -> float:
        """Calculate relevance score based on keyword matching."""
        alt_lower = alt_text.lower()
        query_words = query.lower().split()
        
        score = 0
        for word in query_words:
            if word in alt_lower:
                score += 1
        
        # Bonus for privacy-specific terms
        privacy_terms = ['privacy', 'consent', 'permission', 'gdpr', 'settings', 'control']
        for term in privacy_terms:
            if term in alt_lower:
                score += 0.5
        
        return score

async def main():
    """Main function to find alternatives for broken URLs."""
    finder = AlternativeFinder()
    
    try:
        await finder.initialize()
        
        print("🔍 Privacy UI Alternative Finder")
        print("=" * 50)
        
        # Find alternatives for known broken URLs
        await finder.find_alternatives_for_broken_urls()
        
        # Search for high-value privacy patterns
        await finder.search_specific_patterns()
        
        print("\n✅ Alternative search complete!")
        print("📋 Check the generated JSON files for results")
        
    finally:
        await finder.cleanup()

if __name__ == "__main__":
    asyncio.run(main())