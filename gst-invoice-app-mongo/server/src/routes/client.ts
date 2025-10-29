// server/src/routes/client.ts
import { Router } from 'express';
import { createClient, getClients, getClient, updateClient, deleteClient } from '../controllers/clientController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect); // Protect all client routes

router.post('/clients', createClient);
router.get('/clients', getClients);
router.get('/clients/:id', getClient);
router.put('/clients/:id', updateClient);
router.delete('/clients/:id', deleteClient);

export default router;
