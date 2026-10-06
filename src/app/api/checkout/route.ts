import { prisma } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";
import { capture } from "@/lib/payments";
import { orderTotal } from "@/lib/pricing";
import { getSession } from "@/lib/session";
import { checkoutSchema } from "@/lib/validation";

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return new Response("Unauthorized", { status: 401 });
    const parsed = checkoutSchema.safeParse(await req.json());
    if (!parsed.success) return Response.json({ error: "Invalid cart" }, { status: 400 });
    const { items } = parsed.data;

    const products = await prisma.product.findMany({
        where: { id: { in: items.map(i => i.productId) }, storeId: session.storeId, active: true }
    });
    if (products.length !== new Set(items.map(i => i.productId)).size) return Response.json({ error: "Unknown product" }, { status: 400 });
    const lines = items.map(i => ({ ...i, priceCents: products.find(p => p.id === i.productId)!.priceCents }));
    const total = orderTotal(lines);

    const order = await prisma.order.create({
        data: {
            storeId: session.storeId,
            userId: session.userId,
            totalCents: total,
            items: { create: lines.map(l => ({ productId: l.productId, quantity: l.quantity, priceCents: l.priceCents })) }
        }
    });
    for (const line of lines) {
        await prisma.product.update({
            where: { id: line.productId },
            data: { stock: { decrement: line.quantity }, sold: { increment: line.quantity } }
        });
    }
    const charge = await capture(order.id, total);
    await prisma.order.update({ where: { id: order.id }, data: { status: "paid", paymentId: charge.id } });

    sendOrderConfirmation(session.email, order.id);
    return Response.json({ orderId: order.id });
}
