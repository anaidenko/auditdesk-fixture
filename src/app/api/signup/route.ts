import { randomBytes, scrypt } from "node:crypto";

import { prisma } from "@/lib/db";
import { createSession } from "@/lib/session";
import { signupSchema } from "@/lib/validation";

async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);
    const derived = await new Promise<Buffer>((resolve, reject) =>
        scrypt(password, salt, 64, { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (err, key) => (err ? reject(err) : resolve(key)))
    );
    return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export async function POST(req: Request) {
    const parsed = signupSchema.safeParse(await req.json());
    if (!parsed.success) return Response.json({ error: "Invalid sign-up details" }, { status: 400 });
    const { email, password, storeSlug } = parsed.data;
    const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
    if (!store) return Response.json({ error: "Unknown store" }, { status: 404 });
    const existing = await prisma.user.findUnique({ where: { storeId_email: { storeId: store.id, email } } });
    if (existing) return Response.json({ error: "Could not create the account" }, { status: 400 });
    const user = await prisma.user.create({ data: { storeId: store.id, email, passwordHash: await hashPassword(password) } });
    await createSession({ userId: user.id, storeId: store.id, email, role: "customer" });
    return Response.json({ ok: true });
}
