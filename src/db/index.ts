import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Create a Neon connection
const sql = neon(process.env.DATABASE_URL);

// Create a Drizzle client
export const db = drizzle(sql, { schema });