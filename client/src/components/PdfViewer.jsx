import { useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';
import api from '../services/api';
import Loader from './Loader.jsx';

export default function PdfViewer({ documentId }) {
  const [fileUrl, setFileUrl] = useState('');
  const [error, setError] = useState('');
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    let objectUrl = '';
    const loadPdf = async () => {
      try {
        const { data } = await api.get(`/documents/${documentId}/download`, { responseType: 'blob' });
        objectUrl = URL.createObjectURL(data);
        setFileUrl(objectUrl);
      } catch (_error) {
        setError('Unable to load PDF preview');
      }
    };
    loadPdf();
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [documentId]);

  if (error) return <div className="panel p-4 text-sm text-red-600">{error}</div>;
  if (!fileUrl) return <div className="panel p-4"><Loader label="Loading PDF preview" /></div>;

  return (
    <div className="panel h-[420px] overflow-hidden sm:h-[560px] lg:h-[680px]">
      <Worker workerUrl={workerUrl}>
        <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
}
