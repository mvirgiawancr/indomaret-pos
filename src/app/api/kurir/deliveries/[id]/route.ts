import { NextRequest, NextResponse } from "next/server";
import { db, pengiriman, pesanan, pembayaran } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PUT(
    request: NextRequest,
    params: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params.params;
        const body = await request.json();
        const { status } = body;

        const updateData: Record<string, any> = { status };

        // Set dates based on status
        if (status === "diambil" || status === "dalam_perjalanan") {
            updateData.tanggalDikirim = new Date();
        }
        if (status === "terkirim") {
            updateData.tanggalTerkirim = new Date();
        }

        // 1. Update Pengiriman Status
        await db
            .update(pengiriman)
            .set(updateData)
            .where(eq(pengiriman.id, parseInt(id)));

        // 2. If delivered, update Order and Payment status
        if (status === "terkirim") {
            // Get delivery info to find order ID
            const delivery = await db.query.pengiriman.findFirst({
                where: eq(pengiriman.id, parseInt(id)),
                with: {
                    pesanan: {
                        with: {
                            pembayaran: true
                        }
                    }
                }
            });

            if (delivery && delivery.pesanan) {
                // Update Order Status to 'selesai'
                await db
                    .update(pesanan)
                    .set({ status: 'selesai', updatedAt: new Date() })
                    .where(eq(pesanan.id, delivery.pesananId));

                // Update Payment Status if COD
                // Assuming COD payments are initially 'pending'
                if (delivery.pesanan.pembayaran?.metodePembayaran === 'cod') {
                    await db
                        .update(pembayaran)
                        .set({ status: 'berhasil', updatedAt: new Date() })
                        .where(eq(pembayaran.pesananId, delivery.pesananId));
                }
            }
        }
        // 3. For 'diambil'/'dalam_perjalanan', maybe update Order status to 'dikirim'?
        else if (status === "dalam_perjalanan") {
            const delivery = await db.query.pengiriman.findFirst({
                where: eq(pengiriman.id, parseInt(id)),
            });
            if (delivery) {
                await db
                    .update(pesanan)
                    .set({ status: 'dikirim', updatedAt: new Date() })
                    .where(eq(pesanan.id, delivery.pesananId));
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating delivery:", error);
        return NextResponse.json({ error: "Failed to update delivery" }, { status: 500 });
    }
}
