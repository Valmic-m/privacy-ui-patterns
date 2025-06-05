from pathlib import Path
import logging

# Project paths
BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "privacy_ui_screenshots"
HTML_PATH = BASE_DIR.parent / "UI_Libary_2025.htm"

# Browser settings
VIEWPORT = {"width": 1920, "height": 1080}
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
HEADLESS = True
TIMEOUT = 30000  # 30 seconds
SCREENSHOT_TIMEOUT = 60000  # 60 seconds for full page screenshots

# Scraping settings
DELAY_BETWEEN_REQUESTS = 2  # seconds
MAX_RETRIES = 3
RESUME_MODE = True  # Skip existing screenshots

# Privacy pattern categories (expected 29 patterns)
PATTERN_CATEGORIES = [
    "Cookie Consent Banners",
    "Privacy Notices Policies",
    "Just in Time Data Collection",
    "Data Minimization Indicators",
    "Privacy Dashboard Settings",
    "Consent Management Interfaces",
    "Data Portability Tools",
    "Account Deletion Options",
    "Third Party Sharing Controls",
    "Location Permission Requests",
    "Camera Microphone Access",
    "Contact Sync Permissions",
    "Notification Preferences",
    "Email Marketing Opt Out",
    "Behavioral Tracking Controls",
    "Anonymization Options",
    "Data Retention Displays",
    "Privacy Breach Notifications",
    "Children Privacy Controls",
    "Biometric Data Consent",
    "Cross Device Tracking",
    "Social Media Privacy",
    "Search History Controls",
    "Ad Personalization Settings",
    "Privacy Education Tooltips",
    "Granular Permission Toggles",
    "Privacy Score Indicators",
    "Data Usage Visualizations",
    "Privacy Certification Badges"
]

# Logging configuration
LOG_LEVEL = logging.INFO
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
LOG_FILE = BASE_DIR / "scraper.log"