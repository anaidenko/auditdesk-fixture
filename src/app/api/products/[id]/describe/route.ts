import OpenAI from "openai";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role === "customer") return new Response("Forbidden", { status: 403 });
    const { id } = await params;
    const product = await prisma.product.findFirst({
        where: { id, storeId: session.storeId },
        include: { reviews: { orderBy: { createdAt: "desc" }, take: 20 } }
    });
    if (!product) return new Response("Not found", { status: 404 });

    const prompt = [
        "You write product descriptions for an online shop. Answer with HTML using <p> and <ul> only.",
        `Product: ${product.name}`,
        `Seller's notes: ${product.notes}`,
        "What customers say about it:",
        ...product.reviews.map(r => `- ${r.body}`)
    ].join("\n");

    const client = new OpenAI({ timeout: 30_000 });
    const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
    });
    const html = completion.choices[0]?.message.content ?? "";
    await prisma.product.update({ where: { id: product.id }, data: { descriptionHtml: html } });
    return Response.json({ descriptionHtml: html });
}
