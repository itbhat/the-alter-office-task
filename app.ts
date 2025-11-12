import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import {registerAuthRoutes} from './routes/auth.routes';
import {registerAnalyticsRoutes} from './routes/analytics.routes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = Application = express();

// ------------Middleware Setup ----------
app.use(bodyParser.json({limit: "1mb"}));

// Rate limiting (global fallback)
const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000, // 1 minute
  max: Number(process.env.RATE_LIMIT_MAX) || 1000,
});
app.use(globalLimiter);

// Basic Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({status:"ok", message:"Analytics API is running" });
});

// -----------Register Routes -------------
app.use("/api/auth", registerAuthRoutes());
app.use("/api/analytics", registerAnalyticsRoutes());

// --------Global Error Handler -------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next(err);
  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "internal_server_error" });
});

app.use(errorHandler);

export default app;

