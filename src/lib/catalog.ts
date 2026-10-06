import { cached } from "./cache";
import { prisma } from "./db";

export function topProducts(storeId: string) {
    return cached("top-products", 300, () =>
        prisma.product.findMany({
            where: { storeId, active: true },
            orderBy: { sold: "desc" },
            take: 8
        })
    );
}

export function storeBySlug(slug: string) {
    return prisma.store.findUnique({ where: { slug } });
}
