import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, LayoutDashboard, Plus, Clock, LogOut, Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const donorNav = [
  { to: '/donor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/donor/donate',    icon: Plus,            label: 'New Donation' },
  { to: '/donor/history',   icon: Clock,           label: 'History' },
];

export default function DashboardSidebar({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const Nav = ({ onClose }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow">
          <Heart className="w-5 h-5 text-primary-600 fill-current" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">Sankalp Setu</span>
      </div>

      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 bg-white/10 rounded-xl px-3 py-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
            <span className="text-white font-bold text-sm">{user?.firstName?.[0]?.toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{user?.firstName}</p>
            <p className="text-primary-200 text-xs capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {donorNav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-white text-primary-700 shadow-md' : 'text-primary-100 hover:bg-white/15 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-primary-200 hover:bg-white/10 hover:text-white transition-all">
          <LogOut className="w-5 h-5" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-primary-700 to-primary-900 fixed inset-y-0 left-0 z-30 shadow-2xl">
        <Nav onClose={() => {}} />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-primary-700 to-primary-900 z-50 lg:hidden shadow-2xl">
              <Nav onClose={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 h-16 flex items-center justify-between shadow-sm">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <button className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-2 pl-2 ml-1 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center shadow">
                <span className="text-white font-bold text-xs">{user?.firstName?.[0]?.toUpperCase()}</span>
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user?.firstName}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
