# APAC People Ops Hub

A client-side Human Resources Operations prototype built to demonstrate multi-country compliance, country-aware onboarding, data quality auditing, and pre-payroll validation across an Asia-Pacific (APAC) remote workforce.

> **Note on Data & Scope:** This is a front-end operational prototype populated with a **13-record synthetic dataset** spanning India, Singapore, Australia, Japan, and the Philippines. No real employee personal identifiable information (PII) is stored or processed. All state lives in-memory in the React runtime.

---

## What Problem This Solves

Distributed remote operations across APAC involve strict, disparate statutory employment regimes. When teams manage these across generic spreadsheets and ad-hoc email threads, four common failure modes emerge:
1. **Omitted Statutory Forms:** Forgetting country-mandated forms (e.g., India EPFO Form 11, Australia Superannuation Choice NAT 13080, Singapore KETs).
2. **Pre-Payroll Calculation Lag:** Hand-calculating mid-month joiner prorations and unpaid leave deductions in spreadsheets leading to month-end payment disputes.
3. **Data Drift & Currency Mismatches:** Storing local direct hires with incorrect base currencies (e.g., Australian staff entered with INR or USD) or unverified bank routing codes.
4. **Privacy & Retention Lapses:** Exposing compensation data to line managers and keeping separated employee records indefinitely without a statutory retention schedule.

This hub codifies these operational rules into a structured workflow.

---

## Core Modules

### 1. Mini HRIS & Employee Directory
- **Country-Aware Record Schema:** Models localized statutory profiles for 5 jurisdictions:
  - **India:** PAN, masked Aadhaar, EPFO UAN, Form 11 upload, Gratuity Form F nomination, POSH acknowledgment, and background verification (BGV).
  - **Singapore:** NRIC/FIN, MOM Pass type (Citizen, PR, EP, S-Pass), CPF status, Employment Act Key Employment Terms (KETs), and PDPA consent.
  - **Australia:** TFN provision status, Superannuation Choice Form (APRA fund name, USI, member number), Fair Work Statement acknowledgment, and VEVO right-to-work check.
  - **Japan:** Shakai Hoken (Kyokai Kenpo & Pension), Koyo Hoken, MyNumber collection flag, and Article 36 Agreement (36協定) overtime rules.
  - **Philippines:** SSS, PhilHealth, Pag-IBIG HDMF, and BIR Form 1902 withholding setup.
- **Role-Based View Masking:** Switchable view modes (**HR Ops Lead**, **People Generalist**, **Line Manager**, **Compliance Auditor**). Line Manager mode hides individual compensation figures and national tax IDs in the UI to demonstrate data minimization principles.
- **Client Session Change Log:** Tracks modifications made during the active session with actor, timestamp, previous value, new value, and justification.

### 2. Country-Specific Onboarding Workflows
- **Deterministic Checklist Generator:** When a new hire is added and a country selected, the engine generates country-mandated statutory tasks, IT hardware dispatch, manager 1:1 check-ins, and 30/60/90-day probation milestones.
- **SLA & Overdue Monitor:** Flags tasks that have passed their target completion date.
- **Clean Initial State:** Tasks for new joiners initialize as pending (`completed: false`) until explicitly executed.

### 3. Data Audit Tool & Privacy Guard
- **12-Rule Workforce Scanner:** Evaluates all records for missing statutory forms, location/currency mismatches, imminent work pass expiries (&lt; 45 days), overdue probation confirmations, and unverified bank details.
- **1-Click Auto-Remediation:** Provides one-click fixes for rule violations (e.g., correcting currency alignment, marking verified bank tests, dispatching e-sign templates).
- **Statutory Retention Matrix:** Outlines legal retention thresholds (Australia 7 years, Singapore 5 years, India 8 years, Japan 5 years) and includes an action to anonymize PII for separated records past the 7-year mark in compliance with GDPR Article 17 ("Right to Erasure").

### 4. Employee Helpdesk & Pre-Payroll Feed
- **Pre-Payroll Validation Engine:**
  - Calculates calendar-day proration for mid-month joiners.
  - Applies deductions for recorded unpaid leave (Leave Without Pay).
  - Estimates statutory employer and employee contributions:
    - **Australia:** 12.0% Superannuation Guarantee (legislated rate effective 1 July 2025).
    - **Singapore:** Central Provident Fund (CPF) tiered contributions subject to the **S$8,000 Ordinary Wage ceiling** (effective 1 Jan 2026).
    - **India:** 12.0% EPF contribution up to statutory wage ceiling.
    - **Japan:** Shakai Hoken social insurance deductions.
  - Highlights critical blockers (e.g., missing PAN in India blocks transmission due to EPFO rules and Section 206AA; missing TFN in Australia triggers an ATO top-marginal rate warning).
  - One-click export to CSV formatted for payroll bureaus (Deel, Remote, or local bureaus).
- **Self-Service Verification Letter:** Generates a formal, printable Employment Verification Letter on Singapore registered entity letterhead with digital seal, purpose selection, and salary toggle.
- **Policy FAQ Keyword Assistant:** Client-side keyword and intent matcher answering statutory leave entitlements, WFH allowances, and probation rules.

### 5. Documentation & Process Architecture Pack
- **Cross-Functional Swimlane Process Map:** Visual workflow across HR Ops, IT, Line Managers, and New Hires from T-14 Pre-boarding to T+90 Probation Confirmation.
- **One-Page Data Handling & Retention Policy:** Formally drafted operational policy covering Singapore PDPA, Australian Privacy Principles, Indian DPDP Act, and GDPR.
- **Empirical Task-Time Benchmark:** Timed comparison showing manual spreadsheet/email administrative entry (~22.0 mins per hire) versus this prototype workflow (~2.2 mins per hire).

---

## Technical Stack

- **Framework:** React 19 (Functional components & Hooks)
- **Language:** TypeScript 5.8
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Build Tool:** Vite 8

---

## Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/apac-people-ops-hub.git
cd apac-people-ops-hub

# If running on npm with React 19 peer dependencies:
npm install --legacy-peer-deps
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Verify Build & Typecheck
```bash
npm run lint    # Runs tsc --noEmit
npm run build   # Compiles production bundle via Vite
```

---

## Limitations & Honest Scope

To ensure complete credibility during technical and HR generalist evaluations, please note the following architectural boundaries:

| Dimension | How It Works in This Prototype | Production Equivalent |
|---|---|---|
| **Data Persistence** | In-memory React state (resets on browser reload). | PostgreSQL / Supabase with row-level security (RLS). |
| **Access Control** | UI-level view masking via a header role selector. | Authenticated RBAC via OAuth / JWT session tokens with server-side API redaction. |
| **Audit Logging** | In-memory array appending state changes in session. | Write-once append-only audit table in an immutable datastore. |
| **Statutory Payroll** | Illustrative calculations applying retirement rules (Super, CPF, EPF). Excludes individual PAYG/TDS income tax withholding. | Certified payroll engine integration (Deel, Remote, localized payroll bureau). |
| **FAQ Assistant** | Client-side keyword and topic matcher against handbook text. | RAG pipeline grounded on versioned company policy documents. |

---

## Interview Talking Points: Key Engineering & HR Decisions

When discussing this project in interviews, expect questions on the underlying business logic:

1. **Why does India missing PAN block payroll, while Australia missing TFN only generates a warning?**
   - In India, EPFO e-challan submissions mandate a valid PAN, and Section 206AA of the Income Tax Act imposes a punitive 20% flat withholding penalty. Payroll cannot be remitted without manual intervention.
   - In Australia, the ATO allows employers to pay an employee who has not provided a TFN, but mandates that the employer withhold tax at the highest marginal rate (47% plus Medicare levy). Thus, it is a compliance warning rather than a complete disbursement blocker.

2. **How is mid-month joiner proration calculated?**
   - The engine uses the standard calendar day formula: `(Monthly Base / Total Days in Month) * (Days Remaining from Start Date)`. For a hire starting on Oct 15th, they are paid for 17 active calendar days out of 31.

3. **What statutory rates are modeled?**
   - Australian Superannuation Guarantee is modeled at **12.0%** (the legislated statutory rate effective from 1 July 2025).
   - Singapore CPF is capped at the **S$8,000 monthly Ordinary Wage ceiling** (effective 1 January 2026).
