import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Navigation,
  Package,
  Phone,
  Power,
  Route,
  Sparkles,
  SquareArrowOutUpRight,
  Truck,
  UserCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { volunteerService } from '../../services/volunteerService';
import { staggerContainer, staggerItem } from '../../design-system/animations/variants';

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const AVAILABILITY_STYLES = {
  AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  BUSY: 'bg-amber-50 text-amber-700 border-amber-200',
  OFFLINE: 'bg-slate-50 text-slate-600 border-slate-200',
};

const ASSIGNMENT_STYLES = {
  ASSIGNED: 'bg-blue-50 text-blue-700 border-blue-200',
  PICKED_UP: 'bg-violet-50 text-violet-700 border-violet-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function formatDateTime(value) {
  if (!value) return 'Not scheduled';
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

function ActionButton({ children, onClick, disabled, tone = 'primary', icon: Icon }) {
  const styles = tone === 'primary'
    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
    : tone === 'ghost'
      ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
      : 'bg-slate-900 text-white hover:bg-slate-800';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles}`}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workingId, setWorkingId] = useState(null);

  useEffect(() => {
    let mounted = true;

    volunteerService.dashboard()
      .then((data) => {
        if (mounted) {
          setDashboard(data);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || 'Could not load volunteer dashboard.');
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const availability = dashboard?.availabilityStatus || 'OFFLINE';
  const availableAssignments = dashboard?.availableAssignments || [];
  const activeAssignments = dashboard?.activeAssignments || [];
  const recentActivity = dashboard?.recentActivity || [];
  const primaryRoute = useMemo(() => activeAssignments[0] || availableAssignments[0] || null, [activeAssignments, availableAssignments]);

  async function refresh() {
    const data = await volunteerService.dashboard();
    setDashboard(data);
  }

  async function handleAction(assignmentId, action) {
    setWorkingId(assignmentId || 'toggle');
    setError('');
    try {
      if (action === 'accept') {
        await volunteerService.acceptAssignment(assignmentId);
      } else if (action === 'picked_up') {
        await volunteerService.markPickedUp(assignmentId);
      } else if (action === 'delivered') {
        await volunteerService.markDelivered(assignmentId);
      } else if (action === 'toggle') {
        await volunteerService.toggleAvailability();
      }
      await refresh();
    } catch (err) {
      setError(err.message || 'Action failed.');
    } finally {
      setWorkingId(null);
    }
  }

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <div className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-blue-700 via-blue-700 to-cyan-600 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-50">
                <Sparkles className="h-3.5 w-3.5" />
                Volunteer route control
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">{greeting}, {dashboard?.volunteerName || user?.firstName || 'Volunteer'}</h1>
              <p className="mt-3 text-blue-50/90 max-w-2xl text-sm sm:text-base leading-6">
                Accept tasks, track pickups, and finish deliveries with a single view for active route work.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[410px]">
              <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Availability</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold">{availability}</p>
                    <p className="text-xs text-blue-50/80">{dashboard?.vehicleType || 'Vehicle not set'}</p>
                  </div>
                  <ActionButton tone="ghost" disabled={loading || workingId !== null} onClick={() => handleAction(null, 'toggle')} icon={Power}>
                    Toggle
                  </ActionButton>
                </div>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Primary route</p>
                <p className="mt-2 text-sm font-semibold">{primaryRoute?.pickupAddress || primaryRoute?.pickup || 'No active route'}</p>
                <p className="mt-1 text-xs text-blue-50/80">{primaryRoute?.foodName || 'Waiting for assignment'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>}

        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <motion.div variants={staggerItem}><StatCard loading={loading} icon={<Truck className="h-6 w-6 text-blue-600" />} value={dashboard?.activeAssignmentCount} label="Active assignments" sub="tasks currently on your board" tone="bg-blue-50" /></motion.div>
          <motion.div variants={staggerItem}><StatCard loading={loading} icon={<CheckCircle2 className="h-6 w-6 text-emerald-600" />} value={dashboard?.deliveriesThisMonth} label="Delivered this month" sub="completed pickups and drop-offs" tone="bg-emerald-50" /></motion.div>
          <motion.div variants={staggerItem}><StatCard loading={loading} icon={<Users className="h-6 w-6 text-cyan-600" />} value={availableAssignments.length} label="Open assignments" sub="ready to accept" tone="bg-cyan-50" /></motion.div>
          <motion.div variants={staggerItem}><StatCard loading={loading} icon={<Route className="h-6 w-6 text-violet-600" />} value={dashboard?.routeScore ?? 0} label="Route score" sub="priority + proximity" tone="bg-violet-50" /></motion.div>
        </motion.div>

        <div className="grid gap-8 xl:grid-cols-[1.25fr_0.95fr]">
          <motion.section initial="initial" animate="animate" variants={fadeUp} className="rounded-[28px] border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight">Available assignments</h2>
                <p className="mt-1 text-sm text-slate-500">Claim pickup tasks that are waiting for a volunteer.</p>
              </div>
              <ActionButton tone="ghost" icon={Navigation} disabled={loading || !availableAssignments.length} onClick={() => {
                if (primaryRoute?.directionsUrl) {
                  window.open(primaryRoute.directionsUrl, '_blank', 'noopener,noreferrer');
                }
              }}>
                Route view
              </ActionButton>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((item) => (
                    <div key={item} className="animate-pulse rounded-3xl border border-slate-100 p-5">
                      <div className="h-4 w-1/2 rounded bg-slate-200" />
                      <div className="mt-3 h-3 w-3/4 rounded bg-slate-100" />
                    </div>
                  ))}
                </div>
              ) : availableAssignments.length ? (
                availableAssignments.map((assignment) => (
                  <div key={assignment.assignmentId} className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">{assignment.foodName}</h3>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${ASSIGNMENT_STYLES[assignment.status] || 'border-slate-200 bg-white text-slate-600'}`}>{assignment.status}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{assignment.quantity} {assignment.quantityUnit} · {assignment.distanceLabel}</p>
                        <div className="mt-3 space-y-2 text-sm text-slate-600">
                          <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" /><span>Pickup: {assignment.pickupAddress || 'Address unavailable'}</span></div>
                          <div className="flex items-start gap-2"><Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" /><span>NGO: {assignment.ngoName || 'NGO not set'}</span></div>
                          <div className="flex items-start gap-2"><Clock3 className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" /><span>Urgency: {assignment.urgencyLabel || 'Normal'}</span></div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row lg:min-w-[290px]">
                        <ActionButton disabled={workingId === assignment.assignmentId} onClick={() => handleAction(assignment.assignmentId, 'accept')} icon={UserCheck}>Accept</ActionButton>
                        <a href={assignment.directionsUrl || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50">
                          <SquareArrowOutUpRight className="h-4 w-4" />
                          Directions
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
                    <Package className="h-8 w-8" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">No assignments waiting</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">You’re caught up. New pickup tasks will appear here when the NGO assigns them.</p>
                </div>
              )}
            </div>
          </motion.section>

          <div className="space-y-8">
            <motion.section initial="initial" animate="animate" variants={fadeUp} className="rounded-[28px] border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-xl font-black tracking-tight">Active route</h2>
                <p className="mt-1 text-sm text-slate-500">Use these actions while you’re on the road.</p>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1].map((item) => <div key={item} className="animate-pulse rounded-3xl border border-slate-100 p-5"><div className="h-4 w-1/2 rounded bg-slate-200" /><div className="mt-3 h-3 w-3/4 rounded bg-slate-100" /></div>)}
                  </div>
                ) : activeAssignments.length ? (
                  activeAssignments.map((assignment) => (
                    <div key={assignment.assignmentId} className="rounded-3xl border border-slate-100 bg-slate-50/60 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-slate-900">{assignment.foodName}</h3>
                          <p className="mt-1 text-sm text-slate-600">{assignment.quantity} {assignment.quantityUnit} · {assignment.donorName || 'Donor'}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${ASSIGNMENT_STYLES[assignment.status] || 'border-slate-200 bg-white text-slate-600'}`}>{assignment.status}</span>
                      </div>

                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" /><span>{assignment.pickupAddress || 'Pickup address unavailable'}</span></div>
                        <div className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" /><span>Donor: {assignment.donorPhone || 'Unavailable'}{assignment.donorEmail ? ` · ${assignment.donorEmail}` : ''}</span></div>
                        <div className="flex items-start gap-2"><Clock3 className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" /><span>Pickup {formatDateTime(assignment.pickupTime)} · Delivered {formatDateTime(assignment.deliveredTime)}</span></div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <ActionButton tone="ghost" icon={Phone} disabled={!assignment.donorPhone} onClick={() => assignment.donorPhone && window.open(`tel:${assignment.donorPhone}`)}>Call donor</ActionButton>
                        <ActionButton disabled={workingId === assignment.assignmentId || assignment.status !== 'ASSIGNED'} onClick={() => handleAction(assignment.assignmentId, 'picked_up')} icon={Truck}>Mark picked up</ActionButton>
                        <ActionButton disabled={workingId === assignment.assignmentId || assignment.status !== 'PICKED_UP'} onClick={() => handleAction(assignment.assignmentId, 'delivered')} icon={CheckCircle2}>Mark delivered</ActionButton>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">No active route right now.</div>
                )}
              </div>
            </motion.section>

            <motion.section initial="initial" animate="animate" variants={fadeUp} className="rounded-[28px] border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-xl font-black tracking-tight">Recent activity</h2>
                <p className="mt-1 text-sm text-slate-500">Recent route progress and completed deliveries.</p>
              </div>
              <div className="divide-y divide-slate-100">
                {loading ? (
                  <div className="p-6 text-sm text-slate-500">Loading activity…</div>
                ) : recentActivity.length ? (
                  recentActivity.map((item) => (
                    <div key={item.activityId} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                          <p className="mt-1 text-xs text-slate-400">{formatDateTime(item.createdAt)}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${item.statusClass || 'border-slate-200 bg-white text-slate-600'}`}>{item.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-10 text-sm text-slate-500">No recent activity yet.</div>
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
