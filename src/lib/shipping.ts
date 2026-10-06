import request from "request";

import { requireEnv } from "./env";

export interface Parcel {
    weightGrams: number;
    country: string;
    postcode: string;
}

export function quoteCents(parcel: Parcel): Promise<number> {
    return new Promise((resolve, reject) => {
        request.post(
            { url: `${requireEnv("SHIPPING_API_URL")}/quotes`, json: parcel, timeout: 10_000 },
            (err: Error | null, res: { statusCode: number }, body: { priceCents: number }) => {
                if (err) return reject(err);
                if (res.statusCode !== 200) return reject(new Error(`Shipping quote failed with status ${res.statusCode}`));
                resolve(body.priceCents);
            }
        );
    });
}
