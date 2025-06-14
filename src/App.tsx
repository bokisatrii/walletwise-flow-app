
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
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

const AppRoutes = () => {
  const { session, loading } = useAuth();
  
  console.log('AppRoutes: Routing state:', {
    hasSession: !!session,
    loading,
    userEmail: session?.user?.email || 'no user'
  });

  if (loading) {
    console.log('AppRoutes: Still loading auth state...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    console.log('AppRoutes: No session, redirecting to auth');
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  console.log('AppRoutes: Session found, rendering app routes');
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="insights" element={<Insights />} />
        <Route path="auth" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

function App() {
  console.log('App: Initializing...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <AuthProvider>
            <CurrencyProvider>
              <Router>
                <div className="min-h-screen bg-background">
                  <AppRoutes />
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
