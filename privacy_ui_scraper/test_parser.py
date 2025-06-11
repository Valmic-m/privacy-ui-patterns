#!/usr/bin/env python3

"""Test script to verify HTML parser functionality."""

import logging
from pathlib import Path
from html_parser import PrivacyPatternParser
from config import HTML_PATH

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

def test_parser():
    """Test the HTML parser with the actual document."""
    print(f"\nTesting HTML parser with: {HTML_PATH}")
    print("=" * 50)
    
    if not HTML_PATH.exists():
        print(f"ERROR: HTML file not found at {HTML_PATH}")
        print("Please ensure UI_Libary_2025.htm is in the parent directory")
        return
    
    try:
        parser = PrivacyPatternParser(HTML_PATH)
        patterns = parser.parse()
        
        print(f"\nSuccessfully parsed {len(patterns)} patterns:\n")
        
        for pattern in patterns[:5]:  # Show first 5 patterns
            print(f"Pattern {pattern.pattern_number}: {pattern.pattern_name}")
            print(f"  Description: {pattern.description[:100]}..." if pattern.description else "  No description")
            print(f"  Examples: {len(pattern.examples)}")
            
            for example in pattern.examples[:2]:  # Show first 2 examples
                print(f"    - Example {example.example_number}: {example.company}")
                print(f"      URL: {example.url}")
                print(f"      Title: {example.title[:50]}..." if example.title else "      No title")
            
            if len(pattern.examples) > 2:
                print(f"    ... and {len(pattern.examples) - 2} more examples")
            print()
        
        if len(patterns) > 5:
            print(f"... and {len(patterns) - 5} more patterns\n")
        
        # Save parsed data
        output_path = Path("test_parsed_data.json")
        parser.save_parsed_data(output_path)
        print(f"Saved parsed data to: {output_path}")
        
        # Summary statistics
        total_examples = sum(len(p.examples) for p in patterns)
        print(f"\nSummary:")
        print(f"  Total patterns: {len(patterns)}")
        print(f"  Total examples: {total_examples}")
        print(f"  Average examples per pattern: {total_examples / len(patterns):.1f}")
        
    except Exception as e:
        print(f"\nERROR: Failed to parse HTML: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_parser()