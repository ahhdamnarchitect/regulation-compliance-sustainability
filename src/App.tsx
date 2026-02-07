import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { UpgradeProvider, useUpgrade } from "@/contexts/UpgradeContext";
import { UpgradePopup } from "@/components/auth/UpgradePopup";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import SearchResults from "./pages/SearchResults";
import RegulationDetail from "./pages/RegulationDetail";
import AccountSettings from "./pages/AccountSettings";
import About from "./pages/About";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function UpgradePopupWrapper() {
  const { showUpgrade, setShowUpgrade } = useUpgrade();
  return (
    <UpgradePopup
      open={showUpgrade}
      onClose={() => setShowUpgrade(false)}
    />
  );
}

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <UpgradeProvider>
              <UpgradePopupWrapper />
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/regulation/:id" element={<RegulationDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/account" element={<AccountSettings />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/about" element={<About />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </UpgradeProvider>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
