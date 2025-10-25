
// server/src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth';
import profileRoutes from './profile'; // <-- Import profile routes
import invoiceRoutes from './invoice'; // <-- Import invoice routes
import clientRoutes from './client'; // <-- Import client routes
import gstReportsRoutes from './gstReports'; // <-- Import GST reports routes

const router = Router();

router.use(authRoutes);
router.use(profileRoutes); // <-- Use profile routes (prefixed with /api)
router.use(invoiceRoutes);
router.use(clientRoutes); // <-- Use client routes
router.use(gstReportsRoutes); // <-- Use GST reports routes

export default router;