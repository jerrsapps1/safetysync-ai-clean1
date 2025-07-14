import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import WebSocket from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon database connection
neonConfig.webSocketConstructor = WebSocket;

// Enhanced error handling for database connection issues
neonConfig.pipelineConnect = false;
neonConfig.pipelineTLS = false;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool with error handling
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  max: 10
});

export const db = drizzle({ client: pool, schema });

// Add connection error handling
pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

// Test database connection on startup
export async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log('Database connection successful');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}