// Initial privacy pattern categories to seed the database
// Based on the Privacy UI Pattern Library documentation

export interface InitialCategory {
  name: string;
  slug: string;
  order_index: number;
  description?: string;
  icon?: string;
}

export const INITIAL_CATEGORIES: InitialCategory[] = [
  { 
    name: "Account Deletion", 
    slug: "account-deletion", 
    order_index: 1,
    description: "Permanent account removal workflows that ensure complete data erasure while maintaining user trust.",
    icon: "user-x"
  },
  { 
    name: "Biometric Privacy", 
    slug: "biometric-privacy", 
    order_index: 2,
    description: "Facial recognition, fingerprint, and other biometric data handling interfaces that prioritize consent and security.",
    icon: "fingerprint"
  },
  { 
    name: "Child Privacy", 
    slug: "child-privacy", 
    order_index: 3,
    description: "COPPA-compliant patterns for minors including parental consent, age verification, and child-safe interfaces.",
    icon: "baby"
  },
  { 
    name: "Consent Management", 
    slug: "consent-management", 
    order_index: 4,
    description: "User consent collection and management systems that make choices clear and revocable.",
    icon: "check-circle"
  },
  { 
    name: "Cookie Banners", 
    slug: "cookie-banners", 
    order_index: 5,
    description: "GDPR-compliant cookie notices that balance compliance with user experience.",
    icon: "cookie"
  },
  { 
    name: "Data Access Rights", 
    slug: "data-access-rights", 
    order_index: 6,
    description: "User data access interfaces that enable individuals to view, download, and understand their personal data.",
    icon: "database"
  },
  { 
    name: "Data Export", 
    slug: "data-export", 
    order_index: 7,
    description: "Data portability patterns that allow users to easily export their information to other services.",
    icon: "download"
  },
  { 
    name: "Data Retention", 
    slug: "data-retention", 
    order_index: 8,
    description: "Data lifecycle management interfaces that clearly communicate retention periods and deletion processes.",
    icon: "calendar-clock"
  },
  { 
    name: "Device Permissions", 
    slug: "device-permissions", 
    order_index: 9,
    description: "Camera, microphone, location and other device permission interfaces that explain purpose and enable granular control.",
    icon: "smartphone"
  },
  { 
    name: "Incident Notifications", 
    slug: "incident-notifications", 
    order_index: 10,
    description: "Data breach notification patterns that communicate incidents clearly while maintaining user trust.",
    icon: "alert-triangle"
  },
  { 
    name: "Just-in-Time Consent", 
    slug: "just-in-time-consent", 
    order_index: 11,
    description: "Contextual permission requests that appear exactly when data collection occurs with clear explanations.",
    icon: "clock"
  },
  { 
    name: "Permission Requests", 
    slug: "permission-requests", 
    order_index: 12,
    description: "Clear permission explanations that help users understand what they're granting access to and why.",
    icon: "key"
  },
  { 
    name: "Privacy Dashboards", 
    slug: "privacy-dashboards", 
    order_index: 13,
    description: "Centralized privacy control centers that give users visibility and control over their data and privacy settings.",
    icon: "dashboard"
  },
  { 
    name: "Privacy Defaults", 
    slug: "privacy-defaults", 
    order_index: 14,
    description: "Privacy-protective default settings that maximize user privacy without requiring action.",
    icon: "shield"
  },
  { 
    name: "Privacy Notices", 
    slug: "privacy-notices", 
    order_index: 15,
    description: "Policy presentation patterns that make privacy information digestible and actionable for users.",
    icon: "file-text"
  },
  { 
    name: "Third-Party Tracking", 
    slug: "third-party-tracking", 
    order_index: 16,
    description: "Ad and tracker management interfaces that give users control over third-party data collection.",
    icon: "eye-off"
  }
];

// Helper functions for working with categories
export function getCategoryBySlug(slug: string): InitialCategory | undefined {
  return INITIAL_CATEGORIES.find(category => category.slug === slug);
}

export function getCategoryByName(name: string): InitialCategory | undefined {
  return INITIAL_CATEGORIES.find(category => category.name === name);
}

export function getCategoriesSorted(): InitialCategory[] {
  return INITIAL_CATEGORIES.sort((a, b) => a.order_index - b.order_index);
}

export function getCategoriesAlphabetical(): InitialCategory[] {
  return INITIAL_CATEGORIES.sort((a, b) => a.name.localeCompare(b.name));
}