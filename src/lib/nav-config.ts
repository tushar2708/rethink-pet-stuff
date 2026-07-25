export interface NavItem {
  label: string;
  path: string;
  icon: string; // Lucide icon name
}

export const OWNER_NAV: NavItem[] = [
  { label: "Dashboard", path: "/owner/dashboard", icon: "LayoutDashboard" },
  { label: "My Pets", path: "/owner/pets", icon: "PawPrint" },
  { label: "Find Vet", path: "/owner/find-vet", icon: "Stethoscope" },
  { label: "Find Worker", path: "/owner/find-worker", icon: "Users" },
  { label: "Appointments", path: "/owner/appointments", icon: "Calendar" },
  { label: "Settings", path: "/owner/settings", icon: "Settings" },
];

export const VET_NAV: NavItem[] = [
  { label: "Dashboard", path: "/vet/dashboard", icon: "LayoutDashboard" },
  { label: "Appointments", path: "/vet/appointments", icon: "Calendar" },
  { label: "Patients", path: "/vet/patients", icon: "ClipboardList" },
  { label: "Schedule", path: "/vet/schedule", icon: "Clock" },
  { label: "Profile", path: "/vet/profile", icon: "UserCircle" },
  { label: "Settings", path: "/vet/settings", icon: "Settings" },
];

export const GIG_NAV: NavItem[] = [
  { label: "Dashboard", path: "/gig/dashboard", icon: "LayoutDashboard" },
  { label: "Jobs", path: "/gig/jobs", icon: "Briefcase" },
  { label: "Earnings", path: "/gig/earnings", icon: "DollarSign" },
  { label: "Profile", path: "/gig/profile", icon: "UserCircle" },
  { label: "Settings", path: "/gig/settings", icon: "Settings" },
];
