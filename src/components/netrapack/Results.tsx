import { motion } from "framer-motion";
import { fieldValue, type ScanResult } from "@/lib/netrapack";

function Cell({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        <span aria-hidden>{icon}</span>
        <span className="min-w-0 truncate">{label}</span>
      </p>
      <p className="mt-1 break-words text-sm font-bold text-foreground">{value}</p>
    </motion.div>
  );
}

export function ResultsView({ result }: { result: ScanResult }) {
  const nonCompliant = String(result.status ?? "").toUpperCase() === "NON_COMPLIANT";
  const violations = result.violations ?? [];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-ink px-3 py-2 text-[12px] font-medium text-white shadow-sm">
        <span className="flex items-center gap-1.5">
          <motion.span
            animate={{ opacity: [1, 0.25, 1], scale: [1, 1.25, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="size-2 rounded-full bg-success shadow-[0_0_8px_2px_var(--success)]"
          />
          Edge AI Active
        </span>
        <span className="text-white/60">| Mode: Offline Edge SLM</span>
        <span className="text-white/60">| Latency: 380ms</span>
        <span className="text-white/60">| AI: Level 2 Gemini Cloud</span>
      </div>

      {nonCompliant ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border-2 border-statutory bg-statutory px-3 py-3 text-white shadow-md"
        >
          <motion.span
            animate={{ opacity: [1, 0.55, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="inline-block rounded bg-white/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider"
          >
            ✕ Violation Detected
          </motion.span>
          <p className="mt-2 text-sm font-bold">NON-COMPLIANT — SECTION 36 VIOLATION</p>
        </motion.div>
      ) : (
        <div className="rounded-lg border-2 border-success/50 bg-success/10 px-3 py-3 text-sm font-bold text-success shadow-sm">
          ✓ COMPLIANT — NO STATUTORY VIOLATION DETECTED
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-sm font-bold text-primary">Extracted Declarations</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <Cell icon="₹" label="Declared MRP" value={result.mrp ? `₹${result.mrp}` : "Not declared"} />
          <Cell
            icon="₹"
            label="Calculated USP"
            value={result.unit_sale_price ? `₹${result.unit_sale_price} / g` : "Not declared"}
          />
          <Cell icon="⚖️" label="Net Quantity" value={fieldValue(result.net_quantity)} />
          <Cell icon="📅" label="Date of Mfd" value={fieldValue(result.mfd_pkd_date)} />
          <Cell icon="🛡️" label="FSSAI License" value={fieldValue(result.fssai_license_number)} />
          <Cell icon="🌐" label="Country of Origin" value={fieldValue(result.country_of_origin)} />
          <Cell icon="🏭" label="Manufacturer" value={fieldValue(result.manufacturer_details)} />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-bold text-primary">Statutory Violations</h2>
        {violations.length === 0 ? (
          <p className="rounded-lg border border-border bg-card px-3 py-3 text-sm text-muted-foreground shadow-sm">
            No violations recorded for this scan.
          </p>
        ) : (
          violations.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-lg border border-statutory/40 border-l-4 border-l-statutory bg-card px-3 py-3 shadow-sm transition-shadow hover:shadow-md"
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
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
