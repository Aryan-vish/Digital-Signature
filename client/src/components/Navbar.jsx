import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FileSignature, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2 font-bold text-ink">
          <FileSignature className="h-6 w-6 text-mint" />
          <span className="truncate">Digital Sign</span>
        </Link>
        <nav className="flex w-full flex-wrap items-center gap-2 text-sm sm:w-auto sm:justify-end">
          <NavLink to="/verify" className="btn-secondary min-h-10 flex-1 px-3 py-2 sm:flex-none"><ShieldCheck className="h-4 w-4" /> Verify</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className="btn-secondary min-h-10 flex-1 px-3 py-2 sm:flex-none">Dashboard</NavLink>
              {user?.role === 'admin' && <NavLink to="/admin" className="btn-secondary min-h-10 flex-1 px-3 py-2 sm:flex-none">Admin</NavLink>}
              <button onClick={handleLogout} className="btn-secondary min-h-10 flex-1 px-3 py-2 sm:flex-none"><LogOut className="h-4 w-4" /> Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn-secondary min-h-10 flex-1 px-3 py-2 sm:flex-none">Login</NavLink>
              <NavLink to="/register" className="btn-primary min-h-10 flex-1 px-3 py-2 sm:flex-none">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
