import AuditLog from '../models/AuditLog.js';

export const logAudit = async ({ userId, action, documentId, ipAddress }) => {
  try {
    await AuditLog.create({ userId, action, documentId, ipAddress });
  } catch (error) {
    console.error('Audit log failed:', error.message);
  }
};
