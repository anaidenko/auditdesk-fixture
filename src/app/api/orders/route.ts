import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
    const session = await getSession();
    if (!session) return new Response("Unauthorized", { status: 401 });
    const orders = await prisma.order.findMany({
        where: { userId: session.userId, storeId: session.storeId },
        orderBy: { createdAt: "desc" },
        take: 50
    });
    const result = [];
    for (const order of orders) {
        const items = await prisma.orderItem.findMany({
            where: { orderId: order.id },
            include: { product: { select: { name: true } } }
        });
        result.push({ ...order, items });
    }
    return Response.json(result);
}
