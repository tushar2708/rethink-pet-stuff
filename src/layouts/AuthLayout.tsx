import { Outlet } from "react-router-dom";
import { PawPrint } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-lg">
        {/* Logo/App Name */}
        <div className="mb-8 text-center">
          <PawPrint className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-3 text-3xl font-bold text-foreground">Pet OS</h1>
          <p className="mt-2 text-sm text-muted-foreground">Care for your furry friends</p>
        </div>

        {/* Form Content */}
        <Outlet />
      </div>
    </div>
  );
}
