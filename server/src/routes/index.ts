
// server/src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth';

const router = Router();

router.use(authRoutes);
// You will add other routes here later

export default router;