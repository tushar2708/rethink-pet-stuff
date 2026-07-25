import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useMyGigProfile } from "@/hooks/useGigWorkers";

export function GigProfilePage() {
  const { data: profile } = useMyGigProfile();

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Display view for now.</p>
      </div>
      <Card className="space-y-4 p-6">
        <div>
          <p className="font-semibold text-foreground">{profile.firstName}</p>
          <p className="text-sm text-muted-foreground">Coverage ZIP: {profile.coverageZip}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.services?.map((service: any) => <Badge key={service.type}>{service.type}: ${service.hourlyRate}/hr</Badge>)}
        </div>
        <p className="text-sm text-muted-foreground">{profile.bio}</p>
      </Card>
    </div>
  );
}
