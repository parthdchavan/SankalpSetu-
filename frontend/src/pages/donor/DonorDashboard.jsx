import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus, Package, Clock, CheckCircle2, ArrowRight, Sparkles, MapPin, Calendar } from 'lucide-react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { donationService } from '../../services/donationService';
import { useAuth } from '../../context/useAuth';

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const STATUS = {
  PENDING:            { label: 'Pending',           dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  ACCEPTED:           { label: 'Accepted',          dot: 'bg-blue-400',    badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  VOLUNTEER_ASSIGNED: { label: 'Volunteer Assigned',dot: 'bg-violet-400',  badge: 'bg-violet-50 text-violet-700 border-violet-200' },
  PICKED_UP:          { label: 'Picked Up',         dot: 'bg-indigo-400',  badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  DELIVERED:          { label: 'Delivered',         dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  EXPIRED:            { label: 'Expired',           dot: 'bg-slate-300',   badge: 'bg-slate-50 text-slate-500 border-slate-200' },
  CANCELLED:          { label: 'Cancelled',         dot: 'bg-red-400',     badge: 'bg-red-50 text-red-600 border-red-200' },
};

const FOOD_ICONS = { 'Cooked Food':'🍛', 'Packaged Food':'📦', 'Fruits':'🍎', 'Vegetables':'🥦', 'Bakery':'🍞', 'Beverages':'🧃' };

function StatCard({ icon, value, label, sub, accent, loading }) {
  if (loading) return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
      <div className="h-3 bg-slate-200 rounded w-20 mb-4" />
      <div className="h-9 bg-slate-200 rounded w-16 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-28" />
    </div>
  );
  return (
    <motion.div variants={fadeUp}
      className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${accent} rounded-l-2xl`} />
      <div className="flex items-start justify-between pl-2">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
          <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{value ?? 0}</p>
          <p className="text-sm text-slate-400 mt-1.5">{sub}</p>
        </div>
        <div className={`p-3 rounded-2xl ${accent.replace('bg-', 'bg-').replace('-600','').replace('-500','').replace('-400','')}`}
          style={{ background: 'var(--icon-bg, #f1f5f9)' }}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export default function DonorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([donationService.myStats(), donationService.myDonations()])
      .then(([s, d]) => { setStats(s); setDonations(d.slice(0, 5)); })
      .catch(() => setError('Could not load data. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <DashboardSidebar>
      <motion.div initial="initial" animate="animate" variants={stagger} className="space-y-8 max-w-6xl mx-auto">

        {/* Page Header */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{greeting}, {user?.firstName} 👋</h1>
            <p className="text-slate-500 mt-1 text-sm">Here's your impact summary for today</p>
          </div>
          <Link to="/donor/donate">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-primary-200 transition-colors text-sm">
              <Plus className="w-4 h-4" /> New Donation
            </motion.button>
          </Link>
        </motion.div>

        {error && (
          <motion.div variants={fadeUp} className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
            ⚠️ {error}
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard loading={loading} icon={<Heart className="w-6 h-6 text-primary-600 fill-current" />} value={stats?.totalMealsProvided} label="Meals Provided" sub="lifetime impact" accent="bg-primary-500" />
          <StatCard loading={loading} icon={<Package className="w-6 h-6 text-amber-500" />}            value={stats?.totalDonations}   label="Total Donations" sub="all time"         accent="bg-amber-400" />
          <StatCard loading={loading} icon={<Clock className="w-6 h-6 text-blue-500" />}              value={stats?.activeDonations}  label="Active"          sub="in progress"       accent="bg-blue-400" />
          <StatCard loading={loading} icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />}    value={stats?.completedDonations} label="Completed"     sub="delivered"         accent="bg-emerald-400" />
        </motion.div>

        {/* Hero CTA */}
        <motion.div variants={fadeUp}
          className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 text-white overflow-hidden shadow-xl shadow-primary-200">
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute -right-4 -bottom-12 w-64 h-64 bg-white/5 rounded-full" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/20">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold">Ready to make more impact?</h2>
                <p className="text-primary-100 text-sm mt-1">Every donation feeds hope — takes under 60 seconds</p>
              </div>
            </div>
            <Link to="/donor/donate">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 bg-white text-primary-700 font-extrabold px-7 py-3.5 rounded-2xl hover:bg-primary-50 transition shadow-lg whitespace-nowrap">
                <Plus className="w-5 h-5" /> Create Donation
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Recent Donations */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-extrabold text-slate-900">Recent Donations</h2>
            <Link to="/donor/history" className="text-sm text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse flex gap-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-2xl flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : donations.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center">
              <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
                <Package className="w-10 h-10 text-primary-400" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2">No donations yet</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">Start making a difference — your first donation can feed up to 50 people</p>
              <Link to="/donor/donate">
                <button className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-700 transition shadow-md">
                  <Plus className="w-4 h-4" /> Create First Donation
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {donations.map((d, i) => {
                const s = STATUS[d.status] || STATUS.PENDING;
                const icon = FOOD_ICONS[d.foodCategory] || '🍽️';
                return (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={`/donor/donations/${d.id}`}>
                      <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-primary-200 hover:shadow-lg transition-all flex items-center gap-4 group cursor-pointer">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl shadow-sm">
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-bold text-slate-900 truncate">{d.foodName}</span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                              {s.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                            <span className="flex items-center gap-1"><Package className="w-3 h-3" />{d.quantity} {d.quantityUnit}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(d.createdAt).toLocaleDateString('en-IN')}</span>
                            {d.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{d.city}</span>}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

      </motion.div>
    </DashboardSidebar>
  );
}
