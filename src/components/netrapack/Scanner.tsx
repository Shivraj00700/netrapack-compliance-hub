import { useState } from "react";
import { Loader2, Upload } from "lucide-react";

function UploadBox({
  label,
  file,
  onPick,
}: {
  label: string;
  file: File | null;
  onPick: (f: File | null) => void;
}) {
  const preview = file ? URL.createObjectURL(file) : null;
  return (
    <label className="flex cursor-pointer flex-col gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </span>
      <div className="grid h-36 place-items-center overflow-hidden rounded-md border border-dashed border-border bg-surface-muted">
        {preview ? (
          <img src={preview} alt={label} className="h-full w-full object-contain" />
        ) : (
          <span className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
            <Upload className="size-5" />
            Tap to upload
          </span>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
      {file ? (
        <span className="truncate text-[11px] text-muted-foreground">{file.name}</span>
      ) : null}
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
        <UploadBox label="Front Label" file={front} onPick={setFront} />
        <UploadBox label="Back Label" file={back} onPick={setBack} />
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
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold tracking-wide text-primary-foreground transition-opacity disabled:opacity-50"
      >
        {loading ? <Loader2 className="size-5 animate-spin" /> : null}
        {loading ? "INSPECTING…" : "RUN COMPLIANCE INSPECTION"}
      </button>
    </section>
  );
}
