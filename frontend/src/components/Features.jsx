import { Link } from 'react-router-dom'

const features = [
  { icon: '📚', title: 'Education', desc: 'Access quality learning resources and mentorship programs.', color: 'bg-blue-50 border-blue-100', iconBg: 'bg-blue-100' },
  { icon: '🤝', title: 'Community', desc: 'Connect with like-minded people working toward change.', color: 'bg-green-50 border-green-100', iconBg: 'bg-green-100' },
  { icon: '💡', title: 'Opportunities', desc: 'Discover scholarships, internships, and skill programs.', color: 'bg-yellow-50 border-yellow-100', iconBg: 'bg-yellow-100' },
  { icon: '🌍', title: 'Impact', desc: 'Track real-world change driven by collective action.', color: 'bg-purple-50 border-purple-100', iconBg: 'bg-purple-100' },
]

export default function Features() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">What We Offer</h2>
        <p className="text-center text-gray-400 text-sm mb-12">Everything you need to create lasting impact.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className={`rounded-2xl p-6 border ${f.color} hover:shadow-md transition`}>
              <div className={`${f.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4`}>{f.icon}</div>
              <h3 className="text-gray-800 font-bold text-lg mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/programs" className="bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full hover:bg-indigo-800 transition">
            View All Programs →
          </Link>
        </div>
      </div>
    </section>
  )
}
