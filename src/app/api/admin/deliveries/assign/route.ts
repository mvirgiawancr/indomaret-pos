import { NextRequest, NextResponse } from "next/server";
import { db, pengiriman } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { pengirimanId, kurirId } = body;

        if (!pengirimanId || !kurirId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await db
            .update(pengiriman)
            .set({
                kurirId: kurirId,
                updatedAt: new Date()
            })
            .where(eq(pengiriman.id, pengirimanId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error assigning courier:", error);
        return NextResponse.json({ error: "Failed to assign courier" }, { status: 500 });
    }
}
