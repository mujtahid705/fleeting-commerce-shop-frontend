export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header placeholder */}
      <div className="h-20 bg-white shadow-sm"></div>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6">
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images Skeleton */}
          <div className="space-y-4">
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>

            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>

            <div className="flex space-x-4">
              <div className="h-12 bg-gray-200 rounded flex-1 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-12 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading product details...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
