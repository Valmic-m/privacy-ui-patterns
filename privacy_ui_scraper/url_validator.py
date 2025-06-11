#!/usr/bin/env python3

"""URL validation to check if privacy pattern URLs are accessible."""

import asyncio
import aiohttp
import json
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

async def validate_urls():
    """Validate all URLs from parsed data before screenshotting."""
    
    parsed_data_path = Path("privacy_ui_screenshots/parsed_data.json")
    
    if not parsed_data_path.exists():
        print("No parsed_data.json found. Run the parser first.")
        return
    
    with open(parsed_data_path) as f:
        data = json.load(f)
    
    print(f"🔍 Validating URLs from {len(data['patterns'])} patterns...")
    
    results = {
        "working": [],
        "broken": [],
        "auth_required": [],
        "redirected": []
    }
    
    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=10)) as session:
        for pattern in data["patterns"]:
            print(f"\n📋 Pattern {pattern['pattern_number']}: {pattern['pattern_name']}")
            
            for example in pattern["examples"]:
                url = example["url"]
                print(f"  🌐 Testing: {url}")
                
                try:
                    async with session.get(url, allow_redirects=True) as response:
                        status = response.status
                        final_url = str(response.url)
                        
                        if status == 200:
                            # Check for common error page indicators
                            text = await response.text()
                            error_indicators = [
                                "404", "not found", "page not found", 
                                "error", "oops", "something went wrong",
                                "sign in", "login required", "access denied"
                            ]
                            
                            is_error = any(indicator in text.lower() for indicator in error_indicators)
                            is_redirect = url != final_url
                            
                            if is_error:
                                results["broken"].append({
                                    "pattern": pattern["pattern_name"],
                                    "company": example["company"],
                                    "url": url,
                                    "status": status,
                                    "reason": "Error page content"
                                })
                                print(f"    ❌ Error page detected")
                            elif "login" in text.lower() or "sign in" in text.lower():
                                results["auth_required"].append({
                                    "pattern": pattern["pattern_name"],
                                    "company": example["company"],
                                    "url": url,
                                    "status": status,
                                    "reason": "Authentication required"
                                })
                                print(f"    🔐 Login required")
                            elif is_redirect:
                                results["redirected"].append({
                                    "pattern": pattern["pattern_name"],
                                    "company": example["company"],
                                    "original_url": url,
                                    "final_url": final_url,
                                    "status": status
                                })
                                print(f"    ↪️  Redirected to: {final_url[:50]}...")
                            else:
                                results["working"].append({
                                    "pattern": pattern["pattern_name"],
                                    "company": example["company"],
                                    "url": url,
                                    "status": status
                                })
                                print(f"    ✅ Working ({status})")
                        
                        else:
                            results["broken"].append({
                                "pattern": pattern["pattern_name"],
                                "company": example["company"],
                                "url": url,
                                "status": status,
                                "reason": f"HTTP {status}"
                            })
                            print(f"    ❌ HTTP {status}")
                
                except Exception as e:
                    results["broken"].append({
                        "pattern": pattern["pattern_name"],
                        "company": example["company"],
                        "url": url,
                        "status": None,
                        "reason": str(e)
                    })
                    print(f"    💥 Error: {str(e)[:50]}...")
                
                # Small delay between requests
                await asyncio.sleep(0.5)
    
    # Summary
    total = len(results["working"]) + len(results["broken"]) + len(results["auth_required"]) + len(results["redirected"])
    
    print(f"\n📊 URL VALIDATION SUMMARY")
    print(f"Total URLs tested: {total}")
    print(f"✅ Working: {len(results['working'])}")
    print(f"↪️  Redirected: {len(results['redirected'])}")
    print(f"🔐 Auth required: {len(results['auth_required'])}")
    print(f"❌ Broken: {len(results['broken'])}")
    print(f"Success rate: {(len(results['working']) + len(results['redirected'])) / total * 100:.1f}%")
    
    # Save results
    with open("url_validation_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Results saved to url_validation_results.json")
    
    # Show most problematic
    if results["broken"]:
        print(f"\n🚨 BROKEN URLS:")
        for item in results["broken"][:10]:  # Show first 10
            print(f"  {item['pattern']} - {item['company']} - {item['reason']}")

if __name__ == "__main__":
    asyncio.run(validate_urls())