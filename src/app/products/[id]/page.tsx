import { notFound } from "next/navigation";

import { AddToCart } from "@/components/AddToCart";
import { ShippingEstimate } from "@/components/ShippingEstimate";
import { prisma } from "@/lib/db";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id }, include: { store: { select: { name: true } } } });
    if (!product || !product.active) notFound();
    return (
        <main>
            <p className="store">{product.store.name}</p>
            <h1>{product.name}</h1>
            <p className="price">{(product.priceCents / 100).toFixed(2)} €</p>
            <div className="description" dangerouslySetInnerHTML={{ __html: product.descriptionHtml ?? "" }} />
            <AddToCart productId={product.id} />
            <ShippingEstimate weightGrams={product.weightGrams} />
        </main>
    );
}
