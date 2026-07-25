import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-lg">
        {/* Logo/App Name */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">PetStuff</h1>
          <p className="mt-2 text-sm text-muted-foreground">Care for your furry friends</p>
        </div>

        {/* Form Content */}
        <Outlet />
      </div>
    </div>
  );
}
