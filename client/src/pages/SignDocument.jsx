import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import PdfViewer from '../components/PdfViewer.jsx';
import SignaturePad from '../components/SignaturePad.jsx';
import Loader from '../components/Loader.jsx';
import { fetchDocument, fetchSignatures, signDocument } from '../services/documentApi';

export default function SignDocument() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [signatures, setSignatures] = useState([]);
  const [signatureImage, setSignatureImage] = useState('');
  const [saveSignature, setSaveSignature] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDocument(id), fetchSignatures()])
      .then(([documentResponse, signatureResponse]) => {
        setDocument(documentResponse.data);
        setSignatures(signatureResponse.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async () => {
    if (!signatureImage) return setMessage('Draw or select a signature first.');
    setMessage('Signing PDF...');
    const { data } = await signDocument(id, {
      signatureImage,
      saveSignature,
      position: { page: 0, x: 390, y: 72, width: 160, height: 64 }
    });
    setDocument(data);
    setMessage(`Signed successfully. Verification code: ${data.verificationCode}`);
  };

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-8"><Loader label="Loading signing workspace" /></main>;

  return (
    <main className="mx-auto grid max-w-7xl gap-4 px-3 py-5 sm:gap-6 sm:px-4 sm:py-8 lg:grid-cols-[240px_1fr]">
      <Sidebar />
      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <button className="btn-secondary mb-4 w-full sm:w-auto" onClick={() => navigate('/dashboard')}>Back to dashboard</button>
          <PdfViewer documentId={id} />
        </div>
        <div className="min-w-0 space-y-4">
          <div className="panel p-4">
            <h1 className="break-words text-lg font-bold sm:text-xl">{document.fileName}</h1>
            <p className="mt-1 text-sm text-steel">Status: {document.status}</p>
            {document.verificationCode && <p className="mt-1 break-all text-sm text-steel">Verification: {document.verificationCode}</p>}
          </div>
          <SignaturePad onSave={setSignatureImage} />
          {signatures.length > 0 && (
            <div className="panel p-4">
              <h2 className="font-semibold">Saved signatures</h2>
              <div className="mt-3 grid gap-2">
                {signatures.map((signature) => (
                  <button key={signature._id} className="rounded-md border border-slate-200 bg-white p-2" onClick={() => setSignatureImage(signature.signatureImage)}>
                    <img src={signature.signatureImage} alt="Saved signature" className="h-12 object-contain" />
                  </button>
                ))}
              </div>
            </div>
          )}
          {signatureImage && <img src={signatureImage} alt="Selected signature" className="panel h-24 w-full object-contain p-3" />}
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={saveSignature} onChange={(e) => setSaveSignature(e.target.checked)} /> Save signature for later</label>
          {message && <p className="rounded-md bg-slate-100 p-3 text-sm text-steel">{message}</p>}
          <button className="btn-primary w-full" onClick={submit}>Place signature and generate PDF</button>
        </div>
      </section>
    </main>
  );
}
