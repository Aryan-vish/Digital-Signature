import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <form onSubmit={submit} className="panel p-6">
        <h1 className="text-2xl font-bold">Create account</h1>
        {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <label className="mt-5 block text-sm font-medium">Name<input className="input mt-1" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label className="mt-4 block text-sm font-medium">Email<input className="input mt-1" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="mt-4 block text-sm font-medium">Password<input className="input mt-1" type="password" minLength="8" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button disabled={loading} className="btn-primary mt-6 w-full">{loading ? 'Creating...' : 'Register'}</button>
        <p className="mt-4 text-sm text-steel">Already registered? <Link className="font-semibold text-ink" to="/login">Login</Link></p>
      </form>
    </main>
  );
}
