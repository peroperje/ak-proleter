# AK Proleter - Athlete Tracking Application

A Next.js application for tracking athlete results and performance for Athletic Club Proleter Zrenjanin.

## Features

- **Athlete Management**: Track athlete profiles, personal information, and categories
- **Event Management**: Manage competitions, training camps, and other events
- **Results Tracking**: Record and analyze athlete performance results
- **Training Management**: Plan and track training sessions and exercises
- **Coach Management**: Manage coach profiles and assignments
- **Reports**: Generate reports and analytics on athlete performance
- **Activity Feed (Timeline)**: Track project events and athlete results chronologically with likes and comments
- **Authentication**: Role-based access control (RBAC) powered by NextAuth.js


## Authentication & Role-Based Access Control (RBAC)

The application uses **Auth.js v5 (NextAuth.js)** for secure authentication and a centralized authorization system managed via `src/auth.config.ts` and `src/proxy.ts`.

### Access Levels

| Route Pattern | Access Level | Description |
| :--- | :--- | :--- |
| `/login`, `/register` | **Public** | Accessible to everyone. Redirects to `/` if already logged in. |
| `/`, `/athletes/[id]`, `/events/[id]`, `/results/[id]` | **Private (All Roles)** | Requires an active session. |
| `/athletes`, `/events`, `/results` | **Admin Only** | Requires `ADMIN` role. |
| `/athletes/new`, `/events/new`, `/results/new` | **Admin Only** | Requires `ADMIN` role. |
| `**/edit` | **Admin Only** | Requires `ADMIN` role. |

### Technical Implementation

- **Middleware/Proxy**: `src/proxy.ts` handles global route interception.
- **Rules Engine**: `src/auth.config.ts` contains the logic for determining access based on the user's role and the requested path.
- **Session Management**: Roles are persisted in the JWT token and synchronized with the database session.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with Storybook
- **Authentication**: [Auth.js v5 (NextAuth.js)](https://authjs.dev/) with Prisma Adapter
- **Database**: PostgreSQL with Prisma ORM
- **API**: Next.js API routes

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm
- Docker and Docker Compose (for local database)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ak-proleter.git
   cd ak-proleter
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the local database:

   ```bash
   pnpm db:start
   ```

4. Generate Prisma Client:

    ```bash
    pnpm prisma:generate
    ```

5. Seed the database (optional, for initial data):

    ```bash
    pnpm db:seed
    ```

6. Run the development server:

   ```bash
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

8. (Optional) Use Prisma Studio to view and edit the database:

   ```bash
   pnpm prisma:studio
   ```

   This will open Prisma Studio at [http://localhost:5555](http://localhost:5555)

For more details on database setup and configuration, see the [Database Documentation](./prisma/README.md).

## Kubernetes Deployment

The application is containerized and ready for deployment on Kubernetes. All configuration files are located in the `k8s/` directory.

### 1. Build Docker Images

First, build the Docker images for the application.

**For Production:**
```bash
docker build -t ak-proleter-app:latest -f Dockerfile .
```

**For Development (runs `pnpm dev` inside container):**
```bash
docker build -t ak-proleter-app:dev -f Dockerfile.dev .
```

### 2. Configure Secrets

Update `k8s/app-config.yaml` with your database connection string and other secrets. Then apply it:

```bash
kubectl apply -f k8s/app-config.yaml
```

### 3. Deploy Database

The deployment includes a PostgreSQL setup. If you already have a PostgreSQL instance, you can skip this and update the `DATABASE_URL` in `app-config.yaml`.

```bash
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
```

### 4. Run Database Migrations and Seeding

Use the migration job to run Prisma migrations and seed the database:

```bash
kubectl apply -f k8s/migration-job.yaml
```

*Note: You may need to delete and re-create this job (`kubectl delete job ak-proleter-migration-v1`) if you need to run it again.*

### 5. Deploy the Application

**For Production:**
```bash
kubectl apply -f k8s/app-deployment.yaml
```

**For Development/Testing:**
```bash
kubectl apply -f k8s/app-dev-deployment.yaml
```

### Accessing the Application

The services are configured as `LoadBalancer`. On local environments like Minikube, you might need to run `minikube tunnel` or use:

```bash
minikube service ak-proleter-service
```
or for dev:
```bash
minikube service ak-proleter-dev-service
```

## Project Structure

- `src/app`: Main application code (Next.js App Router)
  - `api`: API routes for data fetching
  - `components`: Shared React components
  - `lib`: Utility functions and type definitions
  - `ui`: UI components (buttons, inputs, etc.)
  - `views`: Page-specific components
  - `(routes)`: Page components for each route
- `prisma`: Database configuration and Prisma ORM setup

## Demo Accounts

For testing purposes, the following demo accounts are available:

- **Admin**: admin@akproleter.rs / admin123
- **Coach**: coach@akproleter.rs / coach123
- **Athlete**: marko.petrovic@example.com / athlete123
- **Viewer**: viewer@akproleter.rs / viewer123

## Development

### Storybook

This project uses Storybook for component development and testing:

```bash
pnpm storybook
```

### Building for Production

```bash
pnpm build
```

## Future Enhancements

- File uploads for athlete photos and documents
- Advanced analytics and visualization
- Mobile application
- Email notifications
- Calendar integration
- Prisma schema development for data models

## License

This project is licensed under the MIT License.
