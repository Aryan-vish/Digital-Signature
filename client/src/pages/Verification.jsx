import { useState } from 'react';
import { verifyDocument } from '../services/documentApi';

export default function Verification() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);
    try {
      const { data } = await verifyDocument(code.trim());
      setResult(data);
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <form onSubmit={submit} className="panel p-6">
        <h1 className="text-2xl font-bold">Verify document authenticity</h1>
        <label className="mt-5 block text-sm font-medium">Verification code<input className="input mt-1 uppercase" required value={code} onChange={(e) => setCode(e.target.value)} /></label>
        <button className="btn-primary mt-6">Verify</button>
      </form>
      {error && <div className="panel mt-4 p-4 text-red-700">{error}</div>}
      {result?.valid && (
        <div className="panel mt-4 p-6">
          <h2 className="text-xl font-bold">Document verified</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="font-semibold">Document Name</dt><dd className="text-steel">{result.documentName}</dd></div>
            <div><dt className="font-semibold">Signed Date</dt><dd className="text-steel">{new Date(result.signedDate).toLocaleString()}</dd></div>
            <div><dt className="font-semibold">Status</dt><dd className="text-steel">{result.status}</dd></div>
            <div><dt className="font-semibold">Owner</dt><dd className="text-steel">{result.owner?.name} ({result.owner?.email})</dd></div>
          </dl>
        </div>
      )}
    </main>
  );
}
