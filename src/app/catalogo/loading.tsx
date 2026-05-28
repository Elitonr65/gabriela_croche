import ProductSkeleton from "@/components/ProductSkeleton"

export default function CatalogoLoading() {
  return (
    <div className="app-container py-8">
      <section className="card p-6">
        <div className="grid gap-5 md:grid-cols-[1fr_18rem] md:items-end">
          <div className="animate-pulse">
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="mt-2 h-8 w-64 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-80 rounded bg-gray-200" />
          </div>
          <div className="animate-pulse rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="h-8 w-10 rounded bg-gray-200" />
            <div className="mt-1 h-4 w-20 rounded bg-gray-200" />
          </div>
        </div>
        <div className="mt-6">
          <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200" />
        </div>
      </section>

      <section className="mt-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
        </div>
      </section>
    </div>
  )
}
