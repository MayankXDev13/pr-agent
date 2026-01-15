export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Repositories Card */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Repositories
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    0
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
            <div className="text-sm">
              <a href="/dashboard/repos" className="font-medium text-blue-600 hover:text-blue-500">
                View all
              </a>
            </div>
          </div>
        </div>

        {/* Reviews Card */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Reviews This Month
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    0 / 100
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
            <div className="text-sm">
              <a href="/dashboard/reviews" className="font-medium text-blue-600 hover:text-blue-500">
                View all
              </a>
            </div>
          </div>
        </div>

        {/* Plan Card */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Current Plan
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    Free
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
            <div className="text-sm">
              <a href="/dashboard/settings" className="font-medium text-blue-600 hover:text-blue-500">
                Upgrade
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href="/dashboard/repos"
            className="relative block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Add Repository
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Connect a GitHub repository to start reviewing PRs
            </p>
          </a>
          <a
            href="/dashboard/ask"
            className="relative block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Ask About Code
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Get AI-powered answers about your codebase
            </p>
          </a>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">
          Coming Soon
        </h3>
        <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
          Phase 2-8 implementation pending. This is Phase 1 (Foundation) - Authentication is set up.
        </p>
      </div>
    </div>
  );
}
