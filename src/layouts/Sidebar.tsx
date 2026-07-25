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
  LogOut,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/cn";
import type { NavItem } from "@/lib/nav-config";

interface SidebarProps {
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

export function Sidebar({ navItems }: SidebarProps) {
  const { user, logout } = useAuthStore();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed left-0 top-0 z-50 hidden h-screen w-60 flex-col border-r border-border bg-card md:flex">
      {/* Header */}
      <div className="border-b border-border p-6">
        <h1 className="text-xl font-bold text-foreground">Pet OS</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = ICONS[item.icon as IconName];

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive: navLinkIsActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                      navLinkIsActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                    )
                  }
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-4">
        <div className="mb-4 flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback>{getInitials(user?.name || "User")}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
