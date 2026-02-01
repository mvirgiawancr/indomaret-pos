import { NextRequest, NextResponse } from "next/server";
import { db, pesanan, detailPesanan, pembayaran, pengiriman, produk } from "@/lib/db";
import { eq, desc, sql } from "drizzle-orm";

// GET - Get orders for a user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        const orders = await db
            .select()
            .from(pesanan)
            .where(eq(pesanan.userId, userId))
            .orderBy(desc(pesanan.createdAt));

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

// POST - Create a new order
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, items, totalHarga, alamatPengiriman, catatan, metodePembayaran } = body;

        if (!userId || !items || !totalHarga || !alamatPengiriman) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Generate order number
        const nomorPesanan = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create order
        const [order] = await db
            .insert(pesanan)
            .values({
                nomorPesanan,
                userId,
                totalHarga,
                alamatPengiriman,
                catatan: catatan || null,
                status: "menunggu",
            })
            .returning();

        // Create order details and update stock
        for (const item of items) {
            // Create detail record
            await db.insert(detailPesanan).values({
                pesananId: order.id,
                produkId: item.produkId,
                jumlah: item.jumlah,
                harga: item.harga,
            });

            // Decrease product stock
            await db
                .update(produk)
                .set({
                    stok: sql`${produk.stok} - ${item.jumlah}`
                })
                .where(eq(produk.id, item.produkId));
        }

        // Create payment record
        await db.insert(pembayaran).values({
            pesananId: order.id,
            metodePembayaran,
            jumlah: totalHarga,
            status: "pending",
        });

        // Create delivery record
        await db.insert(pengiriman).values({
            pesananId: order.id,
            status: "menunggu",
        });

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
