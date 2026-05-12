import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const ADMIN_EMAIL = 'themakencollection@gmail.com';
const ADMIN_PASSWORD = 'Maken3147#!$&';
const REMEMBER_KEY = 'beetglow_admin_remember';
const SESSION_KEY = 'beetglow_admin_session';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/admin';

  function submit(e) {
    e.preventDefault();
    if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      setError('Invalid email or password.');
      return;
    }
    setError('');
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, '1');
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, '1');
      localStorage.removeItem(REMEMBER_KEY);
    }
    navigate(from, { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-muted px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
            <Lock className="h-7 w-7" aria-hidden />
          </span>
        </div>
        <h1 className="text-center text-2xl font-bold text-neutral-900">
          BeetGlow Admin
        </h1>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Login to manage products, branding and orders.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            autoComplete="email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            autoComplete="current-password"
            required
          />
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
            />
            Remember me
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-brand py-3 font-semibold text-white hover:bg-brand-dark"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center">
          <Link to="/" className="text-sm text-brand hover:underline">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
