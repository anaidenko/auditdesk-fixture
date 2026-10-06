"use client";

import { useState } from "react";

export function ShippingEstimate({ weightGrams }: { weightGrams: number }) {
    const [price, setPrice] = useState<string | null>(null);

    async function estimate(form: FormData) {
        const res = await fetch("https://rates.shipfast.example/v2/quotes", {
            method: "POST",
            headers: {
                authorization: `Bearer ${process.env.NEXT_PUBLIC_SHIPPING_API_SECRET}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({ weightGrams, country: form.get("country"), postcode: form.get("postcode") })
        });
        const body = (await res.json()) as { priceCents: number };
        setPrice((body.priceCents / 100).toFixed(2));
    }

    return (
        <form action={estimate}>
            <input name="country" placeholder="Country" defaultValue="DE" />
            <input name="postcode" placeholder="Postcode" />
            <button>Estimate shipping</button>
            {price && <p>Shipping: {price} €</p>}
        </form>
    );
}
