"use client";

import { FaChartLine, FaUsers, FaFileAlt, FaClock, FaExclamationCircle } from "react-icons/fa";

const MOCK_CHART_DATA = {
  reviewsByDay: [
    { day: "Mon", reviews: 45 },
    { day: "Tue", reviews: 52 },
    { day: "Wed", reviews: 38 },
    { day: "Thu", reviews: 65 },
    { day: "Fri", reviews: 58 },
    { day: "Sat", reviews: 22 },
    { day: "Sun", reviews: 18 },
  ],
  findingsBySeverity: [
    { severity: "Critical", count: 12, color: "bg-red-500" },
    { severity: "High", count: 45, color: "bg-orange-500" },
    { severity: "Medium", count: 128, color: "bg-yellow-500" },
    { severity: "Low", count: 234, color: "bg-green-500" },
  ],
  topRepos: [
    { name: "pr-agent", reviews: 89, findings: 156 },
    { name: "portfolio", reviews: 45, findings: 78 },
    { name: "learning-dashboard", reviews: 34, findings: 56 },
    { name: "ecommerce-api", reviews: 28, findings: 45 },
    { name: "mobile-app", reviews: 21, findings: 32 },
  ],
  reviewTimeTrend: [
    { week: "Week 1", time: 3.2 },
    { week: "Week 2", time: 2.9 },
    { week: "Week 3", time: 2.7 },
    { week: "Week 4", time: 2.3 },
  ],
};

export default function AdminAnalyticsPage() {
  const totalFindings = MOCK_CHART_DATA.findingsBySeverity.reduce((sum, f) => sum + f.count, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-gray-600 mt-1">Review metrics and performance insights</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>All time</option>
          </select>
          <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Total Reviews</span>
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <FaChartLine className="h-4 w-4" />
              +12%
            </span>
          </div>
          <div className="text-3xl font-bold">1,247</div>
          <div className="text-sm text-gray-500 mt-1">This month</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Avg Review Time</span>
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <FaChartLine className="h-4 w-4" style={{ transform: 'rotate(180deg)' }} />
              -8%
            </span>
          </div>
          <div className="text-3xl font-bold">2.3s</div>
          <div className="text-sm text-gray-500 mt-1">Improved from 2.5s</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Findings Rate</span>
            <span className="flex items-center gap-1 text-red-600 text-sm">
              <FaChartLine className="h-4 w-4" />
              +5%
            </span>
          </div>
          <div className="text-3xl font-bold">419</div>
          <div className="text-sm text-gray-500 mt-1">Total findings detected</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Completion Rate</span>
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <FaChartLine className="h-4 w-4" />
              +2%
            </span>
          </div>
          <div className="text-3xl font-bold">94.2%</div>
          <div className="text-sm text-gray-500 mt-1">Reviews completed</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Reviews by Day</h2>
          <div className="space-y-3">
            {MOCK_CHART_DATA.reviewsByDay.map((day) => (
              <div key={day.day} className="flex items-center gap-4">
                <span className="w-8 text-sm text-gray-600">{day.day}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                  <div
                    className="bg-black h-6 rounded-full absolute left-0 top-0"
                    style={{ width: `${(day.reviews / 70) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-sm font-medium text-right">{day.reviews}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Findings by Severity</h2>
          <div className="space-y-4">
            {MOCK_CHART_DATA.findingsBySeverity.map((item) => (
              <div key={item.severity}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm">{item.severity}</span>
                  </div>
                  <span className="text-sm font-medium">{item.count} ({((item.count / totalFindings) * 100).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${(item.count / totalFindings) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Top Repositories by Reviews</h2>
          <div className="space-y-3">
            {MOCK_CHART_DATA.topRepos.map((repo, index) => (
              <div key={repo.name} className="flex items-center gap-4">
                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="font-medium">{repo.name}</div>
                  <div className="text-sm text-gray-500">{repo.findings} findings</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{repo.reviews}</div>
                  <div className="text-sm text-gray-500">reviews</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Review Time Trend</h2>
          <div className="flex items-end justify-between h-48 pt-8">
            {MOCK_CHART_DATA.reviewTimeTrend.map((week, index) => (
              <div key={week.week} className="flex flex-col items-center gap-2 flex-1">
                <div className="text-sm font-medium">{week.time}s</div>
                <div
                  className="w-full bg-black rounded-t"
                  style={{ height: `${(week.time / 4) * 100}%` }}
                />
                <span className="text-xs text-gray-500">{week.week}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <FaChartLine className="h-4 w-4" style={{ transform: 'rotate(180deg)' }} />
              28% faster review times over the past month
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-700">
          <FaExclamationCircle className="h-5 w-5" />
          <span className="font-medium">Note:</span>
          <span className="text-sm">
            Charts use mock data. Connect to Convex database for real analytics.
          </span>
        </div>
      </div>
    </div>
  );
}
