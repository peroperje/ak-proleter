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
- **Authentication**: Role-based access control for administrators, coaches, athletes, and viewers

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with Storybook
- **Authentication**: Custom JWT-based authentication
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
