import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-indigo-900 text-indigo-200 py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-2">🌱 Sankalp Setu</h3>
          <p className="text-sm">Bridging communities with resources, education, and opportunities.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About</Link></li>
            <li><Link to="/programs" className="hover:text-white transition">Programs</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Contact</h4>
          <p className="text-sm">info@sankalpsetu.org</p>
          <p className="text-sm mt-1">+91 98765 43210</p>
        </div>
      </div>
      <div className="text-center text-xs text-indigo-400 mt-8">
        © {new Date().getFullYear()} Sankalp Setu. All rights reserved.
      </div>
    </footer>
  )
}
