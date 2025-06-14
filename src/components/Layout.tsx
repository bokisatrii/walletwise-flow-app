
import { Outlet } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";
import { CurrencySelector } from "./CurrencySelector";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with currency selector */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-bold text-primary">WalletWise</h1>
          <CurrencySelector />
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
