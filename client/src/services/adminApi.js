import api from './api';

export const fetchAdminStats = () => api.get('/admin/stats');
export const fetchAdminUsers = (q = '') => api.get('/admin/users', { params: { q } });
export const fetchAdminDocuments = (q = '') => api.get('/admin/documents', { params: { q } });
export const fetchAdminLogs = () => api.get('/admin/logs');
export const deleteAdminDocument = (id) => api.delete(`/admin/documents/${id}`);
