import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-28 px-6 text-center">
      <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-6 inline-block">
        🌱 Together We Grow
      </span>
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
        Bridging Gaps,<br />Building Futures
      </h1>
      <p className="text-lg text-indigo-100 max-w-xl mx-auto mb-10">
        Sankalp Setu connects communities with NGOs, volunteers, donors, and opportunities for a better tomorrow.
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <Link to="/programs" className="bg-white text-indigo-700 font-semibold px-7 py-3 rounded-full hover:bg-indigo-50 transition shadow-lg">
          Explore Programs
        </Link>
        <Link to="/contact" className="border-2 border-white text-white font-semibold px-7 py-3 rounded-full hover:bg-white hover:text-indigo-700 transition">
          Get Involved
        </Link>
      </div>
    </section>
  )
}
