import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">Please try refreshing the page.</p>
      </div>
    </div>
  );
}

export function RootLayout() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Outlet />
    </ErrorBoundary>
  );
}
