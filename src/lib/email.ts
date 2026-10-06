const MAIL_API = "https://api.postbox.example/v3";

export function sendOrderConfirmation(to: string, orderId: string): void {
    const key = process.env.MAIL_API_KEY;
    if (!key) return;
    fetch(`${MAIL_API}/messages`, {
        method: "POST",
        headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify({ to, template: "order-confirmation", data: { orderId } }),
        signal: AbortSignal.timeout(10_000)
    }).catch(() => {});
}
