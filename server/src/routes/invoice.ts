// server/src/routes/invoice.ts
import { Router } from 'express';
import { createInvoice, getInvoices, getInvoiceSummary, getInvoice, updateInvoice, deleteInvoice } from '../controllers/invoiceController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect); // Protect all invoice routes

router.post('/invoices', createInvoice);
router.get('/invoices', getInvoices);
router.get('/invoices/summary', getInvoiceSummary);
router.get('/invoices/:id', getInvoice);
router.put('/invoices/:id', updateInvoice);
router.delete('/invoices/:id', deleteInvoice);

export default router;