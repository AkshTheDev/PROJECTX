// server/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import Business from '../models/Business'; // Import Business model
import mongoose from 'mongoose';
// Extend Express Request type to include user and businessId
export interface AuthRequest extends Request {
  user?: { id: string };
  userId?: string;
  businessId?: string;
}

// Express expects middleware to conform to RequestHandler and return void/Promise<void>
export const protect: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthRequest;
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
  typedReq.userId = decoded.userId;
  typedReq.user = { id: decoded.userId };

      // --- Find the associated Business ID ---
      const business = await Business.findOne({ user: typedReq.userId }).select('_id');
    if (!business) {
      console.warn(`No business found for user ID: ${typedReq.userId}`);
          res.status(401).json({ message: 'Not authorized, business not found' });
          return;
      }
      typedReq.businessId = (business._id as mongoose.Types.ObjectId).toString(); // Add type assertion      // --- End Find Business ID ---

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};