import { Navigate, Outlet } from 'react-router-dom';
import { AuthRole, useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: AuthRole[];
}

function roleHomePath(role: AuthRole | null) {
  return role === 'admin' ? '/admin/dashboard' : '/dashboard';
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);

  if (!token) return <Navigate to="/login" replace />;
  if (!role) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={roleHomePath(role)} replace />;
  }

  return <Outlet />;
}
