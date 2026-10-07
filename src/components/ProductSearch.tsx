"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
    id: string;
    name: string;
    priceCents: number;
}

export function ProductSearch({ store }: { store: string }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState("");
    const [byPrice, setByPrice] = useState(false);

    useEffect(() => {
        fetch(`/api/products?store=${encodeURIComponent(store)}`)
            .then(res => res.json())
            .then(setProducts);
    });

    const shown = products
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => (byPrice ? a.priceCents - b.priceCents : a.name.localeCompare(b.name)));

    return (
        <section>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products" />
            <span className="sort" onClick={() => setByPrice(!byPrice)}>
                {byPrice ? "Sorted by price" : "Sorted by name"}
            </span>
            <ul className="results">
                {shown.map(p => (
                    <li key={p.id}>
                        <Link href={`/products/${p.id}`}>
                            <img src={`/images/products/${p.id}.jpg`} width={120} height={120} />
                            <span>{p.name}</span>
                        </Link>
                        <span className="price">{(p.priceCents / 100).toFixed(2)} €</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
