import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export interface Session {
    userId: string;
    storeId: string;
    email: string;
    role: "customer" | "staff" | "admin";
}

function key(): Uint8Array {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");
    return new TextEncoder().encode(secret);
}

export async function createSession(session: Session): Promise<void> {
    const token = await new SignJWT({ ...session }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key());
    (await cookies()).set("session", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export async function getSession(): Promise<Session | null> {
    const token = (await cookies()).get("session")?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
        return payload as unknown as Session;
    } catch {
        return null;
    }
}
