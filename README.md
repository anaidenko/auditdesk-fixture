# Stalls

Stalls gives small shops their own online storefront on a shared platform. Each store has its
staff accounts, a catalogue, and customers who order from it. Store staff manage products,
see sales reports, and can have product descriptions drafted from their notes and customer
reviews.

## Stack

Next.js 15 (App Router), React 19, Prisma with PostgreSQL, a card-payments provider, a
transactional mail service and a shipping-rates API.

## Running locally

```sh
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

The storefront runs at http://localhost:3000; the staff area is at `/admin`.
