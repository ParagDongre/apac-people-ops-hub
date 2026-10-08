import React, { useState } from 'react';
import { Employee } from '../types/hr';
import { X, Printer, CheckCircle, Building2, ShieldCheck } from 'lucide-react';

interface VerificationLetterModalProps {
  employee: Employee;
  employees: Employee[];
  onClose: () => void;
  onSelectAnotherEmployee: (emp: Employee) => void;
}

export const VerificationLetterModal: React.FC<VerificationLetterModalProps> = ({
  employee,
  employees,
  onClose,
  onSelectAnotherEmployee,
}) => {
  const [includeSalary, setIncludeSalary] = useState(true);
  const [recipientOrganization, setRecipientOrganization] = useState('Consular Visa Services / Financial Institution');
  const [letterPurpose, setLetterPurpose] = useState<'Mortgage / Loan' | 'Visa / Immigration' | 'Rental Lease' | 'General Employment Verification'>('Visa / Immigration');

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Print dialog cannot be opened in this frame context:', e);
    }
  };

  const todayStr = 'October 8, 2026';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Controls Header */}
        <div className="bg-slate-900 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">Official Employment Verification Letter</h3>
              <p className="text-[11px] text-slate-400">
                Digitally authenticated with corporate seal & People Operations sign-off.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration Toolbar (Hidden during print) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 print:hidden grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Target Employee</label>
            <select
              value={employee.id}
              onChange={(e) => {
                const target = employees.find(emp => emp.id === e.target.value);
                if (target) onSelectAnotherEmployee(target);
              }}
              className="w-full border border-slate-200 rounded-lg p-1.5 bg-white text-slate-800"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.country})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Verification Purpose</label>
            <select
              value={letterPurpose}
              onChange={(e) => setLetterPurpose(e.target.value as any)}
              className="w-full border border-slate-200 rounded-lg p-1.5 bg-white text-slate-800"
            >
              <option value="Visa / Immigration">Visa / Immigration Authority</option>
              <option value="Mortgage / Loan">Mortgage / Bank Underwriting</option>
              <option value="Rental Lease">Residential Tenancy Lease</option>
              <option value="General Employment Verification">General Employment Verification</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="inc-sal"
              checked={includeSalary}
              onChange={(e) => setIncludeSalary(e.target.checked)}
              className="rounded border-slate-300 text-slate-900"
            />
            <label htmlFor="inc-sal" className="text-slate-700 font-medium">
              Include Total Remuneration Figure
            </label>
          </div>
        </div>

        {/* Printable Formal Letter Body */}
        <div className="p-8 sm:p-12 overflow-y-auto space-y-6 text-slate-900 bg-white leading-relaxed text-sm font-serif">
          {/* Company Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6 font-sans">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                Remote APAC Operations Pte. Ltd.
              </h2>
              <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                <div>Registration (UEN): 202309182K · GST Reg: M90382910K</div>
                <div>79 Robinson Road, #14-01 CapitaSky, Singapore 068897</div>
                <div>Email: people-ops@example.com · Web: people.example.com</div>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500">
              <div className="font-bold text-slate-900">PEOPLE OPERATIONS DIVISION</div>
              <div>APAC Regional Headquarters</div>
              <div>Date: {todayStr}</div>
            </div>
          </div>

          {/* Recipient Block */}
          <div className="space-y-1 font-sans text-xs">
            <div className="font-bold text-slate-800">TO WHOM IT MAY CONCERN</div>
            <div className="text-slate-600">{recipientOrganization}</div>
            <div className="text-slate-500">Re: Formal Verification of Employment for {employee.firstName} {employee.lastName}</div>
          </div>

          {/* Letter Content */}
          <div className="space-y-4 text-justify">
            <p>
              This letter serves to formally confirm that <strong>{employee.firstName} {employee.lastName}</strong> (Employee ID: <code className="font-mono text-xs">{employee.employeeNumber}</code>) is a permanent, full-time employee of <strong>Remote APAC Operations Pte. Ltd.</strong>, currently performing duties remotely from <strong>{employee.city}, {employee.country}</strong>.
            </p>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-sans text-xs space-y-1.5 my-4">
              <div className="grid grid-cols-2">
                <span className="text-slate-500">Official Job Title:</span>
                <span className="font-bold text-slate-900">{employee.jobTitle}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-slate-500">Organizational Division:</span>
                <span className="font-medium text-slate-800">{employee.department}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-slate-500">Date of Commencement:</span>
                <span className="font-medium text-slate-800">{employee.startDate}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-slate-500">Employment Standing:</span>
                <span className="font-medium text-emerald-800">
                  {employee.status} (Permanent Full-Time, Good Standing)
                </span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-slate-500">Probation Status:</span>
                <span className="font-medium text-slate-800">{employee.probationStatus}</span>
              </div>

              {includeSalary && (
                <div className="grid grid-cols-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-semibold">Total Gross Remuneration:</span>
                  <span className="font-bold text-slate-900">
                    {employee.salary.currency} {employee.salary.amount.toLocaleString()} ({employee.salary.frequency})
                  </span>
                </div>
              )}
            </div>

            <p>
              This letter is issued upon the request of the employee specifically for the purpose of <strong>{letterPurpose}</strong>. {employee.firstName} remains in continuous, active employment with our organization, and we consider them an esteemed member of our distributed engineering and operations workforce.
            </p>

            <p>
              Should you require any further validation or detailed employment history records, please direct inquiries to our People Operations Division at <code className="font-mono text-xs text-slate-700">people-ops@example.com</code>.
            </p>
          </div>

          {/* Sign-off & Digital Stamp */}
          <div className="pt-8 flex items-end justify-between font-sans">
            <div className="space-y-1">
              <div className="font-serif italic text-lg text-slate-800 font-semibold">
                Eileen Tan
              </div>
              <div className="font-bold text-xs text-slate-900">Eileen Tan</div>
              <div className="text-[11px] text-slate-500">Head of People Operations (APAC)</div>
              <div className="text-[10px] text-slate-400">Remote APAC Operations Pte. Ltd.</div>
            </div>

            {/* Corporate Digital Seal */}
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-600 flex flex-col items-center justify-center text-center p-1 text-emerald-800">
              <div className="text-[9px] font-bold uppercase tracking-wider">OFFICIAL SEAL</div>
              <div className="text-[8px] font-mono mt-0.5">AUTHENTICATED</div>
              <div className="text-[7px] text-slate-500 mt-0.5">2026-10-08</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
