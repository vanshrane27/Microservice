import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { trafficLogRoutes } from './routes/trafficLog.routes';
import { validateEnv } from './utils/validateEnv';

// Load environment variables
dotenv.config();

// Validate environment variables
try {
  validateEnv();
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', 'Environment Error:', (error as Error).message);
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/logs', trafficLogRoutes);

// Database connection
console.log('\x1b[36m%s\x1b[0m', 'Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('\x1b[32m%s\x1b[0m', '✓ Connected to MongoDB');
    console.log('\x1b[36m%s\x1b[0m', '  Database:', process.env.MONGODB_URI);
  })
  .catch((error) => {
    console.error('\x1b[31m%s\x1b[0m', 'MongoDB connection error:', error);
    console.error('\x1b[31m%s\x1b[0m', 'Please ensure MongoDB is running and accessible');
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\x1b[32m%s\x1b[0m', `✓ Server is running on port ${PORT}`);
  console.log('\x1b[36m%s\x1b[0m', `  API Documentation: http://localhost:${PORT}/api/logs`);
  console.log('\x1b[36m%s\x1b[0m', '  Press Ctrl+C to stop the server');
}); 