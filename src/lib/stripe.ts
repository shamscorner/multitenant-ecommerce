import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Missing required env var: STRIPE_SECRET_KEY");
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-05-28.basil",
  typescript: true,
});
