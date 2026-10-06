import { describe, expect, it } from "vitest";

import { includedVat, orderTotal, shippingCents, subtotal } from "./pricing";

describe("pricing", () => {
    it("adds up lines", () => {
        expect(subtotal([{ priceCents: 1200, quantity: 2 }, { priceCents: 300, quantity: 1 }])).toBe(2700);
    });

    it("ships free from 50 euros", () => {
        expect(shippingCents(4999)).toBe(490);
        expect(shippingCents(5000)).toBe(0);
    });

    it("adds shipping below the threshold", () => {
        expect(orderTotal([{ priceCents: 1000, quantity: 1 }])).toBe(1490);
    });

    it("shows the VAT included in a price", () => {
        expect(includedVat(1200)).toBe(200);
    });
});
