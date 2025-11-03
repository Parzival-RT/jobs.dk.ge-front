export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Job Portal",
  NODE_ENV: process.env.NODE_ENV || "development",

  // Private env vars (server-side only)
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
} as const;

// Validation
const requiredEnvVars = ["NEXT_PUBLIC_API_URL"] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Usage: import { env } from '@/config/env'
