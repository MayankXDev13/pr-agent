"use client";

import { useState, useEffect, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  FiCode,
  FiCpu,
  FiRepeat,
  FiMessageCircle,
  FiZap,
  FiShield,
  FiSun,
  FiMoon,
  FiGithub,
  FiArrowRight,
  FiCheck,
  FiMenu,
  FiX,
  FiStar,
  FiExternalLink,
  FiPlay,
} from "react-icons/fi";

const testimonials = [
  {
    quote: "PR Agent catches bugs I miss and teaches our team better patterns. It's like having a senior engineer review every PR.",
    author: "Sarah Chen",
    role: "Senior Developer",
    company: "TechCorp",
  },
  {
    quote: "Cut our code review time by 60%. The diff scores help us prioritize what needs attention and what can be merged quickly.",
    author: "Marcus Johnson",
    role: "Engineering Lead",
    company: "StartupXYZ",
  },
  {
    quote: "The pattern learning feature is incredible. It adapted to our codebase conventions in just a week.",
    author: "Elena Rodriguez",
    role: "CTO",
    company: "DevStudio",
  },
];

const faqs = [
  {
    question: "How does PR Agent analyze my code?",
    answer: "PR Agent uses advanced AI models to understand your entire codebase context. It reads your repository, indexes the code, and provides intelligent feedback on each PR based on the full context, not just the diff.",
  },
  {
    question: "Is my code secure?",
    answer: "Yes. Your code is processed securely and never stored permanently. We use industry-standard encryption and don't share your code with third parties. All AI processing happens in isolated environments.",
  },
  {
    question: "Which AI models do you use?",
    answer: "PR Agent uses a combination of Claude 3 Haiku (fast reviews) and GPT-4/Claude 3 Opus (complex analyses). Pro and Enterprise plans get access to all models.",
  },
  {
    question: "Can I self-host PR Agent?",
    answer: "Yes! Enterprise customers can self-host PR Agent on their own infrastructure. Contact us for details on self-hosting options.",
  },
  {
    question: "What's included in each plan?",
    answer: "Free: 100 PRs/month. Pro: 1,000 PRs/month + all AI models. Enterprise: Unlimited everything + dedicated support + self-hosting.",
  },
];

export default function Home() {
  const { data: session, status } = { data: null, status: "unauthenticated" };
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(2);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignIn = useCallback(() => {
    signIn("github", { callbackUrl: "/dashboard" });
  }, []);

  const handleCtaClick = useCallback(() => {
    signIn("github", { callbackUrl: "/dashboard" });
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <FiCode className="w-5 h-5 text-white dark:text-black" />
              </div>
              <span className="text-xl font-bold">PR Agent</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition">How It Works</a>
              <a href="#pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition">Pricing</a>
              <a href="#faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition">FAQ</a>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>

              <button
                onClick={handleSignIn}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
              >
                Sign In
              </button>

              <button
                onClick={handleCtaClick}
                className="hidden md:flex items-center gap-2 px-5 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition"
              >
                Get Started
                <FiArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-sm text-gray-600 dark:text-gray-400">Features</a>
                <a href="#how-it-works" className="text-sm text-gray-600 dark:text-gray-400">How It Works</a>
                <a href="#pricing" className="text-sm text-gray-600 dark:text-gray-400">Pricing</a>
                <a href="#faq" className="text-sm text-gray-600 dark:text-gray-400">FAQ</a>
                <button onClick={handleSignIn} className="text-left text-sm text-gray-600 dark:text-gray-400">Sign In</button>
                <button onClick={handleCtaClick} className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-lg">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></span>
                Now with Claude 3.5 Sonnet
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                AI-Powered
                <br />
                <span className="bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Code Reviews
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-lg">
                Automated PR reviews with diff scores, context awareness, and pattern learning. Catch bugs before they ship.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleCtaClick}
                  className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium bg-black dark:bg-white text-white dark:text-black rounded-xl hover:opacity-80 transition-all hover:scale-105"
                >
                  <FiGithub className="w-5 h-5" />
                  Get Started with GitHub
                  <FiArrowRight className="w-5 h-5" />
                </button>

                <a
                  href="#how-it-works"
                  className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-900 dark:hover:border-gray-100 transition-all"
                >
                  <FiPlay className="w-5 h-5" />
                  See How It Works
                </a>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <FiCheck className="w-4 h-4 text-green-500" />
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <FiCheck className="w-4 h-4 text-green-500" />
                  100 PRs/month free
                </span>
              </div>
            </div>

            <div className="relative animate-fade-in-up animation-delay-200">
              <div className="relative bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>

                <div className="space-y-3 text-sm font-mono">
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="text-green-500">+42</span>
                    <span className="text-gray-400">lines added</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="text-red-500">-12</span>
                    <span className="text-gray-400">lines removed</span>
                  </div>
                  <hr className="border-gray-200 dark:border-gray-800" />
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-yellow-600 dark:text-yellow-400 font-bold text-xs">AI</span>
                      </div>
                      <div>
                        <div className="font-medium text-yellow-800 dark:text-yellow-200 text-sm">Diff Score: 4.2/5</div>
                        <div className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                          Good PR! Consider extracting the validation logic into a separate utility function for reusability.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-float">
                  ✓ Review Complete
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 animate-float animation-delay-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <FiShield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Security Check</div>
                    <div className="text-xs text-gray-500">No vulnerabilities found</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "12,847", label: "PRs Reviewed" },
              { value: "523", label: "Teams" },
              { value: "8,432", label: "Issues Found" },
              { value: "4.9/5", label: "User Rating" },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-3xl sm:text-4xl font-bold">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Powerful Features</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Everything you need for automated, intelligent code reviews
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FiCode,
                title: "Smart Diff Analysis",
                description: "Get a quality score (1-5) for every PR with actionable feedback on code quality, security, and best practices.",
                color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
              },
              {
                icon: FiCpu,
                title: "Context Aware",
                description: "Understands your entire codebase, not just the diff. References similar patterns across your repository.",
                color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
              },
              {
                icon: FiRepeat,
                title: "Pattern Learning",
                description: "Learns your team's coding standards over time. Adapts to your codebase conventions and preferences.",
                color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
              },
              {
                icon: FiMessageCircle,
                title: "Q&A About Code",
                description: "Ask questions about any file in your repository. Get instant answers with source code references.",
                color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
              },
              {
                icon: FiZap,
                title: "Instant Feedback",
                description: "Review PRs in seconds, not hours. Fast feedback loops mean faster development cycles.",
                color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
              },
              {
                icon: FiShield,
                title: "Security Scanning",
                description: "Detect vulnerabilities, secret leaks, and security issues before they reach production.",
                color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Repository",
                description: "Install the GitHub app and authorize PR Agent to access your repositories with just one click.",
              },
              {
                step: "02",
                title: "Review PR",
                description: "When you open a PR, PR Agent automatically analyzes the changes and provides a detailed review.",
              },
              {
                step: "03",
                title: "Ship Better Code",
                description: "Address the feedback, merge with confidence, and let PR Agent learn from your preferences.",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black dark:bg-white text-white dark:text-black text-2xl font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>

                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-gray-300 dark:border-gray-700">
                    <FiArrowRight className="absolute top-1/2 -translate-y-1/2 left-full bg-gray-50 dark:bg-gray-900 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-80 transition"
            >
              Connect Your First Repo
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Loved by Developers</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              See what the community says about PR Agent
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.author}
                className="p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                description: "For individuals getting started",
                features: ["100 PR reviews/month", "5 Repositories", "Basic AI models", "Community support"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "$9",
                period: "/month",
                description: "For professional developers",
                features: ["1,000 PR reviews/month", "50 Repositories", "All AI models", "Priority support", "Pattern learning"],
                cta: "Start Free Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "$49",
                period: "/month",
                description: "For teams and organizations",
                features: ["Unlimited PR reviews", "Unlimited Repositories", "Custom models", "Dedicated support", "Self-hosting option", "SSO & audit logs"],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={plan.name}
                className={`relative p-8 bg-white dark:bg-gray-950 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl animate-fade-in-up ${
                  plan.popular
                    ? "border-black dark:border-white scale-105"
                    : "border-gray-200 dark:border-gray-800"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
                </div>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={plan.name === "Enterprise" ? () => router.push("/pricing") : handleCtaClick}
                  className={`mt-8 w-full py-3 rounded-lg font-medium transition-all ${
                    plan.popular
                      ? "bg-black dark:bg-white text-white dark:text-black hover:opacity-80"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
            >
              View full pricing details
              <FiExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Everything you need to know
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  <span className="font-medium">{faq.question}</span>
                  <FiArrowRight
                    className={`w-5 h-5 transition-transform ${
                      openFaq === index ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {openFaq === index && (
                  <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Still have questions?{" "}
              <a href="mailto:support@pr-agent.dev" className="text-black dark:text-white font-medium hover:underline">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black dark:bg-white text-white dark:text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to streamline your code reviews?</h2>
          <p className="mt-4 text-lg text-gray-300 dark:text-gray-600">
            Join 500+ teams using PR Agent to ship better code, faster.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleCtaClick}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-black text-black dark:text-white rounded-xl font-medium hover:opacity-80 transition-all hover:scale-105"
            >
              Get Started Free
              <FiArrowRight className="w-5 h-5" />
            </button>

            <a
              href="https://github.com/pr-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white dark:border-black rounded-xl font-medium hover:bg-white/10 dark:hover:bg-black/10 transition"
            >
              <FiGithub className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                  <FiCode className="w-5 h-5 text-white dark:text-black" />
                </div>
                <span className="text-xl font-bold">PR Agent</span>
              </div>
              <p className="text-sm text-gray-500">
                AI-powered code reviews for modern teams.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#features" className="hover:text-black dark:hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-black dark:hover:text-white transition">Pricing</a></li>
                <li><a href="/docs" className="hover:text-black dark:hover:text-white transition">Documentation</a></li>
                <li><a href="/changelog" className="hover:text-black dark:hover:text-white transition">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="/about" className="hover:text-black dark:hover:text-white transition">About</a></li>
                <li><a href="/blog" className="hover:text-black dark:hover:text-white transition">Blog</a></li>
                <li><a href="/careers" className="hover:text-black dark:hover:text-white transition">Careers</a></li>
                <li><a href="/contact" className="hover:text-black dark:hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="/privacy" className="hover:text-black dark:hover:text-white transition">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-black dark:hover:text-white transition">Terms of Service</a></li>
                <li><a href="/security" className="hover:text-black dark:hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; 2025 PR Agent. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/pr-agent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-black dark:hover:text-white transition"
              >
                <FiGithub className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/pr-agent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-black dark:hover:text-white transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://discord.gg/pr-agent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-black dark:hover:text-white transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
