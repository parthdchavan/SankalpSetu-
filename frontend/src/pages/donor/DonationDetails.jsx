import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Package, MapPin, Calendar, Clock,
  CheckCircle2, Heart, AlertTriangle, Loader2
} from 'lucide-react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { donationService } from '../../services/donationService';

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const STATUS = {
  PENDING:            { label: 'Pending',           badge: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-400',   step: 1 },
  ACCEPTED:           { label: 'Accepted by NGO',   badge: 'bg-blue-50 text-blue-700 border-blue-200',     dot: 'bg-blue-400',    step: 2 },
  VOLUNTEER_ASSIGNED: { label: 'Volunteer Assigned', badge: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-400', step: 3 },
  PICKED_UP:          { label: 'Picked Up',         badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-400', step: 4 },
  DELIVERED:          { label: 'Delivered',         badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400', step: 5 },
  EXPIRED:            { label: 'Expired',           badge: 'bg-slate-50 text-slate-500 border-slate-200',   dot: 'bg-slate-300',   step: 0 },
  CANCELLED:          { label: 'Cancelled',         badge: 'bg-red-50 text-red-600 border-red-200',         dot: 'bg-red-400',     step: 0 },
};

const TIMELINE = [
  { key: 'PENDING',            label: 'Donation Posted',      icon: Package },
  { key: 'ACCEPTED',           label: 'Accepted by NGO',      icon: CheckCircle2 },
  { key: 'VOLUNTEER_ASSIGNED', label: 'Volunteer Assigned',   icon: CheckCircle2 },
  { key: 'PICKED_UP',          label: 'Food Picked Up',       icon: CheckCircle2 },
  { key: 'DELIVERED',          label: 'Delivered Successfully',icon: Heart },
];

const FOOD_ICONS = { 'Cooked Food':'🍛','Packaged Food':'📦','Fruits':'🍎','Vegetables':'🥦','Bakery':'🍞','Beverages':'🧃' };

function InfoBlock({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
      <div className="text-primary-500 mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function DonationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    donationService.getById(id)
      .then(setDonation)
      .catch(() => navigate('/donor/history'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    setCancelling(true);
    setCancelError('');
    try {
      await donationService.cancel(id);
      setDonation(p => ({ ...p, status: 'CANCELLED' }));
      setShowConfirm(false);
    } catch (e) {
      setCancelError(e.message || 'Failed to cancel');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return (
    <DashboardSidebar>
      <div className="max-w-3xl mx-auto space-y-5">
        {[1,2,3].map(i => <div key={i} className="bg-white rounded-3xl h-40 animate-pulse border border-slate-100" />)}
      </div>
    </DashboardSidebar>
  );

  if (!donation) return null;

  const s = STATUS[donation.status] || STATUS.PENDING;
  const currentStep = s.step || 0;
  const icon = FOOD_ICONS[donation.foodCategory] || '🍽️';
  return (
    <DashboardSidebar>
      <motion.div initial="initial" animate="animate" variants={stagger} className="max-w-3xl mx-auto space-y-6">

        {/* Back */}
        <motion.div variants={fadeUp}>
          <Link to="/donor/history" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-semibold transition">
            <ArrowLeft className="w-4 h-4" /> Back to History
          </Link>
        </motion.div>

        {/* Title */}
        <motion.div variants={fadeUp} className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{donation.foodName}</h1>
            <p className="text-slate-400 text-sm mt-1">ID: {donation.id?.slice(0, 8).toUpperCase()}</p>
          </div>
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${s.badge}`}>
            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        </motion.div>

        {/* Impact card — only if delivered */}
        {donation.status === 'DELIVERED' && donation.servesPeople > 0 && (
          <motion.div variants={fadeUp}
            className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 text-white text-center shadow-xl shadow-primary-200 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
              <Heart className="w-8 h-8 fill-white" />
            </div>
            <p className="text-6xl font-black tracking-tight">{donation.servesPeople}</p>
            <p className="text-primary-100 text-lg mt-1">meals you helped provide</p>
            <p className="text-primary-200 text-sm mt-2">
              Your {donation.quantity} {donation.quantityUnit} of {donation.foodCategory} made a real difference 🙏
            </p>
          </motion.div>
        )}

        {/* Details card */}
        <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm flex-shrink-0">
              {icon}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">{donation.foodName}</h2>
              {donation.description && <p className="text-sm text-slate-500 mt-0.5">{donation.description}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <InfoBlock label="Category"  value={donation.foodCategory} icon={<Package className="w-4 h-4" />} />
            <InfoBlock label="Quantity"  value={`${donation.quantity} ${donation.quantityUnit}`} icon={<Package className="w-4 h-4" />} />
            <InfoBlock label="Serves"    value={donation.servesPeople ? `${donation.servesPeople} people` : 'Not specified'} icon={<Heart className="w-4 h-4" />} />
            <InfoBlock label="Donated On" value={new Date(donation.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })} icon={<Calendar className="w-4 h-4" />} />
            <InfoBlock label="Expires"   value={new Date(donation.expiryTime).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })} icon={<Clock className="w-4 h-4" />} />
            {donation.city && <InfoBlock label="Pickup City" value={donation.city} icon={<MapPin className="w-4 h-4" />} />}
          </div>
          {donation.addressLine1 && (
            <div className="mt-3 p-4 bg-slate-50 rounded-2xl">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Pickup Address</p>
              <p className="text-sm font-bold text-slate-800">{donation.addressLine1}</p>
              {donation.city && <p className="text-sm text-slate-500">{donation.city} {donation.pincode}</p>}
            </div>
          )}
        </motion.div>

        {/* Timeline */}
        {!['EXPIRED','CANCELLED'].includes(donation.status) && (
          <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-extrabold text-slate-900 mb-6">Donation Journey</h3>
            <div className="space-y-1">
              {TIMELINE.map((t, i) => {
                const done = currentStep > i;
                const active = currentStep === i + 1;
                const Icon = t.icon;
                return (
                  <div key={t.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                        done ? 'bg-primary-600 shadow-md shadow-primary-200'
                        : active ? 'bg-primary-600 ring-4 ring-primary-100 shadow-md shadow-primary-200'
                        : 'bg-slate-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${done || active ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                      {i < TIMELINE.length - 1 && (
                        <div className={`w-0.5 h-8 my-1 rounded-full transition-all ${done ? 'bg-primary-400' : 'bg-slate-200'}`} />
                      )}
                    </div>
                    <div className="pt-2 pb-4">
                      <p className={`text-sm font-bold ${done || active ? 'text-slate-900' : 'text-slate-400'}`}>{t.label}</p>
                      {active && <p className="text-xs text-primary-600 font-semibold mt-0.5 animate-pulse">In progress...</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Cancel button */}
        {donation.status === 'PENDING' && (
          <motion.div variants={fadeUp}>
            {!showConfirm ? (
              <button onClick={() => setShowConfirm(true)}
                className="w-full py-3.5 rounded-2xl border-2 border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition">
                Cancel Donation
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-700">Cancel this donation?</p>
                    <p className="text-sm text-red-500 mt-0.5">This action cannot be undone.</p>
                  </div>
                </div>
                {cancelError && <p className="text-sm text-red-600 font-medium">{cancelError}</p>}
                <div className="flex gap-3">
                  <button onClick={() => setShowConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition">
                    Keep it
                  </button>
                  <button onClick={handleCancel} disabled={cancelling}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm disabled:opacity-60 transition flex items-center justify-center gap-2">
                    {cancelling ? <><Loader2 className="w-4 h-4 animate-spin" /> Cancelling...</> : 'Yes, Cancel'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

      </motion.div>
    </DashboardSidebar>
  );
}
