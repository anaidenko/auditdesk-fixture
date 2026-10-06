import Link from "next/link";

import { prisma } from "@/lib/db";

interface Props {
    product: { id: string; name: string; priceCents: number; storeId: string };
}

export async function ProductCard({ product }: Props) {
    const store = await prisma.store.findUnique({ where: { id: product.storeId }, select: { name: true } });
    return (
        <Link href={`/products/${product.id}`} className="card">
            <h3>{product.name}</h3>
            <p className="price">{(product.priceCents / 100).toFixed(2)} €</p>
            <p className="store">{store?.name}</p>
        </Link>
    );
}
