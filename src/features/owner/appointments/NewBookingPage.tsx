import { useSearchParams, useNavigate } from "react-router-dom";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { usePets } from "@/hooks/usePets";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewBookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const providerId = searchParams.get("provider") || "";
  const providerType = searchParams.get("type") || "vet";
  const { data: pets } = usePets();
  const createAppointment = useCreateAppointment();
  const form = useForm<any>({ defaultValues: { petId: "", scheduledAt: "", durationMinutes: 30, notes: "" } });

  const onSubmit = async (values: any) => {
    await createAppointment.mutateAsync({
      petId: values.petId,
      providerId,
      providerType,
      serviceType: providerType === "vet" ? "consultation" : "service",
      scheduledAt: values.scheduledAt,
      durationMinutes: Number(values.durationMinutes),
      notes: values.notes,
    });
    navigate("/owner/appointments");
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
      <h1 className="text-2xl font-bold text-foreground">New Booking</h1>
      <select className="rounded-md border px-3 py-2" {...form.register("petId")}>
        <option value="">Select pet</option>
        {(pets || []).map((pet: any) => <option key={pet.id} value={pet.id}>{pet.name}</option>)}
      </select>
      <Input type="datetime-local" {...form.register("scheduledAt")} />
      <Input type="number" {...form.register("durationMinutes", { valueAsNumber: true })} />
      <Input placeholder="Notes" {...form.register("notes")} />
      <Button type="submit">Book</Button>
    </form>
  );
}
