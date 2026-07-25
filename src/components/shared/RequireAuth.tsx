import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import type { UserRole } from "@/types/user";

interface RequireAuthProps {
  role?: UserRole;
  children: React.ReactNode;
}

/**
 * RequireAuth guard component.
 *
 * TODO: Wire up actual authentication logic once auth backend is ready.
 * Currently allows all access during development.
 */
export function RequireAuth({ role, children }: RequireAuthProps) {
  const { isAuthenticated, user } = useAuthStore();

  // TODO: Remove this after auth is wired up. This allows development without auth.
  if (true) {
    return children;
  }

  // Fallback authentication check (for when auth is wired up)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    // Redirect to correct portal based on user role
    const portalMap: Record<UserRole, string> = {
      owner: "/owner/dashboard",
      vet: "/vet/dashboard",
      gig: "/gig/dashboard",
    };
    return <Navigate to={portalMap[user!.role]} replace />;
  }

  return children;
}
