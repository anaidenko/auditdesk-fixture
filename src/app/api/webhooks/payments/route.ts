import { prisma } from "@/lib/db";
import { verifySignature } from "@/lib/payments";

interface PaymentEvent {
    type: "charge.succeeded" | "charge.refunded";
    chargeId: string;
}

export async function POST(req: Request) {
    const body = await req.text();
    if (!verifySignature(body, req.headers.get("x-paywell-signature") ?? "")) {
        return new Response("Bad signature", { status: 400 });
    }
    try {
        const event = JSON.parse(body) as PaymentEvent;
        if (event.type === "charge.refunded") {
            await prisma.order.update({ where: { paymentId: event.chargeId }, data: { status: "refunded" } });
        }
    } catch {
        // already handled
    }
    return Response.json({ received: true });
}
