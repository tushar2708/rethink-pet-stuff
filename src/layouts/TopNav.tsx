import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/owner/dashboard" },
  { label: "My Pets", path: "/owner/dashboard" },
  { label: "Health", path: "/owner/dashboard" },
  { label: "Find Vet", path: "/owner/find-vet" },
  { label: "Community", path: "/owner/dashboard" },
];

export function TopNav() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border bg-surface px-8"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <svg viewBox="0 0 28 28" fill="none" className="h-7 w-7">
          <circle cx="14" cy="14" r="12" stroke="url(#tnGrad)" strokeWidth="2" />
          <circle cx="10" cy="11" r="2" fill="#8b5cf6" />
          <circle cx="18" cy="11" r="2" fill="#06d6a0" />
          <path
            d="M10 18c0-2.2 1.8-4 4-4s4 1.8 4 4"
            stroke="#8b5cf6"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="tnGrad" x1="0" y1="0" x2="28" y2="28">
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#06d6a0" />
            </linearGradient>
          </defs>
        </svg>
        <span className="font-display text-xl font-bold text-gradient">
          Pet OS
        </span>
      </Link>

      {/* Nav Links */}
      <div className="flex gap-1">
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.label}
              to={link.path}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-card text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-base">
          🌙
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-base">
          🔔
        </button>
        <div className="flex items-center gap-2 rounded-full bg-card py-1 pl-1 pr-3 cursor-pointer">
          <img
            src={user?.avatarUrl || "/images/people/avatar-1.jpg"}
            alt=""
            className="h-7 w-7 rounded-full object-cover"
          />
          <span className="text-sm font-semibold">{user?.name || "User"}</span>
          <span className="text-xs text-muted-foreground">▾</span>
        </div>
      </div>
    </div>
  );
}
