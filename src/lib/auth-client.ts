import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    plugins: [adminClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;

// Extended session type for our custom fields
export interface ExtendedUser {
    id: string;
    email: string;
    name?: string;
    nama?: string;
    alamat?: string;
    no_telepon?: string;
    role?: "pengguna" | "admin" | "kurir";
    status?: string;
}
