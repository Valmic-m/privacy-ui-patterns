# API Documentation

## Overview

The Privacy UI Pattern Library provides a RESTful API for accessing privacy patterns, categories, and examples. All endpoints return JSON responses and support standard HTTP status codes.

### Screenshot System

Example objects include `screenshot_url` fields that reference images in `/public/screenshots/`. The system includes:
- 114+ optimized images copied from the scraper directory
- Intelligent URL matching to handle character encoding differences
- Next.js Image optimization with lazy loading and error handling

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Currently, all read endpoints are public. Authentication will be added in Stage 2 for write operations.

## Endpoints

### Categories

#### Get All Categories
```http
GET /api/categories
```

Returns all pattern categories with pattern counts and main pattern slugs.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Cookie Banners",
      "slug": "cookie-banners",
      "description": "GDPR-compliant cookie consent notices",
      "order_index": 1,
      "icon": "cookie",
      "pattern_count": 1,
      "main_pattern_slug": "cookie-consent-banners",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Main Pattern for Category
```http
GET /api/categories/[slug]/main-pattern
```

Returns the main pattern for a specific category.

**Parameters:**
- `slug` (path) - Category slug

**Response:**
```json
{
  "success": true,
  "data": {
    "category": { /* category object */ },
    "pattern": { /* pattern object */ }
  }
}
```

### Patterns

#### Get All Patterns
```http
GET /api/patterns?limit=20&offset=0&category_id=uuid
```

Returns paginated list of patterns.

**Query Parameters:**
- `limit` (optional) - Number of results per page (default: 50)
- `offset` (optional) - Number of results to skip (default: 0)
- `category_id` (optional) - Filter by category UUID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "category_id": "uuid",
      "title": "Cookie Consent Banner",
      "slug": "cookie-consent-banner",
      "description": "Allow users to control website cookies",
      "explanation": "Cookie consent banners are legally required...",
      "relevance": "Essential for GDPR compliance...",
      "sources": [],
      "pbd_alignment": {},
      "nielsen_alignment": {},
      "example_count": 5,
      "category": {
        "id": "uuid",
        "name": "Cookie Banners",
        "slug": "cookie-banners"
      },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0
  }
}
```

#### Get Pattern by ID
```http
GET /api/patterns/[id]
```

Returns a single pattern with all examples.

**Parameters:**
- `id` (path) - Pattern UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "category_id": "uuid",
    "title": "Cookie Consent Banner",
    "slug": "cookie-consent-banner",
    "description": "Allow users to control website cookies",
    "explanation": "Detailed explanation...",
    "relevance": "Why this matters...",
    "sources": [
      {
        "title": "GDPR Article 7",
        "url": "https://gdpr-info.eu/art-7-gdpr/"
      }
    ],
    "pbd_alignment": {
      "proactive": true,
      "privacy_default": true
    },
    "nielsen_alignment": {
      "visibility": true,
      "user_control": true
    },
    "category": {
      "id": "uuid",
      "name": "Cookie Banners",
      "slug": "cookie-banners",
      "description": "GDPR-compliant cookie notices"
    },
    "examples": [
      {
        "id": "uuid",
        "pattern_id": "uuid",
        "company": "BBC",
        "title": "Persistent bottom bar with options",
        "use_case": "Large media sites",
        "description": "Optional description",
        "why_selected": "Demonstrates best practices",
        "screenshot_url": "/screenshots/01_Cookie_Consent_Banners/example_1_BBC.png",
        "source_url": "https://www.bbc.com",
        "metadata": {},
        "display_order": 0,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### Get Patterns by Category
```http
GET /api/patterns/category/[slug]?limit=20&offset=0
```

Returns patterns for a specific category.

**Parameters:**
- `slug` (path) - Category slug

**Query Parameters:**
- `limit` (optional) - Number of results per page (default: 20)
- `offset` (optional) - Number of results to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "category": { /* category object */ },
    "patterns": [ /* array of pattern objects */ ]
  },
  "pagination": {
    "limit": 20,
    "offset": 0
  }
}
```

### Search

#### Search Patterns and Examples
```http
GET /api/search?q=cookie
```

Searches across pattern titles, descriptions, and example companies.

**Query Parameters:**
- `q` (required) - Search query (minimum 2 characters)

**Response:**
```json
{
  "success": true,
  "data": {
    "patterns": [
      {
        "id": "uuid",
        "title": "Cookie Consent Banner",
        "slug": "cookie-consent-banner",
        "description": "Allow users to control cookies",
        "category": {
          "id": "uuid",
          "name": "Cookie Banners",
          "slug": "cookie-banners"
        }
      }
    ],
    "examples": [
      {
        "id": "uuid",
        "company": "BBC",
        "title": "Cookie consent implementation",
        "pattern": {
          "id": "uuid",
          "title": "Cookie Consent Banner",
          "slug": "cookie-consent-banner",
          "category": {
            "id": "uuid",
            "name": "Cookie Banners",
            "slug": "cookie-banners"
          }
        }
      }
    ]
  }
}
```

## Error Responses

All endpoints use consistent error formatting:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Status Codes

- `200 OK` - Request succeeded
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Pagination

Endpoints that return lists support pagination using `limit` and `offset` parameters:

- `limit` - Maximum number of items to return
- `offset` - Number of items to skip

Example: Get the second page of 20 patterns:
```
GET /api/patterns?limit=20&offset=20
```

## TypeScript Types

The application includes full TypeScript types for all API responses. Key interfaces:

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  order_index: number;
  icon: string;
  pattern_count: number;
  main_pattern_slug?: string | null;
  created_at: string;
  updated_at: string;
}

interface Pattern {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  explanation: string;
  relevance: string;
  sources: Array<{ title: string; url: string }>;
  pbd_alignment: Record<string, boolean>;
  nielsen_alignment: Record<string, boolean>;
  example_count?: number;
  category?: Category;
  examples?: Example[];
  created_at: string;
  updated_at: string;
}

interface Example {
  id: string;
  pattern_id: string;
  company: string;
  title: string;
  use_case: string;
  description: string;
  why_selected: string;
  screenshot_url: string;
  source_url: string;
  metadata: Record<string, any>;
  display_order: number;
  created_at: string;
  updated_at: string;
}
```

## Rate Limiting

Currently no rate limiting is implemented. This will be added before public launch.

## CORS

In production, CORS headers will be configured to allow access from approved domains only.