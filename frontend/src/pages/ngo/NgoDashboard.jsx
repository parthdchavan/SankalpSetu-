import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, Package, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { staggerContainer, staggerItem } from '../../design-system/animations/variants';

const mockNgo = {
  name: 'Mumbai Food Bank',
  verificationStatus: 'VERIFIED',
  totalAccepted: 48,
  activePickups: 3,
  mealsDistributed: 1240,
};

const nearbyDonations = [
  { id: '1', category: 'Cooked Food', quantity: '12 kg', distance: '1.2 km', expiresIn: '3 hrs', donor: 'Parth S.' },
  { id: '2', category: 'Packaged Food', quantity: '20 boxes', distance: '2.4 km', expiresIn: '6 hrs', donor: 'Riya M.' },
  { id: '3', category: 'Bakery Items', quantity: '15 pieces', distance: '3.1 km', expiresIn: '2 hrs', donor: 'Amit K.' },
];

export default function NgoDashboard() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">{mockNgo.name}</h1>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  {mockNgo.verificationStatus}
                </span>
              </div>
            </div>
            <div className="hidden md:block bg-white/10 p-3 rounded-xl">
              <Building2 className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="space-y-8">

          {/* Stats */}
          <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard icon={<Package className="w-6 h-6 text-emerald-600" />} bg="bg-emerald-50" label="Total Accepted" value={mockNgo.totalAccepted} sub="donations accepted" />
            <StatCard icon={<Clock className="w-6 h-6 text-amber-600" />} bg="bg-amber-50" label="Active Pickups" value={mockNgo.activePickups} sub="in progress right now" />
            <StatCard icon={<TrendingUp className="w-6 h-6 text-blue-600" />} bg="bg-blue-50" label="Meals Distributed" value={mockNgo.mealsDistributed} sub="to people in need" />
          </motion.div>

          {/* Nearby Donations */}
          <motion.div variants={staggerItem}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900">Nearby Donations</h2>
              <span className="text-sm text-neutral-500">{nearbyDonations.length} available</span>
            </div>
            <div className="space-y-3">
              {nearbyDonations.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <div className="bg-white rounded-2xl border border-neutral-100 p-5 hover:border-emerald-200 hover:shadow-md transition-all flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900">{d.category}</p>
                      <div className="flex items-center gap-3 text-sm text-neutral-500 mt-0.5">
                        <span>{d.quantity}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{d.distance}</span>
                        <span className="flex items-center gap-1 text-amber-600 font-medium"><Clock className="w-3.5 h-3.5" />Expires in {d.expiresIn}</span>
                      </div>
                    </div>
                    <button className="flex-shrink-0 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
                      Accept
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon, bg, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-neutral-900">{value}</p>
          <p className="text-sm text-neutral-500 mt-1">{sub}</p>
        </div>
        <div className={`${bg} p-3 rounded-xl`}>{icon}</div>
      </div>
    </div>
  );
}
