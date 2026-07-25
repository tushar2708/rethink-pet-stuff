import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Dog, Cat, Bird, Rabbit, HelpCircle, Pencil, Trash2, ArrowLeft, Heart, Zap, Calendar, Weight, Syringe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { usePet, useDeletePet } from "@/hooks/usePets";
import { apiFetch } from "@/lib/api";
import type { LucideIcon } from "lucide-react";

const PET_ICONS: Record<string, LucideIcon> = { dog: Dog, cat: Cat, bird: Bird, hamster: Rabbit, other: HelpCircle };
const TYPE_LABELS: Record<string, string> = { dog: "Dog", cat: "Cat", bird: "Bird", hamster: "Hamster" };
const TEMP_LABELS: Record<string, string> = { calm: "Calm & Friendly", "needs-warming-up": "Needs Warming Up" };
const ENERGY_LABELS: Record<string, string> = { low: "Low", medium: "Medium", high: "High" };

interface HealthTimelineItem {
  id: string;
  name: string;
  date: string;
  type: "vaccination" | "surgery" | "grooming" | "other";
  status: "done" | "upcoming" | "overdue" | "far-future";
  isOverdue?: boolean;
}

interface MedicalEvent {
  id: string;
  name: string;
  date: string;
  type: string;
  status: "completed" | "scheduled" | "overdue";
}

const getStatusDotColor = (status: string): string => {
  if (status === "done" || status === "completed") return "bg-green-500";
  if (status === "upcoming" || status === "scheduled") return "bg-amber-500";
  if (status === "overdue") return "bg-red-500";
  return "bg-gray-400";
};

const getRelativeTime = (date: string): string => {
  const now = new Date();
  const eventDate = new Date(date);
  const diffDays = Math.floor((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `${diffDays} days away`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks away`;
  return `${Math.floor(diffDays / 30)} months away`;
};

const getVaccinationProgress = (timeline: HealthTimelineItem[] | undefined): { done: number; total: number } => {
  if (!timeline) return { done: 0, total: 0 };
  const vaccinations = timeline.filter((item) => item.type === "vaccination");
  const done = vaccinations.filter((item) => item.status === "done").length;
  return { done, total: vaccinations.length };
};

const getNextUpItem = (timeline: HealthTimelineItem[] | undefined): HealthTimelineItem | null => {
  if (!timeline || timeline.length === 0) return null;
  return timeline.find((item) => item.status === "overdue" || item.status === "upcoming") || null;
};

export function PetDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { data: pet, isLoading: isPetLoading } = usePet(params.petId || "");
  const deletePet = useDeletePet();

  const { data: timeline, isLoading: isTimelineLoading } = useQuery({
    queryKey: ["pets", params.petId, "health-timeline"],
    queryFn: () => apiFetch<HealthTimelineItem[]>(`/pets/${params.petId}/health-timeline`),
    enabled: !!params.petId,
  });

  const { data: medicalEvents, isLoading: isMedicalLoading } = useQuery({
    queryKey: ["pets", params.petId, "medical-events"],
    queryFn: () => apiFetch<MedicalEvent[]>(`/pets/${params.petId}/medical-events`),
    enabled: !!params.petId,
  });

  if (isPetLoading || isTimelineLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!pet) return <div className="p-6 text-center text-muted-foreground">Pet not found</div>;

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${pet.name}?`)) return;
    await deletePet.mutateAsync(pet.id);
    navigate("/owner/dashboard");
  };

  const Icon = PET_ICONS[pet.type] || HelpCircle;
  const vaccinationProgress = getVaccinationProgress(timeline);
  const nextUpItem = getNextUpItem(timeline);

  const allMedicalItems = [
    ...(timeline || []).map((item) => ({
      ...item,
      isTimeline: true,
    })),
    ...(medicalEvents || []).map((item) => ({
      ...item,
      type: item.type.toLowerCase(),
      status: item.status === "completed" ? "done" : item.status === "overdue" ? "overdue" : "upcoming",
      isTimeline: false,
    })),
  ];

  const filteredByType = (type: string) => {
    if (type === "all") return allMedicalItems;
    return allMedicalItems.filter((item) => item.type === type);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <button onClick={() => navigate("/owner/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      {/* Section 1: Enhanced Profile Card */}
      <Card className="overflow-hidden">
        <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {pet.photoUrl ? (
              <img src={pet.photoUrl} alt={pet.name} className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md" />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-primary/10 shadow-md">
                <Icon className="h-14 w-14 text-primary" />
              </div>
            )}
            <div className="flex-1 text-center sm:text-left sm:pt-2">
              <h1 className="text-2xl font-bold text-foreground">{pet.name}</h1>
              <p className="text-sm text-muted-foreground">{TYPE_LABELS[pet.type] || pet.customType} {pet.breed ? `· ${pet.breed}` : ""}</p>

              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Badge variant="secondary" className="gap-1">
                  <Heart className="h-3 w-3" />
                  {TEMP_LABELS[pet.temperament] || pet.temperament}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Zap className="h-3 w-3" />
                  {ENERGY_LABELS[pet.energyLevel] || pet.energyLevel} energy
                </Badge>
                {pet.gender && <Badge variant="outline">{pet.gender}</Badge>}
                {pet.lifestyle && <Badge variant="outline">{pet.lifestyle}</Badge>}
                {pet.neutered !== undefined && <Badge variant="outline">{pet.neutered ? "Neutered" : "Not neutered"}</Badge>}
                {vaccinationProgress.total > 0 && (
                  <Badge variant="default" className="gap-1">
                    <Syringe className="h-3 w-3" />
                    {vaccinationProgress.done}/{vaccinationProgress.total} core done
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="absolute right-4 top-4 flex gap-2">
            <Link to={`/owner/pets/${pet.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-1 bg-white/80">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-white/80 text-destructive hover:bg-destructive hover:text-white"
              onClick={handleDelete}
              disabled={deletePet.isPending}
            >
              <Trash2 className="h-3.5 w-3.5" /> {deletePet.isPending ? "..." : "Delete"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 p-6 md:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Age</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {pet.ageYears ?? 0}y {pet.ageMonths ?? 0}m
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-foreground">
              <Icon className="h-4 w-4 text-muted-foreground" />
              {TYPE_LABELS[pet.type] || pet.customType || pet.type}
            </p>
          </div>
          {pet.breed && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Breed</p>
              <p className="mt-1 text-sm text-foreground">{pet.breed}</p>
            </div>
          )}
          {pet.dateOfBirth && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Date of Birth</p>
              <p className="mt-1 text-sm text-foreground">{new Date(pet.dateOfBirth).toLocaleDateString()}</p>
            </div>
          )}
          {pet.weight && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Weight</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-foreground">
                <Weight className="h-4 w-4 text-muted-foreground" />
                {pet.weight} lbs
              </p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Added</p>
            <p className="mt-1 text-sm text-foreground">{new Date(pet.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      {/* Section 2: NEXT UP Card */}
      {nextUpItem && (
        <Card className="bg-gray-900 text-white rounded-xl p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Next Up</p>
              <h3 className="mt-1 text-lg font-bold">{nextUpItem.name}</h3>
              <p className="mt-1 text-sm text-gray-300">{getRelativeTime(nextUpItem.date)}</p>
            </div>
            {nextUpItem.isOverdue && <Badge className="bg-red-500 text-white">Overdue</Badge>}
          </div>
          <Link to="/owner/find-vet">
            <Button className="w-full bg-white text-gray-900 hover:bg-gray-100">
              Find a vet
            </Button>
          </Link>
        </Card>
      )}

      {/* Section 3: Tabbed Medical History */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Medical History</h2>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="vaccination">Vaccination</TabsTrigger>
            <TabsTrigger value="surgery">Surgery</TabsTrigger>
            <TabsTrigger value="grooming">Grooming</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          {["all", "vaccination", "surgery", "grooming", "other"].map((type) => (
            <TabsContent key={type} value={type} className="mt-4 space-y-3">
              {isMedicalLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : filteredByType(type).length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No {type === "all" ? "medical" : type} records</p>
              ) : (
                filteredByType(type).map((item) => (
                  <div key={item.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${getStatusDotColor(item.status)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{item.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{getRelativeTime(item.date)}</p>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0 text-xs capitalize">
                      {item.type}
                    </Badge>
                  </div>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Section 4: See Full Health Timeline */}
      <div className="flex justify-center">
        <Link to={`/owner/pets/${pet.id}/health`}>
          <Button variant="outline" className="gap-2">
            See full health timeline
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
