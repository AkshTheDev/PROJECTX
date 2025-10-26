// server/src/controllers/profileController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware'; // Use AuthRequest type
import User from '../models/User';
import Business from '../models/Business';
import bcrypt from 'bcryptjs';

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
        console.error("Update Business Profile Error:", error);
        res.status(500).json({ message: 'Server error updating business profile' });
    }
};

// --- Change Password ---
export const changePassword = async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        user.passwordHash = newPasswordHash;
        await user.save();

        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ message: 'Server error changing password' });
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