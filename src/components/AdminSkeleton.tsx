export default function AdminSkeleton() {
  return (
    <div className="card animate-pulse p-4">
      <div className="grid gap-4 lg:grid-cols-[5rem_1fr_10rem] lg:items-center">
        <div className="h-20 rounded-lg bg-gray-200" />

        <div className="space-y-3">
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
        </div>

        <div className="grid gap-2">
          <div className="h-10 rounded-lg bg-gray-200" />
          <div className="h-10 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  )
}
