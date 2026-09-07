import { useState } from "react";
import { motion } from "framer-motion";
import { Crosshair, Loader2, ScanLine } from "lucide-react";

function Viewfinder({
  label,
  file,
  onPick,
}: {
  label: string;
  file: File | null;
  onPick: (f: File | null) => void;
}) {
  const preview = file ? URL.createObjectURL(file) : null;
  const bracket =
    "pointer-events-none absolute size-6 border-primary";

  return (
    <label className="group flex cursor-pointer flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md active:scale-[0.99]">
      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
        <ScanLine className="size-3.5" />
        {label}
      </span>

      <div className="relative h-40 overflow-hidden rounded-md bg-ink/95">
        {preview ? (
          <img src={preview} alt={label} className="h-full w-full object-contain" />
        ) : (
          <div className="grid h-full place-items-center">
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <Crosshair className="size-8 text-saffron" />
              <span className="px-4 text-[11px] font-medium text-white/80">
                Tap to Activate Camera / Upload Label
              </span>
            </motion.div>
          </div>
        )}

        <span className="np-laser" />

        <span className={`${bracket} left-1.5 top-1.5 border-l-2 border-t-2`} />
        <span className={`${bracket} right-1.5 top-1.5 border-r-2 border-t-2`} />
        <span className={`${bracket} bottom-1.5 left-1.5 border-b-2 border-l-2`} />
        <span className={`${bracket} bottom-1.5 right-1.5 border-b-2 border-r-2`} />
      </div>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />

      {file ? (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 rounded-md bg-success/10 px-2 py-1 text-[11px] font-bold text-success"
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="size-2 rounded-full bg-success"
          />
          ✓ IMAGE CAPTURED (SHA-256 HASHED)
        </motion.span>
      ) : (
        <span className="text-[11px] text-muted-foreground">Awaiting capture…</span>
      )}
    </label>
  );
}

export function ScannerView({
  onSubmit,
  loading,
  error,
}: {
  onSubmit: (front: File, back: File) => void;
  loading: boolean;
  error: string | null;
}) {
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-primary">Packaging Verification Engine</h1>
        <p className="mt-1 text-sm text-slate-600">
          Capture front and back packaging labels for LMPC Rule 6 verification.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Viewfinder label="Front Label" file={front} onPick={setFront} />
        <Viewfinder label="Back Label" file={back} onPick={setBack} />
      </div>

      {error ? (
        <p className="rounded-md border border-statutory/30 bg-statutory-soft px-3 py-2 text-sm text-statutory">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={!front || !back || loading}
        onClick={() => front && back && onSubmit(front, back)}
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold tracking-wide text-primary-foreground shadow-sm transition-all hover:shadow-md active:scale-95 disabled:opacity-50"
      >
        {loading ? <Loader2 className="size-5 animate-spin" /> : null}
        {loading ? "INSPECTING…" : "RUN COMPLIANCE INSPECTION"}
      </button>
    </section>
  );
}
