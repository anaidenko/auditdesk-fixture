"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { refund, refundCents } from "@/lib/payments";
import { getSession } from "@/lib/session";

export async function setActive(productId: string, active: boolean) {
    const session = await getSession();
    if (!session || session.role === "customer") throw new Error("Forbidden");
    await prisma.product.updateMany({ where: { id: productId, storeId: session.storeId }, data: { active } });
    revalidatePath("/admin");
}

export async function refundOrder(orderId: string, returnedCents: number) {
    const session = await getSession();
    if (!session || session.role === "customer") throw new Error("Forbidden");
    const order = await prisma.order.findFirst({ where: { id: orderId, storeId: session.storeId, status: { in: ["paid", "shipped"] } } });
    if (!order?.paymentId) throw new Error("No paid order to refund");
    const days = Math.floor((Date.now() - order.createdAt.getTime()) / (24 * 60 * 60 * 1000));
    const amount = refundCents(order.totalCents, returnedCents, days);
    if (amount <= 0) throw new Error("Nothing to refund for this order");
    await refund(order.paymentId, amount);
    await prisma.order.update({ where: { id: order.id }, data: { status: "refunded" } });
    revalidatePath("/admin");
}

export async function deleteProduct(productId: string) {
    const session = await getSession();
    if (!session) throw new Error("Not signed in");
    await prisma.product.deleteMany({ where: { id: productId, storeId: session.storeId } });
    revalidatePath("/admin");
}
