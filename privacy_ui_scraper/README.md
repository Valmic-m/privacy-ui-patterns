# Privacy UI Pattern Screenshot Scraper

A Python tool that automatically extracts URLs from a Privacy UI Pattern Library document and captures screenshots of real-world privacy interface implementations.

## Features

- **Smart HTML Parsing**: Extracts privacy pattern information and URLs from HTML documents
- **Automated Screenshot Capture**: Uses Playwright to capture full-page screenshots
- **Organized Output**: Creates structured folders for each privacy pattern category
- **Metadata Generation**: Generates JSON metadata and README files for each pattern
- **Progress Tracking**: Real-time progress updates with rich console output
- **Error Handling**: Gracefully handles failed captures and continues processing
- **Resume Capability**: Skips already captured screenshots when re-running

## Installation

1. Clone this repository:
```bash
cd privacy_ui_scraper
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Install Playwright browsers:
```bash
playwright install chromium
```

## Usage

1. Ensure your Privacy UI Pattern Library HTML file is in the parent directory as `UI_Libary_2025.htm`

2. Run the scraper:
```bash
python main.py
```

3. Monitor the progress in the console. The tool will:
   - Parse the HTML document to extract patterns and URLs
   - Create organized folders for each privacy pattern
   - Capture screenshots of each example
   - Generate metadata and documentation

## Output Structure

```
privacy_ui_screenshots/
   01_Cookie_Consent_Banners/
      example_1_BBC.png
      example_2_NYTimes.png
      metadata.json
      README.md
   02_Privacy_Notices_Policies/
      ...
   index.html              # Browse all screenshots
   summary.json           # Overall capture statistics
   README.md             # Main documentation
   parsed_data.json      # Extracted pattern data
```

## Configuration

Edit `config.py` to customize:

- **Browser Settings**: Viewport size, user agent, headless mode
- **Timeouts**: Page load and screenshot timeouts
- **Delays**: Time between requests
- **Resume Mode**: Skip existing screenshots
- **Pattern Categories**: Expected privacy patterns

## Metadata Format

Each pattern folder contains a `metadata.json` file:

```json
{
  "pattern_number": 1,
  "pattern_name": "Cookie Consent Banners",
  "examples": [
    {
      "example_number": 1,
      "company": "BBC",
      "url": "https://www.bbc.com",
      "title": "Persistent bottom bar offering Accept All / Manage Cookies",
      "screenshot_file": "example_1_BBC.png",
      "timestamp": "2025-01-XX",
      "success": true
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **Screenshots failing**: Some sites may block automated browsers. The tool will retry up to 3 times.

2. **Cookie banners**: The tool attempts to click common "Accept" buttons but some may be missed.

3. **Regional content**: Some privacy features only appear in certain regions (e.g., GDPR banners in EU).

### Logs

Check `scraper.log` for detailed debugging information.

## Privacy Patterns Captured

The tool captures 29 different privacy pattern categories including:

1. Cookie Consent Banners
2. Privacy Notices & Policies
3. Just-in-Time Data Collection
4. Data Minimization Indicators
5. Privacy Dashboard Settings
6. Consent Management Interfaces
7. Data Portability Tools
8. Account Deletion Options
9. Third-Party Sharing Controls
10. Location Permission Requests
... and 19 more

## Development

### Project Structure

- `main.py` - Main orchestration script
- `html_parser.py` - Parses HTML documents to extract patterns
- `screenshot_capture.py` - Handles browser automation and screenshots
- `metadata_manager.py` - Manages output organization and metadata
- `config.py` - Configuration settings

### Adding New Features

1. **New Pattern Types**: Add to `PATTERN_CATEGORIES` in `config.py`
2. **Custom Cookie Handlers**: Extend `_handle_cookie_banners()` in `screenshot_capture.py`
3. **Additional Metadata**: Modify data classes in `html_parser.py`

## License

This tool is for educational and research purposes only. Respect website terms of service and robots.txt when using.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Acknowledgments

- Built with [Playwright](https://playwright.dev/) for reliable browser automation
- Uses [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/) for HTML parsing
- [Rich](https://github.com/Textualize/rich) for beautiful console output