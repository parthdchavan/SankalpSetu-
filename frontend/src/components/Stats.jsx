const stats = [
  { value: '500+', label: 'NGOs Partnered' },
  { value: '12K+', label: 'Volunteers' },
  { value: '₹2Cr+', label: 'Donations Raised' },
  { value: '50K+', label: 'Lives Impacted' },
]

export default function Stats() {
  return (
    <section className="bg-indigo-700 text-white py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-4xl font-extrabold">{s.value}</p>
            <p className="text-indigo-200 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
