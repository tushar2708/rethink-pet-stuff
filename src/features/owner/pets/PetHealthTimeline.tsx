import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const STATUS_COLORS: Record<string, string> = {
  done: "bg-green-500",
  upcoming: "bg-amber-500",
  overdue: "bg-red-500",
  far_future: "bg-gray-400",
};

const SECTIONS = [
  { key: "onRepeat", label: "ON REPEAT" },
  { key: "kitten", label: "KITTEN (0-6 MONTHS)" },
  { key: "puppy", label: "PUPPY (0-6 MONTHS)" },
  { key: "firstYear", label: "FIRST YEAR" },
  { key: "adult", label: "ADULT" },
  { key: "senior", label: "SENIOR (7+)" },
  { key: "lifetimeWatch", label: "LIFETIME WATCH" },
];

export function PetHealthTimeline() {
  const params = useParams();
  const { data: timeline, isLoading } = useQuery({
    queryKey: ["healthTimeline", params.petId],
    queryFn: () => apiFetch<any>(`/pets/${params.petId}/health-timeline`),
    enabled: !!params.petId,
  });

  const [filters, setFilters] = useState<Set<string>>(new Set());

  const toggleFilter = (filter: string) => {
    const newFilters = new Set(filters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    setFilters(newFilters);
  };

  const getTriggerBadge = (triggers: string[]) => {
    if (!triggers || triggers.length === 0) return null;
    return triggers[0];
  };

  const getRelativeTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 0) return `in ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!timeline) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Link to={`/owner/pets/${params.petId}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="text-center text-muted-foreground">Health timeline not found</div>
      </div>
    );
  }

  const totalItems = SECTIONS.reduce((sum, section) => sum + (timeline[section.key]?.length || 0), 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link to={`/owner/pets/${params.petId}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div>
        <h1 className="text-2xl font-bold">Health timeline</h1>
        <p className="text-sm text-muted-foreground mt-1">{totalItems} items</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Filters</label>
        <div className="flex flex-wrap gap-2">
          {["Age", "Breed", "Male", "Female", "Indoor", "Outdoor"].map((filter) => (
            <Button
              key={filter}
              type="button"
              variant={filters.has(filter) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {SECTIONS.map((section) => {
          const items = timeline[section.key] || [];
          if (items.length === 0) return null;

          return (
            <div key={section.key}>
              <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-4">{section.label}</h2>
              <div className="space-y-3">
                {items.map((item: any, idx: number) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`${STATUS_COLORS[item.status] || "bg-gray-400"} h-3 w-3 rounded-full flex-shrink-0 mt-1`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold">{item.name}</h3>
                          {getTriggerBadge(item.triggers) && (
                            <Badge variant="secondary" className="text-xs">
                              {getTriggerBadge(item.triggers)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(item.date).toLocaleDateString()} • {getRelativeTime(item.date)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
