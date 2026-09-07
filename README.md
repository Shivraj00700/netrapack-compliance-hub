# NetraPack Compliance Hub

Build a mobile-responsive Government of India Legal Metrology compliance app named "NetraPack" for field inspectors.

================================================================================

DESIGN SYSTEM (DIGITAL INDIA GOVT PORTAL)

================================================================================

- Primary Palette: #0B3C5D (Govt Navy Blue), #E65100 (Saffron Gold), #1B5E20 (Success Green), #B71C1C (Statutory Red).

- Background: #F8FAFC (Light Slate Neutral). Cards: #FFFFFF with 1px border #E2E8F0 and 8px border radius.

- Text: #0F172A (Deep Slate). Font: Inter or Roboto.

- Accent: Top 4px tricolor border (#E65100 Saffron -> #FFFFFF White -> #1B5E20 Green).

================================================================================

HEADER COMPONENT (Global)

================================================================================

- Top 4px tricolor accent line.

- Header Bar (#FFFFFF background, border bottom #E2E8F0):

  * Left: Shield icon (#0B3C5D).

  * Center: Stack with "भारत सरकार | Government of India" (11px, text-slate-500), "Legal Metrology Enforcement Portal" (14px bold, #0B3C5D), "Legal Metrology (Packaged Commodities) Rules, 2011" (10px, text-slate-600).

  * Right: Badge "ID: #4092" (#F1F5F9 background, #0B3C5D text). Ensure badge text is fully visible and not truncated.

================================================================================

VIEWS & NAVIGATION (Tabs or Step Navigation)

================================================================================

1. SCANNER VIEW:

   - Header title: "Packaging Verification Engine" with subtitle "Capture front and back packaging labels for LMPC Rule 6 verification."

   - Dual file upload inputs (Front Label & Back Label) with image previews.

   - Primary Action Button: "RUN COMPLIANCE INSPECTION" (#0B3C5D background, 52px height, rounded 8px, white bold text).

   - On Submission: Send FormData with `front_image` and `back_image` to `POST http://localhost:8000/api/v1/scan/process-photo`. Show loading spinner.

2. RESULTS VIEW:

   - Telemetry Banner (#0F172A background, white text): "🛡️ Mode: Offline Edge SLM | Latency: 380ms | AI: Level 2 Gemini Cloud"

   - Verdict Banner: When status is NON_COMPLIANT, display red container (#FFEBEE background, 2px border #D32F2F) with "✕ NON-COMPLIANT — SECTION 36 VIOLATION".

   - Extracted Declarations Table (Bind exact keys):

     * Declared MRP -> `mrp` (Format: "₹" + value)

     * Calculated USP -> `unit_sale_price` (Format: "₹" + value + " / g")

     * Net Quantity -> `net_quantity`

     * Date of Mfd -> `mfd_pkd_date`

     * FSSAI License -> `fssai_license_number`

     * Country of Origin -> `country_of_origin`

     * Manufacturer -> `manufacturer_details`

   - Statutory Violations List: Red-bordered cards displaying rule failures (e.g., Rule 18 overcharge, Rule 6(11) USP missing).

3. OFFICER GATE & NOTICE VIEW:

   - Inspector Confirmation Card (#FFF3E0 background, 4px left border #E65100):

     * Title: "⚠️ INSPECTOR CONFIRMATION REQUIRED"

     * Text: "AI Suggested Category: [ Food & Beverage ]. Confirm category before official notice generation."

     * Button: "Confirm Category" (Triggers `POST http://localhost:8000/api/v1/officer/confirm-category`).

   - Section 36 PDF Generator Card:

     * Button: "Generate Section 36 PDF Notice" (Disabled until category is confirmed; triggers `POST http://localhost:8000/api/v1/officer/generate-notice`).

     * Button: "View Signed PDF" (Opens PDF URL).

   - Wrap page in scroll container with 32px bottom padding.

4. EMBEDDED RAG CHATBOT (Floating Overlay / Modal):

   - Floating Action Button at bottom-right corner.

   - Chat drawer/modal sending user questions to `POST http://localhost:8000/api/v1/chat/query` with `{ scan_id, query }`.

   - Append mandatory footer to AI responses:

     "Note: This AI explanation is for guidance only and does not constitute a formal legal opinion under the Legal Metrology Act, 2009."

Provide clean, interactive state management allowing full navigation between steps.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/af3a24d2-ef6b-46ac-83fb-3e201d46bf58).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
