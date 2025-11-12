/*
API Endpoints Implementation
- Endpoints implemented:
POST /api/auth/register
GET /api/auth/api-key
POST /api/auth/revoke
POST /api/auth/regenerate
POST /api/analytics/collect
GET /api/analytics/event-summary

Requirements:
- Environment variables (see below)
- Postgres and Redis should be available and reachable via env vars

Environment variables expected:
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/dbname
REDIS_URL=redis://localhost:6379
API_KEY_PEPPER=some-strong-pepper
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=1000
*/

import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { Pool } from "pg";
import Redis from "ioredis";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import rateLimit from "express-rate-limit";
import Joi from "joi";

//-------- Configuration & env --------
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
