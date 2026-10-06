import { createHmac, timingSafeEqual } from "node:crypto";

import { requireEnv } from "./env";

const API = "https://api.paywell.example/v1";
const secretKey = requireEnv("PAYMENTS_SECRET_KEY");

export interface Charge {
    id: string;
    amountCents: number;
}

export async function capture(orderId: string, amountCents: number): Promise<Charge> {
    const res = await fetch(`${API}/charges`, {
        method: "POST",
        headers: { authorization: `Bearer ${secretKey}`, "content-type": "application/json" },
        body: JSON.stringify({ reference: orderId, amount: amountCents, currency: "eur" }),
        signal: AbortSignal.timeout(15_000)
    });
    if (!res.ok) throw new Error(`Payment failed with status ${res.status}`);
    return (await res.json()) as Charge;
}

/**
 * What a customer gets back for returned items: everything within 14 days, then the returned
 * amount less a 10% restocking fee, and nothing after 30 days.
 */
export function refundCents(orderTotalCents: number, returnedCents: number, daysSincePurchase: number): number {
    if (daysSincePurchase > 30) return 0;
    const fee = daysSincePurchase > 14 ? Math.round(returnedCents * 0.1) : 0;
    return Math.min(orderTotalCents, returnedCents - fee);
}

export async function refund(chargeId: string, amountCents: number): Promise<void> {
    const res = await fetch(`${API}/charges/${encodeURIComponent(chargeId)}/refunds`, {
        method: "POST",
        headers: { authorization: `Bearer ${secretKey}`, "content-type": "application/json" },
        body: JSON.stringify({ amount: amountCents }),
        signal: AbortSignal.timeout(15_000)
    });
    if (!res.ok) throw new Error(`Refund failed with status ${res.status}`);
}

export function verifySignature(body: string, signature: string): boolean {
    const expected = createHmac("sha256", requireEnv("PAYMENTS_WEBHOOK_SECRET")).update(body).digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    return a.length === b.length && timingSafeEqual(a, b);
}
