import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Donor pages
import DonorDashboard from './pages/donor/DonorDashboard';
import CreateDonation from './pages/donor/CreateDonation';
import DonationDetails from './pages/donor/DonationDetails';
import DonationHistory from './pages/donor/DonationHistory';

// NGO pages
import NgoDashboard from './pages/ngo/NgoDashboard';

// Volunteer pages
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

/**
 * PublicLayout — includes the marketing Navbar + Footer.
 * Used for the landing page, auth pages, about, etc.
 */
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/**
 * DashboardLayout — no marketing Navbar/Footer.
 * Clean shell for all role-specific dashboards.
 */
function DashboardLayout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public routes (with marketing navbar + footer) ── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* ── Protected Donor routes ── */}
          <Route element={<DashboardLayout />}>
            <Route element={<ProtectedRoute role="DONOR" />}>
              <Route path="/donor/dashboard" element={<DonorDashboard />} />
              <Route path="/donor/donate" element={<CreateDonation />} />
              <Route path="/donor/donations/:id" element={<DonationDetails />} />
              <Route path="/donor/history" element={<DonationHistory />} />
            </Route>

            {/* ── Protected NGO routes ── */}
            <Route element={<ProtectedRoute role="NGO" />}>
              <Route path="/ngo/dashboard" element={<NgoDashboard />} />
            </Route>

            {/* ── Protected Volunteer routes ── */}
            <Route element={<ProtectedRoute role="VOLUNTEER" />}>
              <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
            </Route>

            {/* ── Protected Admin routes ── */}
            <Route element={<ProtectedRoute role="ADMIN" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
