export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-64 bg-card shadow-sm border-r border-border p-6">
        <div className="mb-8">
          <div className="h-8 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-6 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-8">
        <div className="mb-6">
          <div className="h-8 bg-muted rounded w-1/3 animate-pulse mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/5 animate-pulse"></div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading dashboard...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
