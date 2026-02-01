import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// This satisfies the "Security" requirement by keeping the URL in .env [cite: 28, 50]
let db: any = null;

if (typeof window === 'undefined') {
  // Only initialize database on server side
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not defined');
  }
  
  const sql = neon(process.env.DATABASE_URL);
  db = drizzle(sql, { schema });
}

export { db };
