import Document from '../models/Document.js';
import { logAudit } from '../services/auditService.js';

export const verifyDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({ verificationCode: req.params.verificationCode })
      .populate('owner', 'name email')
      .select('fileName status signedAt verificationCode owner');

    await logAudit({ action: 'VERIFICATION_REQUEST', documentId: document?._id, ipAddress: req.ip });

    if (!document) {
      return res.status(404).json({ valid: false, message: 'No signed document found for this code' });
    }

    res.json({
      valid: true,
      documentName: document.fileName,
      signedDate: document.signedAt,
      status: document.status,
      owner: document.owner,
      verificationCode: document.verificationCode
    });
  } catch (error) {
    next(error);
  }
};
