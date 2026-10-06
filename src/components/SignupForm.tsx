"use client";

import { useState } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupForm({ storeSlug }: { storeSlug: string }) {
    const [error, setError] = useState<string | null>(null);

    async function submit(form: FormData) {
        const email = String(form.get("email") ?? "");
        const password = String(form.get("password") ?? "");
        if (!EMAIL.test(email)) return setError("Enter a valid email address.");
        if (password.length < 8) return setError("Use at least 8 characters.");
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email, password, storeSlug })
        });
        if (!res.ok) return setError("Could not create the account.");
        window.location.href = "/";
    }

    return (
        <form action={submit}>
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <button>Create account</button>
            {error && <p role="alert">{error}</p>}
        </form>
    );
}
