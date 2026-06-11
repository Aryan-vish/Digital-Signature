import { Router } from 'express';
import { downloadDocument, getDocument, getDocuments, getSignatures, signDocument, uploadDocument } from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadPdf } from '../middleware/uploadMiddleware.js';

const router = Router();

router.use(protect);
router.post('/upload', uploadPdf.single('pdf'), uploadDocument);
router.get('/', getDocuments);
router.get('/signatures', getSignatures);
router.get('/:id', getDocument);
router.post('/:id/sign', signDocument);
router.get('/:id/download', downloadDocument);

export default router;
