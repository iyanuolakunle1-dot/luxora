import { Navigate } from 'react-router-dom';
import { useGuestAuth } from '../context/GuestAuthContext';

export default function GuestProtectedRoute({ children }) {
  const { session, loading } = useGuestAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxora-bg">
        <div className="w-10 h-10 border-2 border-luxora-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/account/login" replace />;
  return children;
}
