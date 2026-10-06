import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return new Response("Unauthorized", { status: 401 });
    const { id } = await params;
    const order = await prisma.order.findFirst({
        where: { id, storeId: session.storeId },
        include: { items: { include: { product: { select: { name: true } } } } }
    });
    if (!order) return new Response("Not found", { status: 404 });
    return Response.json(order);
}
