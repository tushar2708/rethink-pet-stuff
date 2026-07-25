import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";

const app = express();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan(config.NODE_ENV === "development" ? "dev" : "combined"));

// API Routes
app.use("/api/auth", authRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

// API 404 — only for /api/* paths
app.all("/api/*", (_req, res) => {
  res.status(404).json({ success: false, error: "API route not found" });
});

// In production, serve the built React frontend
if (config.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../../frontend");
  app.use(express.static(frontendDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Error handler (must be last)
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`PetStuff API running on port ${config.PORT} [${config.NODE_ENV}]`);
});

export default app;
