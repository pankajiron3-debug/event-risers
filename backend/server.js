import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import clientRoutes from './routes/clientRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Initialize database connection
connectDB();

const app = express();

// Global Middlewares - Configured for Vercel (Frontend) and Render (Backend)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins dynamically (reflecting origin) so live Vercel domains,
      // preview deployments, and local environments communicate without CORS blocks
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Root Info
app.get('/', (req, res) => {
  res.json({
    project: 'Event Risers - B2B Corporate SaaS Billing & CMS Engine',
    version: '1.0.0',
    status: 'OPERATIONAL',
    environment: process.env.NODE_ENV || 'development',
    documentation: {
      clients: '/api/clients',
      billing: '/api/billing/process',
      health: '/api/health',
    },
  });
});

// Health check endpoint for Render service uptime monitors
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];

  res.status(200).json({
    status: 'UP',
    database: states[dbState] || 'Unknown',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// Register Resource Routes
app.use('/api/clients', clientRoutes);
app.use('/api/billing', billingRoutes);

// Fallthrough 404 & Global Crash-Proof Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  EVENT RISERS - B2B Corporate SaaS API Engine`);
  console.log(`  Server running on port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});
