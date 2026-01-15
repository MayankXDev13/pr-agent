"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Analytics {
  totalUsers: number;
  totalRepos: number;
  totalReviews: number;
  thisMonthReviews: number;
  planCounts: {
    free: number;
    pro: number;
    enterprise: number;
  };
}

interface SystemHealth {
  totalUsers: number;
  totalRepos: number;
  totalReviews: number;
  activeRepos: number;
  completedReviews: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const user = session?.user as any;
    if (user?.isAdmin) {
      fetchAnalytics();
      fetchHealth();
    } else if (status !== "loading") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealth = async () => {
    try {
      const response = await fetch("/api/admin/health");
      if (response.ok) {
        const data = await response.json();
        setHealth(data);
      }
    } catch (error) {
      console.error("Failed to fetch health:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const user = session?.user as any;
  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Access denied. Admin only.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="mb-8">
        <nav className="flex space-x-4">
          {["overview", "users", "repos", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "overview" && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Repos</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalRepos}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Reviews</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalReviews}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Reviews This Month</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.thisMonthReviews}</p>
          </div>
        </div>
      )}

      {activeTab === "overview" && health && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Plan Distribution</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Free</span>
                <span className="font-medium">{analytics?.planCounts.free}</span>
              </div>
              <div className="flex justify-between">
                <span>Pro</span>
                <span className="font-medium">{analytics?.planCounts.pro}</span>
              </div>
              <div className="flex justify-between">
                <span>Enterprise</span>
                <span className="font-medium">{analytics?.planCounts.enterprise}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">System Status</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Active Repos</span>
                <span className="font-medium">{health.activeRepos}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Reviews</span>
                <span className="font-medium">{health.completedReviews}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm">admin@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">Enterprise</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">Yes</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">-</td>
              </tr>
            </tbody>
          </table>
          <p className="p-4 text-gray-500 text-center">User management coming soon</p>
        </div>
      )}

      {activeTab === "repos" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Repository</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">-</td>
              </tr>
            </tbody>
          </table>
          <p className="p-4 text-gray-500 text-center">Repository management coming soon</p>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Usage Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Revenue (Placeholder)</h4>
              <p className="text-gray-600">Stripe integration required for revenue tracking</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">API Usage (Placeholder)</h4>
              <p className="text-gray-600">OpenRouter API integration required</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
