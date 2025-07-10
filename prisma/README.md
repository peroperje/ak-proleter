# Database Setup with Prisma and PostgreSQL

This project uses PostgreSQL with Prisma ORM for database operations.

## Local Development Setup

### Prerequisites

- Docker and Docker Compose installed on your machine
- Node.js and npm/pnpm installed

### Starting the Database

To start the PostgreSQL database in Docker:

```bash
npm run db:start
# or
pnpm db:start
```

This will start a PostgreSQL 16 instance with the following configuration:

- Host: localhost
- Port: 5432
- Username: postgres
- Password: postgres
- Database: ak_proleter

### Stopping the Database

To stop the PostgreSQL database:

```bash
npm run db:stop
# or
pnpm db:stop
```

## Prisma Configuration

The database connection is configured in the `.env` file at the root of the project:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ak_proleter?schema=public"
```

### Generating Prisma Client

After making changes to the Prisma schema, you'll need to generate the Prisma client:

```bash
npm run prisma:generate
# or
pnpm prisma:generate
```

### Using Prisma Studio

Prisma Studio is a visual database editor that allows you to view and edit your database data:

```bash
npm run prisma:studio
# or
pnpm prisma:studio
```

This will start Prisma Studio at [http://localhost:5555](http://localhost:5555), where you can:

- Browse and edit data in all your tables
- Filter and sort data
- Create, update, and delete records
- View relationships between tables

### Migrations

To create and apply a new migration after changing the `schema.prisma` file, run the following command:

```bash
npx prisma migrate dev --name <migration_name>
```

Replace `<migration_name>` with a descriptive name for your migration (e.g., `add_user_roles`). This command will:

1.  Create a new SQL migration file in the `prisma/migrations` directory.
2.  Apply the new migration to the database.
3.  Generate the Prisma Client to reflect the schema changes.

## Production Setup

In production, the application will use PostgreSQL in Vercel. The configuration for this will be added in the future.

## Notes

- The PostgreSQL version in Docker (16) should match the version used in Vercel for production.
- The Prisma schema (`schema.prisma`) defines the data models for the application, including User, Profile, Category, Event, News, and Result models.
