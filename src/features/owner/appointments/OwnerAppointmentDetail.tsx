import { useState } from "react";
import { useAppointment, useUpdateAppointment } from "@/hooks/useAppointments";
import { useCreateReview } from "@/hooks/useReviews";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function OwnerAppointmentDetail() {
  const params = useParams();
  const { data: appt } = useAppointment(params.appointmentId || "");
  const updateAppointment = useUpdateAppointment();
  const createReview = useCreateReview();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!appt) return <div className="p-6">Loading...</div>;

  const handleCancel = async () => {
    await updateAppointment.mutateAsync({ id: appt.id, data: { status: "cancelled" } });
  };

  const handleReview = async () => {
    await createReview.mutateAsync({ appointmentId: appt.id, rating, comment });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Appointment Detail</h1>
        <p className="text-sm text-muted-foreground">{appt.pet?.name} · {appt.provider?.name}</p>
      </div>
      <div className="rounded-lg border p-4">
        <p className="text-sm text-muted-foreground">Service: {appt.serviceType}</p>
        <p className="text-sm text-muted-foreground">When: {new Date(appt.scheduledAt).toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">Status: {appt.status}</p>
        {appt.notes && <p className="mt-2 text-sm text-muted-foreground">Notes: {appt.notes}</p>}
      </div>
      {(appt.status === "pending" || appt.status === "confirmed") && <Button variant="destructive" onClick={handleCancel}>Cancel</Button>}
      {appt.status === "completed" && (
        <div className="space-y-3 rounded-lg border p-4">
          <h2 className="text-lg font-semibold text-foreground">Leave Review</h2>
          <Input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
          <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience" />
          <Button onClick={handleReview}>Submit Review</Button>
        </div>
      )}
    </div>
  );
}
