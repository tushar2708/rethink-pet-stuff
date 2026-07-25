"use client";

import { useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Footprints,
  Home,
  Scissors,
  Car,
  Award,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { GigServiceType, ExperienceLevel } from "@/types/gig";
import { GIG_SERVICES } from "@/lib/constants";

interface ServiceOffering {
  type: GigServiceType;
  experienceLevel: ExperienceLevel;
  hourlyRate: number;
}

interface ServiceDetailExpanderProps {
  services: ServiceOffering[];
  onChange: (services: ServiceOffering[]) => void;
}

function getIconComponent(iconName: string) {
  const iconMap: Record<string, React.ComponentType<any>> = {
    Footprints,
    Home,
    Scissors,
    Car,
    Award,
  };
  return iconMap[iconName] || null;
}

function ExperienceSelector({
  value,
  onChange,
}: {
  value: ExperienceLevel;
  onChange: (level: ExperienceLevel) => void;
}) {
  const levels: Array<{ value: ExperienceLevel; label: string }> = [
    { value: "beginner", label: "New to this" },
    { value: "intermediate", label: "Some experience" },
    { value: "expert", label: "Pro" },
  ];

  return (
    <div className="flex gap-2">
      {levels.map((level) => (
        <Button
          key={level.value}
          variant={value === level.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(level.value)}
          className="flex-1"
        >
          {level.label}
        </Button>
      ))}
    </div>
  );
}

function RateInput({
  value,
  onChange,
  suggestedRange,
}: {
  value: number;
  onChange: (rate: number) => void;
  suggestedRange: { min: number; max: number };
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) {
      onChange(val);
    } else if (e.target.value === "") {
      onChange(0);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">$</span>
        <Input
          type="number"
          value={value || ""}
          onChange={handleChange}
          placeholder="Hourly rate"
          min="0"
          step="0.5"
          className="flex-1"
        />
        <span className="text-sm font-medium">/hr</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Suggested: ${suggestedRange.min} – ${suggestedRange.max}/hr
      </p>
    </div>
  );
}

function ServiceCard({
  service,
  isSelected,
  onSelect,
  onExpand,
}: {
  service: (typeof GIG_SERVICES)[number];
  isSelected: boolean;
  onSelect: () => void;
  onExpand: () => void;
}) {
  const Icon = getIconComponent(service.icon);

  return (
    <button
      onClick={() => {
        onSelect();
        if (!isSelected) {
          onExpand();
        }
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/50"
      )}
    >
      {Icon && <Icon className="size-6 text-primary" />}
      <span className="text-sm font-medium text-center">{service.label}</span>
      {isSelected && (
        <div className="absolute top-2 right-2 size-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="size-3 text-primary-foreground" />
        </div>
      )}
    </button>
  );
}

function ExpandedServicePanel({
  service,
  offering,
  onUpdate,
}: {
  service: (typeof GIG_SERVICES)[number];
  offering: ServiceOffering;
  onUpdate: (offering: ServiceOffering) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <Card className="mt-3 p-4 border-primary/20 bg-primary/5">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Experience Level
            </label>
            <ExperienceSelector
              value={offering.experienceLevel}
              onChange={(level) =>
                onUpdate({ ...offering, experienceLevel: level })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Hourly Rate</label>
            <RateInput
              value={offering.hourlyRate}
              onChange={(rate) => onUpdate({ ...offering, hourlyRate: rate })}
              suggestedRange={service.suggestedRateRange}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function ServiceDetailExpander({
  services,
  onChange,
}: ServiceDetailExpanderProps) {
  const selectedTypes = useMemo(
    () => new Set(services.map((s) => s.type)),
    [services]
  );

  const serviceOfferings = useMemo(() => {
    const map = new Map<GigServiceType, ServiceOffering>();
    services.forEach((s) => {
      map.set(s.type, s);
    });
    return map;
  }, [services]);

  const handleSelectService = useCallback(
    (serviceType: GigServiceType) => {
      if (selectedTypes.has(serviceType)) {
        // Deselect
        const updated = services.filter((s) => s.type !== serviceType);
        onChange(updated);
      } else {
        // Select with defaults
        const serviceConfig = GIG_SERVICES.find((s) => s.value === serviceType);
        if (serviceConfig) {
          const newOffering: ServiceOffering = {
            type: serviceType,
            experienceLevel: "beginner",
            hourlyRate: serviceConfig.suggestedRateRange.min,
          };
          onChange([...services, newOffering]);
        }
      }
    },
    [services, selectedTypes, onChange]
  );

  const handleUpdateService = useCallback(
    (offering: ServiceOffering) => {
      const updated = services.map((s) =>
        s.type === offering.type ? offering : s
      );
      onChange(updated);
    },
    [services, onChange]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {GIG_SERVICES.map((service) => {
          const isSelected = selectedTypes.has(service.value);
          return (
            <div key={service.value} className="relative">
              <ServiceCard
                service={service}
                isSelected={isSelected}
                onSelect={() => handleSelectService(service.value)}
                onExpand={() => {}}
              />
              <AnimatePresence>
                {isSelected && (
                  <div className="mt-0">
                    <ExpandedServicePanel
                      service={service}
                      offering={
                        serviceOfferings.get(service.value) || {
                          type: service.value,
                          experienceLevel: "beginner",
                          hourlyRate: service.suggestedRateRange.min,
                        }
                      }
                      onUpdate={handleUpdateService}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
