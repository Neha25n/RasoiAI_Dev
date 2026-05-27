import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Clock, Flame, BookmarkX } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function SavedPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    api.get("/recipes/saved")
      .then((r) => setRecipes(r.data.recipes))
      .catch(() => toast.error("Failed to load saved recipes"))
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/recipes/${id}`);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
      toast.success("Recipe removed");
    } catch {
      toast.error("Failed to remove recipe");
    }
  };

  const viewRecipe = (recipe) => {
    sessionStorage.setItem("rasoiai:current-recipe", JSON.stringify(recipe));
    sessionStorage.setItem("rasoiai:nutrition-insight", "");
    navigate("/recipe");
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-[var(--muted-foreground)]">Loading…</div>
  );

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 animate-fade-up">
      <h1 className="font-display text-3xl font-bold mb-2">Saved Recipes</h1>
      <p className="text-[var(--muted-foreground)] mb-8">Your personal recipe collection.</p>

      {recipes.length === 0 ? (
        <div className="text-center py-20 text-[var(--muted-foreground)] space-y-3">
          <BookmarkX className="w-12 h-12 mx-auto opacity-30" />
          <p>No saved recipes yet.</p>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline">
            Generate your first recipe →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recipes.map((r) => (
            <div key={r._id} className="rounded-3xl bg-[var(--card)] border border-[var(--border)] p-5 shadow-soft group">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex gap-1.5 mb-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-[var(--muted)] text-xs">{r.cuisine}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--muted)] text-xs">{r.difficulty}</span>
                  </div>
                  <h3 className="font-display font-semibold text-lg leading-tight">{r.title}</h3>
                </div>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="shrink-0 w-8 h-8 rounded-full border border-[var(--border)] grid place-items-center text-[var(--muted-foreground)] hover:text-red-500 hover:border-red-300 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex gap-3 text-xs text-[var(--muted-foreground)] mb-4">
                <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> {r.calories} kcal</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {r.cookTime}m</span>
                <span>{r.protein}g protein</span>
              </div>

              <button
                onClick={() => viewRecipe(r)}
                className="w-full py-2 rounded-xl bg-[var(--muted)] text-sm font-medium hover:bg-[var(--surface)] transition-colors"
              >
                View Recipe
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
