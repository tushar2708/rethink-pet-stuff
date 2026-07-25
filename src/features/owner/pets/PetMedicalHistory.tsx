import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, Edit2 } from "lucide-react";
import { useForm } from "react-hook-form";

const RECORD_TYPE_OPTIONS = [
  { value: "vaccination", label: "Vaccination" },
  { value: "surgery", label: "Surgery" },
  { value: "disease", label: "Disease" },
  { value: "injury", label: "Injury" },
  { value: "allergy", label: "Allergy" },
  { value: "checkup", label: "Checkup" },
  { value: "other", label: "Other" },
];

const SEVERITY_OPTIONS = [
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
  { value: "critical", label: "Critical" },
];

const TYPE_BADGES: Record<string, string> = {
  vaccination: "bg-blue-100 text-blue-800",
  surgery: "bg-red-100 text-red-800",
  disease: "bg-orange-100 text-orange-800",
  injury: "bg-yellow-100 text-yellow-800",
  allergy: "bg-purple-100 text-purple-800",
  checkup: "bg-green-100 text-green-800",
  other: "bg-gray-100 text-gray-800",
};

const SEVERITY_BADGES: Record<string, string> = {
  mild: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  severe: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

type FormData = {
  type: string;
  name: string;
  date: string;
  notes: string;
  severity?: string;
};

export function PetMedicalHistory() {
  const params = useParams();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [_editingId, _setEditingId] = useState<string | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      type: "vaccination",
      name: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
      severity: "mild",
    },
  });

  const { data: healthRecords, isLoading } = useQuery({
    queryKey: ["medicalHistory", params.petId],
    queryFn: () => apiFetch<any[]>(`/pets/${params.petId}/health-records`),
    enabled: !!params.petId,
  });

  const { data: medicalEvents } = useQuery({
    queryKey: ["medicalEvents", params.petId],
    queryFn: () => apiFetch<any[]>(`/pets/${params.petId}/medical-events`),
    enabled: !!params.petId,
  });

  const createHealthRecord = useMutation({
    mutationFn: (data: FormData) => {
      const isHealthRecord = ["vaccination", "checkup"].includes(data.type);
      const endpoint = isHealthRecord
        ? `/pets/${params.petId}/health-records`
        : `/pets/${params.petId}/medical-events`;
      return apiFetch<any>(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicalHistory", params.petId] });
      queryClient.invalidateQueries({ queryKey: ["medicalEvents", params.petId] });
      form.reset();
      setShowForm(false);
    },
  });

  const deleteRecord = useMutation({
    mutationFn: (id: string) =>
      apiFetch<any>(`/pets/${params.petId}/health-records/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicalHistory", params.petId] });
      queryClient.invalidateQueries({ queryKey: ["medicalEvents", params.petId] });
    },
  });

  const onSubmit = async (values: FormData) => {
    await createHealthRecord.mutateAsync(values);
  };

  const allRecords = [
    ...(healthRecords || []).map((r) => ({ ...r, source: "health" })),
    ...(medicalEvents || []).map((r) => ({ ...r, source: "medical" })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const recordsByYear: Record<string, any[]> = {};
  allRecords.forEach((record) => {
    const year = new Date(record.date).getFullYear().toString();
    if (!recordsByYear[year]) recordsByYear[year] = [];
    recordsByYear[year].push(record);
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link to={`/owner/pets/${params.petId}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Medical History</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Record
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Record</h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Type</label>
              <select {...form.register("type")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                {RECORD_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <Input {...form.register("name", { required: true })} placeholder="e.g., Annual Checkup, Rabies Shot" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Date</label>
              <Input type="date" {...form.register("date", { required: true })} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Notes</label>
              <textarea {...form.register("notes")} placeholder="Any additional details..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
            </div>

            {["disease", "surgery", "injury"].includes(form.watch("type")) && (
              <div>
                <label className="mb-1 block text-sm font-medium">Severity</label>
                <select {...form.register("severity")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                  {SEVERITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={createHealthRecord.isPending}>
                {createHealthRecord.isPending ? "Saving..." : "Save Record"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {Object.entries(recordsByYear)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([year, records]) => (
          <div key={year}>
            <h2 className="text-lg font-semibold text-muted-foreground mb-4">{year}</h2>
            <div className="space-y-3">
              {records.map((record, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{record.name}</h3>
                        <Badge className={`text-xs ${TYPE_BADGES[record.type] || TYPE_BADGES.other}`}>
                          {RECORD_TYPE_OPTIONS.find((o) => o.value === record.type)?.label}
                        </Badge>
                        {record.severity && (
                          <Badge className={`text-xs ${SEVERITY_BADGES[record.severity] || SEVERITY_BADGES.mild}`}>
                            {SEVERITY_OPTIONS.find((o) => o.value === record.severity)?.label}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{record.notes}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button type="button" variant="outline" size="sm" disabled>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => deleteRecord.mutate(record.id)}
                        disabled={deleteRecord.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

      {allRecords.length === 0 && !showForm && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No medical records yet. Add one to get started.</p>
        </Card>
      )}
    </div>
  );
}
