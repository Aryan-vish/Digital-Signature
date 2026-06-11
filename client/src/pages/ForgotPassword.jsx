import { useState } from 'react';
import { forgotPassword } from '../services/authApi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    const { data } = await forgotPassword({ email });
    setMessage(data.message);
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <form onSubmit={submit} className="panel p-6">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <p className="mt-2 text-sm text-steel">Enter your email to begin the reset flow.</p>
        {message && <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        <label className="mt-5 block text-sm font-medium">Email<input className="input mt-1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <button className="btn-primary mt-6 w-full">Send reset instructions</button>
      </form>
    </main>
  );
}
