import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Helmet security setup
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// ✅ Fixed CORS Configuration: Explicit Array with Credentials Support
const allowedOrigins = [
  'http://localhost:5173',                       // Local Development for Frontend
  'https://digital-signature-khaki.vercel.app'  // Live Vercel Production Frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allows requests with no origin (like mobile apps, postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin === 'null') {
      callback(null, true);
    } else {
      callback(new Error('CORS policy optimization blocked this request.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging configuration
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting to prevent abuse
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

// Static file hosting for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Main Routes
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'digital-signature-platform' }));
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/verify', verificationRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

// Database connection & Server init
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => console.log(`API running on port ${port}`));
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });