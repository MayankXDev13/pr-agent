"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Subscription {
  plan: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: string;
}

interface Usage {
  reviewsThisMonth: number;
  indexingsThisMonth: number;
  reviewsLimit: number;
  indexingsLimit: number;
}

export default function BillingPage() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const userId = (session?.user as any)?.id;
    if (userId) {
      fetchSubscription();
      fetchUsage();
    }
  }, [session]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/subscription");
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsage = async () => {
    try {
      const response = await fetch("/api/usage");
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (error) {
      console.error("Failed to fetch usage:", error);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error("Failed to create portal session:", error);
    } finally {
      setPortalLoading(false);
    }
  };

  const handleUpgrade = async (plan: string) => {
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const currentPlan = subscription?.plan || "free";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Billing & Subscription</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 capitalize">{currentPlan}</p>
            <p className="text-gray-600">
              {currentPlan === "free"
                ? "Free tier with limited features"
                : currentPlan === "pro"
                ? "$9/month - Professional features"
                : "$49/month - Enterprise features"}
            </p>
          </div>
          {subscription?.stripeCustomerId && (
            <button
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {portalLoading ? "Loading..." : "Manage Billing"}
            </button>
          )}
        </div>
      </div>

      {usage && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">PR Reviews</span>
                <span className="font-medium">
                  {usage.reviewsThisMonth} / {usage.reviewsLimit === Infinity ? "∞" : usage.reviewsLimit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${usage.reviewsLimit === Infinity ? 0 : Math.min((usage.reviewsThisMonth / usage.reviewsLimit) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Code Indexings</span>
                <span className="font-medium">
                  {usage.indexingsThisMonth} / {usage.indexingsLimit === Infinity ? "∞" : usage.indexingsLimit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${usage.indexingsLimit === Infinity ? 0 : Math.min((usage.indexingsThisMonth / usage.indexingsLimit) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`border rounded-lg p-4 ${currentPlan === "free" ? "ring-2 ring-blue-600" : ""}`}>
            <h3 className="font-semibold text-gray-900">Free</h3>
            <p className="text-2xl font-bold mt-2">$0<span className="text-sm font-normal text-gray-600">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>5 Repositories</li>
              <li>100 PR Reviews/month</li>
              <li>20 Code indexings</li>
            </ul>
            {currentPlan === "free" ? (
              <button disabled className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade("free")}
                className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Downgrade
              </button>
            )}
          </div>

          <div className={`border rounded-lg p-4 ${currentPlan === "pro" ? "ring-2 ring-blue-600" : ""}`}>
            <h3 className="font-semibold text-gray-900">Pro</h3>
            <p className="text-2xl font-bold mt-2">$9<span className="text-sm font-normal text-gray-600">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>50 Repositories</li>
              <li>1,000 PR Reviews/month</li>
              <li>100 Code indexings</li>
              <li>All models</li>
            </ul>
            {currentPlan === "pro" ? (
              <button disabled className="mt-4 w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade("pro")}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upgrade
              </button>
            )}
          </div>

          <div className={`border rounded-lg p-4 ${currentPlan === "enterprise" ? "ring-2 ring-blue-600" : ""}`}>
            <h3 className="font-semibold text-gray-900">Enterprise</h3>
            <p className="text-2xl font-bold mt-2">$49<span className="text-sm font-normal text-gray-600">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>Unlimited Repositories</li>
              <li>Unlimited PR Reviews</li>
              <li>Unlimited Code indexings</li>
              <li>Dedicated support</li>
            </ul>
            {currentPlan === "enterprise" ? (
              <button disabled className="mt-4 w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade("enterprise")}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
