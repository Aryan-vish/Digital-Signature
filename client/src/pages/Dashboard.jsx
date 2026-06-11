import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import DocumentCard from '../components/DocumentCard.jsx';
import Loader from '../components/Loader.jsx';
import { fetchDocuments } from '../services/documentApi';

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments().then(({ data }) => setDocuments(data)).finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto grid max-w-7xl gap-4 px-3 py-5 sm:gap-6 sm:px-4 sm:py-8 lg:grid-cols-[240px_1fr]">
      <Sidebar />
      <section className="min-w-0">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Your documents</h1>
            <p className="text-sm text-steel">Continue signing workflows, download files, and track verification codes.</p>
          </div>
          <Link className="btn-primary" to="/upload">Upload PDF</Link>
        </div>
        {loading ? <Loader label="Loading documents" /> : (
          <div className="grid gap-4">
            {documents.length ? documents.map((document) => <DocumentCard key={document._id} document={document} />) : (
              <div className="panel p-8 text-center text-steel">No documents yet. Upload a PDF to start.</div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
