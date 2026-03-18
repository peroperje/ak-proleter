# 🏗️ AK Proleter Architecture: Source of Truth

## 1. Project Overview

AK Proleter is a comprehensive sports club management platform designed for the Athletics Club Proleter. It streamlines the administration of athletes, training sessions, events, and competition results. A core feature is its AI-powered automation, which allows for intelligent data extraction from documents and audio to populate forms and manage records efficiently.

## 2. Tech Stack & Environment

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, React 19).
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) via [Prisma](https://www.prisma.io/).
- **Authentication:** [NextAuth.js v5](https://authjs.dev/) (Beta) with Prisma adapter.
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with native CSS variables.
- **AI Integration:** [Hugging Face Inference](https://huggingface.co/inference) (DeepSeek/Whisper models), with extensibility for Gemini, OpenAI, and Groq.
- **Icons & UI:** [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/).
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) and [Yup](https://github.com/jquense/yup).
- **Maps:** [Leaflet](https://leafletjs.com/) via [React Leaflet](https://react-leaflet.js.org/).
- **Infrastructure:** [Docker Compose](https://docs.docker.com/compose/) for local development (DB), [Kubernetes](https://kubernetes.io/) manifests in `k8s/`.

## 3. File Structure

- `src/app/`: Core application logic (App Router).
  - `(routes)/`: Page groups for organized routing (e.g., auth, athletes, results).
  - `api/`: Backend API route handlers (e.g., `/api/ai/extract`).
  - `components/`: Domain-specific components (Athletes, Events, Results, Timeline).
  - `lib/`: Shared utilities and core business logic.
     - `service/`: Service layer classes (e.g., `AIService.ts` for model factory).
     - `actions/`: Next.js Server Actions for secure database mutations.
     - `prisma.ts`: Central Prisma client instance.
     - `definitions.ts`: Primary TypeScript interfaces and types.
  - `ui/`: Design system (Atomic components: Button, Input, Modal, Select, etc.).
- `prisma/`: Database schema (`schema.prisma`) and extensive seed scripts (`seed.ts`).
- `k8s/`: Infrastructure-as-code for production/staging deployments.

## 4. Implementation Patterns

- **AI Service Factory:** All AI interactions (extraction, transcription) must flow through `src/app/lib/service/AIService.ts`. This ensures provider abstraction and consistent prompting across the app.
- **Server Actions for Mutations:** Always use Server Actions in `src/app/lib/actions` for any database writes to maintain security and type safety.
- **Atomic UI System:** Build new features using the primitives in `src/app/ui`. Avoid writing custom CSS or ad-hoc Tailwind classes if a UI component exists.
- **Prisma Client:** Never instantiate `PrismaClient` directly in components or actions; always import from `src/app/lib/prisma.ts`.
- **Strict Typing:** 
  - Centralize domain types in `src/app/lib/definitions.ts`.
  - Use Zod schemas for form validation and API request parsing.
  - **No `any` Policy**: Use specific types or generics to maintain robustness.
- **AI-Driven Data Entry:** Leverage the `AiFormPopulator` pattern to allow users to extract structured data from unstructured text or audio.

## 5. Efficiency Suggestions for AI Agent

- **Prisma First:** Before proposing schema changes or complex queries, always read `prisma/schema.prisma`.
- **Reuse Services:** Check if logic exists in `AIService` or other `lib/service` files before re-implementing.
- **UI Consistency:** Before creating a new UI element, check if a suitable primitive exists in `src/app/ui`.
- **Seeding:** When modifying the database structure, update `prisma/seed.ts` to ensure local environments remain consistent.
- **Android Integration:** Note that the backend is evolving to support an Android mobile application; keep API routes generic where possible.

> [!IMPORTANT]
> Always read this file at the start of every session. Ensure all code suggestions adhere to the tech stack and architecture defined here.
