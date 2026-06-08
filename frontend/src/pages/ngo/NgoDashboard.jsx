import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Package,
  ShieldAlert,
  Sparkles,
  Route,
  Truck,
  Users,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ngoService } from '../../services/ngoService';
import { staggerContainer, staggerItem } from '../../design-system/animations/variants';

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const REQUEST_STYLES = {
  ACCEPTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
};

const PICKUP_STYLES = {
  ASSIGNED: 'bg-blue-50 text-blue-700 border-blue-200',
  PICKED_UP: 'bg-violet-50 text-violet-700 border-violet-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function formatDateTime(value) {
  if (!value) return 'Not scheduled yet';
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatCard({ icon, value, label, sub, tone, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse">
        <div className="h-3 w-20 bg-slate-200 rounded mb-4" />
        <div className="h-9 w-16 bg-slate-200 rounded mb-2" />
        <div className="h-3 w-28 bg-slate-100 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</p>
          <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{value ?? 0}</p>
          <p className="text-sm text-slate-500 mt-1.5">{sub}</p>
        </div>
        <div className={`${tone} p-3 rounded-2xl`}>{icon}</div>
      </div>
    </div>
  );
}

function Badge({ children, className = '' }) {
  return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${className}`}>{children}</span>;
}

export default function NgoDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');
        const data = await ngoService.dashboard();
        if (mounted) {
          setDashboard(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Could not load NGO dashboard.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  async function refreshDashboard() {
    const data = await ngoService.dashboard();
    setDashboard(data);
  }

  async function handleAction(donationId, action) {
    try {
      setSavingId(donationId);
      setError('');
      if (action === 'accept') {
        await ngoService.acceptDonation(donationId);
      } else {
        await ngoService.rejectDonation(donationId);
      }
      await refreshDashboard();
    } catch (err) {
      setError(err.message || 'Action failed. Please try again.');
    } finally {
      setSavingId(null);
    }
  }

  const isVerified = dashboard?.canAcceptDonations;
  const greetingName = dashboard?.organizationName || user?.firstName || 'your NGO';

  return (
    <div className="min-h-screen bg-[#f6f7f2] text-slate-900">
      <div className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-br from-emerald-700 via-emerald-700 to-lime-600 text-white">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <Badge className="border-white/20 bg-white/10 text-white/95">
                <Sparkles className="h-3.5 w-3.5" />
                NGO operations center
              </Badge>
              <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">{greetingName}</h1>
              <p className="mt-3 text-emerald-50 max-w-2xl text-sm sm:text-base leading-6">
                Review nearby donations, accept the ones you can handle, and keep pickups moving without losing sight of active requests.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[380px]">
              <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/15 p-3"><Building2 className="h-5 w-5" /></div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">Verification</p>
                    <p className="mt-1 font-semibold">{dashboard?.verificationStatus || 'Loading...'}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/15 p-3"><MapPin className="h-5 w-5" /></div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">Coverage</p>
                    <p className="mt-1 font-semibold">{dashboard?.city || 'City not set'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!loading && dashboard && !isVerified && (
            <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50/95 p-4 text-amber-900 shadow-sm">
              <div className="flex gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">Verification required before accepting donations</p>
                  <p className="text-amber-800/90">Your profile is currently {dashboard.verificationStatus.toLowerCase()}. You can still review the flow, but acceptance actions remain disabled until verification is approved.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <motion.div variants={staggerItem}><StatCard loading={loading} icon={<Package className="h-6 w-6 text-emerald-600" />} value={dashboard?.pendingDonationCount} label="Pending donations" sub="nearby opportunities awaiting action" tone="bg-emerald-50" /></motion.div>
          <motion.div variants={staggerItem}><StatCard loading={loading} icon={<Truck className="h-6 w-6 text-blue-600" />} value={dashboard?.activePickupCount} label="Active pickups" sub="assigned or in transit" tone="bg-blue-50" /></motion.div>
          <motion.div variants={staggerItem}><StatCard loading={loading} icon={<CheckCircle2 className="h-6 w-6 text-lime-700" />} value={dashboard?.acceptedThisMonth} label="Accepted this month" sub="current month approvals" tone="bg-lime-50" /></motion.div>
          <motion.div variants={staggerItem}><StatCard loading={loading} icon={<Users className="h-6 w-6 text-violet-600" />} value={dashboard?.requestHistoryCount} label="Request log" sub="accept/reject history" tone="bg-violet-50" /></motion.div>
        </motion.div>

        <div className="grid gap-8 xl:grid-cols-[1.45fr_0.95fr]">
          <motion.section initial="initial" animate="animate" variants={fadeUp} className="rounded-[28px] border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight">Nearby donations</h2>
                <p className="mt-1 text-sm text-slate-500">Sorted by urgency and distance so the fastest wins rise first.</p>
              </div>
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                <Route className="h-3.5 w-3.5" />
                Live queue
              </Badge>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="animate-pulse rounded-3xl border border-slate-100 p-5">
                      <div className="flex gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-slate-200" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 w-1/3 rounded bg-slate-200" />
                          <div className="h-3 w-2/3 rounded bg-slate-100" />
                          <div className="h-3 w-1/2 rounded bg-slate-100" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : dashboard?.nearbyDonations?.length ? (
                dashboard.nearbyDonations.map((donation) => {
                  const accepting = savingId === donation.donationId;
                  return (
                    <motion.div key={donation.donationId} variants={staggerItem} whileHover={{ y: -2 }} className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5 transition-shadow hover:shadow-md">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex gap-4">
                          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                            <Package className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-lg font-bold text-slate-900">{donation.foodName}</h3>
                              <Badge className="border-slate-200 bg-white text-slate-700">{donation.foodCategory || 'Donation'}</Badge>
                              <Badge className={donation.urgencyLabel?.toLowerCase().includes('high') ? 'border-rose-200 bg-rose-50 text-rose-700' : donation.urgencyLabel?.toLowerCase().includes('medium') ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}>
                                <Clock3 className="h-3.5 w-3.5" />
                                {donation.urgencyLabel}
                              </Badge>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                              <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-slate-400" />{donation.donorName || 'Donor name unavailable'}</span>
                              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" />{donation.city || donation.addressLine1 || 'Location not set'}</span>
                              <span className="inline-flex items-center gap-1.5"><Route className="h-4 w-4 text-slate-400" />{donation.distanceLabel || 'Distance unavailable'}</span>
                            </div>
                            <div className="mt-2 text-sm text-slate-500">
                              {donation.quantity} {donation.quantityUnit}{donation.servesPeople ? ` · serves ${donation.servesPeople} people` : ''}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-stretch gap-2 sm:flex-row lg:min-w-[260px]">
                          <button
                            type="button"
                            disabled={!isVerified || accepting}
                            onClick={() => handleAction(donation.donationId, 'accept')}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {accepting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            Accept
                          </button>
                          <button
                            type="button"
                            disabled={accepting}
                            onClick={() => handleAction(donation.donationId, 'reject')}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
                    <Package className="h-8 w-8" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">No available donations right now</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">The queue is clear for now. Check back soon or expand your service area when more donations arrive nearby.</p>
                </div>
              )}
            </div>
          </motion.section>

          <div className="space-y-8">
            <motion.section initial="initial" animate="animate" variants={fadeUp} className="rounded-[28px] border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-xl font-black tracking-tight">Active pickups</h2>
                <p className="mt-1 text-sm text-slate-500">Track accepted donations that are waiting on volunteers or already moving.</p>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2].map((item) => (
                      <div key={item} className="animate-pulse rounded-3xl border border-slate-100 p-5">
                        <div className="h-4 w-1/2 rounded bg-slate-200" />
                        <div className="mt-3 h-3 w-3/4 rounded bg-slate-100" />
                        <div className="mt-3 h-3 w-1/3 rounded bg-slate-100" />
                      </div>
                    ))}
                  </div>
                ) : dashboard?.activePickups?.length ? (
                  dashboard.activePickups.map((pickup) => (
                    <div key={pickup.pickupAssignmentId} className="rounded-3xl border border-slate-100 bg-slate-50/60 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-slate-900">{pickup.foodName}</h3>
                          <p className="mt-1 text-sm text-slate-600">{pickup.quantity} {pickup.quantityUnit} · {pickup.donorName || 'Donor'}</p>
                        </div>
                        <Badge className={PICKUP_STYLES[pickup.status] || 'border-slate-200 bg-white text-slate-700'}>{pickup.status}</Badge>
                      </div>

                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" /><span>{pickup.addressLine1 || 'Pickup address unavailable'}{pickup.city ? `, ${pickup.city}` : ''}</span></div>
                        <div className="flex items-start gap-2"><Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" /><span>Volunteer: {pickup.volunteerName || 'Awaiting assignment'}</span></div>
                        <div className="flex items-start gap-2"><Clock3 className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" /><span>Assigned {formatDateTime(pickup.assignedAt)} · Pickup {formatDateTime(pickup.pickupTime)} · Delivered {formatDateTime(pickup.deliveredTime)}</span></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                    No active pickups yet. Accept a donation to create the first handoff.
                  </div>
                )}
              </div>
            </motion.section>

            <motion.section initial="initial" animate="animate" variants={fadeUp} className="rounded-[28px] border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-xl font-black tracking-tight">Request activity</h2>
                <p className="mt-1 text-sm text-slate-500">Recent accept/reject decisions for your NGO profile.</p>
              </div>

              <div className="divide-y divide-slate-100">
                {loading ? (
                  <div className="p-6 text-sm text-slate-500">Loading activity…</div>
                ) : dashboard?.requestHistory?.length ? (
                  dashboard.requestHistory.map((request) => (
                    <div key={request.requestId} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{request.foodName}</p>
                          <p className="mt-1 text-sm text-slate-500">{request.donorName || 'Donor'} · {request.city || request.addressLine1 || 'Location unavailable'}</p>
                          <p className="mt-1 text-xs text-slate-400">{formatDateTime(request.createdAt)}</p>
                        </div>
                        <Badge className={REQUEST_STYLES[request.requestStatus] || REQUEST_STYLES.PENDING}>{request.requestStatus}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-10 text-sm text-slate-500">No request activity yet.</div>
                )}
              </div>
            </motion.section>
          </div>
        </div>

        {!loading && dashboard && !isVerified && (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Verification pending</h3>
                  <p className="mt-1 max-w-2xl text-sm text-slate-500">Upload the remaining documents and complete verification so your team can start accepting nearby donations.</p>
                </div>
              </div>
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                Review requirements
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
