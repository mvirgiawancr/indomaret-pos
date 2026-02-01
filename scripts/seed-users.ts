/**
 * Seed Script for Admin and Kurir Users
 * 
 * Run this script to create admin and kurir users in the database.
 * 
 * Usage:
 * 1. First register a normal user via the website
 * 2. Then run: npx tsx scripts/seed-users.ts
 * 
 * Or manually update the user role in the database:
 * 
 * UPDATE "user" SET role = 'admin' WHERE email = 'admin@indomaret.com';
 * UPDATE "user" SET role = 'kurir' WHERE email = 'kurir@indomaret.com';
 */

console.log(`
==============================================
PANDUAN SETUP USER ADMIN DAN KURIR
==============================================

Karena Better Auth mengelola user secara khusus,
cara termudah adalah:

1. REGISTER user baru via website:
   - Admin: admin@indomaret.com (password: admin123)
   - Kurir: kurir@indomaret.com (password: kurir123)

2. JALANKAN SQL di Drizzle Studio atau Neon Console:

   -- Jadikan admin
   UPDATE "user" SET role = 'admin' WHERE email = 'admin@indomaret.com';

   -- Jadikan kurir  
   UPDATE "user" SET role = 'kurir' WHERE email = 'kurir@indomaret.com';

3. SELESAI! User sudah bisa login dengan role masing-masing.

==============================================
DEFAULT CREDENTIALS
==============================================

Admin:
  Email: admin@indomaret.com
  Password: admin123
  
Kurir:
  Email: kurir@indomaret.com
  Password: kurir123
  
Pengguna (contoh):
  Email: user@example.com
  Password: user1234

==============================================
`);
