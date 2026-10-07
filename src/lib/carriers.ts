import { requireEnv } from "./env";

export const CARRIERS = ["dhl", "dpd", "gls"] as const;

export interface Rate {
    carrier: (typeof CARRIERS)[number];
    zone: string;
    priceCents: number;
}

export async function standardRate(carrier: Rate["carrier"], zone: string): Promise<Rate> {
    const res = await fetch(`${requireEnv("SHIPPING_API_URL")}/carriers/${carrier}/rates?zone=${zone}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(5_000)
    });
    if (!res.ok) throw new Error(`Rate for ${carrier} failed with status ${res.status}`);
    const body = (await res.json()) as { priceCents: number };
    return { carrier, zone, priceCents: body.priceCents };
}
