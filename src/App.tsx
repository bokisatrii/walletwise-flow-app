
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/AuthProvider";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Layout from "@/components/Layout";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";

import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Subscriptions from "@/pages/Subscriptions";
import Insights from "@/pages/Insights";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <AuthProvider>
            <CurrencyProvider>
              <Router>
                <div className="min-h-screen bg-background">
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Index />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="transactions" element={<Transactions />} />
                      <Route path="subscriptions" element={<Subscriptions />} />
                      <Route path="insights" element={<Insights />} />
                    </Route>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                  <ShadcnToaster />
                </div>
              </Router>
            </CurrencyProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
