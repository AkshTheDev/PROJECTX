// server/src/routes/profile.ts
import { Router } from 'express';
import { getProfile, updateUserProfile, updateBusinessProfile, changePassword } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware'; // Import protect middleware

const router = Router();

// Protect all profile routes
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile/user', updateUserProfile);
router.put('/profile/business', updateBusinessProfile);
router.put('/profile/change-password', changePassword);

export default router;