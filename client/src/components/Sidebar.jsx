import { NavLink } from 'react-router-dom';
import { FileUp, FolderOpen, Gauge, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar() {
  const { user } = useAuth();
  const linkClass = ({ isActive }) => `flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-ink text-white' : 'text-steel hover:bg-slate-100'}`;

  return (
    <aside className="panel h-fit p-2 sm:p-3">
      <div className="flex gap-2 overflow-x-auto lg:block lg:space-y-1 lg:overflow-visible">
        <NavLink className={linkClass} to="/dashboard"><FolderOpen className="h-4 w-4" /> Documents</NavLink>
        <NavLink className={linkClass} to="/upload"><FileUp className="h-4 w-4" /> Upload PDF</NavLink>
        {user?.role === 'admin' && <NavLink className={linkClass} to="/admin"><Shield className="h-4 w-4" /> Admin</NavLink>}
      </div>
      <div className="mt-3 hidden rounded-md bg-slate-50 p-3 text-xs text-steel sm:block lg:mt-4">
        <Gauge className="mb-2 h-4 w-4 text-amber" />
        Signed PDFs receive a public verification code after completion.
      </div>
    </aside>
  );
}
