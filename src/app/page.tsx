import { notFound } from "next/navigation";

import { ProductCard } from "@/components/ProductCard";
import { storeBySlug, topProducts } from "@/lib/catalog";

export default async function Home({ searchParams }: { searchParams: Promise<{ store?: string }> }) {
    const { store: slug = "demo" } = await searchParams;
    const store = await storeBySlug(slug);
    if (!store) notFound();
    const products = await topProducts(store.id);
    return (
        <main>
            <h1>{store.name}</h1>
            <section className="grid">
                {products.map(p => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </section>
        </main>
    );
}
