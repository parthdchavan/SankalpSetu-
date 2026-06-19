import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Building2, CheckCircle2, Clock, Loader2, Package, ShieldCheck, TrendingUp, Users, XCircle } from 'lucide-react';
import { staggerContainer, staggerItem } from '../../design-system/animations/variants';
import { adminService } from '../../services/adminService';

function formatDate(value) {
  if (!value) return 'date unavailable';
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workingId, setWorkingId] = useState(null);

  async function loadDashboard() {
    const data = await adminService.dashboard();
    setDashboard(data);
  }

  useEffect(() => {
    let mounted = true;
    loadDashboard()
      .then(() => mounted && setError(''))
      .catch((err) => mounted && setError(err.message || 'Could not load admin dashboard.'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  async function handleNgoAction(ngoId, action) {
    try {
      setWorkingId(ngoId);
      setError('');
      if (action === 'approve') {
        await adminService.approveNgo(ngoId);
      } else {
        await adminService.rejectNgo(ngoId);
      }
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Action failed. Please try again.');
    } finally {
      setWorkingId(null);
    }
  }

  const pendingNgos = dashboard?.pendingNgos || [];
  const recentDonations = dashboard?.recentDonations || [];
  const stats = [
    { label: 'Total Users', value: dashboard?.totalUsers, change: `${dashboard?.donorCount ?? 0} donors · ${dashboard?.volunteerCount ?? 0} volunteers`, icon: <Users className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Verified NGOs', value: dashboard?.verifiedNgoCount, change: `${dashboard?.pendingNgoCount ?? 0} pending`, icon: <Building2 className="w-6 h-6 text-green-600" />, bg: 'bg-green-50' },
    { label: 'Active Donations', value: dashboard?.activeDonationCount, change: `${dashboard?.deliveredDonationCount ?? 0} delivered`, icon: <Package className="w-6 h-6 text-amber-600" />, bg: 'bg-amber-50' },
    { label: 'Meals This Month', value: dashboard?.mealsThisMonth, change: 'from live analytics', icon: <TrendingUp className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
          <p className="text-neutral-500 mt-1">Platform overview for Sankalp Setu operations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="space-y-8">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-neutral-100 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">{s.label}</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-1">{loading ? '...' : (s.value ?? 0).toLocaleString('en-IN')}</p>
                    <p className="text-sm text-green-600 font-medium mt-1">{s.change}</p>
                  </div>
                  <div className={`${s.bg} p-3 rounded-xl`}>{s.icon}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={staggerItem} className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="bg-white rounded-2xl border border-neutral-100">
              <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-100">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-neutral-900">Pending NGO Verifications</h2>
                <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">{pendingNgos.length}</span>
              </div>
              <div className="divide-y divide-neutral-100">
                {loading ? (
                  <div className="flex items-center gap-3 px-6 py-8 text-neutral-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading NGO requests...
                  </div>
                ) : pendingNgos.length ? pendingNgos.map(n => (
                  <div key={n.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="font-medium text-neutral-900">{n.organizationName}</p>
                      <p className="text-sm text-neutral-500">{n.city || 'City not set'}{n.state ? `, ${n.state}` : ''} · Submitted {formatDate(n.submittedAt)}</p>
                      <p className="text-xs text-neutral-400 mt-1">{n.contactName} · {n.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button disabled={workingId === n.id} onClick={() => handleNgoAction(n.id, 'reject')} className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors">
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                      <button disabled={workingId === n.id} onClick={() => handleNgoAction(n.id, 'approve')} className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="px-6 py-10 text-sm text-neutral-500">No NGOs are waiting for verification.</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-100">
              <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-100">
                <Clock className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-neutral-900">Recent Donations</h2>
              </div>
              <div className="divide-y divide-neutral-100">
                {loading ? (
                  <div className="px-6 py-8 text-sm text-neutral-500">Loading donations...</div>
                ) : recentDonations.length ? recentDonations.map(donation => (
                  <div key={donation.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-neutral-900">{donation.foodName}</p>
                        <p className="text-sm text-neutral-500">{donation.donorName || 'Donor'} · {donation.city || 'City not set'}</p>
                        <p className="text-xs text-neutral-400 mt-1">{formatDate(donation.createdAt)}</p>
                      </div>
                      <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-semibold text-neutral-600">{donation.status}</span>
                    </div>
                  </div>
                )) : (
                  <div className="px-6 py-10 text-sm text-neutral-500">No donations yet.</div>
                )}
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
