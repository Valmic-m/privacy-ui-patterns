import re
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup
from dataclasses import dataclass, asdict

logger = logging.getLogger(__name__)

@dataclass
class PrivacyExample:
    example_number: int
    company: str
    url: str
    title: str
    use_case: str
    description: str = ""
    why_selected: str = ""
    pbd_alignment: str = ""
    nielsen_heuristics: str = ""

@dataclass
class PrivacyPattern:
    pattern_number: int
    pattern_name: str
    description: str
    examples: List[PrivacyExample]

class PrivacyPatternParser:
    def __init__(self, html_path: Path):
        self.html_path = html_path
        self.patterns: List[PrivacyPattern] = []
        
    def parse(self) -> List[PrivacyPattern]:
        """Parse the HTML and extract all privacy patterns with their examples."""
        try:
            with open(self.html_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Try to parse as structured HTML first
            if self._parse_structured_html(soup):
                logger.info(f"Successfully parsed {len(self.patterns)} privacy patterns from structured HTML")
            else:
                # Fall back to text-based parsing
                text = soup.get_text()
                self._parse_patterns(text)
                logger.info(f"Successfully parsed {len(self.patterns)} privacy patterns from text")
                
            return self.patterns
            
        except Exception as e:
            logger.error(f"Error parsing HTML: {e}")
            raise
    
    def _parse_structured_html(self, soup: BeautifulSoup) -> bool:
        """Try to parse HTML with structured elements like tables."""
        # Look for pattern headers in Microsoft Word HTML format
        pattern_headers = []
        
        # Find all paragraphs that might be pattern headers
        for p in soup.find_all('p'):
            text = p.get_text().strip()
            # Look for pattern headers like "1. Cookie Consent Banners"
            if re.match(r'\d+\.\s+[A-Z][^\n]{10,}', text) and 'Pattern' not in text:
                pattern_headers.append((p, text))
        
        if not pattern_headers:
            return False
        
        # Process each pattern
        for i, (header_elem, header_text) in enumerate(pattern_headers):
            # Extract pattern number and name
            match = re.match(r'(\d+)\.\s+(.+)', header_text)
            if not match:
                continue
                
            pattern_number = int(match.group(1))
            pattern_name = match.group(2).strip()
            
            # Find the next elements after this header until next pattern or end
            current_elem = header_elem.next_sibling
            tables_found = []
            
            # Look for tables following this header
            next_pattern_pos = None
            if i + 1 < len(pattern_headers):
                next_pattern_elem = pattern_headers[i + 1][0]
                # Find position of next pattern in document
                all_elements = list(soup.find_all(['p', 'table']))
                try:
                    next_pattern_pos = all_elements.index(next_pattern_elem)
                except ValueError:
                    next_pattern_pos = None
            
            # Find all tables between current pattern and next pattern
            all_elements = list(soup.find_all(['p', 'table']))
            try:
                current_pos = all_elements.index(header_elem)
                end_pos = next_pattern_pos if next_pattern_pos else len(all_elements)
                
                for j in range(current_pos + 1, end_pos):
                    if j < len(all_elements) and all_elements[j].name == 'table':
                        tables_found.append(all_elements[j])
                        
            except ValueError:
                continue
            
            # Parse examples from all tables found for this pattern
            all_examples = []
            for table in tables_found:
                examples = self._parse_table_examples(table)
                all_examples.extend(examples)
            
            if all_examples:
                pattern = PrivacyPattern(
                    pattern_number=pattern_number,
                    pattern_name=pattern_name,
                    description="",
                    examples=all_examples
                )
                self.patterns.append(pattern)
                logger.info(f"Parsed pattern {pattern_number}: {pattern_name} with {len(all_examples)} examples")
        
        return len(self.patterns) > 0
    
    def _parse_table_examples(self, table) -> List[PrivacyExample]:
        """Parse examples from an HTML table."""
        examples = []
        
        rows = table.find_all('tr')
        
        # Skip header rows - look for rows with actual data
        data_rows = []
        for row in rows:
            cells = row.find_all(['td', 'th'])
            if cells:
                # Check if this looks like a data row (has number and URL)
                first_cell_text = cells[0].get_text().strip()
                if len(cells) >= 2 and first_cell_text.isdigit():
                    data_rows.append(row)
        
        for row in data_rows:
            cells = row.find_all(['td', 'th'])
            if len(cells) >= 2:
                try:
                    # Extract example number
                    example_num_text = cells[0].get_text().strip()
                    if not example_num_text.isdigit():
                        continue
                    
                    example_number = int(example_num_text)
                    
                    # Extract URL and company from second cell
                    url_cell_text = cells[1].get_text().strip()
                    
                    # Look for URLs in the cell text
                    url_match = re.search(r'https?://[^\s\n]+', url_cell_text)
                    
                    # Also check for actual links
                    link = cells[1].find('a')
                    url = link.get('href') if link else (url_match.group(0) if url_match else "")
                    
                    if url:
                        # Extract company name (text before URL)
                        company_text = url_cell_text.split('http')[0].strip()
                        company = self._extract_company_name(company_text) if company_text else self._extract_company_from_url(url)
                        
                        # Extract description from third cell if available
                        title = cells[2].get_text().strip() if len(cells) > 2 else ""
                        
                        # Extract use case from fourth cell if available
                        use_case = cells[3].get_text().strip() if len(cells) > 3 else ""
                        
                        example = PrivacyExample(
                            example_number=example_number,
                            company=company,
                            url=url,
                            title=title[:200] if title else "",  # Limit title length
                            use_case=use_case[:200] if use_case else "",  # Limit use case length
                            why_selected=cells[4].get_text().strip()[:200] if len(cells) > 4 else "",
                            pbd_alignment=cells[5].get_text().strip()[:200] if len(cells) > 5 else "",
                            nielsen_heuristics=cells[6].get_text().strip()[:200] if len(cells) > 6 else ""
                        )
                        examples.append(example)
                        logger.debug(f"Parsed example {example_number}: {company} - {url}")
                        
                except Exception as e:
                    logger.warning(f"Error parsing table row: {e}")
                    continue
        
        return examples
    
    def _parse_patterns(self, text: str) -> None:
        """Parse individual privacy patterns from the text."""
        # Pattern to match section headers like "1. Cookie Consent Banners"
        section_pattern = r'(\d+)\.\s+([^\n]+?)\s*\n'
        
        # Find all section headers
        sections = list(re.finditer(section_pattern, text))
        
        for i, match in enumerate(sections):
            pattern_number = int(match.group(1))
            pattern_name = match.group(2).strip()
            
            # Get text for this section (until next section or end)
            start_pos = match.end()
            end_pos = sections[i + 1].start() if i + 1 < len(sections) else len(text)
            section_text = text[start_pos:end_pos]
            
            # Parse examples from the section
            examples = self._parse_examples(section_text)
            
            if examples:
                pattern = PrivacyPattern(
                    pattern_number=pattern_number,
                    pattern_name=pattern_name,
                    description=self._extract_description(section_text),
                    examples=examples
                )
                self.patterns.append(pattern)
                logger.info(f"Parsed pattern {pattern_number}: {pattern_name} with {len(examples)} examples")
    
    def _parse_examples(self, section_text: str) -> List[PrivacyExample]:
        """Extract examples from a pattern section."""
        examples = []
        
        # Look for table rows with example data
        # Pattern: number | company/url | description | use case | why selected | etc.
        row_pattern = r'(\d+)\s*\|\s*([^|]+?)\s+(https?://[^\s|]+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|\n]+)'
        
        # Alternative pattern for simpler format
        simple_pattern = r'(\d+)\s*\|\s*([^|]+?)\s+(https?://[^\s|]+)\s*\|\s*([^|]+?)\s*\|\s*([^|\n]+)'
        
        # Try detailed pattern first
        matches = list(re.finditer(row_pattern, section_text))
        
        if not matches:
            # Try simpler pattern
            matches = list(re.finditer(simple_pattern, section_text))
            
        for match in matches:
            try:
                if len(match.groups()) >= 8:  # Detailed format
                    example = PrivacyExample(
                        example_number=int(match.group(1)),
                        company=match.group(2).strip(),
                        url=match.group(3).strip(),
                        title=match.group(4).strip(),
                        use_case=match.group(5).strip(),
                        why_selected=match.group(6).strip(),
                        pbd_alignment=match.group(7).strip(),
                        nielsen_heuristics=match.group(8).strip()
                    )
                else:  # Simple format
                    example = PrivacyExample(
                        example_number=int(match.group(1)),
                        company=match.group(2).strip(),
                        url=match.group(3).strip(),
                        title=match.group(4).strip(),
                        use_case=match.group(5).strip() if len(match.groups()) > 4 else ""
                    )
                
                examples.append(example)
                
            except Exception as e:
                logger.warning(f"Error parsing example: {e}")
                continue
        
        # If no examples found with table format, try to find URLs in the text
        if not examples:
            url_pattern = r'(\d+)[\s.]+([^\n]+?)\s+(https?://[^\s]+)'
            for match in re.finditer(url_pattern, section_text):
                try:
                    example = PrivacyExample(
                        example_number=int(match.group(1)),
                        company=self._extract_company_name(match.group(2)),
                        url=match.group(3).strip(),
                        title=match.group(2).strip(),
                        use_case=""
                    )
                    examples.append(example)
                except Exception as e:
                    logger.warning(f"Error parsing URL example: {e}")
        
        return examples
    
    def _extract_company_name(self, text: str) -> str:
        """Extract company name from text."""
        # Remove common words and extract the main company name
        text = text.strip()
        # Try to find common patterns like "BBC.com" or "The New York Times"
        company_match = re.search(r'([A-Z][\w\s&.-]+?)(?:\.|\\s+https?://|$)', text)
        if company_match:
            return company_match.group(1).strip()
        return text.split()[0] if text else "Unknown"
    
    def _extract_company_from_url(self, url: str) -> str:
        """Extract company name from URL."""
        try:
            # Extract domain from URL
            domain = url.replace('https://', '').replace('http://', '').split('/')[0]
            # Remove www. prefix
            domain = domain.replace('www.', '')
            # Take the main part before .com/.org etc
            company = domain.split('.')[0]
            return company.capitalize()
        except:
            return "Unknown"
    
    def _extract_description(self, section_text: str) -> str:
        """Extract pattern description from section text."""
        # Look for descriptive text before the table
        lines = section_text.split('\n')
        description_lines = []
        
        for line in lines:
            line = line.strip()
            if not line or '|' in line or line.startswith('#'):
                break
            if len(line) > 20:  # Likely a description line
                description_lines.append(line)
        
        return ' '.join(description_lines[:3])  # Take first 3 lines max
    
    def save_parsed_data(self, output_path: Path) -> None:
        """Save parsed data to JSON for inspection."""
        data = {
            "patterns": [
                {
                    "pattern_number": p.pattern_number,
                    "pattern_name": p.pattern_name,
                    "description": p.description,
                    "examples": [asdict(e) for e in p.examples]
                }
                for p in self.patterns
            ]
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved parsed data to {output_path}")