import { Router } from 'express';
import { deleteDocument, getDocuments, getLogs, getStats, getUsers } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = Router();

router.use(protect, adminOnly);
router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/documents', getDocuments);
router.delete('/documents/:id', deleteDocument);
router.get('/logs', getLogs);

export default router;
