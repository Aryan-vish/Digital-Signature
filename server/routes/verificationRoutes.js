import { Router } from 'express';
import { verifyDocument } from '../controllers/verificationController.js';

const router = Router();

router.get('/:verificationCode', verifyDocument);

export default router;
