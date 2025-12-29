export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-20 bg-card shadow-sm"></div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-muted rounded w-1/4 animate-pulse mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto animate-pulse mb-4"></div>
                <div className="h-6 bg-muted rounded w-3/4 mx-auto animate-pulse mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto animate-pulse"></div>
              </div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="mt-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
