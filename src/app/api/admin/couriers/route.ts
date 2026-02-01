import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET() {
    try {
        const result = await pool.query(
            'SELECT id, name, email FROM "user" WHERE role = $1 ORDER BY name ASC',
            ['kurir']
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching couriers:", error);
        return NextResponse.json({ error: "Failed to fetch couriers" }, { status: 500 });
    }
}
