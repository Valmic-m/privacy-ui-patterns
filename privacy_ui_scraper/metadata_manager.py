import json
import logging
from pathlib import Path
from typing import Dict, List
from datetime import datetime

logger = logging.getLogger(__name__)

class MetadataManager:
    def __init__(self, output_dir: Path):
        self.output_dir = output_dir
        self.summary_data = {
            "generated_at": datetime.now().isoformat(),
            "total_patterns": 0,
            "total_examples": 0,
            "successful_captures": 0,
            "failed_captures": 0,
            "patterns": []
        }
    
    def update_summary(self, pattern_results: Dict):
        """Update the overall summary with pattern results."""
        self.summary_data["patterns"].append({
            "pattern_number": pattern_results["pattern_number"],
            "pattern_name": pattern_results["pattern_name"],
            "folder": pattern_results["folder"],
            "total_examples": len(pattern_results["examples"]),
            "successful": sum(1 for e in pattern_results["examples"] if e["success"]),
            "failed": sum(1 for e in pattern_results["examples"] if not e["success"])
        })
        
        self.summary_data["total_patterns"] = len(self.summary_data["patterns"])
        self.summary_data["total_examples"] += len(pattern_results["examples"])
        self.summary_data["successful_captures"] += sum(1 for e in pattern_results["examples"] if e["success"])
        self.summary_data["failed_captures"] += sum(1 for e in pattern_results["examples"] if not e["success"])
    
    def save_summary(self):
        """Save the overall summary to a JSON file."""
        summary_path = self.output_dir / "summary.json"
        with open(summary_path, 'w', encoding='utf-8') as f:
            json.dump(self.summary_data, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved summary to {summary_path}")
    
    def create_index_html(self):
        """Create an HTML index page for easy browsing."""
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy UI Pattern Screenshots</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }}
        h1 {{
            color: #333;
            text-align: center;
        }}
        .summary {{
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .patterns {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }}
        .pattern-card {{
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }}
        .pattern-card:hover {{
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }}
        .pattern-card h3 {{
            margin-top: 0;
            color: #0066cc;
        }}
        .stats {{
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }}
        .stat {{
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 14px;
        }}
        .success {{
            background: #d4edda;
            color: #155724;
        }}
        .failed {{
            background: #f8d7da;
            color: #721c24;
        }}
        a {{
            color: #0066cc;
            text-decoration: none;
        }}
        a:hover {{
            text-decoration: underline;
        }}
    </style>
</head>
<body>
    <h1>Privacy UI Pattern Screenshots</h1>
    
    <div class="summary">
        <h2>Summary</h2>
        <p>Generated at: {self.summary_data['generated_at']}</p>
        <p>Total Patterns: {self.summary_data['total_patterns']}</p>
        <p>Total Examples: {self.summary_data['total_examples']}</p>
        <p>Successful Captures: {self.summary_data['successful_captures']}</p>
        <p>Failed Captures: {self.summary_data['failed_captures']}</p>
        <p>Success Rate: {(self.summary_data['successful_captures'] / self.summary_data['total_examples'] * 100):.1f}%</p>
    </div>
    
    <h2>Privacy Patterns</h2>
    <div class="patterns">
"""
        
        for pattern in self.summary_data["patterns"]:
            html_content += f"""
        <div class="pattern-card">
            <h3>{pattern['pattern_number']}. {pattern['pattern_name']}</h3>
            <p><a href="./{pattern['folder']}/">View Screenshots</a></p>
            <div class="stats">
                <span class="stat success"> {pattern['successful']} successful</span>
                <span class="stat failed">L {pattern['failed']} failed</span>
            </div>
        </div>
"""
        
        html_content += """
    </div>
</body>
</html>"""
        
        index_path = self.output_dir / "index.html"
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        logger.info(f"Created index.html at {index_path}")
    
    def create_main_readme(self):
        """Create a main README.md file."""
        readme_content = f"""# Privacy UI Pattern Screenshots

A comprehensive collection of privacy UI pattern screenshots from real-world websites.

## Summary

- **Generated**: {self.summary_data['generated_at']}
- **Total Patterns**: {self.summary_data['total_patterns']}
- **Total Examples**: {self.summary_data['total_examples']}
- **Successful Captures**: {self.summary_data['successful_captures']}
- **Failed Captures**: {self.summary_data['failed_captures']}
- **Success Rate**: {(self.summary_data['successful_captures'] / self.summary_data['total_examples'] * 100):.1f}%

## Patterns

"""
        
        for pattern in self.summary_data["patterns"]:
            success_rate = (pattern['successful'] / pattern['total_examples'] * 100) if pattern['total_examples'] > 0 else 0
            readme_content += f"### {pattern['pattern_number']}. [{pattern['pattern_name']}](./{pattern['folder']}/)
"
            readme_content += f"- Examples: {pattern['total_examples']}\n"
            readme_content += f"- Successful: {pattern['successful']}\n"
            readme_content += f"- Failed: {pattern['failed']}\n"
            readme_content += f"- Success Rate: {success_rate:.1f}%\n\n"
        
        readme_content += """## Usage

1. Browse the pattern folders to view screenshots
2. Each folder contains:
   - Screenshots named by example number and company
   - `metadata.json` with detailed information
   - `README.md` with pattern-specific details

## Notes

- Screenshots were captured at 1920x1080 viewport
- Full page screenshots were taken where possible
- Some sites may show different content based on region/cookies
"""
        
        readme_path = self.output_dir / "README.md"
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(readme_content)
        logger.info(f"Created main README.md at {readme_path}")