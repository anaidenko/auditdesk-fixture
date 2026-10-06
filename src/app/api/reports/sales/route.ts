import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
    const session = await getSession();
    if (!session || session.role === "customer") return new Response("Forbidden", { status: 403 });
    const days = Math.min(Number(new URL(req.url).searchParams.get("days") ?? 30) || 30, 365);
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const rows = await prisma.$queryRaw<{ day: Date; revenue: bigint; orders: bigint }[]>`
        SELECT date_trunc('day', "createdAt") AS day, SUM("totalCents") AS revenue, COUNT(*) AS orders
        FROM "Order"
        WHERE status = 'paid' AND "createdAt" >= ${from}
        GROUP BY 1
        ORDER BY 1`;
    return Response.json(rows.map(r => ({ day: r.day, revenueCents: Number(r.revenue), orders: Number(r.orders) })));
}
