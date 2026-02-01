import { NextRequest, NextResponse } from "next/server";
import { db, pengiriman } from "@/lib/db";
import { desc, eq, sql } from "drizzle-orm";
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

        // Get deliveries assigned to this kurir that are not complete
        const deliveries = await db.query.pengiriman.findMany({
            where: sql`${pengiriman.kurirId} = ${userId} AND ${pengiriman.status} != 'terkirim'`,
            orderBy: desc(pengiriman.createdAt),
            with: {
                pesanan: {
                    with: {
                        detailPesanan: {
                            with: {
                                produk: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(deliveries);
    } catch (error) {
        console.error("Error fetching deliveries:", error);
        return NextResponse.json({ error: "Failed to fetch deliveries" }, { status: 500 });
    }
}
