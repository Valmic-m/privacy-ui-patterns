# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Privacy-UI Pattern Library - a Next.js web application providing a comprehensive collection of privacy-focused UI patterns for GDPR/CCPA compliance. 

### Current Status (2025-01-10)
- **Stage 1 MVP**: ✅ Complete
- **Live Features**: Pattern browsing, direct navigation, real-time search, data import
- **Database**: Supabase with 16 categories, multiple patterns, 149+ real-world examples
- **Tech Stack**: Next.js 15, TypeScript, React Query, Tailwind CSS, shadcn/ui

The repository consists of:
- **Web Application**: Next.js app with pattern browsing and search
- **Screenshot Scraper Tool**: `privacy_ui_scraper/` - Python tool with 149+ captured examples
- **Database Schema**: PostgreSQL schema with categories, patterns, examples, and templates
- **Import Scripts**: TypeScript scripts to import pattern data from scraper

## Key Commands

### Development Workflow
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local  # Then add your Supabase credentials

# Run database migrations (in Supabase SQL editor)
# Execute files in supabase/migrations/ in order

# Import pattern data
npm run import:patterns    # Import from scraper data
npm run seed:test         # OR use test data

# Start development server
npm run dev              # Visit http://localhost:3000

# Other commands
npm run build           # Production build
npm run type-check      # TypeScript checking
npm run lint           # ESLint
```

### Scraper Tool (if needed)
```bash
cd privacy_ui_scraper
pip install -r requirements.txt
playwright install chromium
python main.py
```

## Architecture

### Web Application Structure

**Frontend (Next.js App Router)**
```
src/app/
├── (public)/           # Public routes group
│   └── patterns/       # Pattern browsing pages
│       ├── page.tsx    # Category catalogue (direct links to patterns)
│       ├── [category]/
│       │   ├── page.tsx    # Redirects to main pattern
│       │   └── [pattern]/
│       │       └── page.tsx # Pattern detail with tabs
├── api/                # API routes
│   ├── categories/     # Category endpoints
│   ├── patterns/       # Pattern endpoints
│   └── search/         # Search functionality
```

**Key Components**
- **Direct Navigation**: Category cards link directly to pattern pages
- **Pattern Pages**: Three-tab structure (Explanation, Examples, Templates)
- **Search**: Real-time search with debouncing in navigation
- **Loading States**: Skeleton screens maintain layout during data fetching

**Data Layer**
- **React Query**: Client-side data fetching with caching
- **Supabase**: PostgreSQL database with Row Level Security
- **API Routes**: RESTful endpoints with error handling

### Database Schema

```sql
-- Core tables with relationships
pattern_categories (1) → (many) patterns
patterns (1) → (many) examples
patterns (1) → (many) templates
```

**Key Design Decisions**
- Categories are pre-seeded (16 total) and admin-managed
- Patterns belong to exactly one category
- Pattern slugs are unique within a category
- Direct navigation assumes one main pattern per category
- Examples link to real-world screenshots

### Recent Feature: Direct Pattern Navigation (2025-01-10)

**Problem**: Users had to click through category → pattern list → pattern detail
**Solution**: Category cards now link directly to the main pattern

**Implementation**:
1. Updated `/api/categories` to include `main_pattern_slug`
2. `CategoryCard` builds direct links: `/patterns/{category}/{pattern}`
3. Category pages (`/patterns/[category]`) redirect to main pattern
4. "Back" button returns to pattern catalogue, not category

**Benefits**: Fewer clicks, cleaner navigation, maintained URL hierarchy

## Important Architectural Notes

### Frontend Architecture
- **Route Groups**: Using `(public)` for public routes, preparing for `(admin)` in Stage 2
- **Client Components**: Search and pattern pages use 'use client' for interactivity
- **Server Components**: API routes use async server components where possible
- **Loading States**: Every data-fetching page has loading.tsx with skeletons
- **Error Boundaries**: Graceful error handling throughout

### API Design
- **RESTful**: Standard REST conventions for all endpoints
- **Pagination**: Built into pattern listing endpoints
- **Error Handling**: Consistent error response format
- **Type Safety**: Full TypeScript types for all API responses

### Performance Optimizations
- **React Query**: 5-minute cache for patterns, 10 minutes for categories
- **Debounced Search**: 300ms debounce on search input
- **Direct Navigation**: Eliminates unnecessary page loads
- **Turbopack**: Fast refresh in development

### Data Import Process
- Pattern data lives in `privacy_ui_scraper/privacy_ui_screenshots/`
- Import script maps folder names to category slugs
- Handles duplicate detection and resume capability
- Preserves screenshot paths for future asset serving

## Stage 1 MVP Completion (2025-01-10)

### What Was Built
1. **Complete Pattern Browsing System**
   - Category catalogue at `/patterns`
   - Direct navigation to pattern details
   - Three-tab pattern pages (Explanation, Examples, Templates)
   - Real-time search across patterns and examples

2. **Comprehensive API Layer**
   - RESTful endpoints for all data operations
   - Pagination support for large datasets
   - Consistent error handling
   - TypeScript types throughout

3. **Data Import Pipeline**
   - Scripts to import from scraper data
   - Test data seeding for development
   - Duplicate detection and resume capability

4. **Performance & UX**
   - React Query for efficient caching
   - Loading skeletons maintain layout
   - Responsive design with glassmorphism
   - Direct navigation reduces clicks

### Key Technical Decisions
- **Next.js 15 App Router**: For modern React patterns and performance
- **React Query**: For client-side data fetching and caching
- **Supabase**: For managed PostgreSQL with built-in auth (Stage 2)
- **shadcn/ui**: For consistent, accessible UI components
- **Direct Navigation**: Eliminates intermediate category pages

### Future Enhancements (Stage 2 & 3)

**Stage 2 - Community Features**:
- User authentication with Supabase Auth
- Pattern submission workflow
- Admin dashboard for content moderation
- Contributor profiles and badges

**Stage 3 - Design Resources**:
- Figma template integration
- Downloadable design assets
- Implementation code examples
- Pattern variation showcase

## Troubleshooting Guide

### Common Development Issues

1. **Database Connection Errors**
   - Verify Supabase project is active
   - Check `.env.local` has correct credentials
   - Ensure migrations have been run

2. **No Data Showing**
   - Run `npm run import:patterns` to import data
   - Check browser console for API errors
   - Verify Row Level Security policies

3. **TypeScript Errors**
   - Run `npm run type-check` to identify issues
   - Ensure all dependencies are installed
   - Check for missing type definitions

4. **Search Not Working**
   - Verify search API endpoint is accessible
   - Check for React Query errors in console
   - Ensure debounce is not too long (300ms default)

### Development Tips

- Use `npm run dev` with Turbopack for faster refresh
- Check `SETUP_GUIDE.md` for detailed setup instructions
- API routes are in `src/app/api/` for debugging
- React Query DevTools can help debug data fetching

## Summary

This CLAUDE.md documents the Privacy UI Pattern Library web application, which has successfully completed Stage 1 MVP with pattern browsing, direct navigation, and search functionality. The app is built with modern Next.js patterns and is ready for Stage 2 community features.