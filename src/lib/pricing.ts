export interface Line {
    priceCents: number;
    quantity: number;
}

export function subtotal(lines: Line[]): number {
    return lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);
}

/** VAT is included in shop prices; this is the amount shown on the receipt. */
export function includedVat(totalCents: number, rate = 0.2): number {
    return Math.round(totalCents - totalCents / (1 + rate));
}

export function orderTotal(lines: Line[], shippingCents: number): number {
    return subtotal(lines) + shippingCents;
}
