import { useLocation } from "react-router-dom";

export function usePortal(): "owner" | "vet" | "gig" | null {
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname.startsWith("/owner")) {
    return "owner";
  }

  if (pathname.startsWith("/vet")) {
    return "vet";
  }

  if (pathname.startsWith("/gig")) {
    return "gig";
  }

  return null;
}
