import React, { useState } from 'react';
import { 
  Employee, 
  AuditIssue, 
  UserRole, 
  AuditLogEntry, 
  APACCountry 
} from '../types/hr';
import { runWorkforceAudit, AuditSummary } from '../utils/auditEngine';
import { 
  ShieldAlert, 
  RefreshCw, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Wrench, 
  FileText, 
  Trash2, 
  Lock, 
  Filter, 
  Info,
  Clock
} from 'lucide-react';

interface AuditToolProps {
  employees: Employee[];
  currentRole: UserRole;
  onUpdateEmployee: (updated: Employee, logEntry: AuditLogEntry) => void;
  onBatchUpdateEmployees: (updatedList: Employee[], logEntries: AuditLogEntry[]) => void;
}

export const AuditTool: React.FC<AuditToolProps> = ({
  employees,
  currentRole,
  onUpdateEmployee,
  onBatchUpdateEmployees,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'issues' | 'retention' | 'report'>('issues');
  const [isScanning, setIsScanning] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Compute live audit findings
  const auditSummary: AuditSummary = runWorkforceAudit(employees);

  const handleTriggerRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 400);
  };

  const handleAutoRemediate = (issue: AuditIssue) => {
    const emp = employees.find(e => e.id === issue.employeeId);
    if (!emp) return;

    let updated = { ...emp };
    let logField = issue.title;
    let oldVal = 'Non-compliant';
    let newVal = 'Remediated';

    // 1. Currency mismatch fix
    if (issue.category === 'Field Inconsistency' && issue.title.includes('Currency Inconsistency')) {
      const correctCurrencies: Record<APACCountry, string> = {
        India: 'INR',
        Singapore: 'SGD',
        Australia: 'AUD',
        Japan: 'JPY',
        Philippines: 'PHP',
      };
      oldVal = `${emp.salary.currency} ${emp.salary.amount}`;
      updated.salary = {
        ...emp.salary,
        currency: correctCurrencies[emp.country],
      };
      newVal = `${updated.salary.currency} ${updated.salary.amount}`;
      logField = 'Remediated Currency Alignment';
    }

    // 2. Bank details verification
    else if (issue.category === 'Payroll Pre-condition' && issue.title.includes('Bank Account')) {
      oldVal = 'Unverified';
      newVal = 'Verified (Penny-Drop Test Succeeded)';
      updated.bankDetails = {
        ...emp.bankDetails,
        verified: true,
      };
      logField = 'Bank Account Verification';
    }

    // 3. Missing PF Form 11 or Super choice
    else if (issue.id.includes('pf')) {
      oldVal = 'Missing Form 11';
      newVal = 'E-sign Dispatch & Upload Complete';
      if (updated.statutory.india) {
        updated.statutory.india = {
          ...updated.statutory.india,
          pfForm11Uploaded: true,
          pfUan: updated.statutory.india.pfUan || '101999888777',
        };
      }
      logField = 'Statutory EPFO Form 11 Resolution';
    } else if (issue.id.includes('super')) {
      oldVal = 'Missing Superannuation Choice Form';
      newVal = 'AustralianSuper Nominated (USI STA0100AU)';
      if (updated.statutory.australia) {
        updated.statutory.australia = {
          ...updated.statutory.australia,
          superFundName: 'AustralianSuper',
          superUsi: 'STA0100AU',
        };
      }
      logField = 'ATO Superannuation Standard Choice Remediation';
    } else if (issue.id.includes('pdpa')) {
      oldVal = 'Missing PDPA Consent';
      newVal = 'PDPA Employee Consent Executed';
      if (updated.statutory.singapore) {
        updated.statutory.singapore = {
          ...updated.statutory.singapore,
          pdpaConsentSigned: true,
        };
      }
      logField = 'Singapore PDPA Consent Form Executed';
    } else if (issue.id.includes('retention')) {
      // PII field anonymization and placeholder redaction
      oldVal = `${emp.firstName} ${emp.lastName} (Unredacted PII)`;
      updated = {
        ...emp,
        firstName: 'Anonymized',
        lastName: 'Former Employee',
        personalEmail: 'redacted.gdpr@example.com',
        workEmail: 'redacted.gdpr@example.com',
        emergencyContact: { name: 'REDACTED', relationship: 'REDACTED', phone: 'REDACTED' },
        retentionCategory: 'Standard 7-Yr Statutory Hold',
        notes: 'Personal identifiers anonymized in state under GDPR Article 17 / Singapore PDPA retention policy.',
      };
      newVal = 'Redacted & Anonymized for Statutory Audit Archive';
      logField = 'GDPR Article 17 Right to Erasure Execution';
    } else if (issue.id.includes('prob')) {
      oldVal = 'In Probation (Overdue)';
      newVal = 'Confirmed (Line Manager Sign-off Logged)';
      updated.probationStatus = 'Confirmed';
      logField = 'Probation Period Confirmed';
    }

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actorName: currentRole,
      actorRole: currentRole,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      actionType: 'Audit Remediation',
      fieldChanged: logField,
      oldValue: oldVal,
      newValue: newVal,
      justification: `One-click automated audit remediation for rule: ${issue.title}`,
    };

    onUpdateEmployee(updated, log);
  };

  const handlePurgeExpiredRecords = () => {
    const expiredList = employees.filter(
      e => e.status === 'Terminated' && e.retentionCategory === 'Eligible for GDPR/PDPA Purge'
    );
    if (expiredList.length === 0) return;

    const updatedList = employees.map(emp => {
      if (emp.status === 'Terminated' && emp.retentionCategory === 'Eligible for GDPR/PDPA Purge') {
        return {
          ...emp,
          firstName: 'Anonymized',
          lastName: 'Ex-Employee',
          personalEmail: 'purged@gdpr.internal',
          workEmail: 'purged@gdpr.internal',
          emergencyContact: { name: 'PURGED', relationship: 'PURGED', phone: 'PURGED' },
          retentionCategory: 'Standard 7-Yr Statutory Hold' as const,
          notes: 'Full PII anonymization completed under GDPR Article 17.',
        };
      }
      return emp;
    });

    const logs: AuditLogEntry[] = expiredList.map(e => ({
      id: `log-purge-${Date.now()}-${e.id}`,
      timestamp: new Date().toLocaleString(),
      actorName: currentRole,
      actorRole: currentRole,
      employeeId: e.id,
      employeeName: `${e.firstName} ${e.lastName}`,
      actionType: 'Retention Archive',
      fieldChanged: 'Automated GDPR / PDPA Data Purge',
      oldValue: 'Unredacted separated employee record',
      newValue: 'Anonymized record with minimal tax audit metadata',
      justification: 'Statutory 7-year retention elapsed; compliance purge executed.',
    }));

    onBatchUpdateEmployees(updatedList, logs);
  };

  const filteredIssues = auditSummary.issues.filter(issue => {
    if (selectedSeverity !== 'All' && issue.severity !== selectedSeverity) return false;
    if (selectedCategory !== 'All' && issue.category !== selectedCategory) return false;
    return true;
  });

  const generateReportText = () => {
    return `# APAC People Ops Hub — Workforce Data Audit & Compliance Report
Generated on: 2026-10-08 | Scope: Remote APAC Workforce (India, Singapore, Australia, Japan, Philippines)
Auditor Role: ${currentRole}

================================================================================
EXECUTIVE SUMMARY
================================================================================
Total Records Audited:      ${auditSummary.totalEmployeesScanned}
Overall Workforce Health Score: ${auditSummary.healthScore} / 100
Total Compliance Anomalies: ${auditSummary.totalIssuesFound}
- Critical Severity:        ${auditSummary.criticalIssues}
- High Severity:            ${auditSummary.highIssues}
- Medium Severity:          ${auditSummary.mediumIssues}
- Low Severity:             ${auditSummary.lowIssues}

================================================================================
BREAKDOWN BY CATEGORY
================================================================================
${Object.entries(auditSummary.categoryBreakdown)
  .map(([cat, count]) => `- ${cat}: ${count} issue(s)`)
  .join('\n')}

================================================================================
DETAILED AUDIT FINDINGS & REMEDIATION ACTIONS
================================================================================
${auditSummary.issues
  .map(
    (i, idx) =>
      `[${idx + 1}] [${i.severity.toUpperCase()}] ${i.title}
   Employee: ${i.employeeName} (${i.country})
   Category: ${i.category}
   Description: ${i.description}
   Remediation: ${i.remediationAction}
`
  )
  .join('\n')}

================================================================================
DATA PROTECTION & PRIVACY STATEMENT (GDPR / PDPA / PRIVACY ACT 1988)
================================================================================
All personal data is processed under legitimate interest for employment administration.
Access to compensation and statutory tax identifiers is restricted to authorized HR Ops roles.
Separated employee files are subject to scheduled anonymization upon expiration of statutory 
tax recordkeeping mandates.
`;
  };

  const handleCopyReport = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleDownloadReport = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `APAC-People-Ops-Audit-Report-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Data Audit Tool & Privacy Guard
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Automated compliance scanner flagging missing statutory forms, field inconsistencies, expiring work passes, and GDPR retention risks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerRescan}
              disabled={isScanning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Run Live Workforce Audit'}</span>
            </button>

            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Audit Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Health Score & Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Health Score */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Workforce Health Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-3xl font-extrabold ${
              auditSummary.healthScore >= 90
                ? 'text-emerald-700'
                : auditSummary.healthScore >= 75
                ? 'text-amber-700'
                : 'text-red-700'
            }`}>
              {auditSummary.healthScore}
            </span>
            <span className="text-slate-400 text-xs font-semibold">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {auditSummary.healthScore >= 90
              ? 'Excellent audit integrity'
              : 'Remediation needed prior to payroll'}
          </p>
        </div>

        {/* Critical */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Critical</span>
            <AlertOctagon className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-700 mt-1">{auditSummary.criticalIssues}</div>
          <p className="text-[11px] text-slate-500">Immediate legal/payroll blockers</p>
        </div>

        {/* High */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">High Severity</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{auditSummary.highIssues}</div>
          <p className="text-[11px] text-slate-500">Missing statutory forms & taxes</p>
        </div>

        {/* Medium */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Medium Severity</span>
            <Info className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{auditSummary.mediumIssues}</div>
          <p className="text-[11px] text-slate-500">Overdue reviews & acknowledgments</p>
        </div>

        {/* Total Scanned */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Audited Records</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{auditSummary.totalEmployeesScanned}</div>
          <p className="text-[11px] text-slate-500">Across 5 APAC jurisdictions</p>
        </div>
      </div>

      {/* Unified Tab & Content Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Sub Tabs */}
        <div className="border-b border-slate-200 bg-slate-50/75 px-5 pt-3 flex space-x-4 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('issues')}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'issues'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Flagged Compliance Issues ({auditSummary.totalIssuesFound})
          </button>

          <button
            onClick={() => setActiveTab('retention')}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'retention'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            GDPR & APAC Data Retention Matrix
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'report'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Audit Report Preview (Markdown)
          </button>
        </div>

        {/* Content based on sub-tab */}
        {activeTab === 'issues' && (
          <div className="p-5 space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500 font-medium">Filter by:</span>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg p-1.5 bg-slate-50 text-slate-800 font-medium"
                >
                  <option value="All">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg p-1.5 bg-slate-50 text-slate-800 font-medium"
                >
                  <option value="All">All Categories</option>
                  <option value="Missing Statutory Document">Missing Statutory Document</option>
                  <option value="Field Inconsistency">Field Inconsistency</option>
                  <option value="Contract & Visa Expiry">Contract & Visa Expiry</option>
                  <option value="Privacy & Retention">Privacy & Retention (GDPR)</option>
                  <option value="Payroll Pre-condition">Payroll Pre-condition</option>
                  <option value="Duplicate / Unverified">Duplicate / Unverified</option>
                </select>
              </div>

              <span className="text-xs text-slate-500 font-mono">
                Showing {filteredIssues.length} of {auditSummary.totalIssuesFound} findings
              </span>
            </div>

          {/* Issues List */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {filteredIssues.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                No issues match the selected filter criteria. All checked records are compliant.
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div key={issue.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            issue.severity === 'Critical'
                              ? 'bg-red-100 text-red-800'
                              : issue.severity === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : issue.severity === 'Medium'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {issue.severity}
                        </span>

                        <span className="text-xs font-bold text-slate-900">{issue.title}</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{issue.description}</p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span>
                          Target: <strong className="text-slate-800">{issue.employeeName}</strong> ({issue.country})
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Category: {issue.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>Detected: {issue.detectedAt}</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 mt-2 flex items-start gap-2">
                        <Wrench className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900">Recommended Remediation:</strong>{' '}
                          {issue.remediationAction}
                        </div>
                      </div>
                    </div>

                    {/* Auto Fix Button */}
                    <div className="shrink-0 pt-1">
                      {issue.autoFixable ? (
                        <button
                          onClick={() => handleAutoRemediate(issue)}
                          className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>1-Click Auto-Remediate</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Manual Legal/Filing Step</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Retention Matrix */}
      {activeTab === 'retention' && (
        <div className="p-5 space-y-6 text-xs text-slate-800">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">
              GDPR Article 17 ("Right to Erasure") & APAC Statutory Retention Schedule
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Employment data cannot be kept indefinitely. While GDPR Article 17 grants individuals the right to have personal data erased, Article 17(3)(b) recognizes that data must be retained to comply with legal obligations (e.g. tax, payroll, superannuation, and social security audits).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">APAC Legal Retention Thresholds</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex justify-between py-1 border-b border-slate-100">
                  <span>🇦🇺 Australia (ATO & Fair Work)</span>
                  <strong className="text-slate-800">7 Years (Tax Act Sec 262A)</strong>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-100">
                  <span>🇸🇬 Singapore (IRAS & CPF Board)</span>
                  <strong className="text-slate-800">5 Years (Income Tax Act Sec 67)</strong>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-100">
                  <span>🇮🇳 India (Income Tax & EPFO)</span>
                  <strong className="text-slate-800">8 Years (IT Act Sec 44AA)</strong>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-100">
                  <span>🇯🇵 Japan (Labor Standards & Tax)</span>
                  <strong className="text-slate-800">5 Years (Labor Standards Act)</strong>
                </li>
              </ul>
            </div>

            <div className="p-4 border border-amber-200 bg-amber-50/50 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Trash2 className="w-4 h-4 text-amber-700" />
                <span>Automated Anonymization & Purge Engine</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                Employees separated more than 7 years ago whose statutory tax audit period has elapsed are automatically flagged for PII redaction. Direct personal identifiers (names, emails, emergency contacts) are scrubbed and replaced with anonymous tokens in memory while preserving statutory tax audit records.
              </p>
              <button
                onClick={handlePurgeExpiredRecords}
                className="px-3.5 py-1.5 text-xs font-semibold bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors shadow-xs"
              >
                Execute GDPR Retention Purge Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Report Preview */}
      {activeTab === 'report' && (
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              Raw Output for Legal & Leadership Reporting
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyReport}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white hover:bg-slate-50 text-slate-700 transition-colors"
              >
                {copiedReport ? '✓ Copied to Clipboard' : 'Copy Markdown'}
              </button>
              <button
                onClick={handleDownloadReport}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Download .MD File
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed max-h-[500px]">
            {generateReportText()}
          </pre>
        </div>
      )}
      </div>
    </div>
  );
};
