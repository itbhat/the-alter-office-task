import dotenv from "dotenv";

dotenv.config();

//-------------Database Configuration ------------
const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/analytics_db";

// Create a connection pool
export const pool = new Pool({connectionString: DATABASE_URL, ssl: process.enc.NODE_ENV === "productin" ? { rejectUnauthorized: false } : false,});

// simple query wrapper 
export const query = (text: string, params?: any[]) => pool.query(text, params);

// ----- Graceful Shutdown ----------
export async function closeDb(){
  await pool.end();
  console.log("connection pool closed");
}
