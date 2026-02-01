import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { role, status } = body;

        if (!role || !["admin", "kurir", "pengguna"].includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        await pool.query(
            'UPDATE "user" SET role = $1, status = $2 WHERE id = $3',
            [role, status || "aktif", id]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
