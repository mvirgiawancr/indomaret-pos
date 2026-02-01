import { NextRequest, NextResponse } from "next/server";
import { db, pengiriman, pesanan } from "@/lib/db";
import { desc, eq, ne } from "drizzle-orm";

export async function GET() {
    try {
        const deliveries = await db
            .select({
                id: pengiriman.id,
                pesananId: pengiriman.pesananId,
                kurirId: pengiriman.kurirId,
                status: pengiriman.status,
                tanggalDikirim: pengiriman.tanggalDikirim,
                tanggalTerkirim: pengiriman.tanggalTerkirim,
                createdAt: pengiriman.createdAt,
            })
            .from(pengiriman)
            .innerJoin(pesanan, eq(pengiriman.pesananId, pesanan.id))
            .where(ne(pesanan.status, "dibatalkan"))
            .orderBy(desc(pengiriman.createdAt));

        return NextResponse.json(deliveries);
    } catch (error) {
        console.error("Error fetching deliveries:", error);
        return NextResponse.json({ error: "Failed to fetch deliveries" }, { status: 500 });
    }
}
