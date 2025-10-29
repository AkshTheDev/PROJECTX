// server/src/routes/gstReports.ts
import { Router } from 'express';
import { getGstSummary, getGstRateWiseReport, getMonthlyGstReport, getGstDetails } from '../controllers/gstReportsController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect); // Protect all GST reports routes

router.get('/gst-reports/summary', getGstSummary);
router.get('/gst-reports/rate-wise', getGstRateWiseReport);
router.get('/gst-reports/monthly', getMonthlyGstReport);
router.get('/gst-reports/details', getGstDetails);

export default router;
