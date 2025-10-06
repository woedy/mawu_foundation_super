import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { registerRoutes } from './routes';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required');
}

// CORS configuration
app.use(cors({
  origin: isProduction
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:5000', 'http://localhost:3000'],
  credentials: true,
}));

// Session configuration (using memory store for SQLite)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    },
  })
);

declare module 'express-session' {
  interface SessionData {
    adminId?: number;
    adminEmail?: string;
  }
}

// Register API routes
const server = registerRoutes(app);

// Serve static files in production
if (isProduction) {
  const distPath = path.join(__dirname, '../apps/web/dist');
  
  // Serve static assets
  app.use(express.static(distPath));
  
  // Handle client-side routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  if (isProduction) {
    console.log(`Serving static files from: ${path.join(__dirname, '../apps/web/dist')}`);
  }
});
