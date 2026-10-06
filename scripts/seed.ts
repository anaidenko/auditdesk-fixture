import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const store = await prisma.store.upsert({
        where: { slug: "demo" },
        update: {},
        create: { slug: "demo", name: "Demo Store" }
    });
    await prisma.product.createMany({
        data: [
            { storeId: store.id, name: "Linen apron", priceCents: 3200, stock: 40 },
            { storeId: store.id, name: "Ceramic mug", priceCents: 1800, stock: 120 }
        ],
        skipDuplicates: true
    });
}

main().finally(() => prisma.$disconnect());
