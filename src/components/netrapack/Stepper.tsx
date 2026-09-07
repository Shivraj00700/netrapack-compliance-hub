import { motion } from "framer-motion";

export type Step = "scanner" | "results" | "officer";

const STEPS: { id: Step; icon: string; label: string }[] = [
  { id: "scanner", icon: "📷", label: "Scan Label" },
  { id: "results", icon: "⚡", label: "AI Analysis" },
  { id: "officer", icon: "⚖️", label: "Enforcement" },
];

export function Stepper({
  current,
  unlocked,
  onSelect,
}: {
  current: Step;
  unlocked: boolean;
  onSelect: (s: Step) => void;
}) {
  const index = STEPS.findIndex((s) => s.id === current);

  return (
    <div className="relative rounded-lg border border-border bg-card px-3 py-3 shadow-sm">
      <div className="absolute left-[16%] right-[16%] top-[30px] h-[3px] rounded-full bg-surface-muted" />
      <motion.div
        className="absolute left-[16%] top-[30px] h-[3px] rounded-full bg-saffron"
        style={{ boxShadow: "0 0 10px 1px var(--saffron)" }}
        initial={false}
        animate={{ width: `${(index / (STEPS.length - 1)) * 68}%` }}
        transition={{ type: "spring", stiffness: 160, damping: 22 }}
      />
      <div className="relative grid grid-cols-3">
        {STEPS.map((s, i) => {
          const active = s.id === current;
          const done = i < index;
          const locked = i > 0 && !unlocked;
          return (
            <button
              key={s.id}
              type="button"
              disabled={locked}
              onClick={() => onSelect(s.id)}
              className="flex flex-col items-center gap-1.5 transition-opacity active:scale-95 disabled:opacity-40"
            >
              <span
                className={`grid size-9 place-items-center rounded-full border-2 text-sm transition-all ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20"
                    : done
                      ? "border-success bg-success/10 text-success"
                      : "border-border bg-card text-slate-500"
                }`}
              >
                {s.icon}
              </span>
              <span
                className={`text-[11px] leading-tight ${
                  active ? "font-bold text-primary" : "font-medium text-slate-500"
                }`}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
