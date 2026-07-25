import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGigProfile } from "@/hooks/useGigWorkers";
import { useReviews } from "@/hooks/useReviews";

export function WorkerProfilePage() {
  const params = useParams();
  const { data: worker } = useGigProfile(params.workerId || "");
  const { data: reviewsData } = useReviews(worker?.userId || "");

  if (!worker) return <div className="p-6">Loading...</div>;

  const reviews = reviewsData?.reviews || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{worker.firstName}</h1>
          <p className="text-sm text-muted-foreground">Coverage ZIP: {worker.coverageZip}</p>
        </div>
        <Link to={`/owner/bookings/new?provider=${worker.id}&type=gig`}>
          <Button>Book Service</Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {worker.services?.map((service: any) => <Badge key={service.type}>{service.type}: ${service.hourlyRate}/hr</Badge>)}
      </div>
      <p className="text-sm text-muted-foreground">{worker.bio}</p>
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
