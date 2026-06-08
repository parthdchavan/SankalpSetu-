import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart } from 'lucide-react';
import { Button } from '../design-system/components/Button';

/**
 * Navbar Component - Production-quality navigation
 * 
 * Features:
 * - Responsive design (mobile hamburger menu)
 * - Smooth animations with Framer Motion
 * - Design system colors (Deep Emerald Green)
 * - Auth-ready (Login/Register buttons)
 * - Accessibility compliant
 */

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/ngo-directory', label: 'NGO Directory' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition">
            <Heart className="w-8 h-8 fill-current" />
            <span className="text-xl font-bold tracking-tight">Sankalp Setu</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary-600'
                        : 'text-neutral-600 hover:text-primary-600'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-neutral-200 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Nav Links */}
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-neutral-200 space-y-2">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="md" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}>
                  <Button variant="primary" size="md" fullWidth>
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
