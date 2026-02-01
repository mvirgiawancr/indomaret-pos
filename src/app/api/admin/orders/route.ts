import { NextRequest, NextResponse } from "next/server";
import { db, pesanan } from "@/lib/db";
import { desc } from "drizzle-orm";

export async function GET() {
    try {
        const orders = await db
            .select()
            .from(pesanan)
            .orderBy(desc(pesanan.createdAt));

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
