import express from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerRoutes } from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const PgStore = pgSession(session);

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required');
}

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5000',
  credentials: true,
}));

app.use(
  session({
    store: new PgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

declare module 'express-session' {
  interface SessionData {
    adminId?: number;
    adminEmail?: string;
  }
}

const server = registerRoutes(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
