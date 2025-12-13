/*
  Seeds the database with an admin user.
  Run after prisma migrate deploy (production) or prisma db push (dev).
  Usage:
    node scripts/seed-admin.js admin@example.com StrongPass123
*/
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || 'admin@example.com';
  const pass = process.argv[3] || 'StrongPass123';
  const hashed = await bcrypt.hash(pass, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, role: 'admin' },
    create: { email, password: hashed, role: 'admin' }
  });
  console.log('Admin seeded:', user.email);
}
main().then(()=>process.exit()).catch(e=>{ console.error(e); process.exit(1); });
