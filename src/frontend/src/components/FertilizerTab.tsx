import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddFertilizerSchedule, useMySchedule } from "@/hooks/useQueries";
import type { Language } from "@/i18n";
import { t } from "@/i18n";
import { Bell, Sprout } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const TIMELINE_POINTS = [
  { x: 0, highlight: false },
  { x: 60, highlight: true },
  { x: 120, highlight: false },
  { x: 180, highlight: false },
  { x: 240, highlight: false },
];

export default function FertilizerTab({ lang }: { lang: Language }) {
  const [cropType, setCropType] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const { data: schedule, isLoading } = useMySchedule();
  const addSchedule = useAddFertilizerSchedule();

  const handleSubmit = async () => {
    if (!cropType || !plantingDate) return;
    try {
      await addSchedule.mutateAsync({ cropType, plantingDate });
      toast.success("Fertilizer schedule created!");
      setCropType("");
      setPlantingDate("");
    } catch {
      toast.error("Failed to create schedule");
    }
  };

  const hasSchedule = !!(schedule?.tasks && schedule.tasks.length > 0);
  const nextTask = hasSchedule ? schedule!.tasks[0] : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Minimal dark header */}
      <header className="px-5 pt-5 pb-3 flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: "oklch(0.52 0.18 145 / 0.2)",
            border: "1px solid oklch(0.52 0.18 145 / 0.3)",
          }}
        >
          <Bell className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-base font-display font-bold text-foreground">
          Fertilizer Reminder
        </h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Crop card — only when real schedule exists */}
        {hasSchedule ? (
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.38 0.16 145) 0%, oklch(0.25 0.12 145) 100%)",
              border: "1px solid oklch(0.45 0.14 145 / 0.4)",
            }}
          >
            <Sprout className="w-6 h-6 flex-shrink-0 text-white" />
            <div>
              <p className="font-display font-bold text-base text-white">
                Crop: {schedule!.cropType}
              </p>
              <p className="text-white/70 text-sm">
                Planted: {schedule!.plantingDate}
              </p>
            </div>
          </div>
        ) : (
          !isLoading && (
            <div
              data-ocid="fertilizer.empty_state"
              className="rounded-2xl p-6 flex flex-col items-center gap-2 text-center"
              style={{
                background: "oklch(0.18 0.05 145)",
                border: "1px dashed oklch(0.35 0.10 145 / 0.5)",
              }}
            >
              <Sprout
                className="w-8 h-8"
                style={{ color: "oklch(0.52 0.18 145)" }}
              />
              <p className="font-semibold text-foreground text-sm">
                No schedule yet.
              </p>
              <p className="text-xs text-muted-foreground">
                Add your crop below to get started.
              </p>
            </div>
          )
        )}

        {/* Next fertilizer — gold-tinted, only when schedule exists */}
        {nextTask && (
          <div
            className="rounded-2xl p-4"
            style={{
              background: "oklch(0.78 0.14 80 / 0.1)",
              border: "1px solid oklch(0.78 0.14 80 / 0.25)",
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-wide mb-1"
              style={{ color: "oklch(0.78 0.14 80)" }}
            >
              ⏰ Next Fertilizer
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className="text-2xl font-bold"
                style={{ color: "oklch(0.88 0.12 80)" }}
              >
                {String(nextTask.dayOffset)} Days
              </span>
              <span
                className="text-sm"
                style={{ color: "oklch(0.78 0.10 80)" }}
              >
                — {nextTask.fertilizerName}
              </span>
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "oklch(0.65 0.08 80)" }}
            >
              {nextTask.notes}
            </p>
          </div>
        )}

        {/* Stage checklist */}
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-xl"
                style={{ background: "oklch(0.18 0.05 145)" }}
              />
            ))}
          </div>
        ) : hasSchedule ? (
          <div
            data-ocid="fertilizer.schedule.card"
            className="rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.18 0.05 145)",
              border: "1px solid oklch(0.25 0.06 145)",
            }}
          >
            <p
              className="px-4 pt-3 pb-2 text-xs font-bold uppercase tracking-wide"
              style={{ color: "oklch(0.52 0.18 145)" }}
            >
              Schedule
            </p>
            {schedule!.tasks.map((task, i) => (
              <div key={`${task.dayOffset}-${task.fertilizerName}`}>
                {i > 0 && (
                  <div
                    className="h-px mx-4"
                    style={{ background: "oklch(0.25 0.06 145)" }}
                  />
                )}
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="px-4 py-3 flex items-start gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{
                      background:
                        i === 0
                          ? "oklch(0.78 0.14 80 / 0.2)"
                          : "oklch(0.52 0.18 145 / 0.15)",
                      color:
                        i === 0
                          ? "oklch(0.78 0.14 80)"
                          : "oklch(0.52 0.18 145)",
                    }}
                  >
                    D{String(task.dayOffset)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {task.fertilizerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.amount} • {task.notes}
                    </p>
                  </div>
                  {i === 0 && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "oklch(0.78 0.14 80 / 0.15)",
                        color: "oklch(0.78 0.14 80)",
                      }}
                    >
                      Next
                    </span>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Simple trend line */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "oklch(0.18 0.05 145)",
            border: "1px solid oklch(0.25 0.06 145)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-wide mb-3"
            style={{ color: "oklch(0.52 0.18 145)" }}
          >
            Application Timeline
          </p>
          <svg
            viewBox="0 0 240 50"
            className="w-full h-12"
            fill="none"
            aria-label="Application timeline chart"
          >
            <title>Application Timeline</title>
            <line
              x1="0"
              y1="40"
              x2="240"
              y2="40"
              stroke="oklch(0.25 0.06 145)"
              strokeWidth="1"
            />
            {TIMELINE_POINTS.map((p) => (
              <circle
                key={p.x}
                cx={p.x}
                cy={40}
                r="4"
                fill={
                  p.highlight ? "oklch(0.78 0.14 80)" : "oklch(0.52 0.18 145)"
                }
              />
            ))}
            <path
              d="M 0 40 L 60 20 L 120 30 L 180 15 L 240 25"
              stroke="oklch(0.52 0.18 145)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Add schedule form */}
        <div
          className="rounded-2xl p-4 space-y-3"
          style={{
            background: "oklch(0.18 0.05 145)",
            border: "1px solid oklch(0.25 0.06 145)",
          }}
        >
          <p className="font-display font-bold text-foreground flex items-center gap-2">
            <Sprout className="w-4 h-4 text-primary" />
            {t(lang, "addSchedule")}
          </p>
          <div>
            <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
              {t(lang, "cropType")}
            </Label>
            <Input
              data-ocid="fertilizer.crop.input"
              placeholder="e.g. Rice, Tomato"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="h-11 rounded-xl border-border"
              style={{ background: "oklch(0.22 0.04 145)" }}
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
              {t(lang, "plantingDate")}
            </Label>
            <Input
              data-ocid="fertilizer.date.input"
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className="h-11 rounded-xl border-border"
              style={{ background: "oklch(0.22 0.04 145)" }}
            />
          </div>
          <Button
            data-ocid="fertilizer.submit_button"
            className="w-full h-11 rounded-xl font-semibold"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.52 0.18 145), oklch(0.40 0.15 145))",
              color: "oklch(0.98 0 0)",
              boxShadow: "0 4px 16px oklch(0.52 0.18 145 / 0.25)",
            }}
            onClick={handleSubmit}
            disabled={!cropType || !plantingDate || addSchedule.isPending}
          >
            {addSchedule.isPending ? "Saving..." : t(lang, "addSchedule")}
          </Button>
        </div>
      </div>
    </div>
  );
}
