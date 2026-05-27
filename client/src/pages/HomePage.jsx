import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Clock, Flame, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { defaultForm, DIETS, ALLERGIES, CUISINES, MEALS, NUTRIENTS, POPULAR_INGREDIENTS } from "@/lib/types";

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all border ${
        active
          ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
          : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--muted)]"
      }`}
    >
      {children}
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-3xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-soft">
      <h3 className="font-display text-base font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const toggle = (key, value) => {
    const arr = form[key];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    setForm({ ...form, [key]: next });
  };

  const handleGenerate = async () => {
    const allIngredients = [
      ...form.ingredients,
      ...form.customIngredients.split(",").map((s) => s.trim()).filter(Boolean),
    ];
    if (allIngredients.length === 0) {
      toast.error("Add at least one ingredient");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/recipes/generate", {
        ...form,
        ingredients: allIngredients,
      });
      sessionStorage.setItem("rasoiai:current-recipe", JSON.stringify(data.recipe));
      sessionStorage.setItem("rasoiai:nutrition-insight", data.nutritionInsight || "");
      navigate("/recipe");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to generate recipe. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 space-y-6 animate-fade-up">
      {/* Hero */}
      <div className="text-center space-y-3 pb-2">
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
          What shall we cook<br />
          <span className="text-[var(--primary)]">today?</span>
        </h1>
        <p className="text-[var(--muted-foreground)] max-w-md mx-auto">
          Tell us what's in your pantry and your goals — Gemini AI crafts a recipe just for you.
        </p>
      </div>

      <Section title="🥗 Diet Preferences">
        <div className="flex flex-wrap gap-2">
          {DIETS.map((d) => <Chip key={d} active={form.diets.includes(d)} onClick={() => toggle("diets", d)}>{d}</Chip>)}
        </div>
      </Section>

      <Section title="⚠️ Allergies to Avoid">
        <div className="flex flex-wrap gap-2">
          {ALLERGIES.map((a) => <Chip key={a} active={form.allergies.includes(a)} onClick={() => toggle("allergies", a)}>{a}</Chip>)}
        </div>
      </Section>

      <Section title="🧅 Ingredients You Have">
        <div className="flex flex-wrap gap-2 mb-3">
          {POPULAR_INGREDIENTS.map((i) => (
            <Chip key={i} active={form.ingredients.includes(i)} onClick={() => toggle("ingredients", i)}>{i}</Chip>
          ))}
        </div>
        <input
          type="text"
          value={form.customIngredients}
          onChange={(e) => setForm({ ...form, customIngredients: e.target.value })}
          placeholder="Other ingredients, comma separated…"
          className="w-full mt-2 px-4 py-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
      </Section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Section title="🌍 Cuisine">
          <div className="flex flex-wrap gap-2">
            {CUISINES.map((c) => (
              <Chip key={c} active={form.cuisine === c} onClick={() => setForm({ ...form, cuisine: c })}>{c}</Chip>
            ))}
          </div>
        </Section>
        <Section title="🍽 Meal Type">
          <div className="flex flex-wrap gap-2">
            {MEALS.map((m) => (
              <Chip key={m} active={form.mealType === m} onClick={() => setForm({ ...form, mealType: m })}>{m}</Chip>
            ))}
          </div>
        </Section>
      </div>

      <Section title="💪 Nutrition Goals">
        <div className="flex flex-wrap gap-2">
          {NUTRIENTS.map((n) => <Chip key={n} active={form.nutrients.includes(n)} onClick={() => toggle("nutrients", n)}>{n}</Chip>)}
        </div>
      </Section>

      <Section title="⚙️ Recipe Settings">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-[var(--primary)]" /> Calories</span>
              <span className="font-semibold">{form.calories} kcal</span>
            </div>
            <input type="range" min={200} max={1200} step={50} value={form.calories}
              onChange={(e) => setForm({ ...form, calories: +e.target.value })}
              className="w-full accent-[var(--primary)]" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[var(--primary)]" /> Cook Time</span>
              <span className="font-semibold">{form.cookTime} min</span>
            </div>
            <input type="range" min={10} max={120} step={5} value={form.cookTime}
              onChange={(e) => setForm({ ...form, cookTime: +e.target.value })}
              className="w-full accent-[var(--primary)]" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[var(--primary)]" /> Servings</span>
              <span className="font-semibold">{form.servings}</span>
            </div>
            <input type="range" min={1} max={8} step={1} value={form.servings}
              onChange={(e) => setForm({ ...form, servings: +e.target.value })}
              className="w-full accent-[var(--primary)]" />
          </div>
        </div>
      </Section>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full h-14 rounded-2xl bg-gradient-leaf text-[var(--primary-foreground)] font-semibold text-lg flex items-center justify-center gap-2 shadow-glow hover:opacity-95 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Cooking with AI…</>
        ) : (
          <><Sparkles className="w-5 h-5" /> Generate Recipe</>
        )}
      </button>
    </div>
  );
}
