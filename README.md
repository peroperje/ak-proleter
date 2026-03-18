# AK Proleter: AI-Powered Athlete Management Platform

<div align="center">
  <p><em>Elevating athletic performance through intelligent tracking and automation.</em></p>
</div>

[![Tech Stack](https://img.shields.io/badge/Stack-Next.js_|_Prisma_|_PostgreSQL_|_Tailwind-blue.svg)](https://github.com/peroperje/ak-proleter)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![Node](https://img.shields.io/badge/Node-18+-green.svg)](https://nodejs.org/)

AK Proleter is a comprehensive sports club management platform designed for the Athletics Club Proleter Zrenjanin. It streamlines athlete tracking, competition management, and results analysis through a modern, AI-enhanced interface.

---

## 📖 Table of Contents

- [✨ Key Features](#-key-features)
- [🏗️ Repository Structure](#️-repository-structure)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [🔐 Authentication & RBAC](#-authentication--rbac)
- [🚢 Kubernetes Deployment](#-kubernetes-deployment)
- [🛠️ Development Tools](#-development-tools)
- [🎯 Future Enhancements](#-future-enhancements)
- [📄 License](#-license)

---

## ✨ Key Features

- **🤖 AI-Driven Automation**: Intelligent data extraction from unstructured text and audio (DeepSeek/Whisper) to automate form population.
- **🏃 Athlete Lifecycle Management**: Comprehensive tracking of profiles, categories, and personal progression.
- **📅 Smart Event Management**: Centralized hub for competitions, training camps, and club gatherings.
- **📊 Performance Analytics**: Record and analyze athlete results with interactive visualizations.
- **📱 Activities & Engagement**: A chronological activity feed with results tracking, likes, and comments.
- **🛡️ Secure Access Control**: Granular Role-Based Access Control (RBAC) powered by NextAuth.js v5.

---

## 🏗️ Repository Structure

| Path                  | Purpose                                            | Type        |
| :-------------------- | :------------------------------------------------- | :---------- |
| `src/app/`            | Core application logic (App Router).               | Next.js     |
| `src/app/(routes)`    | Organized page groups (auth, athletes, results).   | Next.js     |
| `src/app/api/`        | Backend API routes for AI & data services.         | Next.js API |
| `src/app/components/` | Domain-specific components (Timeline, Athletes).   | React       |
| `src/app/ui/`         | Atomic design system (Buttons, Modals, Inputs).    | React       |
| `src/app/lib/`        | Shared utilities, services, and server actions.    | TypeScript  |
| `prisma/`             | Database schema and production-grade seed scripts. | Prisma      |
| `k8s/`                | K8s manifests for production & staging.            | YAML        |

---

## 🛠️ Tech Stack

### Frontend & UI

- **Framework**: Next.js 16 (App Router) + React 19.
- **Styling**: Tailwind CSS 4 with native CSS variables.
- **Components**: Atomic UI design system with Lucide React icons.
- **Maps**: Leaflet for event location tracking.

### Backend & AI

- **Logic**: Next.js Server Actions & API Routes.
- **AI Integration**: Hugging Face Inference (DeepSeek/Whisper) with an extensible service factory.
- **Database**: PostgreSQL with Prisma ORM.

### Infrastructure

- **Development**: Docker Compose (Local DB).
- **Production**: Kubernetes (K8s) for scalable orchestration.

---

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js**: 18.17+
- **pnpm**: Recommended package manager.
- **Docker**: For local database orchestration.

### 2. Installation & Setup

```bash
# Clone and install dependencies
git clone https://github.com/peroperje/ak-proleter.git
cd ak-proleter
pnpm install

# Start local database
pnpm db:start

# Prep database
pnpm prisma:generate
pnpm db:seed         # Seed with initial data models
```

### 3. Execution

```bash
pnpm dev             # Start development server at localhost:3000
pnpm storybook        # Run component documentation
```

---

## 🔐 Authentication & RBAC

The platform utilizes **Auth.js v5 (NextAuth.js)** for secure session management and role-based routing.

- **Middleware Enforcement**: Global route interception handled in `src/proxy.ts`.
- **RBAC Rules**: Logic centralized in `src/auth.config.ts`.
- **Default Roles**: `USER` (View access) and `ADMIN` (Full management).

---

## 🚢 Kubernetes Deployment

AK Proleter is production-ready with optimized Docker images and K8s manifests.

1. **Build Production Image**: `docker build -t ak-proleter-app:latest -f Dockerfile .`
2. **Apply Secrets**: Configure `k8s/app-config.yaml` and apply via `kubectl`.
3. **Deploy Stack**:
   ```bash
   kubectl apply -f k8s/postgres-pvc.yaml
   kubectl apply -f k8s/postgres-deployment.yaml
   kubectl apply -f k8s/migration-job.yaml
   kubectl apply -f k8s/app-deployment.yaml
   ```

---

## 🛠️ Development Tools

- **Storybook**: Interactive component development. Run `pnpm storybook`.
- **Prisma Studio**: Visual database explorer. Run `pnpm prisma:studio`.
- **Structure**: All domain types are centralized in `src/app/lib/definitions.ts`.

---

## 🎯 Future Enhancements

- 📁 Cloud-based document storage for athlete certifications.
- 📈 Advanced performance progression charts.
- 📱 Dedicated Android application for on-field coach access.
- 🔔 Real-time push notifications for event updates.

---

## 📄 License

This project is licensed under the **MIT License**. Built with ❤️ for Athletic Club Proleter Zrenjanin.
