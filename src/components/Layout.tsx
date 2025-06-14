
import { Outlet } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";
import { CurrencySelector } from "./CurrencySelector";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Layout = () => {
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with currency selector and logout */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-bold text-primary">WalletWise</h1>
          <div className="flex items-center gap-3">
            <CurrencySelector />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;
