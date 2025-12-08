export default function CategoriesLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="px-6 py-4 border-b border-gray-200 last:border-b-0"
          >
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, j) => (
                <div
                  key={j}
                  className="h-6 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mb-2"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    </div>
  );
}
