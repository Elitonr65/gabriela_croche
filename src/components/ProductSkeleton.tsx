export default function ProductSkeleton() {
  return (
    <div className="card animate-pulse overflow-hidden">
      <div className="h-56 bg-gray-200" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  )
}
