import React, { useState, useMemo } from 'react';
import { 
  Employee, 
  APACCountry, 
  Department, 
  EmployeeStatus, 
  UserRole, 
  AuditLogEntry 
} from '../types/hr';
import { 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileCheck2, 
  ChevronRight, 
  Sparkles,
  Building,
  UserCheck
} from 'lucide-react';

interface HrisDirectoryProps {
  employees: Employee[];
  auditLogs: AuditLogEntry[];
  currentRole: UserRole;
  onSelectEmployee: (employee: Employee) => void;
  onNewJoinerClick: () => void;
}

export const HrisDirectory: React.FC<HrisDirectoryProps> = ({
  employees,
  auditLogs,
  currentRole,
  onSelectEmployee,
  onNewJoinerClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<APACCountry | 'All'>('All');
  const [selectedDept, setSelectedDept] = useState<Department | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<EmployeeStatus | 'All'>('All');
  const [showCompensation, setShowCompensation] = useState<boolean>(currentRole === 'HR Ops Lead');
  const [activeSubView, setActiveSubView] = useState<'roster' | 'changelog'>('roster');

  const countryFlags: Record<APACCountry, string> = {
    India: '🇮🇳 India',
    Singapore: '🇸🇬 Singapore',
    Australia: '🇦🇺 Australia',
    Japan: '🇯🇵 Japan',
    Philippines: '🇵🇭 Philippines',
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.workEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCountry = selectedCountry === 'All' || emp.country === selectedCountry;
      const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
      const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

      return matchesSearch && matchesCountry && matchesDept && matchesStatus;
    });
  }, [employees, searchQuery, selectedCountry, selectedDept, selectedStatus, currentRole]);

  const canViewSalary = currentRole === 'HR Ops Lead' || currentRole === 'People Generalist';

  return (
    <div className="space-y-6">
      {/* Top Banner explaining the module */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Mini HRIS & Employee Directory</h1>
            <p className="text-sm text-slate-600 mt-1">
              Prototype directory holding a 13-record synthetic dataset across India, Singapore, Australia, Japan, and the Philippines. Demonstrates client-side role-based view masking and session change logging.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Sub-Switcher */}
            <div className="inline-flex rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setActiveSubView('roster')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeSubView === 'roster'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Workforce Roster ({filteredEmployees.length})
              </button>
              <button
                onClick={() => setActiveSubView('changelog')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeSubView === 'changelog'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Audit Change Log ({auditLogs.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeSubView === 'roster' ? (
        <>
          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by name, email, employee ID, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-slate-50 focus:bg-white text-slate-900"
                />
              </div>

              {/* Country Select */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value as any)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 font-medium focus:outline-hidden focus:bg-white"
                >
                  <option value="All">All APAC Countries</option>
                  <option value="India">🇮🇳 India</option>
                  <option value="Singapore">🇸🇬 Singapore</option>
                  <option value="Australia">🇦🇺 Australia</option>
                  <option value="Japan">🇯🇵 Japan</option>
                  <option value="Philippines">🇵🇭 Philippines</option>
                </select>

                {/* Department Select */}
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value as any)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 font-medium focus:outline-hidden focus:bg-white"
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="People Ops & Talent">People Ops & Talent</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Customer Success">Customer Success</option>
                  <option value="Finance & Legal">Finance & Legal</option>
                </select>

                {/* Status Select */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 font-medium focus:outline-hidden focus:bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Onboarding">Onboarding</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated / Exited</option>
                </select>

                {/* Salary Masking Toggle */}
                {canViewSalary && (
                  <button
                    onClick={() => setShowCompensation(!showCompensation)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
                    title={showCompensation ? 'Hide Compensation' : 'Reveal Compensation'}
                  >
                    {showCompensation ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                        <span className="hidden sm:inline">Mask Comp</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span className="hidden sm:inline">Show Comp</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Privacy Notification Banner if Line Manager */}
            {!canViewSalary && (
              <div className="flex items-center justify-between text-[11px] text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                <span>
                  <strong>Role-Based View Masking:</strong> In Line Manager view mode, individual compensation figures and national tax numbers are hidden in the UI to demonstrate data minimization principles.
                </span>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Location & Country</th>
                    <th className="py-3 px-4">Role & Dept</th>
                    <th className="py-3 px-4">Contract / Status</th>
                    <th className="py-3 px-4">Statutory Checklist</th>
                    <th className="py-3 px-4">Compensation</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No employees match the current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => {
                      const hasDocIssues = emp.documents.some((d) => d.status === 'Missing' || d.status === 'Expired');
                      const hasPendingTasks = emp.onboardingTasks?.some((t) => !t.completed && t.isStatutoryMandatory);

                      return (
                        <tr
                          key={emp.id}
                          onClick={() => onSelectEmployee(emp)}
                          className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                        >
                          {/* Name & ID */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">
                              {emp.firstName} {emp.lastName}
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                              <span className="font-mono text-slate-600">{emp.employeeNumber}</span>
                              <span aria-hidden="true">·</span>
                              <span className="truncate max-w-[150px]">{emp.workEmail}</span>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800">{countryFlags[emp.country]}</div>
                            <div className="text-slate-500 text-[11px]">{emp.city}</div>
                          </td>

                          {/* Role & Dept */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800 max-w-[200px] truncate">{emp.jobTitle}</div>
                            <div className="text-slate-500 text-[11px]">{emp.department}</div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  emp.status === 'Active'
                                    ? 'bg-emerald-500'
                                    : emp.status === 'Onboarding'
                                    ? 'bg-blue-500'
                                    : emp.status === 'On Leave'
                                    ? 'bg-amber-500'
                                    : 'bg-slate-400'
                                }`}
                              />
                              <span className="font-medium text-slate-800">{emp.status}</span>
                            </div>
                            <div className="text-slate-500 text-[11px] mt-0.5">
                              <span>{emp.employmentType}</span>
                            </div>
                          </td>

                          {/* Statutory status */}
                          <td className="py-3.5 px-4">
                            {hasDocIssues || hasPendingTasks ? (
                              <div className="flex items-center gap-1 text-amber-700 font-medium">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span>Action Required</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-emerald-700 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>Verified & Compliant</span>
                              </div>
                            )}
                            <div className="text-slate-500 text-[11px] mt-0.5">
                              {emp.onboardingTasks
                                ? `${emp.onboardingTasks.filter((t) => t.completed).length} / ${emp.onboardingTasks.length} tasks`
                                : 'All records verified'}
                            </div>
                          </td>

                          {/* Compensation */}
                          <td className="py-3.5 px-4">
                            {canViewSalary && showCompensation ? (
                              <div>
                                <div className="font-mono font-semibold text-slate-900">
                                  {emp.salary.currency} {emp.salary.amount.toLocaleString()}
                                </div>
                                <div className="text-slate-500 text-[11px]">{emp.salary.frequency}</div>
                              </div>
                            ) : (
                              <div>
                                <div className="font-mono text-slate-400 select-none">••••••••••••</div>
                                <div className="text-slate-400 text-[11px]">Restricted Access</div>
                              </div>
                            )}
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-4 text-right">
                            <span className="inline-flex items-center gap-1 text-slate-700 font-medium hover:text-slate-900">
                              <span>Inspect</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="border-t border-slate-200 px-4 py-3 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredEmployees.length} of {employees.length} records</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Onboarding
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400" /> Terminated
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Audit Change Log Sub-View */
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">System-Wide HRIS Change History</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Client-side session log recording employee creations, compensation adjustments, and statutory remediations (resets on reload).
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Total Log Entries: {auditLogs.length}
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900">{log.actionType}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-xs font-medium text-slate-800">{log.employeeName}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500 font-mono">{log.fieldChanged}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mt-2">
                      <div className="p-2 rounded bg-slate-50 border border-slate-100 text-slate-700">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Prior State:</span>
                        <code className="text-slate-600 break-all">{log.oldValue}</code>
                      </div>
                      <div className="p-2 rounded bg-emerald-50/50 border border-emerald-100 text-slate-900">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-0.5">New State:</span>
                        <code className="text-emerald-950 font-semibold break-all">{log.newValue}</code>
                      </div>
                    </div>

                    {log.justification && (
                      <p className="text-xs text-slate-500 italic mt-1">
                        Reason: "{log.justification}"
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono text-slate-500">{log.timestamp}</div>
                    <div className="text-xs text-slate-700 font-medium mt-0.5">{log.actorName}</div>
                    <div className="text-[10px] text-slate-400">{log.actorRole}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
