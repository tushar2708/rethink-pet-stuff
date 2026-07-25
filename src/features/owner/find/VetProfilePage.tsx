import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVetProfile } from "@/hooks/useVets";
import { useReviews } from "@/hooks/useReviews";

export function VetProfilePage() {
  const params = useParams();
  const { data: vet } = useVetProfile(params.vetId || "");
  const { data: reviewsData } = useReviews(vet?.userId || "");

  if (!vet) return <div className="p-6">Loading...</div>;

  const reviews = reviewsData?.reviews || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{vet.useDrPrefix ? "Dr. " : ""}{vet.user?.name}</h1>
          <p className="text-sm text-muted-foreground">{vet.clinics?.[0]?.name}</p>
        </div>
        <Link to={`/owner/bookings/new?provider=${vet.id}&type=vet`}>
          <Button>Book Appointment</Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {vet.specializations?.map((spec: any) => <Badge key={spec.specialization}>{spec.specialization}</Badge>)}
      </div>
      <p className="text-sm text-muted-foreground">{vet.bio}</p>
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Reviews</h2>
        <div className="space-y-3">
          {reviews.length === 0 ? <p className="text-sm text-muted-foreground">No reviews yet.</p> : reviews.map((review: any) => (
            <div key={review.id} className="rounded-lg border p-4">
              <p className="font-medium text-foreground">{review.reviewer?.name}</p>
              <p className="text-sm text-muted-foreground">Rating: {review.rating}/5</p>
              {review.comment && <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
