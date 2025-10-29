// server/src/routes/profile.ts
import { Router } from 'express';
import { getProfile, updateUserProfile, updateBusinessProfile, changePassword, uploadAvatar } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware'; // Import protect middleware
import { upload } from '../config/cloudinary'; // Import multer upload middleware

const router = Router();

// Protect all profile routes
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile/user', updateUserProfile);
router.put('/profile/business', updateBusinessProfile);
router.put('/profile/change-password', changePassword);
router.post('/profile/upload-avatar', upload.single('avatar'), uploadAvatar);

export default router;