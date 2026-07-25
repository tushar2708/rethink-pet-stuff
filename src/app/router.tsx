import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { OnboardingLayout } from "@/layouts/OnboardingLayout";
import { OwnerLayout } from "@/layouts/OwnerLayout";
import { VetLayout } from "@/layouts/VetLayout";
import { GigLayout } from "@/layouts/GigLayout";
import { RequireAuth } from "@/components/shared/RequireAuth";
import { OWNER_STEP_LABELS } from "@/features/owner/onboarding/config";
import { VET_STEP_LABELS } from "@/features/vet/onboarding/config";
import { GIG_STEP_LABELS } from "@/features/gig/onboarding/config";
import { LandingPage } from "@/features/landing/LandingPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { SignupPage } from "@/features/auth/SignupPage";
import { RoleSelectPage } from "@/features/auth/RoleSelectPage";
import { OwnerAboutYou } from "@/features/owner/onboarding/steps/OwnerAboutYou";
import { OwnerPetType } from "@/features/owner/onboarding/steps/OwnerPetType";
import { OwnerPetDetails } from "@/features/owner/onboarding/steps/OwnerPetDetails";
import { OwnerTemperament } from "@/features/owner/onboarding/steps/OwnerTemperament";
import { OwnerComplete } from "@/features/owner/onboarding/steps/OwnerComplete";
import {
  VetPersonalInfo,
  VetCredentials,
  VetClinic,
  VetSpecializations,
  VetAvailability,
  VetProfileSetup,
  VetComplete,
} from "@/features/vet/onboarding/steps";

function P({ title }: { title: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-muted-foreground">Coming soon</p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <P title="Something went wrong" />,
    children: [
      { index: true, element: <LandingPage /> },

      // === AUTH ===
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "signup", element: <SignupPage /> },
          { path: "role-select", element: <RoleSelectPage /> },
        ],
      },

      // === OWNER PORTAL ===
      {
        path: "owner",
        children: [
          // Onboarding
          {
            path: "onboarding",
            element: <OnboardingLayout portal="owner" steps={OWNER_STEP_LABELS} />,
            children: [
              { index: true, element: <Navigate to="about-you" replace /> },
              { path: "about-you", element: <OwnerAboutYou /> },
              { path: "pet-type", element: <OwnerPetType /> },
              { path: "pet-details", element: <OwnerPetDetails /> },
              { path: "temperament", element: <OwnerTemperament /> },
              { path: "complete", element: <OwnerComplete /> },
            ],
          },
          // Dashboard (auth-protected)
          {
            element: (
              <RequireAuth role="owner">
                <OwnerLayout />
              </RequireAuth>
            ),
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: "dashboard", element: <P title="Owner Dashboard" /> },
              {
                path: "pets/add",
                children: [
                  { index: true, element: <Navigate to="pet-type" replace /> },
                  { path: "pet-type", element: <P title="Add Pet — Type" /> },
                  { path: "pet-details", element: <P title="Add Pet — Details" /> },
                  { path: "temperament", element: <P title="Add Pet — Temperament" /> },
                  { path: "complete", element: <P title="Pet Added!" /> },
                ],
              },
              { path: "pets/:petId", element: <P title="Pet Detail" /> },
              { path: "pets/:petId/edit", element: <P title="Edit Pet" /> },
              { path: "find-vet", element: <P title="Find a Vet" /> },
              { path: "find-vet/:vetId", element: <P title="Vet Profile" /> },
              { path: "find-worker", element: <P title="Find a Worker" /> },
              { path: "find-worker/:workerId", element: <P title="Worker Profile" /> },
              { path: "appointments", element: <P title="Appointments" /> },
              { path: "appointments/:appointmentId", element: <P title="Appointment Detail" /> },
              { path: "bookings/new", element: <P title="New Booking" /> },
              { path: "settings", element: <P title="Settings" /> },
            ],
          },
        ],
      },

      // === VET PORTAL ===
      {
        path: "vet",
        children: [
          // Onboarding
          {
            path: "onboarding",
            element: <OnboardingLayout portal="vet" steps={VET_STEP_LABELS} />,
            children: [
              { index: true, element: <Navigate to="personal-info" replace /> },
              { path: "personal-info", element: <VetPersonalInfo /> },
              { path: "credentials", element: <VetCredentials /> },
              { path: "clinic", element: <VetClinic /> },
              { path: "specializations", element: <VetSpecializations /> },
              { path: "availability", element: <VetAvailability /> },
              { path: "profile", element: <VetProfileSetup /> },
              { path: "complete", element: <VetComplete /> },
            ],
          },
          // Dashboard (auth-protected)
          {
            element: (
              <RequireAuth role="vet">
                <VetLayout />
              </RequireAuth>
            ),
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: "dashboard", element: <P title="Vet Dashboard" /> },
              { path: "appointments", element: <P title="Appointments" /> },
              { path: "appointments/:appointmentId", element: <P title="Appointment Detail" /> },
              { path: "patients", element: <P title="Patients" /> },
              { path: "patients/:petId", element: <P title="Patient Detail" /> },
              { path: "schedule", element: <P title="Manage Schedule" /> },
              { path: "profile", element: <P title="Edit Profile" /> },
              { path: "settings", element: <P title="Settings" /> },
            ],
          },
        ],
      },

      // === GIG WORKER PORTAL ===
      {
        path: "gig",
        children: [
          // Onboarding
          {
            path: "onboarding",
            element: <OnboardingLayout portal="gig" steps={GIG_STEP_LABELS} />,
            children: [
              { index: true, element: <Navigate to="personal-info" replace /> },
              { path: "personal-info", element: <P title="Hey There!" /> },
              { path: "services", element: <P title="What Can You Do?" /> },
              { path: "availability", element: <P title="When & Where?" /> },
              { path: "about", element: <P title="About You" /> },
              { path: "consent", element: <P title="One Last Thing" /> },
              { path: "complete", element: <P title="You're In!" /> },
            ],
          },
          // Dashboard (auth-protected)
          {
            element: (
              <RequireAuth role="gig">
                <GigLayout />
              </RequireAuth>
            ),
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: "dashboard", element: <P title="Gig Dashboard" /> },
              { path: "jobs", element: <P title="Available Jobs" /> },
              { path: "jobs/active", element: <P title="Active Jobs" /> },
              { path: "jobs/history", element: <P title="Job History" /> },
              { path: "jobs/:jobId", element: <P title="Job Detail" /> },
              { path: "earnings", element: <P title="Earnings" /> },
              { path: "profile", element: <P title="Edit Profile" /> },
              { path: "settings", element: <P title="Settings" /> },
            ],
          },
        ],
      },

      // === 404 ===
      { path: "*", element: <P title="404 — Page Not Found" /> },
    ],
  },
]);
