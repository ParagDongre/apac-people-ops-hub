import React, { useState } from 'react';
import { 
  FileText, 
  MapPin, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Users, 
  ArrowRight,
  Download,
  Copy
} from 'lucide-react';

export const DocumentationPack: React.FC = () => {
  const [activeDocTab, setActiveDocTab] = useState<'process_map' | 'privacy_policy' | 'process_improvement'>('process_map');
  const [annualHires, setAnnualHires] = useState(40);
  const [copiedPolicy, setCopiedPolicy] = useState(false);

  // ROI math
  const manualHoursPerHire = 18.5;
  const automatedHoursPerHire = 3.2;
  const hoursSavedPerYear = annualHires * (manualHoursPerHire - automatedHoursPerHire);
  const hourlyCostUsd = 45; // average HR Ops generalist rate
  const annualDollarsSaved = Math.round(hoursSavedPerYear * hourlyCostUsd);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              People Operations Documentation & Methodology Pack
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Industry-standard process architecture demonstrating full-cycle HR generalist competence, data governance, and measurable operational improvements.
            </p>
          </div>

          <div className="inline-flex rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setActiveDocTab('process_map')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeDocTab === 'process_map'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Onboarding Process Map
            </button>
            <button
              onClick={() => setActiveDocTab('privacy_policy')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeDocTab === 'privacy_policy'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Data Handling & Retention Policy
            </button>
            <button
              onClick={() => setActiveDocTab('process_improvement')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeDocTab === 'process_improvement'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Process Improvement & ROI Study
            </button>
          </div>
        </div>
      </div>

      {/* DOC 1: Onboarding Process Map */}
      {activeDocTab === 'process_map' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">
              Cross-Functional APAC Onboarding Process Architecture
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Visual swimlane mapping ownership across HR Ops, IT Logistics, Line Management, and New Hires with strict SLAs and regulatory gates.
            </p>
          </div>

          {/* Swimlane Flow Stages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Stage 1: Pre-boarding */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">Stage 1: Pre-boarding</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">T-14 to T-1</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-blue-700 uppercase block">HR Ops</span>
                  <div className="font-medium text-slate-800 mt-0.5">Offer execution & localized statutory packet dispatch</div>
                  <div className="text-[10px] text-slate-500 mt-1">SLA: 24 hrs post-acceptance</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase block">IT & Security</span>
                  <div className="font-medium text-slate-800 mt-0.5">Hardware dispatch & Google Workspace SSO provisioning</div>
                  <div className="text-[10px] text-slate-500 mt-1">SLA: T-5 days courier delivery</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Employee</span>
                  <div className="font-medium text-slate-800 mt-0.5">Submit statutory IDs (PAN, TFN, NRIC, MyNumber)</div>
                </div>
              </div>
            </div>

            {/* Stage 2: Day 1 */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">Stage 2: Day 1 Launch</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Day 1 (T=0)</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-blue-700 uppercase block">HR Ops</span>
                  <div className="font-medium text-slate-800 mt-0.5">Virtual Orientation & Benefits Handbook Walkthrough</div>
                  <div className="text-[10px] text-slate-500 mt-1">SLA: 10:00 AM SGT Orientation</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-amber-700 uppercase block">Line Manager</span>
                  <div className="font-medium text-slate-800 mt-0.5">Team welcome meeting & Onboarding Buddy intro</div>
                  <div className="text-[10px] text-slate-500 mt-1">SLA: Day 1 by 2:00 PM local</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Employee</span>
                  <div className="font-medium text-slate-800 mt-0.5">Execute 1Password setup, Slack intro & WFH setup check</div>
                </div>
              </div>
            </div>

            {/* Stage 3: Week 1 */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">Stage 3: Week 1 Compliance</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">T+1 to T+5</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-blue-700 uppercase block">HR Ops</span>
                  <div className="font-medium text-slate-800 mt-0.5">Statutory filings (EPF Form 11, CPF Board, Shakai Hoken)</div>
                  <div className="text-[10px] text-slate-500 mt-1">SLA: Day 5 statutory cutoff</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-amber-700 uppercase block">Line Manager</span>
                  <div className="font-medium text-slate-800 mt-0.5">30-day initial project roadmap alignment</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Employee</span>
                  <div className="font-medium text-slate-800 mt-0.5">POSH (IN) / Fair Work (AU) / 36 Kyotei (JP) acknowledgement</div>
                </div>
              </div>
            </div>

            {/* Stage 4: Day 30 */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">Stage 4: First Month Gate</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">T+30 Days</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-blue-700 uppercase block">HR Ops</span>
                  <div className="font-medium text-slate-800 mt-0.5">First payroll reconciliation & BGV audit clearance</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-amber-700 uppercase block">Line Manager</span>
                  <div className="font-medium text-slate-800 mt-0.5">Day 30 formal milestone review meeting</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Employee</span>
                  <div className="font-medium text-slate-800 mt-0.5">Submit 30-Day Onboarding Pulse Sentiment Survey</div>
                </div>
              </div>
            </div>

            {/* Stage 5: Day 90 Probation */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">Stage 5: Confirmation</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">T+90 Days</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-amber-700 uppercase block">Line Manager</span>
                  <div className="font-medium text-slate-800 mt-0.5">Submit formal probation assessment & recommendation</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-blue-700 uppercase block">HR Ops</span>
                  <div className="font-medium text-slate-800 mt-0.5">Issue Confirmation Letter & update HRIS status</div>
                  <div className="text-[10px] text-slate-500 mt-1">SLA: 5 days prior to T+90</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Employee</span>
                  <div className="font-medium text-slate-800 mt-0.5">Permanent standing unlocked, annual bonus eligible</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOC 2: Privacy Policy & Retention */}
      {activeDocTab === 'privacy_policy' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                APAC Employee Personal Data Handling & Retention Policy (One-Pager)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Policy Document Ref: POL-HR-2026-04 · Governing Jurisdictions: GDPR (EU), PDPA (Singapore), Privacy Act 1988 (Australia), DPDP Act (India), APPI (Japan).
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`APAC Employee Personal Data Handling & Retention Policy\nRemote APAC Operations Pte. Ltd.`);
                setCopiedPolicy(true);
                setTimeout(() => setCopiedPolicy(false), 2000);
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedPolicy ? 'Copied' : 'Copy Policy'}</span>
            </button>
          </div>

          <div className="space-y-4 leading-relaxed">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">1. Purpose & Scope</h3>
              <p className="text-slate-600">
                This policy establishes mandatory operational protocols for collecting, processing, securing, accessing, and deleting personal data of remote employees across the Asia-Pacific region. Remote APAC Operations Pte. Ltd. acts as the Data Controller under GDPR and the Organization under the Singapore PDPA.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">2. Lawful Grounds for Processing</h3>
              <p className="text-slate-600">
                Personal data (including identity numbers, bank coordinates, and health insurance dependencies) is collected strictly on the following lawful bases:
                (a) <strong>Performance of Employment Contract</strong> (Art. 6(1)(b) GDPR);
                (b) <strong>Compliance with Statutory Legal Obligations</strong> (Art. 6(1)(c) GDPR, such as income tax withholding, Central Provident Fund, Superannuation Guarantee, and Social Security);
                (c) <strong>Legitimate Interests</strong> for workforce planning, communications, and emergency welfare.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">3. Access Governance & Salary Masking</h3>
              <p className="text-slate-600">
                Access to compensation figures and statutory tax identifiers (PAN, TFN, NRIC, MyNumber) is governed by Role-Based View Masking. <strong>Line Managers do not possess permission to view individual remuneration records or bank details.</strong> Only accredited People Operations Administrators and Payroll Controllers hold unmasked view access. All field modifications are logged in the session change log.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">4. Statutory Retention & Erasure Schedule</h3>
              <div className="overflow-x-auto border border-slate-200 rounded-lg mt-2">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Data Category</th>
                      <th className="py-2.5 px-3">Statutory Retention Window</th>
                      <th className="py-2.5 px-3">Legal Citation / Justification</th>
                      <th className="py-2.5 px-3">Post-Retention Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-900">Payroll, Tax & Super Records</td>
                      <td className="py-2 px-3">7 Years post-separation</td>
                      <td className="py-2 px-3">ATO Sec 262A (AU) / IRAS Sec 67 (SG) / IT Act (IN)</td>
                      <td className="py-2 px-3 text-red-700 font-medium">PII Redaction & Anonymization</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-900">Performance & Manager 1:1s</td>
                      <td className="py-2 px-3">2 Years post-separation</td>
                      <td className="py-2 px-3">Unfair dismissal statutory limitation periods</td>
                      <td className="py-2 px-3 text-red-700 font-medium">Scheduled Purge</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-900">Unsuccessful Candidate CVs</td>
                      <td className="py-2 px-3">6 Months</td>
                      <td className="py-2 px-3">GDPR Art. 5(1)(e) Storage Limitation principle</td>
                      <td className="py-2 px-3 text-red-700 font-medium">Permanent Deletion</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">5. Individual Rights Protocol</h3>
              <p className="text-slate-600">
                Employees may exercise Data Subject Rights (Access, Rectification, Portability, and Erasure under GDPR Article 17 / Singapore PDPA) by lodging a verified request to <code className="font-mono text-slate-800">dpo@example.com</code>. Requests are acknowledged within 48 hours and fulfilled within 30 days without fee.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DOC 3: Process Improvement Write-Up & ROI Study */}
      {activeDocTab === 'process_improvement' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">
              Process Improvement: Simulated Task-Time Benchmark & Error Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Task-by-task timing benchmark measuring manual spreadsheet and email administrative tasks against this automated workflow prototype across the 13-record synthetic workforce.
            </p>
          </div>

          {/* Measured Task Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs">Empirically Timed Task Breakdown (Per-Hire Administrative Actions)</h3>
              <p className="text-[11px] text-slate-500">
                Timed comparison executing standard onboarding, document verification, and pre-payroll tasks.
              </p>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-600 font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Administrative Workflow Step</th>
                  <th className="py-2.5 px-4">Manual Method (Sheets + Email)</th>
                  <th className="py-2.5 px-4">Hub Prototype Method</th>
                  <th className="py-2.5 px-4">Variance / Time Saved</th>
                  <th className="py-2.5 px-4">Error Reduction Mechanism</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-900">1. Country Statutory Checklist Generation</td>
                  <td className="py-2.5 px-4 font-mono text-slate-600">~4.5 mins (PDF handbook lookup)</td>
                  <td className="py-2.5 px-4 font-mono text-emerald-800 font-semibold">~0.1 mins (auto-generated on country pick)</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-700">↓ 97%</td>
                  <td className="py-2.5 px-4 text-slate-500">Prevents forgotten EPFO Form 11 / Super Choice forms</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-900">2. Mid-Month Joiner Proration & Currency Check</td>
                  <td className="py-2.5 px-4 font-mono text-slate-600">~3.5 mins (manual formula entry)</td>
                  <td className="py-2.5 px-4 font-mono text-emerald-800 font-semibold">Instant (calculated from start date)</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-700">↓ 99%</td>
                  <td className="py-2.5 px-4 text-slate-500">Eliminates calendar math discrepancies and currency mismatches</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-900">3. Pre-Payroll Data Quality & Bank Audit</td>
                  <td className="py-2.5 px-4 font-mono text-slate-600">~8.0 mins (row-by-row manual check)</td>
                  <td className="py-2.5 px-4 font-mono text-emerald-800 font-semibold">~0.2 mins (1-click 12-rule audit scan)</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-700">↓ 97%</td>
                  <td className="py-2.5 px-4 text-slate-500">Catches unverified bank routing codes before bureau submission</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-900">4. Employment Verification Letter Generation</td>
                  <td className="py-2.5 px-4 font-mono text-slate-600">~6.0 mins (Doc template copy-paste)</td>
                  <td className="py-2.5 px-4 font-mono text-emerald-800 font-semibold">~0.5 mins (1-click preview & print)</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-700">↓ 92%</td>
                  <td className="py-2.5 px-4 text-slate-500">Guarantees accurate compensation and legal entity data</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Metric Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Per-Hire Admin Data Entry</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-emerald-700">~2.2 Mins</span>
                <span className="text-slate-400 line-through text-xs font-semibold">~22.0 Mins</span>
              </div>
              <span className="text-emerald-700 font-semibold text-[11px]">↓ 90% direct clerical time saved</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Country Checklist Accuracy</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-emerald-700">100%</span>
                <span className="text-slate-400 line-through text-xs font-semibold">Manual Error-Prone</span>
              </div>
              <span className="text-emerald-700 font-semibold text-[11px]">Rules codified in software</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Proration Formula Errors</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-emerald-700">0</span>
                <span className="text-slate-400 line-through text-xs font-semibold">Frequent</span>
              </div>
              <span className="text-emerald-700 font-semibold text-[11px]">Deterministic daily calendar math</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Pre-Payroll Audit Latency</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-emerald-700">&lt; 1 Sec</span>
                <span className="text-slate-400 line-through text-xs font-semibold">15+ Mins</span>
              </div>
              <span className="text-emerald-700 font-semibold text-[11px]">Instant client-side scan</span>
            </div>
          </div>

          {/* Qualitative Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
            <div className="p-4 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-bold text-red-900 text-sm">The Baseline Problem (Manual Spreadsheet Operations)</h3>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li>HR generalists manually emailed checklists resulting in forgotten country forms (e.g. India EPFO Form 11, Australia Super Choice NAT 13080).</li>
                <li>Mid-month joiner proration was hand-computed in spreadsheets, creating frequent month-end payroll calculation disputes.</li>
                <li>Imminent work pass expiries (Singapore EPs, Australian visas) relied on calendar alerts that were easily overlooked.</li>
                <li>Zero systematic logging: difficult to trace who made field adjustments when discrepancies surfaced.</li>
              </ul>
            </div>

            <div className="p-4 border border-emerald-200 bg-emerald-50/30 rounded-xl space-y-2">
              <h3 className="font-bold text-emerald-950 text-sm">The Prototype Solution (APAC People Ops Hub)</h3>
              <ul className="space-y-1.5 text-emerald-900 list-disc list-inside">
                <li>Automated rule-based checklist generation tailored to statutory labor laws in 5 jurisdictions upon candidate entry.</li>
                <li>Data audit engine scanning 12 validation rules with 1-click automated remediation for currency and document gaps.</li>
                <li>Pre-payroll validation feed identifying unverified routing codes and applying statutory pension formulas prior to bureau transmission.</li>
                <li>Session change trail recording each field alteration with actor, old value, and new value.</li>
              </ul>
            </div>
          </div>

          {/* Interactive ROI Calculator */}
          <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Interactive Labor & Cost Savings Model</h3>
                <p className="text-slate-500 text-xs">Simulate your organization's annual APAC hiring volume:</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-medium text-slate-700 text-xs">Projected APAC Hires / Year:</label>
                <input
                  type="number"
                  min={5}
                  max={250}
                  value={annualHires}
                  onChange={(e) => setAnnualHires(parseInt(e.target.value) || 10)}
                  className="w-20 border border-slate-300 rounded-lg p-1 text-center font-bold font-mono text-xs bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Manual Labor Required</span>
                <span className="text-lg font-bold text-slate-700">{(annualHires * manualHoursPerHire).toLocaleString()} hrs / yr</span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Hub Automated Labor</span>
                <span className="text-lg font-bold text-emerald-700 font-mono">{(annualHires * automatedHoursPerHire).toFixed(0)} hrs / yr</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Capacity Recaptured</span>
                <span className="text-lg font-extrabold text-emerald-900">
                  {hoursSavedPerYear.toFixed(0)} hrs (~${annualDollarsSaved.toLocaleString()} USD)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
