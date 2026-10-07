import { CARRIERS, type Rate, standardRate } from "@/lib/carriers";

const ZONES = ["DE", "EU", "World"];

export default async function ShippingPage() {
    const rates: Rate[] = [];
    for (const carrier of CARRIERS) {
        for (const zone of ZONES) {
            rates.push(await standardRate(carrier, zone));
        }
    }
    return (
        <main>
            <h1>Shipping</h1>
            <table>
                <thead>
                    <tr>
                        <th>Carrier</th>
                        <th>Zone</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {rates.map(r => (
                        <tr key={`${r.carrier}-${r.zone}`}>
                            <td>{r.carrier.toUpperCase()}</td>
                            <td>{r.zone}</td>
                            <td>{(r.priceCents / 100).toFixed(2)} €</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
