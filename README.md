# BUCHA'S — Next.js E-commerce with WhatsApp Checkout

Premium clothing storefront built entirely in Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion. No separate backend — product data lives in `data/store.json` and is read/written by Next.js API routes.

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Admin Portal

Go to `/admin/login`.

Default credentials (override in `.env.local`, see `.env.example`):
- Email: `admin@buchas.lk`
- Password: `BuchasAdmin#2026`

From the dashboard you can add/edit/delete products and update WhatsApp number, social links, phone, and address — no database required, changes write straight to `data/store.json`.

## WhatsApp checkout

The cart page builds a pre-filled WhatsApp message from the bag contents and opens `https://wa.me/<number>?text=...`. Update the destination number from **Admin → Site Settings**.

## Stack

- Next.js 14 App Router, TypeScript
- Tailwind CSS (custom brand tokens: ink / bone / clay / moss / steel)
- Framer Motion for entrance/hover motion
- Zustand (persisted to localStorage) for the cart
- Google Fonts: Anton (display), Inter (body), Fraunces italic (accent)

## Notes

- Admin auth uses a signed httpOnly cookie set by `/api/admin/login`; `middleware.ts` guards `/admin/dashboard`.
- For production, swap `data/store.json` for a real database (Postgres/MongoDB) behind the same API route shape — the frontend won't need to change.
