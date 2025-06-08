
import { Routes, Route, Navigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Subscriptions from "@/pages/Subscriptions";
import Insights from "@/pages/Insights";
import Layout from "@/components/Layout";
import NotFound from "@/pages/NotFound";

interface AppRoutesProps {
  session: Session | null;
}

export const AppRoutes = ({ session }: AppRoutesProps) => {
  if (!session) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

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
