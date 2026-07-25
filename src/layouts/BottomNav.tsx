import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PawPrint,
  Stethoscope,
  Users,
  Calendar,
  Settings,
  ClipboardList,
  Clock,
  UserCircle,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { NavItem } from "@/lib/nav-config";

interface BottomNavProps {
  navItems: NavItem[];
}

const ICONS = {
  LayoutDashboard,
  PawPrint,
  Stethoscope,
  Users,
  Calendar,
  Settings,
  ClipboardList,
  Clock,
  UserCircle,
  Briefcase,
  DollarSign,
};

type IconName = keyof typeof ICONS;

export function BottomNav({ navItems }: BottomNavProps) {
  // Show only first 5 items for mobile bottom nav
  const displayItems = navItems.slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
      <div className="flex justify-around">
        {displayItems.map((item) => {
          const Icon = ICONS[item.icon as IconName];

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: navLinkIsActive }) =>
                cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 px-2 py-3 transition-colors",
                  navLinkIsActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {Icon && <Icon className="h-5 w-5" />}
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
