import type { NextRequest } from "next/server";

import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
    const slug = req.nextUrl.searchParams.get("store") ?? "demo";
    const store = await prisma.store.findUnique({ where: { slug } });
    if (!store) return new Response("Not found", { status: 404 });
    const products = await prisma.product.findMany({
        where: { storeId: store.id, active: true },
        select: { id: true, name: true, priceCents: true },
        orderBy: { name: "asc" }
    });
    return Response.json(products);
}
