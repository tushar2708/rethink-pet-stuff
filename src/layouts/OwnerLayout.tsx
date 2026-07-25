import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { TopNav } from "./TopNav";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { OWNER_NAV } from "@/lib/nav-config";

export function OwnerLayout() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div data-portal="owner" className="min-h-screen bg-background">
      <TopNav />
      {isDesktop ? (
        <div className="flex pt-14">
          <Sidebar navItems={OWNER_NAV} />
          <main className="flex-1 ml-60">
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="pt-14 pb-20">
          <Outlet />
          <BottomNav navItems={OWNER_NAV} />
        </main>
      )}
    </div>
  );
}
