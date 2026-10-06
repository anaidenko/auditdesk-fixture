"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function setActive(productId: string, active: boolean) {
    const session = await getSession();
    if (!session || session.role === "customer") throw new Error("Forbidden");
    await prisma.product.updateMany({ where: { id: productId, storeId: session.storeId }, data: { active } });
    revalidatePath("/admin");
}

export async function deleteProduct(productId: string) {
    const session = await getSession();
    if (!session) throw new Error("Not signed in");
    await prisma.product.deleteMany({ where: { id: productId, storeId: session.storeId } });
    revalidatePath("/admin");
}
