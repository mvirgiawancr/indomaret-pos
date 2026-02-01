# Indomaret POS Application 🏪

Sistem Informasi Point of Sale (POS) dan Manajemen Pengiriman berbasis Web untuk Indomaret. Aplikasi ini dirancang untuk memudahkan pengelolaan pesanan, stok produk, dan pelacakan pengiriman kurir secara real-time.

![Indomaret POS Banner](https://upload.wikimedia.org/wikipedia/commons/9/9d/Logo_Indomaret.png)

## 🚀 Fitur Utama

### 🛒 Pengguna (Pelanggan)
*   **Katalog Produk**: Menjelajahi produk dengan kategori dan pencarian.
*   **Keranjang Belanja**: Menambahkan produk ke keranjang dan checkout.
*   **Manajemen Pesanan**: Melacak status pesanan (Menunggu, Diproses, Dikirim, Selesai).
*   **Riwayat Transaksi**: Melihat history belanja lengkap.

### 👨‍💼 Admin (Manajemen)
*   **Dashboard Statistik**: Ringkasan penjualan, total pesanan, dan produk terlaris.
*   **Manajemen Produk**: Tambah, edit, hapus, dan atur stok produk.
*   **Manajemen Pesanan**: Verifikasi pembayaran dan memproses pesanan masuk.
*   **Manajemen Kurir**: Menugaskan pengiriman ke kurir yang tersedia.

### 🛵 Kurir (Pengiriman)
*   **Dashboard Pengiriman**: Melihat daftar tugas pengiriman "Hari Ini".
*   **Detail Pengiriman**: Informasi lengkap alamat pelanggan dan barang yang harus diantar.
*   **Update Status**: Update status pengiriman (Diambil, Dalam Perjalanan, Terkirim) dengan sekali klik.

---

## 🛠️ Teknologi yang Digunakan

Build with modern web technologies for performance and scalability:

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/) / Supabase)
*   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
*   **Authentication**: [Better Auth](https://www.better-auth.com/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Deployment**: Vercel

---

## 📂 Project Structure

```bash
indomaret-pos/
├── src/
│   ├── app/                    # App Router (Pages & Layouts)
│   │   ├── (auth)/             # Authentication Routes (Login/Register)
│   │   ├── (main)/             # Public Routes (Home, Product, Cart)
│   │   ├── admin/              # Admin Dashboard (Orders, Products, Users)
│   │   ├── kurir/              # Kurir Dashboard (Deliveries)
│   │   └── api/                # API Routes (Backend Logic)
│   ├── components/             # Reusable UI Components
│   ├── lib/                    # Utilities & Configurations (DB, Auth)
│   └── types/                  # TypeScript Definitions
├── public/                     # Static Assets (Images, Icons)
├── drizzle.config.ts           # Drizzle ORM Config
└── package.json                # Project Dependencies
```

---

## 📦 Instalasi & Cara Menjalankan

Ikuti langkah-langkah berikut untuk menjalankan project di lokal komputer Anda:

1.  **Clone Repository**
    ```bash
    git clone https://github.com/mvirgiawancr/indomaret-pos.git
    cd indomaret-pos
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Buat file `.env` di root folder dan isi konfigurasi berikut (sesuaikan dengan kredensial Anda):
    ```env
    DATABASE_URL="postgresql://user:password@host:port/dbname"
    BETTER_AUTH_SECRET="your_generated_secret_key"
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```

4.  **Push Database Schema**
    ```bash
    npm run db:push
    ```

5.  **Jalankan Development Server**
    ```bash
    npm run dev
    ```

    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 👤 Author

**Moch Virgiawan Caesar Ridollohi**

*   GitHub: [@mvirgiawancr](https://github.com/mvirgiawancr)
