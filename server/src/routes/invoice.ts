// server/src/routes/invoice.ts
import { Router } from 'express';
import { createInvoice, getInvoices, getInvoiceSummary, getInvoice, updateInvoice, deleteInvoice, getDashboardStats, updateOverdueInvoices } from '../controllers/invoiceController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect); // Protect all invoice routes

router.post('/invoices', createInvoice);
router.get('/invoices/dashboard-stats', getDashboardStats); // Must be before /:id
router.get('/invoices/summary', getInvoiceSummary);
router.post('/invoices/check-overdue', updateOverdueInvoices); // Check and update overdue invoices
router.get('/invoices', getInvoices);
router.get('/invoices/:id', getInvoice);
router.put('/invoices/:id', updateInvoice);
router.delete('/invoices/:id', deleteInvoice);

export default router;