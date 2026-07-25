import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import ownerRoutes from "./routes/owner";
import petRoutes from "./routes/pets";
import { vetOnboardingRouter, vetRouter } from "./routes/vets";
import { gigOnboardingRouter, gigWorkerRouter } from "./routes/gigWorkers";
import appointmentRoutes from "./routes/appointments";
import userRoutes from "./routes/users";
import reviewRoutes from "./routes/reviews";
import breedRoutes from "./routes/breeds";
import { getTemplates } from "./controllers/healthController";
import { validate } from "./middleware/validate";
import { healthTemplateQuerySchema } from "./schemas/healthSchemas";

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan(config.NODE_ENV === "development" ? "dev" : "combined"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/vet", vetOnboardingRouter);
app.use("/api/vets", vetRouter);
app.use("/api/gig", gigOnboardingRouter);
app.use("/api/gig-workers", gigWorkerRouter);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/breeds", breedRoutes);
app.get("/api/health-templates", validate({ query: healthTemplateQuerySchema }), getTemplates);

app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

// API 404 — only for /api/* paths
app.all("/api/*", (_req, res) => {
  res.status(404).json({ success: false, error: "API route not found" });
});

// In production, serve the built React frontend
if (config.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../frontend");
  app.use(express.static(frontendDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Error handler (must be last)
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Pet OS API running on port ${config.PORT} [${config.NODE_ENV}]`);
});

export default app;
