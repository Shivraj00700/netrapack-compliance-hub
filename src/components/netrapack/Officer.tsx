import { useState } from "react";
import { Loader2 } from "lucide-react";
import { API_BASE, type ScanResult } from "@/lib/netrapack";

export function OfficerView({ result }: { result: ScanResult }) {
  const [confirmed, setConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const category = result.suggested_category ?? "Food & Beverage";

  async function confirmCategory() {
    setConfirming(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/officer/confirm-category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scan_id: result.scan_id, category }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setConfirmed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not confirm category.");
    } finally {
      setConfirming(false);
    }
  }

  async function generateNotice() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/officer/generate-notice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scan_id: result.scan_id, category }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json().catch(() => ({}));
      setPdfUrl(data.pdf_url ?? data.url ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate notice.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <section className="space-y-4 pb-8">
      <div className="rounded-lg border border-border border-l-4 border-l-saffron bg-saffron-soft px-3 py-3">
        <p className="text-sm font-bold text-saffron">⚠️ INSPECTOR CONFIRMATION REQUIRED</p>
        <p className="mt-1.5 text-sm text-slate-700">
          AI Suggested Category: [ {category} ]. Confirm category before official notice
          generation.
        </p>
        <button
          type="button"
          onClick={confirmCategory}
          disabled={confirming || confirmed}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-saffron text-sm font-bold text-white disabled:opacity-60"
        >
          {confirming ? <Loader2 className="size-4 animate-spin" /> : null}
          {confirmed ? "Category Confirmed" : "Confirm Category"}
        </button>
      </div>

      <div className="rounded-lg border border-border bg-card px-3 py-3">
        <h2 className="text-sm font-bold text-primary">Section 36 PDF Notice</h2>
        <p className="mt-1 text-sm text-slate-600">
          Generate the statutory notice once the category has been confirmed.
        </p>
        <button
          type="button"
          onClick={generateNotice}
          disabled={!confirmed || generating}
          className="mt-3 flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          {generating ? <Loader2 className="size-5 animate-spin" /> : null}
          Generate Section 36 PDF Notice
        </button>
        <a
          href={pdfUrl ?? "#"}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!pdfUrl}
          onClick={(e) => {
            if (!pdfUrl) e.preventDefault();
          }}
          className={`mt-2 flex h-11 w-full items-center justify-center rounded-lg border border-primary text-sm font-bold text-primary ${
            pdfUrl ? "" : "pointer-events-none opacity-50"
          }`}
        >
          View Signed PDF
        </a>
      </div>

      {error ? (
        <p className="rounded-md border border-statutory/30 bg-statutory-soft px-3 py-2 text-sm text-statutory">
          {error}
        </p>
      ) : null}
    </section>
  );
}
