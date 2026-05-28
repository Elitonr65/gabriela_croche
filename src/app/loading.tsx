import ProductSkeleton from "@/components/ProductSkeleton"

export default function HomeLoading() {
  return (
    <div className="app-container py-8">
      <section className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="card animate-pulse p-6">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="mt-4 h-8 w-3/4 rounded bg-gray-200" />
          <div className="mt-4 h-4 w-2/3 rounded bg-gray-200" />
          <div className="mt-6 flex gap-3">
            <div className="h-12 w-36 rounded-lg bg-gray-200" />
            <div className="h-12 w-36 rounded-lg bg-gray-200" />
          </div>
        </div>
        <aside className="card animate-pulse p-6">
          <div className="h-4 w-28 rounded bg-gray-200" />
          <div className="mt-4 h-10 w-12 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-40 rounded bg-gray-200" />
        </aside>
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="mt-2 h-6 w-48 rounded bg-gray-200" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
        </div>
      </section>
    </div>
  )
}
