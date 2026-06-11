import { Link } from 'react-router-dom';
import { CheckCircle2, FileCheck2, LockKeyhole, ShieldCheck } from 'lucide-react';

export default function Landing() {
  return (
    <main>
      <section className="bg-white">
        <div className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-ink md:text-6xl">Digital Signature & Document Management Platform</h1>
            <p className="mt-5 max-w-2xl text-lg text-steel">Upload, preview, electronically sign, verify, and audit PDF documents through a secure MERN workflow built for teams.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary">Start signing</Link>
              <Link to="/verify" className="btn-secondary">Verify a document</Link>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <div className="grid gap-4">
              {[
                ['Upload PDF', 'Store the original document securely.', FileCheck2],
                ['Sign Electronically', 'Draw a signature and place it into the PDF.', CheckCircle2],
                ['Public Verification', 'Generate a unique authenticity code.', ShieldCheck],
                ['Audit Trail', 'Track sign-ins, uploads, downloads, and admin actions.', LockKeyhole]
              ].map(([title, text, Icon]) => (
                <div className="rounded-md bg-white p-4 shadow-sm" key={title}>
                  <Icon className="mb-3 h-5 w-5 text-mint" />
                  <h2 className="font-semibold">{title}</h2>
                  <p className="mt-1 text-sm text-steel">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
