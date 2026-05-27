import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.js";
import recipeRoutes from "./routes/recipes.js";
import pantryRoutes from "./routes/pantry.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/pantry", pantryRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "RasoiAI" }));

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🍛 RasoiAI server running on http://localhost:${PORT}`);
  });
});
