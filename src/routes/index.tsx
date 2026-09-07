import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/netrapack/Header";
import { ScannerView } from "@/components/netrapack/Scanner";
import { ResultsView } from "@/components/netrapack/Results";
import { OfficerView } from "@/components/netrapack/Officer";
import { Chatbot } from "@/components/netrapack/Chatbot";
import { API_BASE, type ScanResult } from "@/lib/netrapack";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NetraPack — Legal Metrology Compliance Inspection" },
      {
        name: "description",
        content:
          "Field inspector app for Legal Metrology (Packaged Commodities) Rules, 2011 — scan labels, review declarations and issue Section 36 notices.",
      },
      { property: "og:title", content: "NetraPack — Legal Metrology Compliance Inspection" },
      {
        property: "og:description",
        content:
          "Scan packaging labels, detect statutory violations and generate Section 36 notices in the field.",
      },
    ],
  }),
  component: Index,
});

type Step = "scanner" | "results" | "officer";

const STEPS: { id: Step; label: string }[] = [
  { id: "scanner", label: "1. Scanner" },
  { id: "results", label: "2. Results" },
  { id: "officer", label: "3. Notice" },
];

function Index() {
  const [step, setStep] = useState<Step>("scanner");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runInspection(front: File, back: File) {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("front_image", front);
      fd.append("back_image", back);
      const res = await fetch(`${API_BASE}/scan/process-photo`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Inspection failed (${res.status})`);
      const data: ScanResult = await res.json();
      setResult(data);
      setStep("results");
    } catch (e) {
      setError(
        e instanceof Error
          ? `${e.message}. Ensure the inspection service is running on localhost:8000.`
          : "Inspection failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <nav className="mx-auto max-w-3xl px-3 pt-3 sm:px-4">
        <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-card p-1">
          {STEPS.map((s) => {
            const locked = s.id !== "scanner" && !result;
            return (
              <button
                key={s.id}
                type="button"
                disabled={locked}
                onClick={() => setStep(s.id)}
                className={`h-9 rounded-md text-xs font-bold transition-colors disabled:opacity-40 ${
                  step === s.id
                    ? "bg-primary text-primary-foreground"
                    : "text-slate-600 hover:bg-surface-muted"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-3xl overflow-y-auto px-3 pb-8 pt-4 sm:px-4">
        {step === "scanner" ? (
          <ScannerView onSubmit={runInspection} loading={loading} error={error} />
        ) : null}
        {step === "results" && result ? (
          <div className="space-y-4">
            <ResultsView result={result} />
            <button
              type="button"
              onClick={() => setStep("officer")}
              className="h-[52px] w-full rounded-lg bg-primary text-sm font-bold text-primary-foreground"
            >
              PROCEED TO OFFICER GATE
            </button>
          </div>
        ) : null}
        {step === "officer" && result ? <OfficerView result={result} /> : null}
      </main>

      <Chatbot scanId={result?.scan_id} />
    </div>
  );
}
