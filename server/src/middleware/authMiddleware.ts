// server/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Business from '../models/Business'; // Import Business model
import mongoose from 'mongoose';
// Extend Express Request type to include user and businessId
export interface AuthRequest extends Request {
  userId?: string;
  businessId?: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

      // Attach user ID to request
      req.userId = decoded.userId;

      // --- Find the associated Business ID ---
      const business = await Business.findOne({ user: req.userId }).select('_id');
      if (!business) {
          console.warn(`No business found for user ID: ${req.userId}`);
          return res.status(401).json({ message: 'Not authorized, business not found' });
      }
      req.businessId = (business._id as mongoose.Types.ObjectId).toString(); // Add type assertion      // --- End Find Business ID ---

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};