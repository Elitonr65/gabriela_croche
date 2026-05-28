import AdminSkeleton from "@/components/AdminSkeleton"

export default function AdminLoading() {
  return (
    <div className="app-container grid gap-6 py-8 lg:grid-cols-[18rem_1fr]">
      <aside className="card h-fit animate-pulse p-5">
        <div className="h-4 w-12 rounded bg-gray-200" />
        <div className="mt-2 h-8 w-20 rounded bg-gray-200" />
        <div className="mt-6 grid gap-3">
          <div className="h-12 rounded-lg bg-gray-200" />
          <div className="h-12 rounded-lg bg-gray-200" />
        </div>
        <div className="mt-8 h-12 rounded-lg bg-gray-200" />
      </aside>

      <section className="grid gap-5">
        <div className="card animate-pulse p-6">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="mt-2 h-8 w-32 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-56 rounded bg-gray-200" />
          <div className="mt-6 h-12 w-full rounded-lg bg-gray-200" />
        </div>
        <AdminSkeleton />
        <AdminSkeleton />
        <AdminSkeleton />
      </section>
    </div>
  )
}
