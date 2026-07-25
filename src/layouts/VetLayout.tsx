import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { VET_NAV } from "@/lib/nav-config";

export function VetLayout() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div data-portal="vet" className="min-h-screen bg-background">
      {isDesktop ? (
        <div className="flex">
          <Sidebar navItems={VET_NAV} />
          <main className="flex-1 pl-60">
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="pb-20">
          <Outlet />
          <BottomNav navItems={VET_NAV} />
        </main>
      )}
    </div>
  );
}
