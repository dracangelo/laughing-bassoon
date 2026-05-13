export default function AdminPage() {
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-10">
      <h1 className="mb-3 text-5xl font-black">Admin Dashboard</h1>
      <p className="mb-8 text-slate-600">Internal area for product data, lookups, orders, users, IP blocking, eBay listings and SEO link creation.</p>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["/admin/turbos", "Turbo data entry"],
          ["/admin/car-lookup", "Car reg lookup viewer"],
          ["/admin/car-lookup/stats", "Lookup stats"],
          ["/admin/orders", "Order management"],
          ["/admin/users", "User/IP management"],
          ["/admin/ebay", "eBay listings"],
          ["/admin/seo", "SEO links"]
        ].map(([href, label]) => (
          <a className="bg-white p-5 font-black shadow-ace" href={href} key={href}>{label}</a>
        ))}
      </div>
    </main>
  );
}
