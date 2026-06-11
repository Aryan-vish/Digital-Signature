import api from './api';

export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append('pdf', file);
  return api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const fetchDocuments = () => api.get('/documents');
export const fetchDocument = (id) => api.get(`/documents/${id}`);
export const fetchSignatures = () => api.get('/documents/signatures');
export const signDocument = (id, payload) => api.post(`/documents/${id}/sign`, payload);
export const downloadDocumentUrl = (id) => `${api.defaults.baseURL}/documents/${id}/download`;
export const downloadDocumentBlob = (id) => api.get(`/documents/${id}/download`, { responseType: 'blob' });
export const verifyDocument = (code) => api.get(`/verify/${code}`);
