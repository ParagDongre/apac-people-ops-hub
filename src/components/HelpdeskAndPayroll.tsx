import React, { useState } from 'react';
import { 
  Employee, 
  HelpdeskFAQ, 
  APACCountry, 
  UserRole, 
  AuditLogEntry 
} from '../types/hr';
import { HELPDESK_FAQS } from '../data/mockData';
import { generateMonthlyPayrollFeed, exportPayrollCsv } from '../utils/payrollEngine';
import { 
  HelpCircle, 
  Receipt, 
  Search, 
  Send, 
  FileText, 
  DollarSign, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Laptop, 
  ChevronDown, 
  ChevronUp, 
  Bot,
  Building
} from 'lucide-react';

interface HelpdeskAndPayrollProps {
  employees: Employee[];
  currentRole: UserRole;
  onOpenVerificationLetter: (emp: Employee) => void;
  onLogAudit: (log: AuditLogEntry) => void;
}

export const HelpdeskAndPayroll: React.FC<HelpdeskAndPayrollProps> = ({
  employees,
  currentRole,
  onOpenVerificationLetter,
  onLogAudit,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'helpdesk' | 'payroll'>('payroll');
  
  // Helpdesk States
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCountry, setFaqCountry] = useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string>('faq-1');
  const [userQuery, setUserQuery] = useState('');
  const [chatResponse, setChatResponse] = useState<string | null>(null);

  // Purchase Order / WFH Request States
  const [poEmployeeId, setPoEmployeeId] = useState(employees[0]?.id || '');
  const [poItemName, setPoItemName] = useState('Ergonomic Monitor Arm & Keyboard');
  const [poAmount, setPoAmount] = useState(250);
  const [poCategory, setPoCategory] = useState('Home Office Ergonomics');
  const [poSubmitted, setPoSubmitted] = useState(false);

  // Payroll Calculations
  const payrollFeed = generateMonthlyPayrollFeed(employees);
  const readyCount = payrollFeed.filter(p => p.status === 'Ready').length;
  const warningCount = payrollFeed.filter(p => p.status === 'Warning').length;
  const blockedCount = payrollFeed.filter(p => p.status === 'Blocked').length;

  const handleDownloadCsv = () => {
    const csv = exportPayrollCsv(payrollFeed, employees);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `APAC-Payroll-Feed-October-2026.csv`;
    a.click();
    URL.revokeObjectURL(url);

    onLogAudit({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actorName: currentRole,
      actorRole: currentRole,
      employeeId: 'system',
      employeeName: 'All APAC Staff',
      actionType: 'Payroll Adjustment',
      fieldChanged: 'Monthly Payroll Feed Exported',
      oldValue: 'Pre-validation queue',
      newValue: `Generated CSV for ${payrollFeed.length} records (${blockedCount} blocked)`,
      justification: 'October 2026 pre-payroll validation export to payroll bureau.',
    });
  };

  const handleAskHelpdesk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const q = userQuery.toLowerCase();
    let reply = '';

    if (q.includes('leave') || q.includes('holiday') || q.includes('annual')) {
      reply = `All full-time remote APAC employees receive 20 days paid annual leave per year, plus statutory sick leave and official regional public holidays for their declared country. You can log leaves directly in your HRIS profile.`;
    } else if (q.includes('wfh') || q.includes('desk') || q.includes('chair') || q.includes('equipment') || q.includes('reimburse')) {
      reply = `You have a one-time $1,000 USD WFH setup allowance plus a recurring $75 USD/month connectivity stipend. You can submit equipment purchase receipts in the "WFH Equipment & Purchase Order" tab below!`;
    } else if (q.includes('letter') || q.includes('verification') || q.includes('visa') || q.includes('mortgage')) {
      reply = `Employment Verification Letters are generated automatically with official company letterhead, verified compensation, and corporate seal! Click the "Generate Verification Letter" button to preview and download yours.`;
    } else if (q.includes('probation') || q.includes('confirm')) {
      reply = `Standard APAC probation is 90 days. Check-in milestones are held at 30 days and 60 days, followed by the line manager confirmation review at Day 90. Notice period during probation is 14 days.`;
    } else if (q.includes('super') || q.includes('cpf') || q.includes('pf') || q.includes('pension')) {
      reply = `Statutory retirement contributions are remitted automatically according to local labor laws: 12.0% Super in Australia (legislated rate from 1 July 2025), CPF in Singapore (up to 17% employer / 20% employee, S$8,000 OW ceiling as of 2026), EPFO in India (12%), and Shakai Hoken in Japan.`;
    } else {
      reply = `Thank you for your inquiry. According to Remote APAC People Operations policy, this query has been matched against handbook guidelines for your territory. For specialized tax or visa advisory, please raise a ticket to people-ops@example.com.`;
    }

    setChatResponse(reply);
  };

  const handlePoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPoSubmitted(true);
    const emp = employees.find(e => e.id === poEmployeeId);

    onLogAudit({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actorName: emp ? `${emp.firstName} ${emp.lastName}` : 'Employee',
      actorRole: 'People Generalist',
      employeeId: poEmployeeId,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : 'Employee',
      actionType: 'Create',
      fieldChanged: 'WFH Purchase Order Request Submitted',
      oldValue: 'null',
      newValue: `$${poAmount} USD for ${poItemName} (${poCategory})`,
      justification: 'Remote home office ergonomic stipend claim.',
    });

    setTimeout(() => {
      setPoSubmitted(false);
      setPoItemName('');
      setPoAmount(150);
    }, 3000);
  };

  const filteredFaqs = HELPDESK_FAQS.filter(faq => {
    const matchesCountry = faqCountry === 'All' || faq.countries.includes('All') || faq.countries.includes(faqCountry as any);
    const matchesSearch =
      faqSearch === '' ||
      faq.title.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.summary.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Employee Helpdesk & Payroll Validation Feed
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Localized policy knowledge base, self-service employment letters, and pre-payroll validation catching calculation errors before transmission.
            </p>
          </div>

          <div className="inline-flex rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setActiveSubTab('payroll')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'payroll'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Pre-Payroll Validation ({payrollFeed.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('helpdesk')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'helpdesk'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Helpdesk & Self-Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: Pre-Payroll Validation Feed */}
      {activeSubTab === 'payroll' && (
        <div className="space-y-6">
          {/* Payroll Cycle Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Cycle & Cutoff</span>
              <div className="text-base font-bold text-slate-900 mt-1">October 2026 Run</div>
              <p className="text-[11px] text-slate-500">Transmission cutoff: Oct 25, 2026</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Ready Records</span>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-emerald-700 mt-1">{readyCount}</div>
              <p className="text-[11px] text-slate-500">Cleared all statutory & bank checks</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Warning Flags</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-amber-700 mt-1">{warningCount}</div>
              <p className="text-[11px] text-slate-500">Prorated joiners & unpaid leave</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Blocked Records</span>
                <XCircle className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-red-700 mt-1">{blockedCount}</div>
              <p className="text-[11px] text-slate-500">Missing bank / missing tax identifiers</p>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Monthly Pre-Payroll Validation Feed
                </h3>
                <p className="text-xs text-slate-500">
                  Performs automatic prorations for mid-month joiners, computes unpaid leave deductions, and flags unverified bank routing codes before transmission to payroll bureau (Deel / Remote).
                </p>
                <div className="mt-1 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                  <strong>Statutory Model Note:</strong> Rates reflect 2026 standards (Australia Super 12.0%, Singapore CPF OW Ceiling S$8,000). Net payout reflects an <em>estimate pre-income tax withholding</em> (PAYG/TDS calculated at bureau transmission). Verify against local revenue authorities before live payroll processing.
                </div>
              </div>

              <button
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs shrink-0 self-start sm:self-center"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Bureau Feed (CSV)</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Country & Dept</th>
                    <th className="py-3 px-4">Monthly Base</th>
                    <th className="py-3 px-4">Adjustments (Proration/LWP)</th>
                    <th className="py-3 px-4">Statutory Ded / Contribution</th>
                    <th className="py-3 px-4">Est. Net (Pre-Tax)</th>
                    <th className="py-3 px-4">Status & Flags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payrollFeed.map((item) => (
                    <tr key={item.employeeId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{item.employeeName}</div>
                        <div className="text-slate-500 font-mono text-[11px]">{item.employeeId}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{item.country}</div>
                        <div className="text-slate-500 text-[11px]">{item.department}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-semibold text-slate-900">
                          {item.currency} {item.baseSalary.toLocaleString()}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {item.proRatedAdjustment !== 0 && (
                          <div className="text-blue-700">
                            Proration: {item.currency} {item.proRatedAdjustment.toLocaleString()}
                          </div>
                        )}
                        {item.unpaidLeaveDeduction > 0 && (
                          <div className="text-amber-700">
                            LWP: -{item.currency} {item.unpaidLeaveDeduction.toLocaleString()}
                          </div>
                        )}
                        {item.proRatedAdjustment === 0 && item.unpaidLeaveDeduction === 0 && (
                          <span className="text-slate-400">Standard Full Period</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="text-slate-700">
                          Employee Ded: {item.currency} {item.statutoryContributionEmployee.toLocaleString()}
                        </div>
                        <div className="text-slate-500">
                          Employer: {item.currency} {item.statutoryContributionEmployer.toLocaleString()}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {item.currency} {item.netPayable.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              item.status === 'Ready'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'Warning'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        {item.flags.length > 0 && (
                          <div className="text-[10px] text-slate-600 mt-1 max-w-[220px]">
                            {item.flags.map((f, i) => (
                              <div key={i} className="truncate" title={f}>• {f}</div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Helpdesk & Self-Service */}
      {activeSubTab === 'helpdesk' && (
        <div className="space-y-6">
          {/* Ask Policy Assistant Widget */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Policy FAQ Keyword Assistant (Client-Side Search)
                </h3>
                <p className="text-xs text-slate-500">
                  Keyword matching for statutory leave entitlements, WFH allowances, notice periods, and benefits across APAC.
                </p>
              </div>
            </div>

            <form onSubmit={handleAskHelpdesk} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask a policy question: e.g. 'How does WFH allowance work?' or 'What is statutory annual leave in Australia?'"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="flex-1 text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ask Assistant</span>
              </button>
            </form>

            {chatResponse && (
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2 animate-fade-in text-xs">
                <span className="font-bold text-emerald-950 block">People Ops Policy Resolution:</span>
                <p className="text-emerald-900 leading-relaxed whitespace-pre-line">{chatResponse}</p>
              </div>
            )}
          </div>

          {/* Quick Actions Cluster: Verification Letter & WFH Claim */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Action 1: Employment Verification Letter */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Official Employment Verification Letter</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Need verification for a mortgage, apartment lease, banking, or consular visa? Generate a digitally sealed, official letter with your tenure and compensation on registered entity letterhead.
              </p>
              <button
                onClick={() => onOpenVerificationLetter(employees[0])}
                className="px-3.5 py-2 text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors shadow-xs"
              >
                Launch Verification Letter Generator
              </button>
            </div>

            {/* Action 2: Purchase Order / WFH Request */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">WFH Equipment Purchase Order Request</h3>
              </div>

              {poSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium">
                  ✓ Purchase order request submitted and logged into the HRIS change audit trail! Reimbursed in next payroll run.
                </div>
              ) : (
                <form onSubmit={handlePoSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Employee</label>
                      <select
                        value={poEmployeeId}
                        onChange={(e) => setPoEmployeeId(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-1.5 bg-slate-50 text-xs"
                      >
                        {employees.map(e => (
                          <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.country})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Expense Category</label>
                      <select
                        value={poCategory}
                        onChange={(e) => setPoCategory(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-1.5 bg-slate-50 text-xs"
                      >
                        <option value="Home Office Ergonomics">Ergonomic Desk / Chair</option>
                        <option value="Monitors & Tech Peripherals">External Monitor / Keyboard</option>
                        <option value="Noise-Canceling Headset">Audio & Headset</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Item Description</label>
                      <input
                        type="text"
                        required
                        value={poItemName}
                        onChange={(e) => setPoItemName(e.target.value)}
                        placeholder="e.g. Dell 27-inch 4K Monitor"
                        className="w-full border border-slate-200 rounded-lg p-1.5 bg-slate-50 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Claim Amount ($ USD)</label>
                      <input
                        type="number"
                        required
                        min={10}
                        max={1000}
                        value={poAmount}
                        onChange={(e) => setPoAmount(parseInt(e.target.value) || 0)}
                        className="w-full border border-slate-200 rounded-lg p-1.5 bg-slate-50 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
                  >
                    Submit WFH Stipend Claim
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* APAC Policies Knowledge Base */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  APAC People Operations Knowledge Base
                </h3>
                <p className="text-xs text-slate-500">
                  Searchable statutory guidelines across India, Singapore, Australia, Japan, and the Philippines.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-900"
                />

                <select
                  value={faqCountry}
                  onChange={(e) => setFaqCountry(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 font-medium"
                >
                  <option value="All">All Territories</option>
                  <option value="India">🇮🇳 India</option>
                  <option value="Singapore">🇸🇬 Singapore</option>
                  <option value="Australia">🇦🇺 Australia</option>
                  <option value="Japan">🇯🇵 Japan</option>
                  <option value="Philippines">🇵🇭 Philippines</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;

                return (
                  <div key={faq.id} className="p-4">
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? '' : faq.id)}
                      className="w-full flex items-center justify-between text-left font-bold text-slate-900 hover:text-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        <span>{faq.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-normal">
                          {faq.category}
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    <p className="text-slate-500 text-[11px] mt-1">{faq.summary}</p>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
                        <div>{faq.answer}</div>
                        {faq.statutoryReference && (
                          <div className="text-[11px] text-slate-400 font-mono">
                            Statutory Reference: {faq.statutoryReference}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
