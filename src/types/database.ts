// Database types based on class diagram
export type UserRole = 'pengguna' | 'admin' | 'kurir';

export interface User {
    id: string;
    nama: string;
    email: string;
    alamat?: string;
    no_telepon?: string;
    role: UserRole;
    status?: string;
    created_at: string;
}

export interface Produk {
    id: number;
    nama: string;
    harga: number;
    stok: number;
    deskripsi?: string | null;
    gambar?: string | null;
    created_at?: string;
}

export type PesananStatus =
    | 'menunggu_pembayaran'
    | 'sudah_dibayar'
    | 'diproses'
    | 'dalam_pengiriman'
    | 'selesai'
    | 'dibatalkan';

export interface Pesanan {
    id: number;
    user_id: string;
    total: number;
    status: PesananStatus;
    created_at: string;
    // Relations
    user?: User;
    items?: PesananProduk[];
    pembayaran?: Pembayaran;
    pengiriman?: Pengiriman;
}

export interface PesananProduk {
    id: number;
    pesanan_id: number;
    produk_id: number;
    jumlah: number;
    harga: number;
    // Relations
    produk?: Produk;
}

export type PembayaranStatus = 'pending' | 'validated' | 'rejected';

export interface Pembayaran {
    id: number;
    pesanan_id: number;
    jumlah: number;
    metode?: string;
    status: PembayaranStatus;
    bukti?: string;
    created_at: string;
}

export type PengirimanStatus = 'menunggu' | 'diterima' | 'dalam_pengiriman' | 'selesai';

export interface Pengiriman {
    id: number;
    pesanan_id: number;
    kurir_id?: string;
    status_pengiriman: PengirimanStatus;
    tanggal_kirim?: string;
    tanggal_sampai?: string;
    // Relations
    kurir?: User;
    pesanan?: Pesanan;
}

// Cart types (client-side)
export interface CartItem {
    produk: Produk;
    jumlah: number;
}
