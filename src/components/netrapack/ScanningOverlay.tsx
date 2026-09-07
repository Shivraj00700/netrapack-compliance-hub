import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINES = [
  "Connecting to Local SLM (qwen2.5vl:3b)...",
  "Extracting MRP, Net Quantity & FSSAI...",
  "Checking LMPC Rule 6(11) & Section 36 compliance...",
];

export function ScanningOverlay({ open }: { open: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) {
      setStep(0);
      return;
    }
    const t1 = setTimeout(() => setStep(1), 550);
    const t2 = setTimeout(() => setStep(2), 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-ink/90 px-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="flex w-full max-w-sm flex-col items-center gap-6"
          >
            <div className="relative grid size-36 place-items-center">
              <span className="np-radar-pulse absolute size-36 rounded-full border-2 border-saffron/60" />
              <span
                className="np-radar-pulse absolute size-36 rounded-full border-2 border-saffron/40"
                style={{ animationDelay: "0.6s" }}
              />
              <span className="absolute size-24 rounded-full border border-white/20" />
              <span
                className="np-sweep absolute size-36 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--saffron) 55%, transparent) 60deg, transparent 90deg)",
                }}
              />
              <span className="relative text-3xl">🛡️</span>
            </div>

            <div className="w-full space-y-2">
              {LINES.map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: i <= step ? 1 : 0.25, x: 0 }}
                  className="flex items-center gap-2 font-mono text-[12px] text-white/90"
                >
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${
                      i < step ? "bg-success" : i === step ? "bg-saffron" : "bg-white/30"
                    }`}
                  />
                  {line}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
