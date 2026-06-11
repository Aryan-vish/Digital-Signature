import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Loader from '../components/Loader.jsx';
import { deleteAdminDocument, fetchAdminDocuments, fetchAdminLogs, fetchAdminStats, fetchAdminUsers } from '../services/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (q = '') => {
    const [statsRes, usersRes, documentsRes, logsRes] = await Promise.all([
      fetchAdminStats(),
      fetchAdminUsers(q),
      fetchAdminDocuments(q),
      fetchAdminLogs()
    ]);
    setStats(statsRes.data);
    setUsers(usersRes.data);
    setDocuments(documentsRes.data);
    setLogs(logsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const removeDocument = async (id) => {
    await deleteAdminDocument(id);
    load(query);
  };

  return (
    <main className="mx-auto grid max-w-7xl gap-4 px-3 py-5 sm:gap-6 sm:px-4 sm:py-8 lg:grid-cols-[240px_1fr]">
      <Sidebar />
      <section className="min-w-0 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin dashboard</h1>
          <p className="text-sm text-steel">Monitor usage, search records, and review audit activity.</p>
        </div>
        {loading ? <Loader label="Loading admin data" /> : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Stat title="Total users" value={stats.totalUsers} />
              <Stat title="Total documents" value={stats.totalDocuments} />
              <Stat title="Signed documents" value={stats.totalSignedDocuments} />
            </div>
            <div className="panel p-4">
              <div className="grid gap-2 sm:flex">
                <input className="input" placeholder="Search users or documents" value={query} onChange={(e) => setQuery(e.target.value)} />
                <button className="btn-primary" onClick={() => load(query)}>Search</button>
              </div>
            </div>
            <Table title="Users" headers={['Name', 'Email', 'Role', 'Created']} rows={users.map((user) => [user.name, user.email, user.role, new Date(user.createdAt).toLocaleDateString()])} />
            <div className="panel overflow-hidden">
              <h2 className="border-b border-slate-200 p-4 font-semibold">Documents</h2>
              <div className="overflow-auto">
                <table className="min-w-[720px] w-full text-left text-sm">
                  <thead className="bg-slate-50 text-steel"><tr><th className="p-3">File</th><th className="p-3">Owner</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
                  <tbody>
                    {documents.map((document) => (
                      <tr className="border-t border-slate-100" key={document._id}>
                        <td className="p-3">{document.fileName}</td>
                        <td className="p-3">{document.owner?.email}</td>
                        <td className="p-3">{document.status}</td>
                        <td className="p-3"><button className="btn-secondary py-1" onClick={() => removeDocument(document._id)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Table title="Audit logs" headers={['Action', 'User', 'Document', 'IP', 'Time']} rows={logs.map((log) => [log.action, log.userId?.email || 'Public', log.documentId?.fileName || '-', log.ipAddress || '-', new Date(log.createdAt).toLocaleString()])} />
          </>
        )}
      </section>
    </main>
  );
}

function Stat({ title, value }) {
  return <div className="panel p-5"><p className="text-sm text-steel">{title}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>;
}

function Table({ title, headers, rows }) {
  return (
    <div className="panel overflow-hidden">
      <h2 className="border-b border-slate-200 p-4 font-semibold">{title}</h2>
      <div className="overflow-auto">
        <table className="min-w-[720px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-steel"><tr>{headers.map((header) => <th className="p-3" key={header}>{header}</th>)}</tr></thead>
          <tbody>{rows.map((row, index) => <tr className="border-t border-slate-100" key={index}>{row.map((cell, cellIndex) => <td className="p-3" key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
