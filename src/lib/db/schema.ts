import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const statusPesananEnum = pgEnum("status_pesanan", ["menunggu", "diproses", "dikirim", "selesai", "dibatalkan"]);
export const statusPembayaranEnum = pgEnum("status_pembayaran", ["pending", "berhasil", "gagal"]);
export const statusPengirimanEnum = pgEnum("status_pengiriman", ["menunggu", "diambil", "dalam_perjalanan", "terkirim"]);

// =====================
// PRODUK TABLE
// =====================
export const produk = pgTable("produk", {
    id: serial("id").primaryKey(),
    nama: text("nama").notNull(),
    harga: integer("harga").notNull(),
    stok: integer("stok").notNull().default(0),
    deskripsi: text("deskripsi"),
    gambar: text("gambar"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// =====================
// PESANAN TABLE
// =====================
export const pesanan = pgTable("pesanan", {
    id: serial("id").primaryKey(),
    nomorPesanan: text("nomor_pesanan").notNull().unique(),
    userId: text("user_id").notNull(), // References Better Auth user table
    totalHarga: integer("total_harga").notNull(),
    status: statusPesananEnum("status").default("menunggu").notNull(),
    alamatPengiriman: text("alamat_pengiriman").notNull(),
    catatan: text("catatan"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// =====================
// DETAIL PESANAN TABLE
// =====================
export const detailPesanan = pgTable("detail_pesanan", {
    id: serial("id").primaryKey(),
    pesananId: integer("pesanan_id").notNull(),
    produkId: integer("produk_id").notNull(),
    jumlah: integer("jumlah").notNull(),
    harga: integer("harga").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// =====================
// PEMBAYARAN TABLE
// =====================
export const pembayaran = pgTable("pembayaran", {
    id: serial("id").primaryKey(),
    pesananId: integer("pesanan_id").notNull(),
    metodePembayaran: text("metode_pembayaran").notNull(),
    jumlah: integer("jumlah").notNull(),
    status: statusPembayaranEnum("status").default("pending").notNull(),
    buktiPembayaran: text("bukti_pembayaran"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// =====================
// PENGIRIMAN TABLE
// =====================
export const pengiriman = pgTable("pengiriman", {
    id: serial("id").primaryKey(),
    pesananId: integer("pesanan_id").notNull(),
    kurirId: text("kurir_id"), // References Better Auth user table
    status: statusPengirimanEnum("status").default("menunggu").notNull(),
    tanggalDikirim: timestamp("tanggal_dikirim"),
    tanggalTerkirim: timestamp("tanggal_terkirim"),
    buktiPengiriman: text("bukti_pengiriman"),
    catatan: text("catatan"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// =====================
// RELATIONS
// =====================
export const pesananRelations = relations(pesanan, ({ many, one }) => ({
    detailPesanan: many(detailPesanan),
    pembayaran: one(pembayaran),
    pengiriman: one(pengiriman),
}));

export const detailPesananRelations = relations(detailPesanan, ({ one }) => ({
    pesanan: one(pesanan, {
        fields: [detailPesanan.pesananId],
        references: [pesanan.id],
    }),
    produk: one(produk, {
        fields: [detailPesanan.produkId],
        references: [produk.id],
    }),
}));

export const produkRelations = relations(produk, ({ many }) => ({
    detailPesanan: many(detailPesanan),
}));

export const pembayaranRelations = relations(pembayaran, ({ one }) => ({
    pesanan: one(pesanan, {
        fields: [pembayaran.pesananId],
        references: [pesanan.id],
    }),
}));

export const pengirimanRelations = relations(pengiriman, ({ one }) => ({
    pesanan: one(pesanan, {
        fields: [pengiriman.pesananId],
        references: [pesanan.id],
    }),
}));

// =====================
// TYPE EXPORTS
// =====================
export type Produk = typeof produk.$inferSelect;
export type NewProduk = typeof produk.$inferInsert;
export type Pesanan = typeof pesanan.$inferSelect;
export type NewPesanan = typeof pesanan.$inferInsert;
export type DetailPesanan = typeof detailPesanan.$inferSelect;
export type Pembayaran = typeof pembayaran.$inferSelect;
export type Pengiriman = typeof pengiriman.$inferSelect;
