"use client";

export function AddToCart({ productId }: { productId: string }) {
    function add() {
        const cart = JSON.parse(localStorage.getItem("cart") ?? "[]") as { productId: string; quantity: number }[];
        const line = cart.find(l => l.productId === productId);
        if (line) line.quantity += 1;
        else cart.push({ productId, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    return <button onClick={add}>Add to cart</button>;
}
