
import { NavLink } from "react-router-dom";
import { BarChart3, CreditCard, Repeat, Lightbulb } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/transactions", label: "Transactions", icon: CreditCard },
  { to: "/subscriptions", label: "Subscriptions", icon: Repeat },
  { to: "/insights", label: "Insights", icon: Lightbulb },
];

export const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? "text-primary bg-primary-50"
                  : "text-gray-500 hover:text-gray-700"
              }`
            }
          >
            <Icon size={20} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
