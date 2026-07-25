import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useMyVetProfile } from "@/hooks/useVets";

export function VetProfilePage() {
  const { data: profile } = useMyVetProfile();

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
        <p className="text-sm text-muted-foreground">Display view for now.</p>
      </div>
      <Card className="space-y-4 p-6">
        <div>
          <p className="font-semibold text-foreground">{profile.useDrPrefix ? "Dr. " : ""}{profile.user?.name}</p>
          <p className="text-sm text-muted-foreground">{profile.clinics?.[0]?.name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.specializations?.map((spec: any) => <Badge key={spec.specialization}>{spec.specialization}</Badge>)}
        </div>
        <p className="text-sm text-muted-foreground">{profile.bio}</p>
      </Card>
    </div>
  );
}
