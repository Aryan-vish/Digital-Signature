import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { uploadDocument } from '../services/documentApi';

export default function UploadDocument() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (!file) return setError('Choose a PDF file');
    setLoading(true);
    setError('');
    try {
      const { data } = await uploadDocument(file);
      navigate(`/documents/${data._id}/sign`);
    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto grid max-w-7xl gap-4 px-3 py-5 sm:gap-6 sm:px-4 sm:py-8 lg:grid-cols-[240px_1fr]">
      <Sidebar />
      <form onSubmit={submit} className="panel max-w-2xl p-6">
        <h1 className="text-2xl font-bold">Upload PDF</h1>
        <p className="mt-2 text-sm text-steel">Files are validated as PDFs and limited by the server file size setting.</p>
        {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <label className="mt-6 block text-sm font-medium">PDF document<input className="input mt-2" type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0])} /></label>
        <button disabled={loading} className="btn-primary mt-6">{loading ? 'Uploading...' : 'Upload and sign'}</button>
      </form>
    </main>
  );
}
