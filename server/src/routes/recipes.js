import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { generateRecipe, getNutritionAdvice } from "../lib/gemini.js";
import { Recipe } from "../models/Recipe.js";

const router = Router();

const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many requests. Please wait a moment." },
});

const GenerateSchema = z.object({
  ingredients: z.array(z.string()).min(1),
  diets: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  calories: z.number().min(100).max(2000).default(500),
  cookTime: z.number().min(5).max(120).default(30),
  cuisine: z.string().default("Indian"),
  mealType: z.string().default("Dinner"),
  servings: z.number().min(1).max(10).default(2),
  nutrients: z.array(z.string()).default([]),
});

// POST /api/recipes/generate
router.post("/generate", generateLimiter, optionalAuth, async (req, res) => {
  const parsed = GenerateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const recipe = await generateRecipe(parsed.data);

  let nutritionInsight;
  if (parsed.data.nutrients.length > 0) {
    try {
      nutritionInsight = await getNutritionAdvice(recipe, parsed.data.nutrients);
    } catch {
      // Non-fatal
    }
  }

  res.json({ recipe, nutritionInsight });
});

// POST /api/recipes/save
router.post("/save", authenticate, async (req, res) => {
  const recipe = req.body;
  if (!recipe?.title) {
    res.status(400).json({ error: "Invalid recipe data" });
    return;
  }

  const saved = await Recipe.create({ ...recipe, userId: req.userId });
  res.status(201).json({ recipe: saved });
});

// GET /api/recipes/saved
router.get("/saved", authenticate, async (req, res) => {
  const recipes = await Recipe.find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ recipes });
});

// DELETE /api/recipes/:id
router.delete("/:id", authenticate, async (req, res) => {
  const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!recipe) {
    res.status(404).json({ error: "Recipe not found" });
    return;
  }
  res.json({ success: true });
});

export default router;
