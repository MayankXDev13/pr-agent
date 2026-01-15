interface IndexingStatusProps {
  status: {
    state: string;
    progress: number;
    filesCount?: number;
    lastIndexedAt?: number;
  } | null;
  onStartIndexing: () => void;
  onRemove: () => void;
  isIndexing: boolean;
}

export function IndexingStatus({ status, onStartIndexing, onRemove, isIndexing }: IndexingStatusProps) {
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Never";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusInfo = () => {
    switch (status?.state) {
      case "completed":
        return {
          badge: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          text: "Indexed",
          icon: (
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
        };
      case "indexing":
        return {
          badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          text: `Indexing ${status.progress}%`,
          icon: (
            <svg className="w-5 h-5 text-yellow-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ),
        };
      case "failed":
        return {
          badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          text: "Indexing failed",
          icon: (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
          text: "Not indexed",
          icon: (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {statusInfo.icon}
          <div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.badge}`}>
                {statusInfo.text}
              </span>
              {status?.filesCount !== undefined && status.state === "completed" && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {status.filesCount} files
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Last indexed: {formatDate(status?.lastIndexedAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {status?.state === "indexing" && (
            <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${status.progress}%` }}
              />
            </div>
          )}

          {status?.state !== "indexing" && (
            <button
              onClick={onStartIndexing}
              disabled={isIndexing}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isIndexing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Indexing...
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Re-index
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
