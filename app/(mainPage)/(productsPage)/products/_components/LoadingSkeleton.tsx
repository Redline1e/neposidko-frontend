export default function LoadingSkeleton() {
    return (
      <div className="flex w-full min-h-[calc(100vh-250px)] animate-pulse">
        <div className="w-64 bg-gray-100 p-4 space-y-4">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }