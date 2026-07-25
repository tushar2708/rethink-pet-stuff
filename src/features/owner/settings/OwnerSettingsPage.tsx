import { Settings } from "lucide-react";
import { Card } from "@/components/ui/card";

export function OwnerSettingsPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <Card className="max-w-md text-center p-8">
        <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Settings</h2>
        <p className="mt-2 text-muted-foreground">Coming soon</p>
      </Card>
    </div>
  );
}
