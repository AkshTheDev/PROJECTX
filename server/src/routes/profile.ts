// server/src/routes/profile.ts
import { Router } from 'express';
import { getProfile, updateUserProfile, updateBusinessProfile } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware'; // Import protect middleware

const router = Router();

// Protect all profile routes
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile/user', updateUserProfile);
router.put('/profile/business', updateBusinessProfile);

export default router;