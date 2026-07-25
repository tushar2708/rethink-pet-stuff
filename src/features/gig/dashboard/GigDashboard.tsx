import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useActiveGigJobs, useGigEarnings, useMyGigProfile } from "@/hooks/useGigWorkers";

export function GigDashboard() {
  const { data: profile } = useMyGigProfile();
  const { data: earnings } = useGigEarnings();
  const { data: activeJobs } = useActiveGigJobs();

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{profile.firstName}</h1>
        <p className="text-sm text-muted-foreground">Coverage ZIP: {profile.coverageZip}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4"><p className="text-sm text-muted-foreground">Total earnings</p><p className="mt-2 text-2xl font-bold text-foreground">${earnings?.total ?? 0}</p></Card>
        <Card className="p-4"><p className="text-sm text-muted-foreground">This week</p><p className="mt-2 text-2xl font-bold text-foreground">${earnings?.thisWeek ?? 0}</p></Card>
        <Card className="p-4"><p className="text-sm text-muted-foreground">Active jobs</p><p className="mt-2 text-2xl font-bold text-foreground">{activeJobs?.length ?? 0}</p></Card>
      </div>
      <div className="flex flex-wrap gap-2">
        {profile.services?.map((service: any) => <Badge key={service.type}>{service.type}: ${service.hourlyRate}/hr</Badge>)}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/gig/jobs"><Card className="p-4 hover:border-primary/50"><p className="font-medium text-foreground">View Jobs</p></Card></Link>
        <Link to="/gig/earnings"><Card className="p-4 hover:border-primary/50"><p className="font-medium text-foreground">Earnings</p></Card></Link>
        <Link to="/gig/profile"><Card className="p-4 hover:border-primary/50"><p className="font-medium text-foreground">Profile</p></Card></Link>
      </div>
    </div>
  );
}
