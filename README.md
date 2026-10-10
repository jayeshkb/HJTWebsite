# Hindu-Jain Temple

The Hindu-Jain Temple website is a Next.js App Router application designed for Vercel, PostgreSQL, and replaceable email, payment, and object-storage providers.

## Local Development

Requirements: Node.js 22 or later, npm, and a PostgreSQL database. A managed Neon development database or local PostgreSQL can be used.

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set the database URLs and a unique Better Auth secret.
3. Generate Prisma Client with `npm run db:generate`.
4. Apply local migrations with `npm run db:migrate`.
5. Start the site with `npm run dev`.

For local development, set `DATABASE_URL` to the application connection and `DIRECT_URL` to the direct database connection. Neon deployments should use its pooled connection for `DATABASE_URL` and the unpooled connection for `DIRECT_URL`. Prisma scripts load `.env.local`; Next.js also reads it automatically.

Generate a local auth secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`. Keep `.env.local` private and never use `NEXT_PUBLIC_` for secrets.

## Database

The schema and migrations are in `prisma/`. Use `npm run db:deploy` in a controlled deployment step with `DATABASE_URL` and `DIRECT_URL` supplied by the deployment environment. Do not depend on the Vercel build filesystem or run schema migrations against production from a developer machine without authorization.

Development seed data is deliberately labeled `DEMO:` and requires both `NODE_ENV=development` and `ALLOW_DEMO_SEED=true`. It is skipped by default; production seeding creates only role definitions. On PowerShell, opt into demo data explicitly:

```powershell
$env:NODE_ENV = "development"
$env:ALLOW_DEMO_SEED = "true"
npm run db:seed:local
```

The seed does not create administrator accounts or payment records. For deployment environments with injected variables, use `npm run db:seed`; it creates role definitions and skips demo content unless the development-only guard passes.

## Authentication and Providers

Administrator credentials and sessions are handled by Better Auth and PostgreSQL. Public sign-up is disabled. Two-factor support is configured for TOTP; administrator enrollment and account invitation workflows must be completed before production access is enabled. All admin data operations must use server-side permission checks from `src/lib/auth/permissions.ts`.

PayPal, email delivery, and object storage are represented by provider interfaces under `src/lib/`. Their production adapters require the corresponding environment variables from `.env.example`; no payment, email, or upload credentials are needed to build the public site.

## Checks

- `npm run lint`
- `npm run build` (requires `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `DATABASE_URL`, and `DIRECT_URL` in the environment)
- `npm run db:generate`
- `npm run db:migrate`

The app uses Webpack for local Next.js commands because the native Turbopack binding is unavailable in the current Windows environment.