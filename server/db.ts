import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../shared/schema';

// استخدام Pool العادي لـ PostgreSQL
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://ubuntu:ubuntu@localhost:5432/restaurant_db",
});

export const db = drizzle(pool, { schema });
