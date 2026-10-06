export interface Line {
    priceCents: number;
    quantity: number;
}

export function subtotal(lines: Line[]): number {
    return lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);
}

export function shippingCents(subtotalCents: number): number {
    return subtotalCents >= 5000 ? 0 : 490;
}

/** VAT is included in shop prices; this is the amount shown on the receipt. */
export function includedVat(totalCents: number, rate = 0.2): number {
    return Math.round(totalCents - totalCents / (1 + rate));
}

export function orderTotal(lines: Line[]): number {
    const sub = subtotal(lines);
    return sub + shippingCents(sub);
}
