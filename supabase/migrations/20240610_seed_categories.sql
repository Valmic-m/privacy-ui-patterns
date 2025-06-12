-- Seed initial categories
INSERT INTO pattern_categories (name, slug, description, order_index, icon) VALUES
  ('Account Deletion', 'account-deletion', 'Patterns for allowing users to permanently delete their accounts and associated data', 1, 'trash-2'),
  ('Biometric Privacy', 'biometric-privacy', 'Patterns for handling facial recognition, fingerprints, and other biometric data', 2, 'fingerprint'),
  ('Child Privacy', 'child-privacy', 'Patterns specifically designed to protect children''s privacy and comply with COPPA', 3, 'baby'),
  ('Consent Management', 'consent-management', 'Patterns for obtaining and managing user consent for data processing', 4, 'check-square'),
  ('Cookie Banners', 'cookie-banners', 'Patterns for cookie consent notices and preference management', 5, 'cookie'),
  ('Data Access Rights', 'data-access-rights', 'Patterns for allowing users to access their personal data', 6, 'database'),
  ('Data Export', 'data-export', 'Patterns for enabling users to download their data in portable formats', 7, 'download'),
  ('Data Retention', 'data-retention', 'Patterns for managing how long user data is stored', 8, 'clock'),
  ('Device Permissions', 'device-permissions', 'Patterns for requesting camera, microphone, location, and other device permissions', 9, 'smartphone'),
  ('Incident Notifications', 'incident-notifications', 'Patterns for notifying users about data breaches and security incidents', 10, 'alert-triangle'),
  ('Just-in-Time Consent', 'just-in-time-consent', 'Patterns for requesting permission at the moment of need', 11, 'zap'),
  ('Permission Requests', 'permission-requests', 'Patterns for clearly explaining why permissions are needed', 12, 'shield'),
  ('Privacy Dashboards', 'privacy-dashboards', 'Patterns for centralized privacy control interfaces', 13, 'layout-dashboard'),
  ('Privacy Defaults', 'privacy-defaults', 'Patterns for privacy-protective default settings', 14, 'toggle-left'),
  ('Privacy Notices', 'privacy-notices', 'Patterns for presenting privacy policies and notices', 15, 'file-text'),
  ('Third-Party Tracking', 'third-party-tracking', 'Patterns for managing third-party trackers and advertising', 16, 'eye-off');