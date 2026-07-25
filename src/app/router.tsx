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
import { GigPersonalInfo } from "@/features/gig/onboarding/steps/GigPersonalInfo";
import { GigServices } from "@/features/gig/onboarding/steps/GigServices";
import { GigAvailability } from "@/features/gig/onboarding/steps/GigAvailability";
import { GigAbout } from "@/features/gig/onboarding/steps/GigAbout";
import { GigConsent } from "@/features/gig/onboarding/steps/GigConsent";
import { GigComplete } from "@/features/gig/onboarding/steps/GigComplete";
import { OwnerDashboard } from "@/features/owner/dashboard/OwnerDashboard";
import { AddPetType } from "@/features/owner/pets/steps/AddPetType";
import { AddPetDetails } from "@/features/owner/pets/steps/AddPetDetails";
import { AddPetTemperament } from "@/features/owner/pets/steps/AddPetTemperament";
import { AddPetComplete } from "@/features/owner/pets/steps/AddPetComplete";
import { PetDetailPage } from "@/features/owner/pets/PetDetailPage";
import { PetEditPage } from "@/features/owner/pets/PetEditPage";
import { FindVetPage } from "@/features/owner/find/FindVetPage";
import { VetProfilePage as OwnerVetProfilePage } from "@/features/owner/find/VetProfilePage";
import { FindWorkerPage } from "@/features/owner/find/FindWorkerPage";
import { WorkerProfilePage } from "@/features/owner/find/WorkerProfilePage";
import { OwnerAppointmentsPage } from "@/features/owner/appointments/OwnerAppointmentsPage";
import { OwnerAppointmentDetail } from "@/features/owner/appointments/OwnerAppointmentDetail";
import { NewBookingPage } from "@/features/owner/appointments/NewBookingPage";
import { OwnerSettingsPage } from "@/features/owner/settings/OwnerSettingsPage";
import { VetDashboard } from "@/features/vet/dashboard/VetDashboard";
import { VetAppointmentsPage } from "@/features/vet/appointments/VetAppointmentsPage";
import { VetAppointmentDetail } from "@/features/vet/appointments/VetAppointmentDetail";
import { VetPatientsPage } from "@/features/vet/patients/VetPatientsPage";
import { VetPatientDetail } from "@/features/vet/patients/VetPatientDetail";
import { VetSchedulePage } from "@/features/vet/schedule/VetSchedulePage";
import { VetProfilePage } from "@/features/vet/profile/VetProfilePage";
import { VetSettingsPage } from "@/features/vet/settings/VetSettingsPage";
import { GigDashboard } from "@/features/gig/dashboard/GigDashboard";
import { GigJobsPage } from "@/features/gig/jobs/GigJobsPage";
import { GigActiveJobs } from "@/features/gig/jobs/GigActiveJobs";
import { GigJobHistory } from "@/features/gig/jobs/GigJobHistory";
import { GigJobDetail } from "@/features/gig/jobs/GigJobDetail";
import { GigEarningsPage } from "@/features/gig/earnings/GigEarningsPage";
import { GigProfilePage } from "@/features/gig/profile/GigProfilePage";
import { GigSettingsPage } from "@/features/gig/settings/GigSettingsPage";

function ErrorPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">Please try refreshing the page</p>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">404 — Page Not Found</h1>
        <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist</p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
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
              { path: "dashboard", element: <OwnerDashboard /> },
              {
                path: "pets/add",
                children: [
                  { index: true, element: <Navigate to="pet-type" replace /> },
                  { path: "pet-type", element: <AddPetType /> },
                  { path: "pet-details", element: <AddPetDetails /> },
                  { path: "temperament", element: <AddPetTemperament /> },
                  { path: "complete", element: <AddPetComplete /> },
                ],
              },
              { path: "pets/:petId", element: <PetDetailPage /> },
              { path: "pets/:petId/edit", element: <PetEditPage /> },
              { path: "find-vet", element: <FindVetPage /> },
              { path: "find-vet/:vetId", element: <OwnerVetProfilePage /> },
              { path: "find-worker", element: <FindWorkerPage /> },
              { path: "find-worker/:workerId", element: <WorkerProfilePage /> },
              { path: "appointments", element: <OwnerAppointmentsPage /> },
              { path: "appointments/:appointmentId", element: <OwnerAppointmentDetail /> },
              { path: "bookings/new", element: <NewBookingPage /> },
              { path: "settings", element: <OwnerSettingsPage /> },
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
              { path: "dashboard", element: <VetDashboard /> },
              { path: "appointments", element: <VetAppointmentsPage /> },
              { path: "appointments/:appointmentId", element: <VetAppointmentDetail /> },
              { path: "patients", element: <VetPatientsPage /> },
              { path: "patients/:petId", element: <VetPatientDetail /> },
              { path: "schedule", element: <VetSchedulePage /> },
              { path: "profile", element: <VetProfilePage /> },
              { path: "settings", element: <VetSettingsPage /> },
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
              { path: "personal-info", element: <GigPersonalInfo /> },
              { path: "services", element: <GigServices /> },
              { path: "availability", element: <GigAvailability /> },
              { path: "about", element: <GigAbout /> },
              { path: "consent", element: <GigConsent /> },
              { path: "complete", element: <GigComplete /> },
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
              { path: "dashboard", element: <GigDashboard /> },
              { path: "jobs", element: <GigJobsPage /> },
              { path: "jobs/active", element: <GigActiveJobs /> },
              { path: "jobs/history", element: <GigJobHistory /> },
              { path: "jobs/:jobId", element: <GigJobDetail /> },
              { path: "earnings", element: <GigEarningsPage /> },
              { path: "profile", element: <GigProfilePage /> },
              { path: "settings", element: <GigSettingsPage /> },
            ],
          },
        ],
      },

      // === 404 ===
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
