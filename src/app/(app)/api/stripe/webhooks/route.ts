import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import type { Stripe } from "stripe";

import { stripe } from "@/lib/stripe";
import { ExpandedLineItem } from "@/modules/checkout/type";

class WebhookError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = "WebhookError";
  }
}

export async function POST(req: Request) {
  const startTime = Date.now();
  let event: Stripe.Event;

  // Validate required environment variables
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("❌ STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook configuration error" },
      { status: 500 }
    );
  }

  try {
    const body = await (await req.blob()).text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new WebhookError("Missing stripe-signature header");
    }

    if (!body) {
      throw new WebhookError("Empty request body");
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log(`✅ Webhook verified successfully: ${event.id} (${event.type})`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Webhook verification failed: ${errorMessage}`, {
      error: error instanceof Error ? error.stack : error,
      timestamp: new Date().toISOString(),
    });

    const statusCode = error instanceof WebhookError ? error.statusCode : 400;
    return NextResponse.json(
      { error: `Webhook verification failed: ${errorMessage}` },
      { status: statusCode }
    );
  }

  const permittedEvents: string[] = [
    "checkout.session.completed",
  ];

  if (!permittedEvents.includes(event.type)) {
    console.log(`ℹ️ Ignoring unhandled event type: ${event.type}`);
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const payload = await getPayload({ config });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Validate required metadata
        if (!session.metadata?.userId) {
          throw new WebhookError("Missing userId in session metadata", 422);
        }

        console.log(`🔄 Processing checkout session: ${session.id} for user: ${session.metadata.userId}`);

        // Validate user exists
        const user = await payload.findByID({
          collection: "users",
          id: session.metadata.userId,
        });

        if (!user) {
          throw new WebhookError(`User not found: ${session.metadata.userId}`, 404);
        }

        // Retrieve expanded session with line items
        const expandedSession = await stripe.checkout.sessions.retrieve(
          session.id,
          { expand: ["line_items.data.price.product"] }
        );

        const lineItems = expandedSession.line_items?.data as ExpandedLineItem[] | undefined;

        if (!lineItems?.length) {
          throw new WebhookError("No line items found in checkout session", 422);
        }

        console.log(`📦 Processing ${lineItems.length} line items`);

        // Process each line item and create orders
        const orderCreationPromises = lineItems.map(async (item) => {
          if (!item.price?.product?.metadata?.id) {
            console.warn(`⚠️ Missing product metadata for line item: ${item.id}`);
            throw new WebhookError(`Invalid product data for line item: ${item.id}`, 422);
          }

          return payload.create({
            collection: "orders",
            data: {
              stripeCheckoutSessionId: session.id,
              user: user.id,
              product: item.price.product.metadata.id,
              name: item.price.product.name,
            },
          });
        });

        const orderResults = await Promise.allSettled(orderCreationPromises);

        const createdOrders = orderResults
          .filter((result): result is PromiseFulfilledResult<any> => result.status === "fulfilled")
          .map((result) => result.value);

        const failedOrders = orderResults
          .filter((result): result is PromiseRejectedResult => result.status === "rejected")
          .map((result) => result.reason);

        if (failedOrders.length > 0) {
          console.error(`⚠️ Failed to create ${failedOrders.length} orders:`, failedOrders.map(f => f.reason));
        }

        console.log(`✅ Successfully created ${createdOrders.length}/${lineItems.length} orders for session: ${session.id}`);

        break;
      }

      default:
        // This shouldn't happen due to permitted events check, but keeping for safety
        throw new WebhookError(`Unhandled event type: ${event.type}`, 400);
    }

    const processingTime = Date.now() - startTime;
    console.log(`⏱️ Webhook processed successfully in ${processingTime}ms`);

    return NextResponse.json(
      { received: true, processed: true },
      {
        status: 200,
        headers: {
          "X-Processing-Time": `${processingTime}ms`,
        }
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown processing error";
    const statusCode = error instanceof WebhookError ? error.statusCode : 500;

    console.error("❌ Webhook processing failed:", {
      error: errorMessage,
      eventId: event.id,
      eventType: event.type,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: "Webhook processing failed",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: statusCode }
    );
  }
}
