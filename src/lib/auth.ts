import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        admin({
            defaultRole: "pengguna",
        }),
    ],
    user: {
        additionalFields: {
            nama: {
                type: "string",
                required: false, // Changed to false - we use 'name' as primary
            },
            alamat: {
                type: "string",
                required: false,
            },
            no_telepon: {
                type: "string",
                required: false,
            },
            role: {
                type: "string",
                defaultValue: "pengguna",
            },
            status: {
                type: "string",
                defaultValue: "aktif",
            },
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
});

export type Session = typeof auth.$Infer.Session;

