# AI Lead Enrichment & Outreach Automation

An AI-powered platform that automates lead research, pain point analysis, and personalized cold email generation. Built with Next.js, Supabase, and Groq AI.

## What It Does

1. **Scrapes** company websites (3-strategy fallback: direct + Googlebot UA, Google Cache, alternative pages)
2. **Analyzes** business using AI to extract company info, industry, audience
3. **Identifies** pain points related to web presence, marketing, technology
4. **Generates** personalized outreach emails tailored to each lead's specific situation
5. **Manages** the full pipeline: approve, edit, send, track

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + React 19 + Tailwind CSS 4 |
| Backend | Next.js API Routes (App Router) |
| Database | Supabase (PostgreSQL) |
| AI | Groq (Llama 3.3 70B) via OpenAI SDK |
| Scraping | Server-side fetch with fallback strategies |

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend  │────▶│  API Routes  │────▶│  Supabase   │
│  React SPA  │     │  /api/leads  │     │  PostgreSQL │
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
                    ┌──────▼───────┐
                    │   AI Engine  │
                    │  Groq/LLaMA  │
                    └──────────────┘
```

## Features

- **Bulk Operations**: Process all pending leads or selected subset
- **Inline Edit**: Modify AI-generated email drafts before sending
- **One-Click Send**: Opens mailto with pre-filled subject + body
- **Copy to Clipboard**: Quick copy for pasting into email client
- **Undo Send**: Mark sent emails back to approved if not actually sent
- **Reprocess**: Retry failed leads with updated scraping strategies
- **Confidence Scoring**: Auto-flags low-confidence results for review

## Pipeline Flow

```
Pending → Processing → Ready (≥60% confidence)
                     → Needs Review (<60% confidence)
Ready/Review → Approved → Sent
```

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project
- Groq API key (free tier: 30 RPM)

### Setup

1. Clone and install:
```bash
git clone https://github.com/websytdesign/ai-lead-enrichment.git
cd ai-lead-enrichment
npm install
```

2. Create `.env.local` from the example:
```bash
cp .env.example .env.local
```

3. Fill in your keys in `.env.local`

4. Run the Supabase schema:
```sql
-- Copy contents of supabase-schema.sql into Supabase SQL Editor
```

5. Start development:
```bash
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `AI_BASE_URL` | AI API endpoint (default: Groq) |
| `AI_API_KEY` | Your AI provider API key |
| `AI_MODEL` | Model name (default: llama-3.3-70b-versatile) |
| `SENDER_NAME` | Your name for email sign-off |
| `SENDER_COMPANY` | Your company name |
| `SENDER_WEBSITE` | Your website URL |
| `SENDER_SERVICES` | Services you offer |
| `SENDER_CTA` | Call to action (e.g., "a quick 15-minute call") |
| `SENDER_FIVERR` | Fiverr profile URL (optional) |
| `SENDER_UPWORK` | Upwork profile URL (optional) |

## Switching AI Providers

The platform uses the OpenAI SDK pointed at any compatible endpoint:

| Provider | `AI_BASE_URL` | `AI_MODEL` |
|----------|--------------|------------|
| Groq | `https://api.groq.com/openai/v1` | `llama-3.3-70b-versatile` |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` |
| Together | `https://api.together.xyz/v1` | `meta-llama/Llama-3-70b-chat-hf` |

## Scraper Strategy

The scraper uses a 3-tier fallback:

1. **Direct fetch** with Googlebot User-Agent (bypasses basic bot blocking)
2. **Google Cache** fallback for sites that block direct access
3. **Alternative pages** (`/about`, `/about-us`, `/company`, `/services`)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── leads/
│   │   │   ├── route.ts          # GET all, POST new
│   │   │   ├── bulk/route.ts     # POST process bulk, DELETE bulk
│   │   │   └── [id]/
│   │   │       ├── route.ts      # GET, PATCH, DELETE single
│   │   │       └── process/route.ts  # POST full AI pipeline
│   │   ├── add-leads/route.ts    # POST batch add
│   │   └── test-ai/route.ts      # GET connection test
│   ├── layout.tsx
│   ├── page.tsx                   # Main dashboard
│   └── globals.css
├── components/
│   ├── AddLeadForm.tsx
│   ├── LeadDetail.tsx             # Modal with approve/edit/send/copy
│   ├── LeadsTable.tsx             # Selectable table with bulk actions
│   └── StatusBadge.tsx
├── lib/
│   ├── openai.ts                  # AI functions (analyze, pain points, outreach)
│   ├── scraper.ts                 # 3-strategy web scraper
│   ├── supabase.ts                # Supabase client
│   └── utils.ts                   # Tailwind merge utility
└── types/
    └── lead.ts                    # TypeScript interfaces
```

## License

All rights reserved.
