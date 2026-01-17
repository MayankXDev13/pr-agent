import { FaUsers, FaCodeBranch, FaFileAlt, FaClock, FaChartLine, FaExclamationTriangle, FaCog } from "react-icons/fa";

const MOCK_STATS = {
  totalUsers: 156,
  totalRepos: 89,
  totalReviews: 1247,
  avgReviewTime: "2.3s",
  reviewsToday: 23,
  usersThisWeek: 12,
};

const MOCK_RECENT_ACTIVITY = [
  { id: 1, type: "review", user: "mayankxdev", repo: "pr-agent", pr: 42, time: "2 min ago" },
  { id: 2, type: "signup", user: "johndoe", time: "15 min ago" },
  { id: 3, type: "review", user: "developer1", repo: "portfolio", pr: 18, time: "1 hour ago" },
  { id: 4, type: "repo", user: "mayankxdev", repo: "new-project", time: "2 hours ago" },
  { id: 5, type: "review", user: "alice", repo: "learning-dashboard", pr: 7, time: "3 hours ago" },
];

const MOCK_SYSTEM_STATUS = [
  { name: "API Server", status: "healthy", latency: "45ms" },
  { name: "Convex DB", status: "healthy", latency: "12ms" },
  { name: "OpenRouter", status: "healthy", latency: "230ms" },
  { name: "GitHub API", status: "degraded", latency: "850ms" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">System overview and metrics</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <FaUsers className="h-8 w-8 text-blue-600" />
            <span className="text-green-600 text-sm flex items-center gap-1">
              <FaChartLine className="h-4 w-4" />
              +{MOCK_STATS.usersThisWeek}
            </span>
          </div>
          <div className="text-3xl font-bold">{MOCK_STATS.totalUsers}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <FaCodeBranch className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold">{MOCK_STATS.totalRepos}</div>
          <div className="text-sm text-gray-600">Connected Repos</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <FaFileAlt className="h-8 w-8 text-purple-600" />
            <span className="text-green-600 text-sm flex items-center gap-1">
              <FaChartLine className="h-4 w-4" />
              +{MOCK_STATS.reviewsToday}
            </span>
          </div>
          <div className="text-3xl font-bold">{MOCK_STATS.totalReviews}</div>
          <div className="text-sm text-gray-600">Total Reviews</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <FaClock className="h-8 w-8 text-orange-600" />
          </div>
          <div className="text-3xl font-bold">{MOCK_STATS.avgReviewTime}</div>
          <div className="text-sm text-gray-600">Avg Review Time</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {MOCK_RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === "review" ? "bg-purple-500" :
                  activity.type === "signup" ? "bg-green-500" :
                  activity.type === "repo" ? "bg-blue-500" : "bg-gray-500"
                }`} />
                <div className="flex-1">
                  <span className="font-medium">{activity.user}</span>
                  {activity.type === "review" && (
                    <span className="text-gray-600">
                      {" "}reviewed PR #{activity.pr} in <span className="font-mono">{activity.repo}</span>
                    </span>
                  )}
                  {activity.type === "signup" && (
                    <span className="text-gray-600"> signed up</span>
                  )}
                  {activity.type === "repo" && (
                    <span className="text-gray-600">
                      {" "}added <span className="font-mono">{activity.repo}</span>
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">System Status</h2>
          <div className="space-y-4">
            {MOCK_SYSTEM_STATUS.map((system) => (
              <div key={system.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {system.status === "healthy" ? (
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  ) : (
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  )}
                  <span className="font-medium">{system.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${
                    system.status === "healthy" ? "text-green-600" : "text-yellow-600"
                  }`}>
                    {system.status}
                  </span>
                  <span className="text-sm text-gray-500">{system.latency}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaExclamationTriangle className="h-4 w-4" />
              GitHub API experiencing higher than normal latency
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-4">
          <a href="/admin/users" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <FaUsers className="h-8 w-8 mx-auto mb-2 text-gray-600" />
            <span className="font-medium">Manage Users</span>
          </a>
          <a href="/admin/repos" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <FaCodeBranch className="h-8 w-8 mx-auto mb-2 text-gray-600" />
            <span className="font-medium">View Repos</span>
          </a>
          <a href="/admin/analytics" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <FaChartLine className="h-8 w-8 mx-auto mb-2 text-gray-600" />
            <span className="font-medium">Analytics</span>
          </a>
          <a href="/admin/settings" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <FaCog className="h-8 w-8 mx-auto mb-2 text-gray-600" />
            <span className="font-medium">Settings</span>
          </a>
        </div>
      </div>
    </div>
  );
}
