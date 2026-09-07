import { fieldValue, type ScanResult } from "@/lib/netrapack";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-3 border-b border-border px-3 py-2.5 last:border-0">
      <span className="min-w-0 text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <span className="min-w-0 break-words text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

export function ResultsView({ result }: { result: ScanResult }) {
  const nonCompliant = String(result.status ?? "").toUpperCase() === "NON_COMPLIANT";
  const violations = result.violations ?? [];

  return (
    <section className="space-y-4">
      <div className="rounded-lg bg-ink px-3 py-2 text-[12px] font-medium text-white">
        🛡️ Mode: Offline Edge SLM | Latency: 380ms | AI: Level 2 Gemini Cloud
      </div>

      {nonCompliant ? (
        <div className="rounded-lg border-2 border-statutory-strong bg-statutory-soft px-3 py-3 text-sm font-bold text-statutory">
          ✕ NON-COMPLIANT — SECTION 36 VIOLATION
        </div>
      ) : (
        <div className="rounded-lg border-2 border-success/50 bg-success/10 px-3 py-3 text-sm font-bold text-success">
          ✓ COMPLIANT — NO STATUTORY VIOLATION DETECTED
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <h2 className="border-b border-border bg-surface-muted px-3 py-2 text-sm font-bold text-primary">
          Extracted Declarations
        </h2>
        <Row label="Declared MRP" value={result.mrp ? `₹${result.mrp}` : "Not declared"} />
        <Row
          label="Calculated USP"
          value={result.unit_sale_price ? `₹${result.unit_sale_price} / g` : "Not declared"}
        />
        <Row label="Net Quantity" value={fieldValue(result.net_quantity)} />
        <Row label="Date of Mfd" value={fieldValue(result.mfd_pkd_date)} />
        <Row label="FSSAI License" value={fieldValue(result.fssai_license_number)} />
        <Row label="Country of Origin" value={fieldValue(result.country_of_origin)} />
        <Row label="Manufacturer" value={fieldValue(result.manufacturer_details)} />
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-bold text-primary">Statutory Violations</h2>
        {violations.length === 0 ? (
          <p className="rounded-lg border border-border bg-card px-3 py-3 text-sm text-muted-foreground">
            No violations recorded for this scan.
          </p>
        ) : (
          violations.map((v, i) => (
            <div
              key={i}
              className="rounded-lg border border-statutory-strong/60 border-l-4 border-l-statutory bg-card px-3 py-3"
            >
              <p className="text-sm font-bold text-statutory">
                {v.rule ? `${v.rule} — ` : ""}
                {v.title ?? "Violation"}
              </p>
              {v.description ? (
                <p className="mt-1 text-sm text-slate-600">{v.description}</p>
              ) : null}
              {v.severity ? (
                <span className="mt-2 inline-block rounded bg-statutory-soft px-2 py-0.5 text-[11px] font-semibold uppercase text-statutory">
                  {v.severity}
                </span>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
