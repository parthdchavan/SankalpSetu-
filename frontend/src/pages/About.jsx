export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-extrabold text-indigo-700 mb-6">About Sankalp Setu</h2>
      <p className="text-gray-600 text-lg leading-relaxed mb-6">
        Sankalp Setu is a platform that bridges the gap between NGOs, volunteers, donors, and communities in need.
        We believe in collective action — every sankalp (pledge) builds a setu (bridge) to a better world.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {[
          { title: 'Our Mission', desc: 'To connect people with the right resources, programs, and communities for meaningful impact.' },
          { title: 'Our Vision', desc: 'A world where no community is left behind due to lack of access to opportunities.' },
          { title: 'Our Values', desc: 'Transparency, inclusivity, empathy, and accountability drive everything we do.' },
          { title: 'Our Team', desc: 'A passionate group of changemakers, developers, and social workers united by purpose.' },
        ].map((item) => (
          <div key={item.title} className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <h3 className="text-indigo-700 font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
