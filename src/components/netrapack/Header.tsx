import { Shield } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30">
      <div className="tricolor-bar" />
      <div className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-3xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 sm:px-4">
          <Shield className="size-7 shrink-0 text-primary" strokeWidth={2.2} />
          <div className="min-w-0 text-center">
            <p className="truncate text-[11px] leading-tight text-slate-500">
              भारत सरकार | Government of India
            </p>
            <p className="truncate text-[14px] font-bold leading-tight text-primary">
              Legal Metrology Enforcement Portal
            </p>
            <p className="truncate text-[10px] leading-tight text-slate-600">
              Legal Metrology (Packaged Commodities) Rules, 2011
            </p>
          </div>
          <span className="shrink-0 whitespace-nowrap rounded-md bg-surface-muted px-2 py-1 text-[11px] font-semibold text-primary">
            ID: #4092
          </span>
        </div>
      </div>
    </header>
  );
}
