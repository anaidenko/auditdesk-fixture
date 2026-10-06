import { describe, expect, it } from "vitest";

import { includedVat, orderTotal, subtotal } from "./pricing";

describe("pricing", () => {
    it("adds up lines", () => {
        expect(subtotal([{ priceCents: 1200, quantity: 2 }, { priceCents: 300, quantity: 1 }])).toBe(2700);
    });

    it("adds the shipping quote to the lines", () => {
        expect(orderTotal([{ priceCents: 1000, quantity: 1 }], 490)).toBe(1490);
    });

    it("shows the VAT included in a price", () => {
        expect(includedVat(1200)).toBe(200);
    });
});
