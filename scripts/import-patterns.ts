import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Pattern category mapping from folder names to our database categories
const CATEGORY_MAPPING: Record<string, string> = {
  // From debug output, the first format is being generated
  '01_Cookie Consent Banners': 'cookie-banners',
  '03_Just‑in‑Time': 'just-in-time-consent',
  '04_Permission_Requests_(Camera___Microphone___Location)': 'permission-requests',
  '06_Privacy‑Settings': 'privacy-dashboards',
  '07_Third‑Party': 'third-party-tracking',
  '07_REDO:_Third‑Party': 'third-party-tracking',
  '08_Device-Permission_Flows_(iOS___Android)': 'device-permissions',
  '09_Contextual_Consent_for_Sensitive_Data': 'consent-management',
  '10_Child‑Privacy': 'child-privacy',
  '13_Privacy‑First': 'privacy-defaults',
  '14_Data‑Access': 'data-access-rights',
  '22_Incident_&_Breach_Notifications': 'incident-notifications',
  '23_Biometric_Privacy_Controls': 'biometric-privacy',
  '26_Data‑Retention': 'data-retention',
  '27_Data‑Retention': 'data-retention',
  '28_Data‑Retention': 'data-retention',
  '29_Data‑Retention': 'data-retention',
  
  // Also add exact folder names from filesystem
  '01_Cookie_Consent_Banners': 'cookie-banners',
  '03_Just_in_Time': 'just-in-time-consent',
  '04_Permission_Requests_(Camera_/_Microphone_/_Location)': 'permission-requests',
  '06_Privacy_Settings': 'privacy-dashboards',
  '07_Third_Party': 'third-party-tracking',
  '07_REDO:_Third_Party': 'third-party-tracking',
  '08_Device-Permission_Flows_(iOS_/_Android)': 'device-permissions',
  '10_Child_Privacy': 'child-privacy',
  '13_Privacy_First': 'privacy-defaults',
  '14_Data_Access': 'data-access-rights'
};

// Pattern descriptions to be added
const PATTERN_INFO: Record<string, { title: string; description: string; explanation: string; relevance: string }> = {
  'cookie-consent-banner': {
    title: 'Cookie Consent Banner',
    description: 'Allow users to control website cookies and tracking technologies',
    explanation: 'Cookie consent banners are legally required in many jurisdictions to inform users about data collection and obtain consent for non-essential cookies. They provide transparency about tracking technologies and give users control over their data.',
    relevance: 'Essential for GDPR and ePrivacy compliance. Required when websites use cookies for analytics, advertising, or other non-essential purposes.'
  },
  'just-in-time-permission': {
    title: 'Just-in-Time Permission Request',
    description: 'Request permissions at the moment they are needed with clear context',
    explanation: 'Just-in-time permissions ask for access to sensitive resources (camera, location, etc.) only when the user is about to use a feature that requires it, providing immediate context for why the permission is needed.',
    relevance: 'Improves consent quality by providing contextual information when users are most receptive. Reduces permission fatigue and increases grant rates.'
  },
  'granular-permission-control': {
    title: 'Granular Permission Control',
    description: 'Provide fine-grained control over different types of permissions',
    explanation: 'Granular permissions allow users to selectively grant access to specific features or data types rather than all-or-nothing consent. This enables users to use services while maintaining control over sensitive data.',
    relevance: 'Aligns with data minimization principles. Allows users to participate in services while maintaining privacy boundaries.'
  },
  'privacy-dashboard': {
    title: 'Privacy Dashboard',
    description: 'Centralized interface for managing all privacy settings and data',
    explanation: 'Privacy dashboards provide a single location where users can view and manage all their privacy settings, see what data is collected, and control how it is used.',
    relevance: 'Supports transparency and user control requirements. Makes it easier for users to exercise their privacy rights in one place.'
  },
  'third-party-tracking-control': {
    title: 'Third-Party Tracking Control',
    description: 'Controls for managing third-party trackers and advertising',
    explanation: 'These controls allow users to manage how third-party services track them across websites and apps, including advertising networks and analytics providers.',
    relevance: 'Critical for compliance with tracking regulations and giving users control over cross-site tracking and behavioral advertising.'
  },
  'device-permission-flow': {
    title: 'Device Permission Flow',
    description: 'System-level flows for managing device permissions',
    explanation: 'Device permission flows handle requests for access to device capabilities like camera, microphone, contacts, and location at the operating system level.',
    relevance: 'Provides consistent permission experiences across apps and ensures users maintain control over sensitive device capabilities.'
  },
  'contextual-consent': {
    title: 'Contextual Consent',
    description: 'Obtain consent with relevant context about data use',
    explanation: 'Contextual consent provides users with specific information about how their data will be used at the point of collection, making the consent more informed and meaningful.',
    relevance: 'Improves consent quality by ensuring users understand the implications of their choices. Required for valid consent under GDPR.'
  },
  'child-privacy-protection': {
    title: 'Child Privacy Protection',
    description: 'Special protections and controls for children\'s data',
    explanation: 'Child privacy patterns implement age-appropriate design, parental controls, and enhanced protections for minors\' personal data.',
    relevance: 'Required by COPPA, GDPR Article 8, and other child protection regulations. Essential for services accessible to minors.'
  },
  'privacy-by-default': {
    title: 'Privacy by Default',
    description: 'Privacy-protective settings enabled by default',
    explanation: 'Privacy by default ensures that the most privacy-protective settings are enabled without requiring user action. Users can opt into less private settings if desired.',
    relevance: 'Core principle of GDPR Article 25. Protects users who don\'t actively manage privacy settings.'
  },
  'data-access-request': {
    title: 'Data Access Request',
    description: 'Allow users to request and download their personal data',
    explanation: 'Data access patterns enable users to request a copy of all personal data an organization holds about them, typically in a portable format.',
    relevance: 'Required by GDPR Article 15 (right of access) and similar regulations. Fundamental transparency right.'
  },
  'breach-notification': {
    title: 'Data Breach Notification',
    description: 'Notify users about security incidents affecting their data',
    explanation: 'Breach notification patterns inform users when their personal data may have been compromised in a security incident, including what data was affected and recommended actions.',
    relevance: 'Required by GDPR Article 34 and breach notification laws. Critical for maintaining user trust after incidents.'
  },
  'biometric-privacy-control': {
    title: 'Biometric Privacy Control',
    description: 'Controls for biometric data like fingerprints and face recognition',
    explanation: 'Biometric privacy controls allow users to manage how their biometric data is collected, stored, and used, with options to delete biometric templates.',
    relevance: 'Biometric data is considered special category data under GDPR. Subject to strict regulations in many jurisdictions.'
  },
  'data-retention-control': {
    title: 'Data Retention Control',
    description: 'Allow users to control how long their data is retained',
    explanation: 'Data retention controls let users set preferences for how long their data is kept, request deletion, or enable automatic deletion after specified periods.',
    relevance: 'Supports data minimization principles and right to erasure. Helps organizations comply with retention limitations.'
  }
};

async function importPatterns() {
  try {
    console.log('Starting pattern import...');
    
    // Read the parsed data file
    const dataPath = path.join(__dirname, '../privacy_ui_scraper/privacy_ui_screenshots/parsed_data.json');
    const parsedData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));
    
    // Get all categories from the database
    const { data: categories, error: catError } = await supabase
      .from('pattern_categories')
      .select('*');
    
    if (catError) {
      throw new Error(`Failed to fetch categories: ${catError.message}`);
    }
    
    const categoryMap = new Map(categories?.map(cat => [cat.slug, cat.id]) || []);
    
    // Process each pattern
    for (const patternData of parsedData.patterns) {
      // Try multiple folder name formats to match the actual folders
      const paddedNumber = String(patternData.pattern_number).padStart(2, '0');
      const possibleFolderNames = [
        `${paddedNumber}_${patternData.pattern_name}`,
        `${paddedNumber}_${patternData.pattern_name.replace(/[‑\s]+/g, '_')}`,
        `${paddedNumber}_${patternData.pattern_name.replace(/[\s]+/g, '_')}`,
        `${paddedNumber}_${patternData.pattern_name.replace(/[‑]/g, '-').replace(/[\s]+/g, '_')}`,
        `${paddedNumber}_${patternData.pattern_name.replace(/[‑]/g, '‑').replace(/[\s]+/g, '_')}`
      ];
      
      let categorySlug = null;
      let matchedFolderName = null;
      
      for (const folderName of possibleFolderNames) {
        if (CATEGORY_MAPPING[folderName]) {
          categorySlug = CATEGORY_MAPPING[folderName];
          matchedFolderName = folderName;
          break;
        }
      }
      
      console.log(`Pattern ${patternData.pattern_number}: ${patternData.pattern_name}`);
      console.log(`Trying folder names:`, possibleFolderNames);
      console.log(`Matched:`, matchedFolderName, '→', categorySlug);
      
      if (!categorySlug) {
        console.warn(`No category mapping for pattern: ${patternData.pattern_name} (tried: ${possibleFolderNames[0]})`);
        continue;
      }
      
      const categoryId = categoryMap.get(categorySlug);
      if (!categoryId) {
        console.warn(`Category not found in database: ${categorySlug}`);
        continue;
      }
      
      // Create a pattern slug
      const patternSlug = patternData.pattern_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Check if pattern already exists
      const { data: existingPattern } = await supabase
        .from('patterns')
        .select('id')
        .eq('category_id', categoryId)
        .eq('slug', patternSlug)
        .single();
      
      if (existingPattern) {
        console.log(`Pattern already exists, skipping: ${patternData.pattern_name}`);
        continue;
      }
      
      // Get pattern info or use defaults
      const patternInfo = PATTERN_INFO[patternSlug] || {
        title: patternData.pattern_name,
        description: patternData.description || `Patterns for ${patternData.pattern_name.toLowerCase()}`,
        explanation: `${patternData.pattern_name} patterns help users understand and control how their data is collected and used.`,
        relevance: `Important for privacy compliance and user trust.`
      };
      
      // Insert pattern
      const { data: pattern, error: patternError } = await supabase
        .from('patterns')
        .insert({
          category_id: categoryId,
          title: patternInfo.title,
          slug: patternSlug,
          description: patternInfo.description,
          explanation: patternInfo.explanation,
          relevance: patternInfo.relevance,
          sources: [],
          pbd_alignment: {},
          nielsen_alignment: {}
        })
        .select()
        .single();
      
      if (patternError) {
        console.error(`Failed to insert pattern ${patternData.pattern_name}:`, patternError);
        continue;
      }
      
      console.log(`Created pattern: ${pattern.title}`);
      
      // Import examples for this pattern
      for (const example of patternData.examples) {
        // Determine screenshot path
        const screenshotFileName = example.screenshot_file || 
          `example_${example.example_number}_${example.company.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
        
        const screenshotUrl = `/screenshots/${matchedFolderName}/${screenshotFileName}`;
        
        // Parse alignment data
        const pbdAlignment = example.pbd_alignment?.split(',').map((s: string) => s.trim()) || [];
        const nielsenAlignment = example.nielsen_heuristics?.split(';').map((s: string) => s.trim()) || [];
        
        // Insert example
        const { error: exampleError } = await supabase
          .from('examples')
          .insert({
            pattern_id: pattern.id,
            company: example.company,
            title: example.title?.replace(/\n/g, ' ').trim() || '',
            use_case: example.use_case?.replace(/\n/g, ' ').trim() || '',
            description: example.description || '',
            why_selected: example.why_selected?.replace(/\n/g, ' ').trim() || '',
            screenshot_url: screenshotUrl,
            source_url: example.url,
            metadata: {
              pbd_alignment: pbdAlignment,
              nielsen_heuristics: nielsenAlignment
            },
            display_order: example.example_number
          });
        
        if (exampleError) {
          console.error(`Failed to insert example for ${example.company}:`, exampleError);
        } else {
          console.log(`  - Added example: ${example.company}`);
        }
      }
    }
    
    console.log('Pattern import completed!');
    
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Run the import
importPatterns();