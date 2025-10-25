// server/src/controllers/profileController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware'; // Use AuthRequest type
import User from '../models/User';
import Business from '../models/Business';

// --- Get User & Business Profile ---
export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId).select('-passwordHash'); // Exclude password
        const business = await Business.findOne({ user: req.userId });

        if (!user || !business) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json({ user, business });

    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};

// --- Update User Profile ---
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
    const { fullName, phone, notificationsOn, avatarUrl } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.userId,
            { fullName, phone, notificationsOn, avatarUrl },
            { new: true, runValidators: true } // Return updated doc, run schema validators
        ).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);

    } catch (error) {
        console.error("Update User Profile Error:", error);
        res.status(500).json({ message: 'Server error updating user profile' });
    }
};

// --- Update Business Profile ---
export const updateBusinessProfile = async (req: AuthRequest, res: Response) => {
    const { name, address, gstin, logoUrl } = req.body;
    try {
        // Find business by the businessId attached in middleware
        const business = await Business.findByIdAndUpdate(
            req.businessId,
            { name, address, gstin, logoUrl },
            { new: true, runValidators: true }
        );

        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }
        res.json(business);

    } catch (error) {
        console.error("Update Business Profile Error:", error);
        res.status(500).json({ message: 'Server error updating business profile' });
    }
};