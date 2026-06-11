import User from '../models/User.js';
import Document from '../models/Document.js';
import AuditLog from '../models/AuditLog.js';
import { logAudit } from '../services/auditService.js';
import { deleteCloudinaryFile } from '../services/cloudinaryService.js';

export const getUsers = async (req, res, next) => {
  try {
    const q = req.query.q ? { $or: [{ name: new RegExp(req.query.q, 'i') }, { email: new RegExp(req.query.q, 'i') }] } : {};
    const users = await User.find(q).select('-password').sort({ createdAt: -1 });
    await logAudit({ userId: req.user._id, action: 'ADMIN_VIEW_USERS', ipAddress: req.ip });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const q = req.query.q ? { fileName: new RegExp(req.query.q, 'i') } : {};
    const documents = await Document.find(q).populate('owner', 'name email').sort({ createdAt: -1 });
    await logAudit({ userId: req.user._id, action: 'ADMIN_VIEW_DOCUMENTS', ipAddress: req.ip });
    res.json(documents);
  } catch (error) {
    next(error);
  }
};

export const getLogs = async (_req, res, next) => {
  try {
    const logs = await AuditLog.find().populate('userId', 'name email').populate('documentId', 'fileName').sort({ createdAt: -1 }).limit(200);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (_req, res, next) => {
  try {
    const [totalUsers, totalDocuments, totalSignedDocuments] = await Promise.all([
      User.countDocuments(),
      Document.countDocuments(),
      Document.countDocuments({ status: 'signed' })
    ]);
    res.json({ totalUsers, totalDocuments, totalSignedDocuments });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    await Promise.all([
      deleteCloudinaryFile(document.originalPdfPublicId),
      deleteCloudinaryFile(document.signedPdfPublicId)
    ]);
    await logAudit({ userId: req.user._id, action: 'ADMIN_DELETE_DOCUMENT', documentId: document._id, ipAddress: req.ip });
    res.json({ message: 'Document deleted' });
  } catch (error) {
    next(error);
  }
};
