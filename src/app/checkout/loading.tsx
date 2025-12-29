export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-20 bg-card shadow-sm"></div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="h-8 bg-muted rounded w-48 mx-auto animate-pulse mb-2"></div>
          <div className="h-4 bg-muted rounded w-64 mx-auto animate-pulse"></div>
        </div>
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
                {i < 2 && (
                  <div className="w-16 h-0.5 bg-muted mx-4 animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse mb-6"></div>
              <div className="space-y-4 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading checkout...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
