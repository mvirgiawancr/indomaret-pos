import { NextRequest, NextResponse } from "next/server";
import { db, pengiriman } from "@/lib/db";
import { count, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Get pending deliveries (waiting to be picked up)
        const pendingResult = await db
            .select({ count: count() })
            .from(pengiriman)
            .where(sql`${pengiriman.kurirId} = ${userId} AND ${pengiriman.status} = 'menunggu'`);

        // Get in-progress deliveries
        const inProgressResult = await db
            .select({ count: count() })
            .from(pengiriman)
            .where(sql`${pengiriman.kurirId} = ${userId} AND ${pengiriman.status} IN ('diambil', 'dalam_perjalanan')`);

        // Get completed deliveries
        const completedResult = await db
            .select({ count: count() })
            .from(pengiriman)
            .where(sql`${pengiriman.kurirId} = ${userId} AND ${pengiriman.status} = 'terkirim'`);

        // Get today's deliveries
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayResult = await db
            .select({ count: count() })
            .from(pengiriman)
            .where(sql`${pengiriman.kurirId} = ${userId} AND ${pengiriman.tanggalTerkirim} >= ${today.toISOString()}`);

        return NextResponse.json({
            pending: pendingResult[0]?.count || 0,
            inProgress: inProgressResult[0]?.count || 0,
            completed: completedResult[0]?.count || 0,
            todayDeliveries: todayResult[0]?.count || 0,
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
