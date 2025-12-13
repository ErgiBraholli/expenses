import jwt from "jsonwebtoken";
import { SUPABASE_JWT_SECRET } from "../config/env.js";

export const requireAuth = (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
    req.user = { id: decoded.sub };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
