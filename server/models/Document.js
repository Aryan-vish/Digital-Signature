import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fileName: { type: String, required: true, trim: true },
    originalPdf: { type: String, required: true },
    originalPdfPublicId: { type: String, required: true },
    signedPdf: { type: String },
    signedPdfPublicId: { type: String },
    status: { type: String, enum: ['uploaded', 'in_progress', 'signed'], default: 'uploaded', index: true },
    verificationCode: { type: String, unique: true, sparse: true, index: true },
    signedAt: { type: Date }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default mongoose.model('Document', documentSchema);
