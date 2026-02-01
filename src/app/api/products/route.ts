import { NextRequest, NextResponse } from "next/server";
import { db, produk } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

// GET - Get all products or search
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get("featured");
        const limit = parseInt(searchParams.get("limit") || "50");

        let products;

        if (featured === "true") {
            products = await db
                .select()
                .from(produk)
                .orderBy(desc(produk.createdAt))
                .limit(limit);
        } else {
            products = await db
                .select()
                .from(produk)
                .orderBy(desc(produk.createdAt));
        }

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

// POST - Create a new product (admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nama, harga, stok, deskripsi, gambar } = body;

        if (!nama || !harga) {
            return NextResponse.json({ error: "nama and harga are required" }, { status: 400 });
        }

        const [product] = await db
            .insert(produk)
            .values({
                nama,
                harga: parseInt(harga),
                stok: parseInt(stok) || 0,
                deskripsi: deskripsi || null,
                gambar: gambar || null,
            })
            .returning();

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
