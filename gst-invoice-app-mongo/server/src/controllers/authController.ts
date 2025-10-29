// server/src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Business from '../models/Business';

export const register = async (req: Request, res: Response) => {
  const { email, password, companyName } = req.body;

  if (!email || !password || !companyName) {
    return res.status(400).json({ message: 'Email, password, and company name are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      passwordHash,
    });
    const savedUser = await newUser.save();

    const newBusiness = new Business({
      name: companyName,
      user: savedUser._id,
    });
    await newBusiness.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Ensure a Business document exists for this user to support protected routes
    // Some older accounts may have been created before businesses were auto-created
    const existingBusiness = await Business.findOne({ user: user._id });
    if (!existingBusiness) {
      await Business.create({ name: user.fullName || 'My Business', user: user._id });
    }

    const token = jwt.sign(
      { userId: user._id }, // Use _id from MongoDB
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
