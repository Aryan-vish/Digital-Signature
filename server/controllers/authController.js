import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import User from '../models/User.js';
import { logAudit } from '../services/auditService.js';
import { sendPasswordResetEmail } from '../services/emailService.js';

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

const authPayload = (user) => ({ token: signToken(user), user: user.toJSON() });

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !validator.isEmail(String(email || '')) || !validator.isStrongPassword(String(password || ''), { minSymbols: 0 })) {
      return res.status(400).json({ message: 'Provide a valid name, email, and strong password' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    await logAudit({ userId: user._id, action: 'USER_REGISTRATION', ipAddress: req.ip });
    res.status(201).json(authPayload(user));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(String(password || ''), user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    await logAudit({ userId: user._id, action: 'USER_LOGIN', ipAddress: req.ip });
    res.json(authPayload(user));
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!validator.isEmail(String(email || ''))) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    await sendPasswordResetEmail({ email });
    res.json({ message: 'If an account exists, password reset instructions will be sent' });
  } catch (error) {
    next(error);
  }
};
