import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateRecipe(req) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are RasoiAI, an expert Indian and global cuisine chef and nutritionist.

Generate a detailed recipe based on these preferences:
- Available ingredients: ${req.ingredients.join(", ")}
- Diet: ${req.diets.join(", ") || "No restriction"}
- Allergies to avoid: ${req.allergies.join(", ") || "None"}
- Target calories: ~${req.calories} kcal
- Max cook time: ${req.cookTime} minutes
- Cuisine style: ${req.cuisine}
- Meal type: ${req.mealType}
- Servings: ${req.servings}
- Nutritional focus: ${req.nutrients.join(", ") || "Balanced"}

Respond ONLY with a valid JSON object (no markdown, no code fences) matching this exact structure:
{
  "title": "Recipe Name",
  "tagline": "One enticing sentence about the dish",
  "prepTime": 10,
  "cookTime": 25,
  "calories": 480,
  "protein": 22,
  "carbs": 45,
  "fat": 18,
  "fiber": 6,
  "difficulty": "Easy",
  "servings": ${req.servings},
  "cuisine": "${req.cuisine}",
  "diet": ["Vegetarian"],
  "ingredients": [
    { "name": "Paneer", "qty": "200g", "status": "have" },
    { "name": "Heavy cream", "qty": "50ml", "status": "sub", "substitution": "Use coconut cream for vegan" },
    { "name": "Kasuri methi", "qty": "1 tsp", "status": "buy" }
  ],
  "steps": [
    "Step 1 description",
    "Step 2 description"
  ],
  "tips": [
    "Pro tip 1",
    "Pro tip 2"
  ]
}

Rules:
- ingredient status "have" = from the provided ingredients list, "sub" = available substitute, "buy" = needs to be bought
- steps should be detailed and clear, 6-10 steps
- tips should be genuinely useful cooking advice
- calories and macros should be realistic for the dish
- difficulty: Easy (under 30 min, few steps), Medium, or Hard`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip any accidental markdown fences
  const clean = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error("Gemini returned invalid JSON. Raw: " + text.slice(0, 300));
  }
}

export async function getNutritionAdvice(recipe, userGoals) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `As a nutritionist, give a 2-3 sentence personalized nutrition insight for this recipe:
Recipe: ${recipe.title} (${recipe.calories} cal, ${recipe.protein}g protein, ${recipe.carbs}g carbs, ${recipe.fat}g fat)
User goals: ${userGoals.join(", ")}
Be specific, encouraging, and mention one actionable tip. Keep it under 60 words.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
