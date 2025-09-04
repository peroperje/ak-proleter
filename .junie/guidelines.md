# Guidelines for Junie AI Contributors

These guidelines help Junie AI (and human maintainers) contribute safely and effectively to the AK Proleter Next.js app.

## 1. Project Overview
- Purpose: Athlete tracking and management for AK Proleter Zrenjanin.
- Framework: Next.js 15 (App Router) with TypeScript and Tailwind CSS.
- Data: PostgreSQL via Prisma ORM.
- AI: Optional AI-assisted form population using Hugging Face Inference API.

Key entry points:
- App code: `src/app`
- Database: `prisma/`
- AI service: `src/app/lib/service/AISevice.ts`
- AI UI: `src/app/components/AiFormPopulator/*`

## 2. Running the Project Locally
- Prerequisites: Node 18.17+, pnpm, Docker.
- Install: `pnpm install`
- Start DB: `pnpm db:start` (Docker Compose)
- Dev server: `pnpm dev` then open http://localhost:3000
- Prisma Studio: `pnpm prisma:studio`
- Build: `pnpm build`

Environment variables:
- Copy `env.local` (if provided) or create your own `.env.local`.
- For AI features: set `NEXT_PUBLIC_HF_API_KEY` to a valid Hugging Face token.

## 3. Code Structure and Conventions
- App Router structure under `src/app` with route groups like `(routes)/athletes/...`.
- Shared components in `src/app/components` and `src/app/ui`.
- Utilities/services in `src/app/lib`.
- TypeScript is enforced. Prefer explicit types for public function signatures.
- Styling uses Tailwind CSS. Follow utility-first practices; keep class lists readable.
- Lint/format before committing: `pnpm lint` (ESLint), use Prettier locally.

## 4. AI Integration Notes
- Service: `AIService` in `src/app/lib/service/AISevice.ts` wraps Hugging Face Inference.
  - Text extraction: `extractData<T>(prompt: string)` sends a crafted prompt to `deepseek-ai/DeepSeek-V3-0324` via `chatCompletion`.
  - Audio: `transcribeAudioWithHF(file)` calls Whisper (`openai/whisper-large-v3`) through HF, then `extractData` is used on the transcript.
  - Requires env var: `NEXT_PUBLIC_HF_API_KEY`.
- UI: `AiFormPopulator` allows text or audio input and calls the service, passing back parsed JSON to populate athlete forms.
- Be careful with:
  - JSON parsing: `extractData` expects strictly valid JSON in the response. When adjusting prompts, ensure `response_format: { type: 'json_object' }` is preserved and the system text requests a plain JSON object without extra prose.
  - Token limits: `max_tokens` currently 100; increase cautiously if fields are truncated.
  - Model availability: If the model changes or is rate-limited, handle errors gracefully and avoid blocking normal (manual) form entry.

## 5. Database and Prisma
- DB is managed via Docker Compose (`docker-compose.yml`).
- Use Prisma commands:
  - Generate: `pnpm prisma:generate`
  - Studio: `pnpm prisma:studio`
  - Seeding: `pnpm db:seed`
- Check README for migration scripts and recent changes related to Profile model.
- Never commit secrets or local datasets. Do not change production schema unless required by an issue; prefer additive migrations.

## 6. Routes and Forms
- Athlete forms are under `(routes)/athletes` with `new` and `[id]/edit` pages.
- The AI populator is optional: ensure forms still work entirely without AI keys configured.
- Follow React 19 patterns and Next.js client/server boundaries (`'use client'` where client APIs are used, e.g., MediaRecorder).

## 7. Security and Secrets
- Do not log or commit API keys. `NEXT_PUBLIC_HF_API_KEY` is read at build/runtime; treat as secret even if prefixed with NEXT_PUBLIC.
- Avoid exposing PII unnecessarily in logs. When debugging AI responses, prefer summaries over raw content.

## 8. Contribution Workflow (for Junie AI)
- Aim for minimal, targeted changes that satisfy the issue description.
- Before editing, scan related files to understand context.
- Add or edit files only within the repository.
- If adding new files, prefer co-locating with related modules; for general guidance, put docs in repo root (e.g., `guidelines.md`).
- Update README only when user-facing instructions change.
- When touching AIService:
  - Keep types generic (`<T>`) and ensure callers validate the presence of data.
  - Catch and surface errors with concise messages; avoid throwing unhandled errors in UI.

## 9. Testing and Verification
- No formal test suite is present in scripts. Manually verify:
  - App builds: `pnpm build`
  - Pages load under dev server.
  - With and without `NEXT_PUBLIC_HF_API_KEY`.
  - AI populator text path returns structured JSON and populates forms as expected.
  - Audio path records or uploads and transcribes; handle permission errors.

## 10. Common Pitfalls
- Model response not pure JSON: adjust prompt or add validation before `JSON.parse`.
- Audio blob types: ensure `MediaRecorder` output is accepted by HF (WAV/WebM). Current code constructs a WAV-typed Blob; verify browser support.
- Token limits causing truncated output.
- Forgetting to start Docker DB leading to runtime DB errors.

## 11. Styling and UI
- Use `src/app/ui` primitives (Button, Textarea, icons) for consistency.
- Keep accessibility in mind: labels for inputs, proper button semantics, and feedback messages for errors/success.

## 12. Documentation
- Keep `README.md` high-level. Put contributor-specific or AI-agent notes here in `guidelines.md`.
- When adding features, include brief usage notes in the relevant component directory README if helpful.

## 13. Release and Deployment
- Ensure `pnpm build` succeeds and environment variables are set in the deployment target.
- Database migrations should be applied before starting the new app version.

If unsure, ask for clarification in the issue. Keep changes minimal and reversible.
