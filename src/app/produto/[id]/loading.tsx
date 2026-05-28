export default function ProdutoLoading() {
  return (
    <div className="app-container py-8">
      <div className="mb-5 h-4 w-32 animate-pulse rounded bg-gray-200" />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_24rem]">
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="h-[28rem] animate-pulse rounded-lg bg-gray-200 sm:col-span-2" />
          <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
        </section>

        <aside className="card h-fit animate-pulse p-6">
          <div className="h-6 w-40 rounded-full bg-gray-200" />
          <div className="mt-4 h-8 w-3/4 rounded bg-gray-200" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
          <div className="my-6 border-y border-gray-200 py-5">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-56 rounded bg-gray-200" />
          </div>
          <div className="h-12 w-full rounded-lg bg-gray-200" />
        </aside>
      </div>
    </div>
  )
}
