
import { Outlet } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;
