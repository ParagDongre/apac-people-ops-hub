import React, { useState } from 'react';
import { 
  Employee, 
  UserRole, 
  AuditLogEntry, 
  APACCountry 
} from '../types/hr';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  Calendar, 
  FileText, 
  History, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  Check, 
  Clock, 
  PlusCircle, 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  User 
} from 'lucide-react';

interface EmployeeDetailModalProps {
  employee: Employee;
  currentRole: UserRole;
  auditLogs: AuditLogEntry[];
  onClose: () => void;
  onUpdateEmployee: (updated: Employee, logEntry: AuditLogEntry) => void;
  onOpenVerificationLetter: (emp: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  currentRole,
  auditLogs,
  onClose,
  onUpdateEmployee,
  onOpenVerificationLetter,
}) => {
  const [activeTab, setActiveTab] = useState<'statutory' | 'comp' | 'leave' | 'onboarding' | 'history' | 'retention'>('statutory');
  
  // Local quick action states
  const [leaveDaysToDeduct, setLeaveDaysToDeduct] = useState(1);
  const [leaveType, setLeaveType] = useState<'annual' | 'sick' | 'statutorySpecial'>('annual');
  const [leaveNotes, setLeaveNotes] = useState('');

  const canEdit = currentRole === 'HR Ops Lead' || currentRole === 'People Generalist';
  const canViewSalary = currentRole === 'HR Ops Lead' || currentRole === 'People Generalist';

  const employeeLogs = auditLogs.filter(l => l.employeeId === employee.id);

  const countryFlags: Record<APACCountry, string> = {
    India: '🇮🇳 India',
    Singapore: '🇸🇬 Singapore',
    Australia: '🇦🇺 Australia',
    Japan: '🇯🇵 Japan',
    Philippines: '🇵🇭 Philippines',
  };

  const handleToggleTask = (taskId: string) => {
    if (!employee.onboardingTasks) return;
    const task = employee.onboardingTasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;
    const updatedTasks = employee.onboardingTasks.map(t =>
      t.id === taskId
        ? {
            ...t,
            completed: newCompleted,
            completedAt: newCompleted ? new Date().toISOString().split('T')[0] : undefined,
            completedBy: newCompleted ? `${currentRole}` : undefined,
          }
        : t
    );

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actorName: currentRole,
      actorRole: currentRole,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      actionType: 'Update',
      fieldChanged: `Onboarding Task: ${task.title}`,
      oldValue: task.completed ? 'Completed' : 'Pending',
      newValue: newCompleted ? 'Completed' : 'Pending',
      justification: 'Manual task status toggle in employee profile.',
    };

    onUpdateEmployee({ ...employee, onboardingTasks: updatedTasks }, log);
  };

  const handleVerifyBank = () => {
    const updated = {
      ...employee,
      bankDetails: {
        ...employee.bankDetails,
        verified: true,
      },
    };

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actorName: currentRole,
      actorRole: currentRole,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      actionType: 'Update',
      fieldChanged: 'Bank Account Verification Status',
      oldValue: 'Unverified',
      newValue: 'Verified (Penny-Drop Test Passed)',
      justification: 'Pre-payroll compliance verification completed.',
    };

    onUpdateEmployee(updated, log);
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const currentBalance = employee.leaveBalances[leaveType];
    const newBalance = Math.max(0, currentBalance - leaveDaysToDeduct);

    const updated = {
      ...employee,
      leaveBalances: {
        ...employee.leaveBalances,
        [leaveType]: newBalance,
      },
    };

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actorName: currentRole,
      actorRole: currentRole,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      actionType: 'Update',
      fieldChanged: `Leave Deduction: ${leaveType}`,
      oldValue: `${currentBalance} days`,
      newValue: `${newBalance} days (-${leaveDaysToDeduct} days)`,
      justification: leaveNotes || 'Approved time-off request recorded in HRIS.',
    };

    onUpdateEmployee(updated, log);
    setLeaveNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Banner */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-white shrink-0">
                {employee.firstName[0]}{employee.lastName[0]}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight">
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {employee.employeeNumber}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      employee.status === 'Active'
                        ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-800'
                        : employee.status === 'Onboarding'
                        ? 'bg-blue-900/60 text-blue-300 border border-blue-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {employee.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>{employee.jobTitle}</span>
                  <span aria-hidden="true">·</span>
                  <span>{employee.department}</span>
                  <span aria-hidden="true">·</span>
                  <span>{countryFlags[employee.country]} ({employee.city})</span>
                  <span aria-hidden="true">·</span>
                  <span>Reports to: {employee.lineManagerName}</span>
                </div>
              </div>
            </div>

            {/* Quick action button: Generate Verification Letter */}
            <div className="shrink-0">
              <button
                onClick={() => onOpenVerificationLetter(employee)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Verification Letter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 flex space-x-4 overflow-x-auto text-xs font-semibold no-scrollbar">
          <button
            onClick={() => setActiveTab('statutory')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'statutory'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Statutory & Compliance
          </button>
          <button
            onClick={() => setActiveTab('comp')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'comp'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Compensation & Banking
          </button>
          <button
            onClick={() => setActiveTab('leave')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'leave'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Leave & Balances
          </button>
          <button
            onClick={() => setActiveTab('onboarding')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'onboarding'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Onboarding Tasks ({employee.onboardingTasks?.filter(t => t.completed).length || 0}/{employee.onboardingTasks?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Change Trail ({employeeLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('retention')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'retention'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Data Retention & Privacy
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          {/* TAB 1: Statutory & Compliance */}
          {activeTab === 'statutory' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm mb-1">
                  Jurisdiction Profile: {countryFlags[employee.country]}
                </h3>
                <p className="text-slate-500">
                  Mandatory statutory identifiers, social security schemes, and mandatory labor filings required under local employment law.
                </p>
              </div>

              {/* India Profile */}
              {employee.country === 'India' && employee.statutory.india && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                    <span className="font-semibold text-slate-900 block text-xs">Tax & Identity Numbers</span>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">PAN (Income Tax)</span>
                      <span className="font-mono font-medium">{employee.statutory.india.pan || 'Missing'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Aadhaar (Last 4)</span>
                      <span className="font-mono font-medium">XXXX-XXXX-{employee.statutory.india.aadhaarLast4 || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">EPFO UAN</span>
                      <span className="font-mono font-medium">{employee.statutory.india.pfUan || 'Not Registered'}</span>
                    </div>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                    <span className="font-semibold text-slate-900 block text-xs">Statutory Filings Checklist</span>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">EPF Form 11 Declaration</span>
                      <span className={`font-semibold ${employee.statutory.india.pfForm11Uploaded ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {employee.statutory.india.pfForm11Uploaded ? '✓ Uploaded' : '✗ Missing'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Gratuity Form F Nomination</span>
                      <span className={`font-semibold ${employee.statutory.india.gratuityNominationFormF ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {employee.statutory.india.gratuityNominationFormF ? '✓ Executed' : '✗ Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">POSH Policy Acknowledgment</span>
                      <span className={`font-semibold ${employee.statutory.india.poshAcknowledged ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {employee.statutory.india.poshAcknowledged ? '✓ Certified' : '✗ Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500">Background Verification (BGV)</span>
                      <span className="font-semibold text-slate-800">{employee.statutory.india.bgvStatus}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Singapore Profile */}
              {employee.country === 'Singapore' && employee.statutory.singapore && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                    <span className="font-semibold text-slate-900 block text-xs">MOM & Pass Details</span>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Residency / Pass Type</span>
                      <span className="font-semibold text-slate-900">{employee.statutory.singapore.passType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">NRIC / FIN (Last 4)</span>
                      <span className="font-mono font-medium">SXXXX{employee.statutory.singapore.nricFinLast4}</span>
                    </div>
                    {employee.statutory.singapore.passExpiryDate && (
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Pass Expiration</span>
                        <span className="font-mono font-semibold text-amber-700">
                          {employee.statutory.singapore.passExpiryDate}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                    <span className="font-semibold text-slate-900 block text-xs">Statutory Obligations</span>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">CPF Contribution Scheme</span>
                      <span className="font-semibold text-slate-800">
                        {employee.statutory.singapore.cpfApplicable ? 'Mandatory (Citizen/PR)' : 'Exempt (EP holder)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">IRAS Auto-Inclusion (IR8A)</span>
                      <span className="font-semibold text-emerald-700">✓ Consented</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500">PDPA Data Processing Consent</span>
                      <span className={`font-semibold ${employee.statutory.singapore.pdpaConsentSigned ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {employee.statutory.singapore.pdpaConsentSigned ? '✓ Signed' : '✗ Missing'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Australia Profile */}
              {employee.country === 'Australia' && employee.statutory.australia && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                    <span className="font-semibold text-slate-900 block text-xs">Tax & Right to Work</span>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">TFN Declaration</span>
                      <span className="font-semibold text-slate-800">
                        {employee.statutory.australia.tfnProvided ? `Provided (Ends in ...${employee.statutory.australia.tfnLast3})` : '✗ Missing (Top Rate 47%)'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Fair Work Statement Ack</span>
                      <span className={`font-semibold ${employee.statutory.australia.fairWorkStatementAck ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {employee.statutory.australia.fairWorkStatementAck ? '✓ Acknowledged' : '✗ Pending Ack'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">VEVO Right-to-Work Check</span>
                      <span className="font-semibold text-emerald-700">✓ Verified</span>
                    </div>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                    <span className="font-semibold text-slate-900 block text-xs">Superannuation Fund Choice</span>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Super Fund</span>
                      <span className="font-semibold text-slate-900">{employee.statutory.australia.superFundName || '✗ Unspecified'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Fund USI</span>
                      <span className="font-mono text-slate-700">{employee.statutory.australia.superUsi || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">SG Guarantee Rate</span>
                      <span className="font-semibold text-slate-800">12.0% Mandatory (effective July 2025)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Japan Profile */}
              {employee.country === 'Japan' && employee.statutory.japan && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                    <span className="font-semibold text-slate-900 block text-xs">Social Insurance & Labor Laws</span>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Shakai Hoken (Health/Pension)</span>
                      <span className={`font-semibold ${employee.statutory.japan.shakaiHokenEnrolled ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {employee.statutory.japan.shakaiHokenEnrolled ? '✓ Enrolled' : '✗ Overdue'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Koyo Hoken (Employment Ins)</span>
                      <span className="font-semibold text-emerald-700">✓ Enrolled</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500">Article 36 Agreement (36協定)</span>
                      <span className="font-semibold text-emerald-700">✓ Signed</span>
                    </div>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                    <span className="font-semibold text-slate-900 block text-xs">Allowances & MyNumber</span>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">MyNumber Collection</span>
                      <span className={`font-semibold ${employee.statutory.japan.myNumberCollected ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {employee.statutory.japan.myNumberCollected ? '✓ Secured' : '✗ Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Remote/Commuter Allowance</span>
                      <span className="font-mono font-medium">¥{employee.statutory.japan.commuterAllowanceJpy.toLocaleString()}/mo</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents List */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-900 border-b border-slate-200">
                  Mandatory Statutory & Contract Documents ({employee.documents.length})
                </div>
                <div className="divide-y divide-slate-100">
                  {employee.documents.map(doc => (
                    <div key={doc.id} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{doc.name}</div>
                        <div className="text-[11px] text-slate-500">
                          Category: {doc.category} · {doc.uploadDate ? `Uploaded: ${doc.uploadDate}` : 'Pending upload'}
                        </div>
                      </div>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                          doc.status === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'Missing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Compensation & Banking */}
          {activeTab === 'comp' && (
            <div className="space-y-6">
              {!canViewSalary ? (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-2">
                  <Lock className="w-8 h-8 text-amber-600 mx-auto" />
                  <h4 className="font-bold text-slate-900 text-sm">Access Restricted</h4>
                  <p className="text-slate-600 max-w-md mx-auto">
                    Compensation figures are restricted to authorized People Operations personnel under the company Data Governance policy and GDPR.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-slate-500 block text-[11px] uppercase font-bold">Base Remuneration</span>
                      <div className="font-mono text-lg font-bold text-slate-900 mt-1">
                        {employee.salary.currency} {employee.salary.amount.toLocaleString()}
                      </div>
                      <span className="text-slate-500 text-[11px]">{employee.salary.frequency} frequency</span>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-slate-500 block text-[11px] uppercase font-bold">Monthly Equivalence</span>
                      <div className="font-mono text-lg font-bold text-slate-900 mt-1">
                        {employee.salary.currency}{' '}
                        {employee.salary.frequency === 'Annual'
                          ? Math.round(employee.salary.amount / 12).toLocaleString()
                          : employee.salary.amount.toLocaleString()}
                      </div>
                      <span className="text-slate-500 text-[11px]">Gross monthly rate</span>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-slate-500 block text-[11px] uppercase font-bold">WFH Connectivity Stipend</span>
                      <div className="font-mono text-lg font-bold text-slate-900 mt-1">
                        $75 USD / mo
                      </div>
                      <span className="text-slate-500 text-[11px]">Tax-free remote allowance</span>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="p-4 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">Disbursement Banking Information</h4>
                      {employee.bankDetails.verified ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Verified for Automated Payroll</span>
                        </span>
                      ) : (
                        <button
                          onClick={handleVerifyBank}
                          className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
                        >
                          Mark Bank Account Verified
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                      <div>
                        <span className="text-slate-400 block">Bank Name</span>
                        <span className="font-medium text-slate-800">{employee.bankDetails.bankName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Routing / IFSC / BSB</span>
                        <span className="font-mono font-medium text-slate-800">{employee.bankDetails.routingCode}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Account Number</span>
                        <span className="font-mono font-medium text-slate-800">•••• •••• {employee.bankDetails.accountLast4}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: Leave & Balances */}
          {activeTab === 'leave' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-slate-500 text-[11px] uppercase font-bold block">Annual Paid Leave</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{employee.leaveBalances.annual}</div>
                  <span className="text-slate-500 text-[11px]">Days Available</span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-slate-500 text-[11px] uppercase font-bold block">Sick / Medical Leave</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{employee.leaveBalances.sick}</div>
                  <span className="text-slate-500 text-[11px]">Days Available</span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-slate-500 text-[11px] uppercase font-bold block">Statutory Special Leave</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{employee.leaveBalances.statutorySpecial}</div>
                  <span className="text-slate-500 text-[11px]">Casual / Carer's / Public</span>
                </div>
              </div>

              {/* Log Leave Form */}
              <div className="p-4 border border-slate-200 rounded-xl space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Record Approved Time Off / Deduct Leave</h4>
                <form onSubmit={handleApplyLeave} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="text-slate-600 block text-[11px] font-medium mb-1">Leave Category</label>
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value as any)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800"
                    >
                      <option value="annual">Annual Leave</option>
                      <option value="sick">Sick Leave</option>
                      <option value="statutorySpecial">Statutory Special Leave</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 block text-[11px] font-medium mb-1">Number of Days</label>
                    <input
                      type="number"
                      min={0.5}
                      step={0.5}
                      max={20}
                      value={leaveDaysToDeduct}
                      onChange={(e) => setLeaveDaysToDeduct(parseFloat(e.target.value) || 1)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block text-[11px] font-medium mb-1">Approval Note / Reason</label>
                    <input
                      type="text"
                      placeholder="e.g. Approved by line manager on Slack"
                      value={leaveNotes}
                      onChange={(e) => setLeaveNotes(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 px-3 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
                    >
                      Deduct & Log in HRIS
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: Onboarding Tasks */}
          {activeTab === 'onboarding' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {countryFlags[employee.country]} Onboarding Workflow
                  </h4>
                  <p className="text-slate-500">
                    Automated checklist generated on {employee.startDate} based on jurisdictional requirements.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {employee.onboardingTasks?.map(task => (
                  <div key={task.id} className="p-3.5 flex items-start gap-3 hover:bg-slate-50/70 transition-colors">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        task.completed
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                          {task.title}
                        </span>
                        {task.isStatutoryMandatory && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase bg-amber-100 text-amber-800">
                            Statutory Mandatory
                          </span>
                        )}
                      </div>

                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        {task.guidanceNotes}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                        <span>Owner: <strong className="text-slate-600">{task.owner}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Due: <strong className="text-slate-600">{task.dueDate}</strong></span>
                        {task.completedAt && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-700">Completed on {task.completedAt}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Change History */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600">
                This timeline displays all logged modifications to this individual employee profile, demonstrating audit trail and change tracking principles.
              </div>

              {employeeLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  No modifications logged since profile creation.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {employeeLogs.map(log => (
                    <div key={log.id} className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-900">{log.actionType}: {log.fieldChanged}</div>
                        <span className="font-mono text-slate-400 text-[11px]">{log.timestamp}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="text-slate-500">From: <code className="text-slate-700">{log.oldValue}</code></div>
                        <div className="text-emerald-700 font-medium">To: <code className="text-emerald-900">{log.newValue}</code></div>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Actor: <strong>{log.actorName}</strong> ({log.actorRole}) · Justification: {log.justification || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Retention & Privacy */}
          {activeTab === 'retention' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Data Retention Policy Lifecycle</h4>
                <p className="text-slate-600 leading-relaxed">
                  In compliance with GDPR Article 17, Singapore PDPA, and the Australian Privacy Act 1988, personal data must only be retained as long as required by employment contracts or statutory recordkeeping mandates (e.g., 7 years for tax and payroll audits).
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Current Retention Classification:</span>
                  <span className="font-semibold text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                    {employee.retentionCategory}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Statutory Record Window:</span>
                  <span className="text-slate-800">
                    {employee.country === 'Australia' ? '7 Years (ATO Section 262A)' :
                     employee.country === 'Singapore' ? '5 Years (IRAS & CPF Board)' :
                     employee.country === 'India' ? '8 Years (Income Tax Act Sec 44AA)' :
                     '5 Years (Standard Statutory Hold)'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Data Storage Mode:</span>
                  <span className="text-slate-700 font-semibold">Client-Side React Prototype · View Masking</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex items-center justify-between">
          <span className="text-slate-400 text-[11px]">
            Record ID: {employee.id} · Timezone: {employee.timezone}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
