import { NextRequest, NextResponse } from "next/server";
import { db, produk } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await db
            .select()
            .from(produk)
            .where(eq(produk.id, parseInt(id)));

        if (!product || product.length === 0) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product[0]);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await db.delete(produk).where(eq(produk.id, parseInt(id)));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        await db
            .update(produk)
            .set({
                nama: body.nama,
                harga: body.harga,
                stok: body.stok,
                deskripsi: body.deskripsi,
                gambar: body.gambar,
            })
            .where(eq(produk.id, parseInt(id)));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}
