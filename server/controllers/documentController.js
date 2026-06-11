import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import axios from 'axios'; 
import { v2 as cloudinary } from 'cloudinary'; // 🟢 FIX 1: Secure URLs banane ke liye SDK import kiya
import Document from '../models/Document.js';
import Signature from '../models/Signature.js';
import { signPdf } from '../services/pdfService.js';
import { logAudit } from '../services/auditService.js';
import { deleteCloudinaryFile, uploadPdfToCloudinary } from '../services/cloudinaryService.js';

const signedDir = path.join(process.cwd(), 'uploads', 'signed');

// Cloudinary config load karne ke liye helper (ताकि signature mismatch issues na aayein)
const configureCloudinaryInController = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
};

const safeUnlink = async (filePath) => {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Temporary file cleanup failed:', error.message);
  }
};

const assertDocumentAccess = async (documentId, user) => {
  const document = await Document.findById(documentId).populate('owner', 'name email');
  if (!document) {
    const error = new Error('Document not found');
    error.status = 404;
    throw error;
  }
  if (user.role !== 'admin' && String(document.owner._id) !== String(user._id)) {
    const error = new Error('Document access denied');
    error.status = 403;
    throw error;
  }
  return document;
};

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    const uploadedPdf = await uploadPdfToCloudinary(req.file.path, 'digital-signature-platform/original');
    const document = await Document.create({
      owner: req.user._id,
      fileName: req.file.originalname,
      originalPdf: uploadedPdf.url,
      originalPdfPublicId: uploadedPdf.publicId
    });
    await safeUnlink(req.file.path);
    await logAudit({ userId: req.user._id, action: 'PDF_UPLOAD', documentId: document._id, ipAddress: req.ip });
    res.status(201).json(document);
  } catch (error) {
    await safeUnlink(req.file?.path);
    next(error);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    next(error);
  }
};

export const getDocument = async (req, res, next) => {
  try {
    const document = await assertDocumentAccess(req.params.id, req.user);
    res.json(document);
  } catch (error) {
    next(error);
  }
};

export const signDocument = async (req, res, next) => {
  try {
    const { signatureImage, position, saveSignature } = req.body;
    if (!signatureImage?.startsWith('data:image/png;base64,')) {
      return res.status(400).json({ message: 'PNG signature image is required' });
    }

    const document = await assertDocumentAccess(req.params.id, req.user);
    const previousSignedPublicId = document.signedPdfPublicId;

    // 🟢 FIX 2: pdfService ko ab strict validation ke liye exact publicId bhi bhej rahe hain
    const result = await signPdf({
      sourceUrl: document.originalPdf,
      publicId: document.originalPdfPublicId, 
      signatureDataUrl: signatureImage,
      outputDir: signedDir,
      position
    });

    const uploadedSignedPdf = await uploadPdfToCloudinary(result.outputPath, 'digital-signature-platform/signed');

    document.signedPdf = uploadedSignedPdf.url;
    document.signedPdfPublicId = uploadedSignedPdf.publicId;
    document.status = 'signed';
    document.signedAt = new Date();
    document.verificationCode = crypto.randomBytes(12).toString('hex').toUpperCase();
    await document.save();

    await safeUnlink(result.outputPath);

    if (previousSignedPublicId) {
      await deleteCloudinaryFile(previousSignedPublicId);
    }

    if (saveSignature) {
      await Signature.create({ userId: req.user._id, signatureImage });
    }

    await logAudit({ userId: req.user._id, action: 'PDF_SIGNING', documentId: document._id, ipAddress: req.ip });
    res.json(document);
  } catch (error) {
    next(error);
  }
};

export const downloadDocument = async (req, res, next) => {
  try {
    const document = await assertDocumentAccess(req.params.id, req.user);
    await logAudit({ userId: req.user._id, action: 'PDF_DOWNLOAD', documentId: document._id, ipAddress: req.ip });

    // 🟢 FIX 3: Download ke time 401 error bypass karne ke liye authenticated secure url generator lagaya
    configureCloudinaryInController();
    
    const activePublicId = document.signedPdfPublicId || document.originalPdfPublicId;
    if (!activePublicId) {
      return res.status(404).json({ message: 'Cloudinary public ID mapping missing for this document.' });
    }

    const secureAuthenticatedUrl = cloudinary.url(activePublicId, {
      resource_type: 'raw',
      sign_url: true,
      secure: true
    });

    // Ab authenticated URL se request 200 OK ke sath buffer download karegi
    const response = await axios.get(secureAuthenticatedUrl, { responseType: 'arraybuffer' });

    const fileName = `${document.status === 'signed' ? 'signed-' : ''}${document.fileName}`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName.replace(/"/g, '')}"`);
    res.send(Buffer.from(response.data));
  } catch (error) {
    next(error);
  }
};

export const getSignatures = async (req, res, next) => {
  try {
    const signatures = await Signature.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(signatures);
  } catch (error) {
    next(error);
  }
};