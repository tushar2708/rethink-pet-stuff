"use client";

import { useMemo, useCallback } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DaySchedule, DayOfWeek } from "@/types/common";
import { DAYS_OF_WEEK, CONSULTATION_DURATIONS } from "@/lib/constants";

interface WeeklyScheduleBuilderProps {
  value: DaySchedule[];
  onChange: (schedule: DaySchedule[]) => void;
  consultationDuration?: number;
  onDurationChange?: (duration: number) => void;
}

// Generate time options from 06:00 to 22:00 in 30-minute increments
function generateTimeOptions(): string[] {
  const times: string[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute of [0, 30]) {
      times.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    }
  }
  return times;
}

const TIME_OPTIONS = generateTimeOptions();

function TimeSelect({
  value,
  onChange,
  disabled,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full" size="sm">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {TIME_OPTIONS.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function isValidTimeSlot(start: string, end: string): boolean {
  if (!start || !end) return true;
  return start < end;
}

function ScheduleRow({
  day,
  schedule,
  onToggle,
  onTimeChange,
  showMobileView,
}: {
  day: DayOfWeek;
  schedule: DaySchedule;
  onToggle: () => void;
  onTimeChange: (start: string, end: string) => void;
  showMobileView?: boolean;
}) {
  const dayLabel = DAYS_OF_WEEK.find((d) => d.value === day)?.label || day;
  const isValid = isValidTimeSlot(schedule.slots[0]?.start || "", schedule.slots[0]?.end || "");
  const error = !isValid && schedule.enabled;

  if (showMobileView === true) {
    return (
      <Card className="mb-3">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{dayLabel}</CardTitle>
            <Switch checked={schedule.enabled} onCheckedChange={onToggle} />
          </div>
        </CardHeader>
        {schedule.enabled && (
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Start Time
              </label>
              <TimeSelect
                value={schedule.slots[0]?.start || "09:00"}
                onChange={(start) =>
                  onTimeChange(start, schedule.slots[0]?.end || "17:00")
                }
                label="Select start time"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                End Time
              </label>
              <TimeSelect
                value={schedule.slots[0]?.end || "17:00"}
                onChange={(end) =>
                  onTimeChange(schedule.slots[0]?.start || "09:00", end)
                }
                label="Select end time"
              />
            </div>
            {error && (
              <div className="text-xs text-destructive font-medium">
                End time must be after start time
              </div>
            )}
          </CardContent>
        )}
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-[120px_80px_1fr_1fr_auto] gap-3 items-center py-3 px-4 border-b last:border-b-0">
      <div className="font-medium text-sm">{dayLabel}</div>
      <Switch checked={schedule.enabled} onCheckedChange={onToggle} />
      <div>
        <TimeSelect
          value={schedule.slots[0]?.start || "09:00"}
          onChange={(start) =>
            onTimeChange(start, schedule.slots[0]?.end || "17:00")
          }
          disabled={!schedule.enabled}
          label="Start"
        />
      </div>
      <div>
        <TimeSelect
          value={schedule.slots[0]?.end || "17:00"}
          onChange={(end) =>
            onTimeChange(schedule.slots[0]?.start || "09:00", end)
          }
          disabled={!schedule.enabled}
          label="End"
        />
      </div>
      {error && (
        <div className="text-xs text-destructive font-medium whitespace-nowrap">
          Invalid range
        </div>
      )}
    </div>
  );
}

export function WeeklyScheduleBuilder({
  value,
  onChange,
  consultationDuration,
  onDurationChange,
}: WeeklyScheduleBuilderProps) {
  const scheduleMap = useMemo(() => {
    const map = new Map<DayOfWeek, DaySchedule>();
    value.forEach((schedule) => {
      map.set(schedule.day, schedule);
    });
    return map;
  }, [value]);

  const currentSchedule = useMemo(() => {
    return DAYS_OF_WEEK.map((day) => {
      const existing = scheduleMap.get(day.value);
      return (
        existing || {
          day: day.value,
          enabled: false,
          slots: [{ start: "09:00", end: "17:00" }],
        }
      );
    });
  }, [scheduleMap]);

  const handleToggleDay = useCallback(
    (day: DayOfWeek) => {
      const updated = currentSchedule.map((schedule) => {
        if (schedule.day === day) {
          return { ...schedule, enabled: !schedule.enabled };
        }
        return schedule;
      });
      onChange(updated);
    },
    [currentSchedule, onChange]
  );

  const handleTimeChange = useCallback(
    (day: DayOfWeek, start: string, end: string) => {
      const updated = currentSchedule.map((schedule) => {
        if (schedule.day === day) {
          return {
            ...schedule,
            slots: [{ start, end }],
          };
        }
        return schedule;
      });
      onChange(updated);
    },
    [currentSchedule, onChange]
  );

  const handleWeekdayPreset = useCallback(() => {
    const weekdayPreset = DAYS_OF_WEEK.map((day) => ({
      day: day.value,
      enabled: ["mon", "tue", "wed", "thu", "fri"].includes(day.value),
      slots: [{ start: "09:00", end: "17:00" }],
    }));
    onChange(weekdayPreset);
  }, [onChange]);

  const handleClearAll = useCallback(() => {
    const cleared = DAYS_OF_WEEK.map((day) => ({
      day: day.value,
      enabled: false,
      slots: [{ start: "09:00", end: "17:00" }],
    }));
    onChange(cleared);
  }, [onChange]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={handleWeekdayPreset}
        >
          Weekdays 9-5
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAll}
        >
          Clear All
        </Button>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block border rounded-lg overflow-hidden bg-card">
        <div className="grid grid-cols-[120px_80px_1fr_1fr_auto] gap-3 items-center py-3 px-4 bg-muted/50 border-b font-semibold text-sm">
          <div>Day</div>
          <div>Enabled</div>
          <div>Start Time</div>
          <div>End Time</div>
          <div></div>
        </div>
        {currentSchedule.map((schedule) => (
          <ScheduleRow
            key={schedule.day}
            day={schedule.day}
            schedule={schedule}
            onToggle={() => handleToggleDay(schedule.day)}
            onTimeChange={(start, end) =>
              handleTimeChange(schedule.day, start, end)
            }
          />
        ))}
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {currentSchedule.map((schedule) => (
          <ScheduleRow
            key={schedule.day}
            day={schedule.day}
            schedule={schedule}
            onToggle={() => handleToggleDay(schedule.day)}
            onTimeChange={(start, end) =>
              handleTimeChange(schedule.day, start, end)
            }
            showMobileView={true}
          />
        ))}
      </div>

      {/* Consultation Duration Section */}
      {onDurationChange && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="size-4" />
            <label className="text-sm font-medium">Consultation Duration</label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {CONSULTATION_DURATIONS.map((duration) => (
              <Button
                key={duration.value}
                variant={consultationDuration === duration.value ? "default" : "outline"}
                size="sm"
                onClick={() => onDurationChange(duration.value)}
                className="w-full"
              >
                {duration.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
