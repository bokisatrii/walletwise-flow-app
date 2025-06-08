
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Subscriptions from "./pages/Subscriptions";
import Insights from "./pages/Insights";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Mock authentication state - in real app this would come from Supabase
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/auth" element={<Auth onAuthSuccess={() => setIsAuthenticated(true)} />} />
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </>
            ) : (
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="subscriptions" element={<Subscriptions />} />
                <Route path="insights" element={<Insights />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
