# FAQ Templates - Productionized Starter

This version includes:
- Prisma schema (Postgres)
- NextAuth credentials provider (DB-backed)
- Stripe checkout + webhook handler
- S3 upload helper
- Save project API route
- Admin seed script

## Quick deploy checklist
1. Create Postgres DB (Supabase recommended). Set DATABASE_URL.
2. Fill .env file using .env.example.
3. Install dependencies: `npm install`
4. Generate Prisma client: `npx prisma generate`
5. Run migrations (production): `npx prisma migrate deploy`
   Or for local dev: `npx prisma db push`
6. Seed admin: `node scripts/seed-admin.js admin@you.com StrongPass123`
7. Start dev: `npm run dev`

## Notes & next steps
- Update Upload API to use secure authentication (only admin can create templates).
- Add CSRF and role middleware for admin pages.
- Implement full editor save/load/export functionality (the project includes the core pieces).
- Configure Stripe webhook endpoint and add key to env.
- Use Vercel (or Render) for hosting, make sure to add environment variables in the project settings.

