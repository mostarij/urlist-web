import { Pool } from 'pg';
import type { QueryResult as PgQueryResult, QueryResultRow } from 'pg';
import { ENV } from './constants';
import * as fs from 'fs/promises';
import path from 'path';

// Create a new Pool instance with validated connection string
const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  ssl: ENV.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test the connection immediately
pool
  .connect()
  .then(() => console.log('Successfully connected to database'))
  .catch((err) => {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  });

// Initialize database with schema
async function initializeDatabase() {
  try {
    const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf-8');
    await pool.query(schema);
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    throw error;
  }
}

// Initialize schema on startup
initializeDatabase().catch((err) => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});

export type QueryResult<T> = {
  rows: T[];
  rowCount: number;
};

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res: PgQueryResult<T> = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return {
      rows: res.rows,
      rowCount: res.rowCount || 0,
    };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function for transactions
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export default {
  query,
  transaction,
  pool,
};
