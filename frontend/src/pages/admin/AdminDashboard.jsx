import { motion } from 'framer-motion';
import { Users, Building2, Package, TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';
import { staggerContainer, staggerItem } from '../../design-system/animations/variants';

const stats = [
  { label: 'Total Users', value: '3,241', change: '+12%', icon: <Users className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50' },
  { label: 'Verified NGOs', value: '127', change: '+3', icon: <Building2 className="w-6 h-6 text-green-600" />, bg: 'bg-green-50' },
  { label: 'Active Donations', value: '48', change: '+7 today', icon: <Package className="w-6 h-6 text-amber-600" />, bg: 'bg-amber-50' },
  { label: 'Meals This Month', value: '18,420', change: '+22%', icon: <TrendingUp className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-50' },
];

const pendingNgos = [
  { id: '1', name: 'Seva Foundation', city: 'Mumbai', submittedAt: '2024-06-08' },
  { id: '2', name: 'Asha Trust', city: 'Delhi', submittedAt: '2024-06-07' },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
          <p className="text-neutral-500 mt-1">Platform overview — Sankalp Setu</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="space-y-8">

          {/* Stats Grid */}
          <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-neutral-100 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">{s.label}</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-1">{s.value}</p>
                    <p className="text-sm text-green-600 font-medium mt-1">{s.change}</p>
                  </div>
                  <div className={`${s.bg} p-3 rounded-xl`}>{s.icon}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Pending NGO Verifications */}
          <motion.div variants={staggerItem}>
            <div className="bg-white rounded-2xl border border-neutral-100">
              <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-100">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-neutral-900">Pending NGO Verifications</h2>
                <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">{pendingNgos.length}</span>
              </div>
              <div className="divide-y divide-neutral-100">
                {pendingNgos.map(n => (
                  <div key={n.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="font-medium text-neutral-900">{n.name}</p>
                      <p className="text-sm text-neutral-500">{n.city} · Submitted {new Date(n.submittedAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-1.5 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Reject</button>
                      <button className="px-4 py-1.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
