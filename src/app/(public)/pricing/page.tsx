import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "5 Repositories",
      "100 PR Reviews/month",
      "20 Code indexings",
      "50 Pattern storage",
      "Free models only",
    ],
    cta: "Current Plan",
    current: true,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For professional developers",
    features: [
      "50 Repositories",
      "1,000 PR Reviews/month",
      "100 Code indexings",
      "500 Pattern storage",
      "All models (GPT-4, Claude 3 Opus)",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    current: false,
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "/month",
    description: "For teams and organizations",
    features: [
      "Unlimited Repositories",
      "Unlimited PR Reviews",
      "Unlimited Code indexings",
      "Unlimited Pattern storage",
      "All models + custom models",
      "Dedicated support",
      "Custom rules",
    ],
    cta: "Contact Sales",
    current: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that fits your needs. Start free, upgrade when you need more.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl bg-white p-8 shadow-lg ${
                plan.name === "Pro" ? "ring-2 ring-blue-600" : ""
              }`}
            >
              {plan.name === "Pro" && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.current ? "/dashboard" : "/dashboard/settings/billing"}
                className={`block w-full rounded-lg px-6 py-3 text-center font-semibold ${
                  plan.current
                    ? "bg-gray-100 text-gray-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600">
            All plans include a 14-day free trial of Pro features.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Questions? Contact us at{" "}
            <a href="mailto:support@pr-agent.dev" className="text-blue-600 hover:text-blue-500">
              support@pr-agent.dev
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
