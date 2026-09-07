export const API_BASE = "http://localhost:8000/api/v1";

export const CHAT_FOOTER =
  "Note: This AI explanation is for guidance only and does not constitute a formal legal opinion under the Legal Metrology Act, 2009.";

export type ScanResult = {
  scan_id?: string;
  status?: string;
  suggested_category?: string;
  mrp?: string | number;
  unit_sale_price?: string | number;
  net_quantity?: string;
  mfd_pkd_date?: string;
  fssai_license_number?: string;
  country_of_origin?: string;
  manufacturer_details?: string;
  violations?: Array<{
    rule?: string;
    title?: string;
    description?: string;
    severity?: string;
  }>;
  [key: string]: unknown;
};

export function fieldValue(v: unknown): string {
  if (v === null || v === undefined || v === "") return "Not declared";
  return String(v);
}
