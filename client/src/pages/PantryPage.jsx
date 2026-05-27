import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES } from "@/lib/types";

export default function PantryPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Other", quantity: "", unit: "" });

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    api.get("/pantry")
      .then((r) => setItems(r.data.items))
      .catch(() => toast.error("Failed to load pantry"))
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  const handleAdd = async () => {
    if (!form.name.trim()) { toast.error("Item name is required"); return; }
    try {
      const { data } = await api.post("/pantry", form);
      setItems((prev) => [...prev, data.item]);
      setForm({ name: "", category: "Other", quantity: "", unit: "" });
      setAdding(false);
      toast.success(`${data.item.name} added to pantry`);
    } catch {
      toast.error("Failed to add item");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/pantry/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const grouped = items.reduce((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-[var(--muted-foreground)]">Loading…</div>
  );

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 animate-fade-up">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-3xl font-bold">My Pantry</h1>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>
      <p className="text-[var(--muted-foreground)] mb-6">Track what you have so AI can suggest what to cook.</p>

      {adding && (
        <div className="rounded-3xl bg-[var(--card)] border border-[var(--border)] p-6 mb-6 shadow-soft space-y-3">
          <h3 className="font-display font-semibold">Add Pantry Item</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <input
              placeholder="Item name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="col-span-2 px-4 py-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-4 py-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-sm focus:outline-none"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              placeholder="Qty (e.g. 500)"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="px-4 py-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-sm focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-5 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90">
              Add
            </button>
            <button onClick={() => setAdding(false)} className="px-5 py-2 rounded-xl bg-[var(--muted)] text-sm font-medium hover:bg-[var(--surface)]">
              Cancel
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-20 text-[var(--muted-foreground)] space-y-3">
          <Package className="w-12 h-12 mx-auto opacity-30" />
          <p>Your pantry is empty. Add items to get smarter recipe suggestions.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, catItems]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2 px-1">
                {category} ({catItems.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {catItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] group">
                    <div>
                      <span className="font-medium text-sm">{item.name}</span>
                      {item.quantity && (
                        <span className="ml-2 text-xs text-[var(--muted-foreground)]">{item.quantity} {item.unit}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="w-7 h-7 rounded-full grid place-items-center text-[var(--muted-foreground)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
