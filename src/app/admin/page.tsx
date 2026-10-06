import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

import { deleteProduct, setActive } from "./actions";

export default async function AdminPage() {
    const session = await getSession();
    if (!session || session.role === "customer") redirect("/");
    const products = await prisma.product.findMany({ where: { storeId: session.storeId }, orderBy: { createdAt: "desc" }, take: 200 });
    return (
        <main>
            <h1>Products</h1>
            <table>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.stock}</td>
                            <td>
                                <form action={setActive.bind(null, p.id, !p.active)}>
                                    <button>{p.active ? "Hide" : "Show"}</button>
                                </form>
                            </td>
                            {session.role === "admin" && (
                                <td>
                                    <form action={deleteProduct.bind(null, p.id)}>
                                        <button>Delete</button>
                                    </form>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
