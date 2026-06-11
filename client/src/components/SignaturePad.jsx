import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { RotateCcw, Save } from 'lucide-react';

export default function SignaturePad({ onSave }) {
  const padRef = useRef(null);

  const save = () => {
    if (padRef.current?.isEmpty()) return;
    onSave(padRef.current.getTrimmedCanvas().toDataURL('image/png'));
  };

  return (
    <div className="panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Draw signature</h3>
        <div className="flex gap-2">
          <button className="btn-secondary" type="button" onClick={() => padRef.current?.clear()}><RotateCcw className="h-4 w-4" /> Clear</button>
          <button className="btn-primary" type="button" onClick={save}><Save className="h-4 w-4" /> Use signature</button>
        </div>
      </div>
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50">
        <SignatureCanvas ref={padRef} penColor="#16202a" canvasProps={{ className: 'h-48 w-full' }} />
      </div>
    </div>
  );
}
