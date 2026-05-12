import { Navigate, Outlet, useLocation } from 'react-router-dom';

const REMEMBER_KEY = 'beetglow_admin_remember';
const SESSION_KEY = 'beetglow_admin_session';

export default function ProtectedAdminRoute() {
  const location = useLocation();
  const authed =
    localStorage.getItem(REMEMBER_KEY) === '1' ||
    sessionStorage.getItem(SESSION_KEY) === '1';

  if (!authed) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
