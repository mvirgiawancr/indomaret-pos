import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { db, produk, pesanan, pengiriman } from "@/lib/db";
import { sql, count, sum } from "drizzle-orm";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET() {
    try {
        // Get total users
        const usersResult = await pool.query('SELECT COUNT(*) as count FROM "user"');
        const totalUsers = parseInt(usersResult.rows[0].count) || 0;

        // Get total products
        const productsResult = await db.select({ count: count() }).from(produk);
        const totalProducts = productsResult[0]?.count || 0;

        // Get total orders
        const ordersResult = await db.select({ count: count() }).from(pesanan);
        const totalOrders = ordersResult[0]?.count || 0;

        // Get pending orders
        const pendingResult = await db.select({ count: count() }).from(pesanan).where(sql`${pesanan.status} = 'menunggu'`);
        const pendingOrders = pendingResult[0]?.count || 0;

        // Get total deliveries
        const deliveriesResult = await db.select({ count: count() }).from(pengiriman);
        const totalDeliveries = deliveriesResult[0]?.count || 0;

        // Get total revenue
        const revenueResult = await db.select({ total: sum(pesanan.totalHarga) }).from(pesanan).where(sql`${pesanan.status} = 'selesai'`);
        const revenue = revenueResult[0]?.total || 0;

        return NextResponse.json({
            totalUsers,
            totalProducts,
            totalOrders,
            pendingOrders,
            totalDeliveries,
            revenue,
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
