import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "5 Repositories",
      "100 PR Reviews/month",
      "20 Code indexings",
      "50 Pattern storage",
      "Free models only",
    ],
    limits: {
      repos: 5,
      reviewsPerMonth: 100,
      indexings: 20,
      patterns: 50,
    },
  },
  pro: {
    name: "Pro",
    price: 9,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "50 Repositories",
      "1,000 PR Reviews/month",
      "100 Code indexings",
      "500 Pattern storage",
      "All models (GPT-4, Claude 3 Opus)",
      "Priority support",
    ],
    limits: {
      repos: 50,
      reviewsPerMonth: 1000,
      indexings: 100,
      patterns: 500,
    },
  },
  enterprise: {
    name: "Enterprise",
    price: 49,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      "Unlimited Repositories",
      "Unlimited PR Reviews",
      "Unlimited Code indexings",
      "Unlimited Pattern storage",
      "All models + custom models",
      "Dedicated support",
      "Custom rules",
    ],
    limits: {
      repos: Infinity,
      reviewsPerMonth: Infinity,
      indexings: Infinity,
      patterns: Infinity,
    },
  },
};

export type Plan = keyof typeof PLANS;

export async function createCheckoutSession(
  userId: string,
  email: string,
  plan: Plan,
  successUrl: string,
  cancelUrl: string
) {
  const priceId = PLANS[plan].priceId;
  if (!priceId) {
    throw new Error("Invalid plan");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      plan,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata: {
        userId,
        plan,
      },
    },
  });

  return session;
}

export async function createPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId);
}

export async function updateSubscription(
  subscriptionId: string,
  priceId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
    proration_behavior: "create_prorations",
  });
}
