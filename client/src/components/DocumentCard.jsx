import { Link } from 'react-router-dom';
import { Download, PenLine } from 'lucide-react';
import { downloadDocumentBlob } from '../services/documentApi';

export default function DocumentCard({ document }) {
  const statusColor = document.status === 'signed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800';

  const download = async () => {
    const { data } = await downloadDocumentBlob(document._id);
    const url = URL.createObjectURL(data);
    const anchor = window.document.createElement('a');
    anchor.href = url;
    anchor.download = `${document.status === 'signed' ? 'signed-' : ''}${document.fileName}`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <article className="panel p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-ink">{document.fileName}</h3>
          <p className="mt-1 text-sm text-steel">Created {new Date(document.createdAt).toLocaleString()}</p>
          {document.verificationCode && <p className="mt-1 text-xs text-steel">Code: {document.verificationCode}</p>}
        </div>
        <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-none sm:flex sm:flex-wrap sm:items-center">
          <span className={`status ${statusColor}`}>{document.status.replace('_', ' ')}</span>
          <Link className="btn-secondary" to={`/documents/${document._id}/sign`}><PenLine className="h-4 w-4" /> {document.status === 'signed' ? 'View / Re-sign' : 'Continue'}</Link>
          <button className="btn-primary" onClick={download}><Download className="h-4 w-4" /> Download</button>
        </div>
      </div>
    </article>
  );
}
