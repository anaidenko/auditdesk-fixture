import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

// Linked from the payment reminder email, sent while an order waits for its payment.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return Response.json({ ok: false, error: "Sign in to cancel an order." });
    const { id } = await params;
    const order = await prisma.order.findFirst({
        where: { id, userId: session.userId, storeId: session.storeId, status: "pending" }
    });
    if (!order) return Response.json({ ok: false, error: "This order can no longer be cancelled." });
    await prisma.$transaction([
        prisma.orderItem.deleteMany({ where: { orderId: order.id } }),
        prisma.order.delete({ where: { id: order.id } })
    ]);
    return Response.json({ ok: true });
}
