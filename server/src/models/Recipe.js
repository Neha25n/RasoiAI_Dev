import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    tagline: String,
    prepTime: Number,
    cookTime: Number,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    servings: Number,
    cuisine: String,
    diet: [String],
    ingredients: [
      {
        name: String,
        qty: String,
        status: { type: String, enum: ["have", "sub", "buy"] },
        substitution: String,
      },
    ],
    steps: [String],
    tips: [String],
  },
  { timestamps: true }
);

export const Recipe = mongoose.model("Recipe", RecipeSchema);
