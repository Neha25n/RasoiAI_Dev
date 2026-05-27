import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bookmark, BookmarkCheck, Clock, Flame, ChefHat, RefreshCw, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const STATUS = {
  have: { label: "You have", dot: "bg-[var(--have)]", chip: "chip-have" },
  sub: { label: "Substitution", dot: "bg-[var(--sub)]", chip: "chip-sub" },
  buy: { label: "Buy", dot: "bg-[var(--buy)]", chip: "chip-buy" },
};

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-4">
      <div className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)]">{label}</div>
      <div className="font-display text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

export default function RecipePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [insight, setInsight] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("rasoiai:current-recipe");
    if (!raw) { navigate("/"); return; }
    setRecipe(JSON.parse(raw));
    setInsight(sessionStorage.getItem("rasoiai:nutrition-insight") || "");
  }, [navigate]);

  const handleSave = async () => {
    if (!user) { toast.error("Sign in to save recipes"); navigate("/auth"); return; }
    if (!recipe) return;
    setSaving(true);
    try {
      await api.post("/recipes/save", recipe);
      setSaved(true);
      toast.success("Recipe saved!");
    } catch {
      toast.error("Failed to save recipe");
    } finally {
      setSaving(false);
    }
  };

  if (!recipe) return null;

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 animate-fade-up space-y-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to generator
      </Link>

      <div className="rounded-3xl bg-[var(--card)] border border-[var(--border)] p-7 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-[var(--muted)] text-xs font-medium">{recipe.cuisine}</span>
              <span className="px-2.5 py-1 rounded-full bg-[var(--muted)] text-xs font-medium">{recipe.difficulty}</span>
              {recipe.diet.slice(0, 2).map((d) => (
                <span key={d} className="px-2.5 py-1 rounded-full diet-badge text-xs font-medium">{d}</span>
              ))}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold">{recipe.title}</h1>
            <p className="text-[var(--muted-foreground)] mt-2">{recipe.tagline}</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saved || saving}
            className={`shrink-0 w-11 h-11 rounded-full border grid place-items-center transition-all ${
              saved ? "bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-foreground)]" : "border-[var(--border)] hover:border-[var(--primary)]"
            }`}
            title={saved ? "Saved!" : "Save recipe"}
          >
            {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <Stat label="Calories" value={`${recipe.calories}`} />
          <Stat label="Protein" value={`${recipe.protein}g`} />
          <Stat label="Carbs" value={`${recipe.carbs}g`} />
          <Stat label="Fat" value={`${recipe.fat}g`} />
        </div>

        <div className="flex gap-4 mt-4 text-sm text-[var(--muted-foreground)]">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Prep {recipe.prepTime}m</span>
          <span className="flex items-center gap-1"><Flame className="w-4 h-4" /> Cook {recipe.cookTime}m</span>
          <span className="flex items-center gap-1"><ChefHat className="w-4 h-4" /> {recipe.servings} servings</span>
        </div>
      </div>

      {insight && (
        <div className="rounded-2xl insight-bg border p-4 flex gap-3">
          <Sparkles className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
          <p className="text-sm">{insight}</p>
        </div>
      )}

      <div className="rounded-3xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-soft">
        <h2 className="font-display text-xl font-bold mb-4">Ingredients</h2>
        <div className="flex gap-4 text-xs text-[var(--muted-foreground)] mb-4">
          {Object.keys(STATUS).map((k) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${STATUS[k].dot}`} /> {STATUS[k].label}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm ${STATUS[ing.status].chip}`}>
              <span className="font-medium">{ing.name}</span>
              <span className="text-[var(--muted-foreground)]">
                {ing.qty}{ing.substitution && <span className="ml-2 italic text-xs">{ing.substitution}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-soft">
        <h2 className="font-display text-xl font-bold mb-5">Instructions</h2>
        <ol className="space-y-4">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="w-7 h-7 shrink-0 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-bold grid place-items-center">{i + 1}</span>
              <p className="text-sm leading-relaxed pt-1">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {recipe.tips.length > 0 && (
        <div className="rounded-3xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-soft">
          <h2 className="font-display text-xl font-bold mb-4">Chef's Tips</h2>
          <ul className="space-y-2">
            {recipe.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-[var(--primary)]">✦</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        to="/"
        className="w-full h-12 rounded-2xl border border-[var(--border)] flex items-center justify-center gap-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors"
      >
        <RefreshCw className="w-4 h-4" /> Generate another recipe
      </Link>
    </div>
  );
}
