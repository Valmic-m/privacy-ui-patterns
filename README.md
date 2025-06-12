# Privacy UI Pattern Library

An open-source platform providing designers with a curated collection of privacy-focused UI patterns that adhere to Privacy by Design principles and Nielsen's Heuristics.

## 🚀 Project Status

**Stage 1 MVP Complete!** The core pattern browsing experience is now live with:
- ✅ Direct navigation from categories to patterns
- ✅ Real-time search functionality
- ✅ 149+ real-world examples from major platforms
- ✅ Comprehensive API and data layer
- ✅ Privacy Guardian design system

## Overview

This Next.js application serves as a comprehensive resource for privacy-conscious design, featuring:

- 🛡️ **16 Privacy Pattern Categories** - Covering GDPR/CCPA compliance needs
- 🌍 **149+ Real-World Examples** - Screenshots from BBC, Apple, Google, Meta, and more
- 📚 **Academic Foundation** - Based on Privacy by Design principles and Nielsen's Heuristics
- 🔍 **Smart Search** - Real-time search across patterns and examples
- 🎯 **Direct Navigation** - Streamlined access to pattern information
- 🎨 **Figma Templates** - Coming in Stage 3

## Tech Stack

- **Framework**: Next.js 15 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Data Fetching**: React Query (TanStack Query)
- **Authentication**: Supabase Auth (Stage 2)
- **Hosting**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Valmic-m/privacy-ui-patterns.git
cd privacy-ui-patterns
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
touch .env.local
```

4. Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_database_url  # Optional, for direct DB access
```

5. Set up the database:
```bash
# Option A: Run migrations in Supabase SQL editor
# Navigate to your Supabase project SQL editor and run:
# 1. supabase/migrations/20240610_initial_schema.sql
# 2. supabase/migrations/20240610_seed_categories.sql

# Option B: Use Supabase CLI (if installed)
supabase db push
```

6. Import pattern data:
```bash
# Import real pattern data from the scraper
npm run import:patterns

# OR use test data for quick setup
npm run seed:test
```

7. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Privacy Pattern Categories

1. **Account Deletion** - Permanent account removal workflows
2. **Biometric Privacy** - Facial recognition and fingerprint handling
3. **Child Privacy** - COPPA-compliant patterns for minors
4. **Consent Management** - User consent collection and management
5. **Cookie Banners** - GDPR-compliant cookie notices
6. **Data Access Rights** - User data access interfaces
7. **Data Export** - Data portability patterns
8. **Data Retention** - Data lifecycle management
9. **Device Permissions** - Camera, mic, location permissions
10. **Incident Notifications** - Breach notification patterns
11. **Just-in-Time Consent** - Contextual permission requests
12. **Permission Requests** - Clear permission explanations
13. **Privacy Dashboards** - Centralized privacy controls
14. **Privacy Defaults** - Privacy-protective defaults
15. **Privacy Notices** - Policy presentation patterns
16. **Third-Party Tracking** - Ad and tracker management

## Project Structure

```
privacy-ui-patterns/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public routes
│   │   │   └── patterns/      # Pattern browsing pages
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── layout/            # Navigation, Footer, Search
│   │   ├── patterns/          # Pattern cards and grids
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # React Query hooks
│   ├── lib/                   # Utilities and configs
│   │   ├── supabase/          # Database clients
│   │   └── constants/         # Categories, principles
│   └── types/                 # TypeScript definitions
├── scripts/
│   ├── import-patterns.ts     # Import scraper data
│   └── seed-test-data.ts      # Seed test patterns
├── supabase/
│   └── migrations/            # Database schema
├── privacy_ui_scraper/        # Pattern data & screenshots
└── public/                    # Static assets
```

## Key Features

### 🎯 Direct Pattern Navigation
Click any category card to go directly to its main pattern page, eliminating unnecessary intermediate pages.

### 🔍 Real-Time Search
Search across all patterns and examples instantly from the navigation bar.

### 📱 Responsive Design
Privacy Guardian design system with glassmorphism effects, optimized for all devices.

### 🚀 Performance
- React Query for efficient data caching
- Next.js App Router with streaming
- Turbopack for fast development
- Optimized API routes

## API Routes

The application provides RESTful API endpoints:

- `GET /api/categories` - List all pattern categories
- `GET /api/patterns` - List all patterns (with pagination)
- `GET /api/patterns/[id]` - Get pattern details with examples
- `GET /api/patterns/category/[slug]` - Get patterns by category
- `GET /api/categories/[slug]/main-pattern` - Get main pattern for category
- `GET /api/search?q={query}` - Search patterns and examples

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint

# Data management
npm run import:patterns  # Import pattern data from scraper
npm run seed:test       # Seed test data for development
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Submission Requirements (Stage 2)

- Minimum 100-character justification for new patterns
- Real-world example with screenshot
- Alignment with Privacy by Design principles
- Manual review by maintainers

## Privacy by Design Principles

This library adheres to Cavoukian's 7 foundational principles:

1. **Proactive not Reactive**
2. **Privacy as the Default**
3. **Privacy Embedded into Design**
4. **Full Functionality - Positive-Sum**
5. **End-to-End Security**
6. **Visibility and Transparency**
7. **Respect for User Privacy**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Academic researchers in privacy and HCI
- Open source privacy advocacy organizations
- Contributors to GDPR and CCPA compliance best practices

---

**Note**: This is a living document. As privacy regulations evolve and new patterns emerge, we'll continue to update and expand this library.