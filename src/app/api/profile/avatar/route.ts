import { z } from "zod";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

const body = z.object({ url: z.string().url() });

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return new Response("Unauthorized", { status: 401 });
    const parsed = body.safeParse(await req.json());
    if (!parsed.success) return Response.json({ error: "Give an image URL" }, { status: 400 });

    const res = await fetch(parsed.data.url, { signal: AbortSignal.timeout(5_000) });
    if (!res.ok || !res.headers.get("content-type")?.startsWith("image/")) {
        return Response.json({ error: "That URL is not an image" }, { status: 400 });
    }
    const size = Number(res.headers.get("content-length"));
    if (!size || size > 2 * 1024 * 1024) return Response.json({ error: "Images up to 2 MB" }, { status: 400 });
    const bytes = Buffer.from(await res.arrayBuffer());
    await prisma.user.update({ where: { id: session.userId }, data: { avatar: bytes } });
    return Response.json({ ok: true });
}
