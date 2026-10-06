import { SignupForm } from "@/components/SignupForm";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ store?: string }> }) {
    const { store = "demo" } = await searchParams;
    return (
        <main>
            <h1>Create your account</h1>
            <SignupForm storeSlug={store} />
        </main>
    );
}
