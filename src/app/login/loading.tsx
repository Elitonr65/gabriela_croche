export default function LoginLoading() {
  return (
    <div className="app-container grid min-h-[calc(100vh-8rem)] items-center gap-6 py-8 lg:grid-cols-[1fr_26rem]">
      <section className="animate-pulse">
        <div className="h-4 w-12 rounded bg-gray-200" />
        <div className="mt-4 h-8 w-3/4 rounded bg-gray-200" />
        <div className="mt-4 h-4 w-2/3 rounded bg-gray-200" />
      </section>

      <div className="card animate-pulse p-6">
        <div className="h-7 w-24 rounded bg-gray-200" />
        <div className="mt-6 h-4 w-12 rounded bg-gray-200" />
        <div className="mt-2 h-12 w-full rounded-lg bg-gray-200" />
        <div className="mt-5 h-4 w-12 rounded bg-gray-200" />
        <div className="mt-2 h-12 w-full rounded-lg bg-gray-200" />
        <div className="mt-6 h-12 w-full rounded-lg bg-gray-200" />
      </div>
    </div>
  )
}
