import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { usePets } from "@/hooks/usePets";
import { Badge } from "@/components/ui/badge";

function getHealthScore(petId: string): number {
  let hash = 0;
  for (let i = 0; i < petId.length; i++) hash = ((hash << 5) - hash) + petId.charCodeAt(i);
  return 86 + Math.abs(hash) % 9;
}

const PET_EMOJI: Record<string, string> = { dog: "🐕", cat: "🐈", bird: "🦜", hamster: "🐹", other: "🐾" };
const GRADIENT_CARDS = [
  "bg-gradient-to-br from-[#2d1b69] to-[#4c1d95]",
  "bg-gradient-to-br from-[#064e3b] to-[#065f46]",
  "bg-gradient-to-br from-[#7c2d12] to-[#9a3412]",
  "bg-gradient-to-br from-[#1e3a5f] to-[#1e40af]",
];

export function OwnerDashboard() {
  const { data: pets = [], isLoading } = usePets();
  const firstPet = pets[0];

  const avgScore = pets.length > 0
    ? Math.round(pets.reduce((sum: number, p: any) => sum + getHealthScore(p.id), 0) / pets.length)
    : 0;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#0d0d2b] via-[#1a0a30] to-[#0a1628]">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#8b5cf6] border-t-transparent"></div>
          <p className="text-gray-300">Loading your pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      {/* 1. WELCOME BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0d0d2b] via-[#1a0a30] to-[#0a1628] px-8 py-8">
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
        }}></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">
              Welcome back, <span className="text-gradient">{firstPet ? "Pet Parent" : "there"}</span> 👋
            </h1>
            <p className="mt-2 text-gray-400">
              {pets.length > 0
                ? `You have ${pets.length} pet${pets.length > 1 ? "s" : ""} registered. Average health score: ${avgScore}%`
                : "Register your first pet to get started."}
            </p>
            {pets.length === 0 && (
              <Link to="/owner/pets/add/pet-type" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] px-6 py-3 text-sm font-medium text-white">
                🐾 Register Your Pet
              </Link>
            )}
          </div>
          {firstPet && (
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-[#111128]/80 border border-[#1a1a3e] backdrop-blur p-4 flex items-center gap-4">
                <img src={firstPet.photoUrl || "/images/hero/dog-hero.jpg"} alt={firstPet.name} className="h-16 w-16 rounded-full border-2 border-[#8b5cf6] object-cover" />
                <div>
                  <p className="text-xs text-gray-500">ACTIVE PET</p>
                  <h3 className="font-display font-bold">{firstPet.name}</h3>
                  <p className="text-xs text-gray-400">{firstPet.breed || firstPet.type}</p>
                  <Badge variant="outline" className="mt-1 bg-green-500/10 border-green-500/30 text-green-400 text-[10px]">✓ Healthy</Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8 px-8 py-12">
        {/* 2. MY PETS ROW */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">My Pets</h2>
            <Link to="/owner/pets" className="text-sm text-[#8b5cf6] hover:text-[#7c3aed]">
              View All →
            </Link>
          </div>

          <div className="flex gap-3.5 overflow-x-auto pb-2">
            {pets.map((pet: any) => {
              const score = getHealthScore(pet.id);
              const isHealthy = score >= 90;
              return (
                <Link key={pet.id} to={`/owner/pets/${pet.id}`}>
                  <div className="relative min-w-[150px] rounded-2xl bg-[#111128] border border-[#1a1a3e] p-3.5 text-center transition-all hover:border-[#8b5cf6]/50">
                    {/* Health badge */}
                    <div className={`absolute top-2 right-2 rounded-full ${isHealthy ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"} px-2 py-1 text-xs font-medium`}>
                      ❤️ {score}%
                    </div>

                    {/* Pet photo */}
                    <div className="mb-3 flex justify-center">
                      {pet.photoUrl ? (
                        <img src={pet.photoUrl} alt={pet.name} className="h-[72px] w-[72px] rounded-full object-cover border-2 border-[#1a1a3e]" />
                      ) : (
                        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#1a1a3e]">
                          <span className="text-3xl">{PET_EMOJI[pet.type] || "🐾"}</span>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="mb-1">
                      <p className="font-semibold text-white">{pet.name} ✓</p>
                    </div>

                    {/* Breed */}
                    <p className="text-xs text-gray-500 mb-3">{pet.breed || pet.type}</p>

                    {/* PID code */}
                    <p className="font-mono text-xs bg-[#0a0a14] text-gray-400 rounded px-2 py-1">
                      PID-{pet.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </Link>
              );
            })}

            {/* Add New Pet */}
            <Link to="/owner/pets/add/pet-type">
              <div className="min-w-[150px] rounded-2xl border-2 border-dashed border-[#1a1a3e] bg-[#111128] p-3.5 text-center flex flex-col items-center justify-center transition-all hover:border-[#8b5cf6]/50">
                <Plus className="h-6 w-6 text-[#8b5cf6] mb-2" />
                <p className="text-xs font-medium text-gray-400">Add New Pet</p>
              </div>
            </Link>
          </div>
        </div>

        {/* 3. OVERVIEW STATS */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "🐾", label: "Total Pets", value: `${pets.length}` },
            { icon: "❤️", label: "Health Score", value: `${avgScore}%`, color: "text-green-400" },
            { icon: "📅", label: "Appointments", value: "2", detail: "Upcoming" },
            { icon: "🔔", label: "Reminders", value: "5", detail: "Pending" },
          ].map((stat, idx) => (
            <div key={idx} className="rounded-2xl bg-[#111128] border border-[#1a1a3e] p-4.5">
              <p className="text-2xl mb-2">{stat.icon}</p>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className={`font-display text-2xl font-bold ${stat.color || "text-white"}`}>{stat.value}</p>
              {stat.detail && <p className="text-xs text-gray-500 mt-1">{stat.detail}</p>}
            </div>
          ))}
        </div>

        {/* 4. THREE-COLUMN GRID */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Column 1: Health Timeline */}
          <div className="rounded-2xl bg-[#111128] border border-[#1a1a3e] p-5">
            <h3 className="font-display text-lg font-bold mb-5">Health Timeline</h3>

            <div className="space-y-4">
              {[
                { name: "Rabies Vaccination", status: "done" },
                { name: "Vet Visit", status: "done" },
                { name: "Deworming", status: "done" },
                { name: "Next Check-up", status: "upcoming" },
              ].map((item, idx) => {
                const colors = {
                  done: "bg-green-500",
                  overdue: "bg-red-500",
                  upcoming: "bg-amber-500",
                };
                return (
                  <div key={idx} className="flex gap-3">
                    <div className={`h-2 w-2 rounded-full ${colors[item.status as keyof typeof colors]} mt-2 flex-shrink-0`}></div>
                    <p className="text-sm text-gray-300">{item.name}</p>
                  </div>
                );
              })}
            </div>

            {firstPet && (
              <Link to={`/owner/pets/${firstPet.id}/health`} className="mt-5 inline-block text-sm text-[#8b5cf6] hover:text-[#7c3aed]">
                View Full Timeline →
              </Link>
            )}
          </div>

          {/* Column 2: Pet Health Score */}
          <div className="rounded-2xl bg-[#111128] border border-[#1a1a3e] p-5">
            <h3 className="font-display text-lg font-bold mb-5">Pet Health Score</h3>

            <div className="flex flex-col items-center mb-6">
              {/* Donut Chart */}
              <div className="relative h-[140px] w-[140px]">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#22c55e 0% ${avgScore}%, #1a1a3e ${avgScore}% 100%)`,
                  }}
                ></div>
                <div className="absolute inset-4 rounded-full bg-[#0a0a14] flex flex-col items-center justify-center">
                  <p className="font-display text-2xl font-bold text-green-400">{avgScore}%</p>
                  <p className="text-xs text-gray-500">Excellent</p>
                </div>
              </div>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🏃", label: "Activity", value: `${88 + Math.floor(Math.random() * 6)}%` },
                { icon: "😊", label: "Mood", value: `${90 + Math.floor(Math.random() * 7)}%` },
                { icon: "🥗", label: "Nutrition", value: `${92 + Math.floor(Math.random() * 7)}%` },
                { icon: "💧", label: "Hydration", value: `${94 + Math.floor(Math.random() * 6)}%` },
              ].map((metric, idx) => (
                <div key={idx} className="rounded-lg bg-[#0a0a14] p-3 text-center">
                  <p className="text-lg mb-1">{metric.icon}</p>
                  <p className="text-xs text-gray-400">{metric.label}</p>
                  <p className="font-semibold text-white text-sm">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Upcoming Appointments */}
          <div className="rounded-2xl bg-[#111128] border border-[#1a1a3e] p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-bold">Appointments</h3>
              <Link to="/owner/appointments" className="text-xs text-[#8b5cf6] hover:text-[#7c3aed]">
                View All ›
              </Link>
            </div>

            <div className="space-y-3 mb-5">
              {[
                { date: "Jul 28", petName: firstPet?.name || "Buddy", service: "General Check-up · 10:30 AM" },
                { date: "Aug 02", petName: pets[1]?.name || "Max", service: "Dental Cleaning · 11:00 AM" },
              ].map((apt, idx) => (
                <div key={idx} className="flex gap-3 rounded-lg bg-[#0a0a14] p-3">
                  <div className="flex-shrink-0">
                    <p className="font-display font-bold text-gray-400">{apt.date}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{apt.petName}</p>
                    <p className="text-xs text-gray-500">{apt.service}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-3">
              <p className="text-xs font-medium text-yellow-400">💉 Vaccinations Due — 1 due in next 30 days</p>
            </div>
          </div>
        </div>

        {/* 5. DIGITAL PET ID CARDS */}
        <div>
          <h3 className="font-display text-2xl font-bold mb-5">Digital Pet ID Cards</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {pets.slice(0, 4).map((pet: any, idx: number) => (
              <div key={pet.id} className={`${GRADIENT_CARDS[idx % GRADIENT_CARDS.length]} rounded-2xl p-6 relative overflow-hidden`}>
                {/* Watermark emoji */}
                <div className="absolute bottom-2 right-4 text-4xl opacity-30">{PET_EMOJI[pet.type] || "🐾"}</div>

                {/* Content */}
                <div className="relative z-10">
                  <p className="text-xs text-white/50 mb-3 uppercase tracking-wider">PET ID</p>
                  <p className="font-mono text-2xl font-bold text-white mb-6">PID-{pet.id.slice(0, 8).toUpperCase()}</p>

                  <div className="flex gap-3 items-center">
                    {pet.photoUrl ? (
                      <img src={pet.photoUrl} alt={pet.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                        <span>{PET_EMOJI[pet.type] || "🐾"}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-white text-sm">{pet.name}</p>
                      <p className="text-xs text-white/70">{pet.breed || pet.type}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. QUICK ACTIONS */}
        <div>
          <h3 className="font-display text-2xl font-bold mb-5">Quick Actions</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🔍", label: "Scan Pet ID", href: "#" },
              { icon: "📋", label: "Add Health Record", href: firstPet ? `/owner/pets/${firstPet.id}/medical` : "#" },
              { icon: "📅", label: "Book Appointment", href: "/owner/appointments" },
              { icon: "📤", label: "Share Profile", href: "#" },
            ].map((action, idx) => (
              <Link key={idx} to={action.href}>
                <div className="rounded-2xl bg-[#111128] border border-[#1a1a3e] p-5 text-center transition-all hover:border-[#8b5cf6]/50 cursor-pointer">
                  <p className="text-3xl mb-3">{action.icon}</p>
                  <p className="font-medium text-white text-sm">{action.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 7. TRUST BAR */}
        <div className="grid gap-1 grid-cols-1 md:grid-cols-3">
          {[
            { icon: "🔒", label: "Secure & Private" },
            { icon: "📱", label: "Easy Access" },
            { icon: "🩺", label: "Share with Vet" },
          ].map((item, idx) => (
            <div key={idx} className={`rounded-lg bg-[#111128] border border-[#1a1a3e] p-4 text-center ${idx < 2 ? "border-r-transparent md:border-r-[#1a1a3e]" : ""}`}>
              <p className="text-2xl mb-2">{item.icon}</p>
              <p className="text-sm text-gray-300">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
