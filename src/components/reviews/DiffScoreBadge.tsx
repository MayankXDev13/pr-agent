interface DiffScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function DiffScoreBadge({ score, size = "md" }: DiffScoreBadgeProps) {
  const getColor = () => {
    if (score >= 4.5) return "bg-green-500";
    if (score >= 3.5) return "bg-green-400";
    if (score >= 2.5) return "bg-yellow-500";
    if (score >= 1.5) return "bg-orange-500";
    return "bg-red-500";
  };

  const getLabel = () => {
    if (score >= 4.5) return "Excellent";
    if (score >= 3.5) return "Good";
    if (score >= 2.5) return "Needs Work";
    if (score >= 1.5) return "Issues Found";
    return "Critical";
  };

  const sizeClasses = {
    sm: "w-12 h-12 text-lg",
    md: "w-16 h-16 text-2xl",
    lg: "w-24 h-24 text-4xl",
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`${getColor()} ${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
      >
        {score.toFixed(1)}
      </div>
      <span className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
        {getLabel()}
      </span>
    </div>
  );
}

export function ScoreLegend() {
  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Diff Score Scale
      </h4>
      <div className="grid grid-cols-5 gap-2 text-xs">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
            1
          </div>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Critical</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 mx-auto rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
            2
          </div>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Issues</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 mx-auto rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
            3
          </div>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Fair</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 mx-auto rounded-full bg-green-400 flex items-center justify-center text-white font-bold">
            4
          </div>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Good</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 mx-auto rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
            5
          </div>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Excellent</p>
        </div>
      </div>
    </div>
  );
}
