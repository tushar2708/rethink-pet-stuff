import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { GIG_NAV } from "@/lib/nav-config";

export function GigLayout() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div data-portal="gig" className="min-h-screen bg-background">
      {isDesktop ? (
        <div className="flex">
          <Sidebar navItems={GIG_NAV} />
          <main className="flex-1 pl-60">
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="pb-20">
          <Outlet />
          <BottomNav navItems={GIG_NAV} />
        </main>
      )}
    </div>
  );
}
