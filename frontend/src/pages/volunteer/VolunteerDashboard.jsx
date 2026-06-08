import { motion } from 'framer-motion';
import { Bike, MapPin, Clock, CheckCircle, Package, Navigation } from 'lucide-react';
import { staggerContainer, staggerItem } from '../../design-system/animations/variants';

const mockVolunteer = { name: 'Rahul', totalDeliveries: 34, activeAssignment: null };

const pendingAssignments = [
  { id: '1', pickup: '42 Shivaji Nagar, Pune', dropoff: 'Mumbai Food Bank, Pune', category: 'Cooked Food', quantity: '12 kg', distance: '2.1 km', urgency: 'HIGH' },
  { id: '2', pickup: '12 MG Road, Pune', dropoff: 'Annapoorna Trust, Pune', category: 'Packaged Food', quantity: '10 boxes', distance: '4.5 km', urgency: 'MEDIUM' },
];

export default function VolunteerDashboard() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-bold mb-1">Hey, {mockVolunteer.name} 👋</h1>
          <p className="text-blue-100">You've completed {mockVolunteer.totalDeliveries} deliveries. Keep going!</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="space-y-6">

          {/* Stats */}
          <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-neutral-100 p-5 text-center">
              <p className="text-3xl font-bold text-blue-600">{mockVolunteer.totalDeliveries}</p>
              <p className="text-sm text-neutral-500 mt-1">Total Deliveries</p>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 p-5 text-center">
              <p className="text-3xl font-bold text-green-600">{pendingAssignments.length}</p>
              <p className="text-sm text-neutral-500 mt-1">Pending Tasks</p>
            </div>
          </motion.div>

          {/* Available Assignments */}
          <motion.div variants={staggerItem}>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Available Assignments</h2>
            <div className="space-y-3">
              {pendingAssignments.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <div className="bg-white rounded-2xl border border-neutral-100 p-5 hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          a.urgency === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>{a.urgency} PRIORITY</span>
                        <p className="font-semibold text-neutral-900 mt-2">{a.category} — {a.quantity}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                        <Navigation className="w-4 h-4" />
                        {a.distance}
                      </div>
                    </div>
                    <div className="space-y-1.5 text-sm text-neutral-500 mb-4">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                        <span>{a.pickup}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                        <span>{a.dropoff}</span>
                      </div>
                    </div>
                    <button className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm">
                      Accept Assignment
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
