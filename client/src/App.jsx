import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import HomePage from "@/pages/HomePage";
import RecipePage from "@/pages/RecipePage";
import SavedPage from "@/pages/SavedPage";
import PantryPage from "@/pages/PantryPage";
import AuthPage from "@/pages/AuthPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipe" element={<RecipePage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/pantry" element={<PantryPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </main>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}
