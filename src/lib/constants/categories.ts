import { LucideIcon, Trash2, Fingerprint, Baby, CheckSquare, Cookie, Database, Download, Clock, Smartphone, AlertTriangle, Zap, Shield, LayoutDashboard, ToggleLeft, FileText, EyeOff } from 'lucide-react';

export interface CategoryConfig {
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  'account-deletion': {
    name: 'Account Deletion',
    slug: 'account-deletion',
    description: 'Patterns for allowing users to permanently delete their accounts and associated data',
    icon: Trash2,
    color: 'destructive'
  },
  'biometric-privacy': {
    name: 'Biometric Privacy',
    slug: 'biometric-privacy',
    description: 'Patterns for handling facial recognition, fingerprints, and other biometric data',
    icon: Fingerprint,
    color: 'purple'
  },
  'child-privacy': {
    name: 'Child Privacy',
    slug: 'child-privacy',
    description: 'Patterns specifically designed to protect children\'s privacy and comply with COPPA',
    icon: Baby,
    color: 'pink'
  },
  'consent-management': {
    name: 'Consent Management',
    slug: 'consent-management',
    description: 'Patterns for obtaining and managing user consent for data processing',
    icon: CheckSquare,
    color: 'green'
  },
  'cookie-banners': {
    name: 'Cookie Banners',
    slug: 'cookie-banners',
    description: 'Patterns for cookie consent notices and preference management',
    icon: Cookie,
    color: 'amber'
  },
  'data-access-rights': {
    name: 'Data Access Rights',
    slug: 'data-access-rights',
    description: 'Patterns for allowing users to access their personal data',
    icon: Database,
    color: 'blue'
  },
  'data-export': {
    name: 'Data Export',
    slug: 'data-export',
    description: 'Patterns for enabling users to download their data in portable formats',
    icon: Download,
    color: 'teal'
  },
  'data-retention': {
    name: 'Data Retention',
    slug: 'data-retention',
    description: 'Patterns for managing how long user data is stored',
    icon: Clock,
    color: 'orange'
  },
  'device-permissions': {
    name: 'Device Permissions',
    slug: 'device-permissions',
    description: 'Patterns for requesting camera, microphone, location, and other device permissions',
    icon: Smartphone,
    color: 'indigo'
  },
  'incident-notifications': {
    name: 'Incident Notifications',
    slug: 'incident-notifications',
    description: 'Patterns for notifying users about data breaches and security incidents',
    icon: AlertTriangle,
    color: 'red'
  },
  'just-in-time-consent': {
    name: 'Just-in-Time Consent',
    slug: 'just-in-time-consent',
    description: 'Patterns for requesting permission at the moment of need',
    icon: Zap,
    color: 'yellow'
  },
  'permission-requests': {
    name: 'Permission Requests',
    slug: 'permission-requests',
    description: 'Patterns for clearly explaining why permissions are needed',
    icon: Shield,
    color: 'cyan'
  },
  'privacy-dashboards': {
    name: 'Privacy Dashboards',
    slug: 'privacy-dashboards',
    description: 'Patterns for centralized privacy control interfaces',
    icon: LayoutDashboard,
    color: 'violet'
  },
  'privacy-defaults': {
    name: 'Privacy Defaults',
    slug: 'privacy-defaults',
    description: 'Patterns for privacy-protective default settings',
    icon: ToggleLeft,
    color: 'emerald'
  },
  'privacy-notices': {
    name: 'Privacy Notices',
    slug: 'privacy-notices',
    description: 'Patterns for presenting privacy policies and notices',
    icon: FileText,
    color: 'slate'
  },
  'third-party-tracking': {
    name: 'Third-Party Tracking',
    slug: 'third-party-tracking',
    description: 'Patterns for managing third-party trackers and advertising',
    icon: EyeOff,
    color: 'gray'
  }
};