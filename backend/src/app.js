import express from "express";
import cors from "cors";

import categoryRoutes from "./routes/categoryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { requireAuth } from "./middleware/auth.js";

const app = express();

const allowedOrigins = new Set(
  [
    "http://localhost:3000",
    "http://localhost:5173",
    process.env.FRONTEND_URL,
  ].filter(Boolean)
);

app.use((req, res, next) => {
  if (req.headers.origin) {
    console.log("ORIGIN:", req.headers.origin);
    console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
  }
  next();
});

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.has(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/categories", requireAuth, categoryRoutes);
app.use("/api/transactions", requireAuth, transactionRoutes);
app.use("/api/dashboard", requireAuth, dashboardRoutes);

export default app;
