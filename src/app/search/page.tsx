import { ProductSearch } from "@/components/ProductSearch";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ store?: string }> }) {
    const { store = "demo" } = await searchParams;
    return (
        <main>
            <h1>Search</h1>
            <ProductSearch store={store} />
        </main>
    );
}
