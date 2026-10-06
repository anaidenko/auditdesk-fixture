import { requireEnv } from "./env";

const MAIL_API = "https://api.postbox.example/v3";

export function sendOrderConfirmation(to: string, orderId: string): void {
    fetch(`${MAIL_API}/messages`, {
        method: "POST",
        headers: { authorization: `Bearer ${requireEnv("MAIL_API_KEY")}`, "content-type": "application/json" },
        body: JSON.stringify({ to, template: "order-confirmation", data: { orderId } }),
        signal: AbortSignal.timeout(10_000)
    }).catch(() => {});
}
