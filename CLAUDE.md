# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install     # install deps
pnpm run build   # compile ts -> dist/
pnpm start       # run dist/ (must build first)
```

## Architecture

Express 5 REST API that sends emails via Postmark. Single endpoint: `POST /` with JSON body `{subject, html, text}`.

**Flow:** `index.ts` → logger middleware → `routes/api/email/send.ts` → `sendPostmarkEmail()` → errors middleware

**Key patterns:**
- Postmark client is a singleton (`lib/createPostmarkClient.ts`) initialized at startup
- `EMAIL_FROM` and `EMAIL_TO` are fixed via env vars (not from request body)
- Request validation uses Zod schemas (`schemas/RequestBodySchema.ts`)
- Env validation also via Zod (`lib/env.ts`)
- Discriminated union types for API responses and result types (`types/global.d.ts`)

**Env vars required:** `POSTMARK_API_TOKEN`, `EMAIL_FROM`, `EMAIL_TO` (optional: `PORT`, defaults 3000)

**Design decisions:**
- No auth: assumes deployment on secure/private network
- `EMAIL_TO` supports comma-separated list for multiple recipients
