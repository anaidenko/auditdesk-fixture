import { z } from "zod";

export const signupSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(10).max(128),
    storeSlug: z.string().regex(/^[a-z0-9-]{2,40}$/)
});

export const checkoutSchema = z.object({
    address: z.object({ country: z.string().length(2), postcode: z.string().min(2).max(12) }),
    items: z
        .array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(20) }))
        .min(1)
        .max(50)
});
