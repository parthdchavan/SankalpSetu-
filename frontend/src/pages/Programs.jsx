const programs = [
  { icon: '📚', title: 'Education Support', desc: 'Scholarships, tutoring, and digital literacy programs for underprivileged students.', tag: 'Education' },
  { icon: '🏥', title: 'Health Camps', desc: 'Free medical checkups, awareness drives, and mental health support.', tag: 'Health' },
  { icon: '🌾', title: 'Rural Development', desc: 'Skill training and livelihood programs for rural communities.', tag: 'Livelihood' },
  { icon: '♻️', title: 'Green Initiative', desc: 'Tree plantation drives, waste management, and eco-awareness campaigns.', tag: 'Environment' },
  { icon: '👩‍💻', title: 'Women Empowerment', desc: 'Tech training, self-help groups, and entrepreneurship support for women.', tag: 'Empowerment' },
  { icon: '🤝', title: 'Volunteer Network', desc: 'Connect with NGOs and contribute your time, skills, and energy.', tag: 'Volunteering' },
]

export default function Programs() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-extrabold text-indigo-700 mb-2">Our Programs</h2>
      <p className="text-gray-500 mb-10">Explore initiatives making a real difference on the ground.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((p) => (
          <div key={p.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-3">{p.icon}</div>
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">{p.tag}</span>
            <h3 className="text-gray-800 font-bold text-lg mt-3 mb-1">{p.title}</h3>
            <p className="text-gray-500 text-sm">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
