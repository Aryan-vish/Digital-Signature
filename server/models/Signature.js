import mongoose from 'mongoose';

const signatureSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    signatureImage: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Signature', signatureSchema);
