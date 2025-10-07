# Multitenant Ecommerce Platform

This project is a modern, production-ready multitenant ecommerce platform built with [Next.js](https://nextjs.org), [Payload CMS](https://payloadcms.com/), and a rich set of integrations for payments, SEO, and multi-store management.

## Features

- **Multi-Tenant Architecture:** Each store (tenant) has its own products, branding, and Stripe account, managed via subdomains.
- **Product & Order Management:** Full CRUD for products, categories, orders, reviews, and media.
- **Stripe Integration:** Per-tenant Stripe Connect for secure payments and onboarding.
- **Advanced SEO:** Dynamic metadata, Open Graph, Twitter Cards, structured data, sitemaps, robots.txt, and more (see [SEO_IMPLEMENTATION.md](./SEO_IMPLEMENTATION.md)).
- **Admin Dashboard:** Powerful admin UI via Payload CMS with role-based access control.
- **API & TRPC:** Modern API layer using tRPC for type-safe client-server communication.
- **Authentication:** Secure, extensible auth with multi-role support.
- **Performance:** Built with Next.js App Router, React 19, and optimized for speed.
- **Modern UI:** Tailwind CSS, Radix UI, and custom components for a beautiful, accessible experience.

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, Radix UI
- **Backend:** Payload CMS, MongoDB (via Mongoose), tRPC
- **Payments:** Stripe Connect
- **Storage:** Vercel Blob Storage for media
- **Other:** Zod, Zustand, React Hook Form, ESLint, TypeScript

## Getting Started

## Getting Started

### 1. Install dependencies

```bash
yarn install # or npm install, pnpm install, or bun install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the required values (MongoDB URI, Stripe keys, Payload secret, etc).

### 3. Run the development server

```bash
yarn dev # or npm run dev, pnpm dev, bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

### 4. Seed the database (optional)

```bash
yarn db:seed # or bun run src/seed/index.ts
```

## Project Structure

- `src/collections/` — Payload CMS collections (Products, Orders, Tenants, etc)
- `src/app/` — Next.js App Router structure
- `src/modules/` — Feature modules (auth, products, checkout, etc)
- `src/components/` — UI components
- `src/lib/` — Utilities and shared logic
- `src/payload.config.ts` — Payload CMS configuration
- `SEO_IMPLEMENTATION.md` — Full SEO implementation details

## Scripts

- `yarn dev` — Start development server
- `yarn build` — Build for production
- `yarn start` — Start production server
- `yarn db:seed` — Seed the database
- `yarn lint` — Lint codebase

## SEO Implementation

This project implements advanced SEO best practices. See [SEO_IMPLEMENTATION.md](./SEO_IMPLEMENTATION.md) for a detailed guide.

## License

MIT

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
