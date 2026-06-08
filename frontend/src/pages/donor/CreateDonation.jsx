import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Utensils, Package, Calendar, MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { donationService } from '../../services/donationService';

const STEPS = [
  { id: 1, label: 'Category',  icon: Utensils },
  { id: 2, label: 'Details',   icon: Package },
  { id: 3, label: 'Expiry',    icon: Calendar },
  { id: 4, label: 'Pickup',    icon: MapPin },
];

const UNITS = ['kg', 'portions', 'boxes', 'plates', 'liters', 'packets'];

export default function CreateDonation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const [form, setForm] = useState({
    foodCategoryId: '',
    foodName: '',
    description: '',
    quantity: '',
    quantityUnit: 'kg',
    servesPeople: '',
    expiryDate: '',
    expiryTime: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    donationService.getFoodCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const set = (field, val) => {
    setForm(p => ({ ...p, [field]: val }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = (s) => {
    const e = {};
    if (s === 1 && !form.foodCategoryId) e.foodCategoryId = 'Please select a category';
    if (s === 2) {
      if (!form.foodName.trim()) e.foodName = 'Food name is required';
      if (!form.quantity || form.quantity <= 0) e.quantity = 'Enter a valid quantity';
    }
    if (s === 3) {
      if (!form.expiryDate) e.expiryDate = 'Select expiry date';
      if (!form.expiryTime) e.expiryTime = 'Select expiry time';
    }
    if (s === 4) {
      if (!form.addressLine1.trim()) e.addressLine1 = 'Address is required';
      if (!form.city.trim()) e.city = 'City is required';
      if (!form.pincode.trim()) e.pincode = 'Pincode is required';
      else if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) { setDir(1); setStep(p => p + 1); } };
  const prev = () => { setDir(-1); setStep(p => p - 1); };

  const submit = async () => {
    if (!validate(4)) return;
    setSubmitting(true);
    setApiError('');
    try {
      const expiryTime = `${form.expiryDate}T${form.expiryTime}:00`;
      const res = await donationService.create({
        foodCategoryId: form.foodCategoryId ? parseInt(form.foodCategoryId) : null,
        foodName: form.foodName,
        description: form.description,
        quantity: parseInt(form.quantity),
        quantityUnit: form.quantityUnit,
        servesPeople: form.servesPeople ? parseInt(form.servesPeople) : null,
        expiryTime,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      });
      navigate(`/donor/donations/${res.id}`);
    } catch (err) {
      setApiError(err.message || 'Failed to create donation. Please try again.');
      setSubmitting(false);
    }
  };

  const slideVariants = {
    initial: (d) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -40 : 40, transition: { duration: 0.2 } }),
  };

  const Input = ({ label, error, children }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );

  const inputCls = (err) =>
    `w-full px-4 py-3 rounded-xl border-2 text-slate-900 text-sm bg-white transition-all outline-none focus:ring-2 focus:ring-primary-300 ${
      err ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-primary-500'
    }`;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">What are you donating?</h2>
              <p className="text-slate-400 text-sm">Select the food category that best fits</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.length === 0
                ? [1,2,3,4,5,6].map(i => <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />)
                : categories.map(c => {
                  const icons = { 'Cooked Food':'🍛','Packaged Food':'📦','Fruits':'🍎','Vegetables':'🥦','Bakery':'🍞','Beverages':'🧃' };
                  const selected = form.foodCategoryId == c.id;
                  return (
                    <motion.button key={c.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => set('foodCategoryId', c.id)}
                      className={`p-5 rounded-2xl border-2 text-center transition-all ${
                        selected ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-100' : 'border-slate-200 hover:border-primary-300 bg-white'
                      }`}>
                      <div className="text-3xl mb-2">{icons[c.name] || '🍽️'}</div>
                      <div className={`text-sm font-bold ${selected ? 'text-primary-700' : 'text-slate-700'}`}>{c.name}</div>
                      {selected && <div className="mt-2 w-5 h-5 bg-primary-500 rounded-full mx-auto flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                    </motion.button>
                  );
                })
              }
            </div>
            {errors.foodCategoryId && <p className="text-xs text-red-500 font-medium">{errors.foodCategoryId}</p>}
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Tell us about the food</h2>
              <p className="text-slate-400 text-sm">Help NGOs understand what's available</p>
            </div>
            <Input label="Food Name *" error={errors.foodName}>
              <input value={form.foodName} onChange={e => set('foodName', e.target.value)}
                placeholder="e.g. Dal Rice, Bread Packets" className={inputCls(errors.foodName)} />
            </Input>
            <Input label="Description" error={errors.description}>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={3} placeholder="Any details about the food..."
                className={inputCls(errors.description) + ' resize-none'} />
            </Input>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Quantity *" error={errors.quantity}>
                <input type="number" value={form.quantity} onChange={e => set('quantity', e.target.value)}
                  placeholder="e.g. 10" className={inputCls(errors.quantity)} />
              </Input>
              <Input label="Unit">
                <select value={form.quantityUnit} onChange={e => set('quantityUnit', e.target.value)} className={inputCls('')}>
                  {UNITS.map(u => <option key={u}>{u}</option>)}
                </select>
              </Input>
            </div>
            <Input label="Estimated Servings">
              <input type="number" value={form.servesPeople} onChange={e => set('servesPeople', e.target.value)}
                placeholder="How many people can this feed?" className={inputCls('')} />
            </Input>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">When does it expire?</h2>
              <p className="text-slate-400 text-sm">This helps us arrange timely pickup</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Expiry Date *" error={errors.expiryDate}>
                <input type="date" value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]} className={inputCls(errors.expiryDate)} />
              </Input>
              <Input label="Expiry Time *" error={errors.expiryTime}>
                <input type="time" value={form.expiryTime} onChange={e => set('expiryTime', e.target.value)}
                  className={inputCls(errors.expiryTime)} />
              </Input>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700 font-medium">
              ⏰ Set a realistic expiry time — NGOs need enough time to arrange pickup
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Where should we pick it up?</h2>
              <p className="text-slate-400 text-sm">Exact address for the volunteer</p>
            </div>
            <Input label="Address Line 1 *" error={errors.addressLine1}>
              <input value={form.addressLine1} onChange={e => set('addressLine1', e.target.value)}
                placeholder="Building, street, area" className={inputCls(errors.addressLine1)} />
            </Input>
            <Input label="Address Line 2">
              <input value={form.addressLine2} onChange={e => set('addressLine2', e.target.value)}
                placeholder="Landmark, floor, etc." className={inputCls('')} />
            </Input>
            <div className="grid grid-cols-2 gap-4">
              <Input label="City *" error={errors.city}>
                <input value={form.city} onChange={e => set('city', e.target.value)}
                  placeholder="City" className={inputCls(errors.city)} />
              </Input>
              <Input label="State">
                <input value={form.state} onChange={e => set('state', e.target.value)}
                  placeholder="State" className={inputCls('')} />
              </Input>
            </div>
            <Input label="Pincode *" error={errors.pincode}>
              <input value={form.pincode} onChange={e => set('pincode', e.target.value)}
                placeholder="6-digit pincode" maxLength={6} className={inputCls(errors.pincode)} />
            </Input>
          </div>
        );
      default: return null;
    }
  };

  return (
    <DashboardSidebar>
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link to="/donor/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Create Donation</h1>
          <p className="text-slate-400 mt-1 text-sm">Takes less than 60 seconds ⚡</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => {
            const done = step > s.id;
            const active = step === s.id;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all font-bold text-sm ${
                    done ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                    : active ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 ring-4 ring-primary-100'
                    : 'bg-slate-100 text-slate-400'
                  }`}>
                    {done ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs mt-1.5 font-semibold ${active ? 'text-primary-600' : 'text-slate-400'}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded-full mt-[-14px] transition-all ${step > s.id ? 'bg-primary-500' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8">
            {apiError && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
                ⚠️ {apiError}
              </div>
            )}
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={step} custom={dir} variants={slideVariants} initial="initial" animate="animate" exit="exit">
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button onClick={prev} disabled={step === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-xs text-slate-400 font-medium">Step {step} of {STEPS.length}</span>
            {step < STEPS.length ? (
              <button onClick={next}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-primary-200 transition">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submit} disabled={submitting}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-emerald-200 transition">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Check className="w-4 h-4" /> Submit Donation</>}
              </button>
            )}
          </div>
        </div>

      </div>
    </DashboardSidebar>
  );
}
