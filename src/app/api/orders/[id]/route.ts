import { NextRequest, NextResponse } from "next/server";
import { db, pesanan, detailPesanan, produk, pembayaran, pengiriman } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const orderId = parseInt(id);

        // Fetch order basic info
        const order = await db
            .select()
            .from(pesanan)
            .where(eq(pesanan.id, orderId));

        if (!order || order.length === 0) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Fetch order items with product details
        const items = await db
            .select({
                id: detailPesanan.id,
                jumlah: detailPesanan.jumlah,
                harga: detailPesanan.harga,
                namaProduk: produk.nama,
                gambarProduk: produk.gambar,
            })
            .from(detailPesanan)
            .leftJoin(produk, eq(detailPesanan.produkId, produk.id))
            .where(eq(detailPesanan.pesananId, orderId));

        // Fetch payment info
        const payment = await db
            .select()
            .from(pembayaran)
            .where(eq(pembayaran.pesananId, orderId));

        // Fetch delivery info
        const delivery = await db
            .select()
            .from(pengiriman)
            .where(eq(pengiriman.pesananId, orderId));

        return NextResponse.json({
            ...order[0],
            items,
            pembayaran: payment[0] || null,
            pengiriman: delivery[0] || null,
        });

    } catch (error) {
        console.error("Error fetching order details:", error);
        return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
    }
}
