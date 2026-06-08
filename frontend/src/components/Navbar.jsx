import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/programs', label: 'Programs' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">🌱 Sankalp Setu</Link>

        {/* Desktop */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive ? 'text-white underline underline-offset-4' : 'text-indigo-200 hover:text-white transition'
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <Link to="/contact" className="hidden md:block bg-white text-indigo-700 text-sm font-semibold px-4 py-2 rounded-full hover:bg-indigo-50 transition">
          Get Involved
        </Link>

        {/* Mobile toggle */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden bg-indigo-800 px-6 pb-4 flex flex-col gap-3 text-sm font-medium">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive ? 'text-white font-bold' : 'text-indigo-200 hover:text-white transition'
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
