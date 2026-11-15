import express from 'express';
import { processBilling, viewInvoicePdf } from '../controllers/billingController.js';

const router = express.Router();

router.post('/process', processBilling);
router.get('/view-pdf/:clientId', viewInvoicePdf);

export default router;
