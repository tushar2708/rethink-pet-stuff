import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useCurrentUser } from "@/hooks/useAuth";
import type { UserRole } from "@/types/user";

interface RequireAuthProps {
  role?: UserRole;
  children: React.ReactNode;
}

export function RequireAuth({ role, children }: RequireAuthProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    const portalMap: Record<string, string> = {
      owner: "/owner/dashboard",
      vet: "/vet/dashboard",
      gig: "/gig/dashboard",
    };
    return <Navigate to={portalMap[user!.role] || "/login"} replace />;
  }

  return children;
}
