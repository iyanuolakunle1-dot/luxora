import { Routes, Route } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/public/Home';
import Rooms from './pages/public/Rooms';
import Facilities from './pages/public/Facilities';
import Dining from './pages/public/Dining';
import Offers from './pages/public/Offers';
import Gallery from './pages/public/Gallery';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Hotels from './pages/admin/Hotels';
import UsersRoles from './pages/admin/UsersRoles';
import Reservations from './pages/admin/Reservations';
import Guests from './pages/admin/Guests';
import RoomsRates from './pages/admin/RoomsRates';
import AdminOffers from './pages/admin/Offers';
import AdminFacilities from './pages/admin/Facilities';
import AdminDining from './pages/admin/Dining';
import Housekeeping from './pages/admin/Housekeeping';
import Reviews from './pages/admin/Reviews';
import Reports from './pages/admin/Reports';
import SettingsPage from './pages/admin/Settings';
import SystemLogs from './pages/admin/SystemLogs';
import WebsiteManagement from './pages/admin/WebsiteManagement';
import EmailTemplates from './pages/admin/EmailTemplates';
// Guest Portal pages
import GuestLogin from './pages/guest/Login';
import GuestSignup from './pages/guest/Signup';
import GuestDashboard from './pages/guest/Dashboard';
import GuestReservations from './pages/guest/Reservations';
import GuestProfile from './pages/guest/Profile';
import GuestStays from './pages/guest/Stays';
import GuestOffers from './pages/guest/Offers';
import GuestLoyalty from './pages/guest/Loyalty';
import GuestPaymentMethods from './pages/guest/PaymentMethods';
import GuestReviews from './pages/guest/Reviews';
import GuestNotifications from './pages/guest/Notifications';
import GuestHelp from './pages/guest/Help';
import GuestSettings from './pages/guest/Settings';
import GuestLayout from './layouts/GuestLayout';
import GuestProtectedRoute from './components/GuestProtectedRoute';
import ContactMessages from './pages/admin/ContactMessages';
import Integrations from './pages/admin/Integrations';

export default function App() {
  return (
    <Routes>
      {/* ---------- Public website ---------- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/dining" element={<Dining />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* ---------- Admin auth ---------- */}
      <Route path="/admin/login" element={<Login />} />

      {/* ---------- Admin dashboard (protected) ---------- */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="hotels" element={<Hotels />} />
        <Route path="users" element={<UsersRoles />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="guests" element={<Guests />} />
        <Route path="rooms" element={<RoomsRates />} />
        <Route path="offers" element={<AdminOffers />} />
        <Route path="facilities" element={<AdminFacilities />} />
        <Route path="dining" element={<AdminDining />} />
        <Route path="housekeeping" element={<Housekeeping />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="messages" element={<ContactMessages />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="logs" element={<SystemLogs />} />
        <Route path="website" element={<WebsiteManagement />} />
        <Route path="email-templates" element={<EmailTemplates />} />
        <Route path="integrations" element={<Integrations />} />
      </Route>

      {/* ---------- Guest Portal auth ---------- */}
      <Route path="/account/login" element={<GuestLogin />} />
      <Route path="/account/signup" element={<GuestSignup />} />

      {/* ---------- Guest Portal (protected) ---------- */}
      <Route path="/account" element={<GuestProtectedRoute><GuestLayout /></GuestProtectedRoute>}>
        <Route index element={<GuestDashboard />} />
        <Route path="reservations" element={<GuestReservations />} />
        <Route path="profile" element={<GuestProfile />} />
        <Route path="stays" element={<GuestStays />} />
        <Route path="offers" element={<GuestOffers />} />
        <Route path="loyalty" element={<GuestLoyalty />} />
        <Route path="payment-methods" element={<GuestPaymentMethods />} />
        <Route path="reviews" element={<GuestReviews />} />
        <Route path="notifications" element={<GuestNotifications />} />
        <Route path="help" element={<GuestHelp />} />
        <Route path="settings" element={<GuestSettings />} />
      </Route>

      {/* ---------- 404 ---------- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-luxora-bg text-center px-4">
      <h1 className="font-display text-6xl text-luxora-gold mb-4">404</h1>
      <p className="text-luxora-muted mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary rounded-full">Back to Home</a>
    </div>
  );
}
