import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.js";
import { PantryItem } from "../models/PantryItem.js";

const router = Router();

const ItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().default("Other"),
  quantity: z.string().default(""),
  unit: z.string().default(""),
  expiresAt: z.string().optional(),
});

router.use(authenticate);

// GET /api/pantry
router.get("/", async (req, res) => {
  const items = await PantryItem.find({ userId: req.userId }).sort({ category: 1, name: 1 }).lean();
  res.json({ items });
});

// POST /api/pantry
router.post("/", async (req, res) => {
  const parsed = ItemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const item = await PantryItem.create({ ...parsed.data, userId: req.userId });
  res.status(201).json({ item });
});

// PUT /api/pantry/:id
router.put("/:id", async (req, res) => {
  const parsed = ItemSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const item = await PantryItem.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    parsed.data,
    { new: true }
  );
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  res.json({ item });
});

// DELETE /api/pantry/:id
router.delete("/:id", async (req, res) => {
  const item = await PantryItem.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  res.json({ success: true });
});

export default router;
