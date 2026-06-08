import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Calendar, MapPin, Search, Heart, ArrowRight } from 'lucide-react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { donationService } from '../../services/donationService';

const stagger = { animate: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

const STATUS = {
  PENDING:            { label: 'Pending',           badge: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-400' },
  ACCEPTED:           { label: 'Accepted',          badge: 'bg-blue-50 text-blue-700 border-blue-200',     dot: 'bg-blue-400' },
  VOLUNTEER_ASSIGNED: { label: 'Vol. Assigned',     badge: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-400' },
  PICKED_UP:          { label: 'Picked Up',         badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-400' },
  DELIVERED:          { label: 'Delivered',         badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  EXPIRED:            { label: 'Expired',           badge: 'bg-slate-50 text-slate-500 border-slate-200',   dot: 'bg-slate-300' },
  CANCELLED:          { label: 'Cancelled',         badge: 'bg-red-50 text-red-600 border-red-200',         dot: 'bg-red-400' },
};

const FOOD_ICONS = { 'Cooked Food':'🍛','Packaged Food':'📦','Fruits':'🍎','Vegetables':'🥦','Bakery':'🍞','Beverages':'🧃' };
const FILTERS = ['All', 'Active', 'Delivered', 'Cancelled'];
const ACTIVE_STATUSES = ['PENDING','ACCEPTED','VOLUNTEER_ASSIGNED','PICKED_UP'];

export default function DonationHistory() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    donationService.myDonations()
      .then(setDonations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => donations.filter(d => {
    const matchSearch = d.foodName?.toLowerCase().includes(search.toLowerCase()) ||
      d.foodCategory?.toLowerCase().includes(search.toLowerCase()) ||
      d.city?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'All' ||
      (filter === 'Active' && ACTIVE_STATUSES.includes(d.status)) ||
      (filter === 'Delivered' && d.status === 'DELIVERED') ||
      (filter === 'Cancelled' && d.status === 'CANCELLED');
    return matchSearch && matchFilter;
  }), [donations, search, filter]);

  const totalMeals = donations
    .filter(d => d.status === 'DELIVERED')
    .reduce((s, d) => s + (d.servesPeople || 0), 0);

  return (
    <DashboardSidebar>
      <motion.div initial="initial" animate="animate" variants={stagger} className="space-y-6 max-w-4xl mx-auto">

        {/* Header */}
        <motion.div variants={fadeUp}>
          <h1 className="text-2xl font-extrabold text-slate-900">Donation History</h1>
          <p className="text-slate-400 text-sm mt-1">Track all your food donations</p>
        </motion.div>

        {/* Impact Banner */}
        <motion.div variants={fadeUp}
          className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-6 text-white flex items-center justify-between shadow-xl shadow-primary-200 overflow-hidden relative">
          <div className="absolute -right-6 -top-6 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute right-12 -bottom-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="relative">
            <p className="text-primary-100 text-sm font-medium">Your total lifetime impact</p>
            <p className="text-5xl font-black mt-1 tracking-tight">
              {loading ? '—' : totalMeals.toLocaleString()}
            </p>
            <p className="text-primary-200 text-sm mt-1">meals provided to people in need</p>
          </div>
          <div className="relative w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center border border-white/20 flex-shrink-0">
            <Heart className="w-8 h-8 fill-white" />
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by food name, category or city..."
              className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all border ${
                  filter === f ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200' : 'bg-white text-slate-500 border-slate-200 hover:border-primary-300'
                }`}>
                {f}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400 self-center font-medium">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse flex gap-4">
                <div className="w-14 h-14 bg-slate-200 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div variants={fadeUp} className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-14 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-700">No donations found</p>
            <p className="text-sm text-slate-400 mt-1">Try a different search or filter</p>
          </motion.div>
        ) : (
          <motion.div variants={stagger} className="space-y-3">
            {filtered.map((d, i) => {
              const s = STATUS[d.status] || STATUS.PENDING;
              const icon = FOOD_ICONS[d.foodCategory] || '🍽️';
              return (
                <motion.div key={d.id} variants={fadeUp} transition={{ delay: i * 0.04 }}>
                  <Link to={`/donor/donations/${d.id}`}>
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-primary-200 hover:shadow-lg transition-all flex items-center gap-4 group cursor-pointer">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl shadow-sm">
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-slate-900">{d.foodName}</span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${s.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {s.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Package className="w-3 h-3" />{d.quantity} {d.quantityUnit}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(d.createdAt).toLocaleDateString('en-IN')}</span>
                          {d.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{d.city}</span>}
                        </div>
                        {d.foodCategory && <p className="text-xs text-slate-300 mt-1">{d.foodCategory}</p>}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {d.status === 'DELIVERED' && d.servesPeople && (
                          <div className="hidden sm:block text-right">
                            <p className="text-lg font-black text-primary-600">{d.servesPeople}</p>
                            <p className="text-xs text-slate-400">meals</p>
                          </div>
                        )}
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </DashboardSidebar>
  );
}
