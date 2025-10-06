// Storage factory to choose between SQLite (dev) and PostgreSQL (production)
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  // Use PostgreSQL in production
  export * from './storage-pg';
} else {
  // Use SQLite in development
  export * from './storage';
}