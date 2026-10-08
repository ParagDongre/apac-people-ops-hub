import React, { useState } from 'react';
import { 
  Employee, 
  APACCountry, 
  OnboardingTask, 
  UserRole, 
  AuditLogEntry 
} from '../types/hr';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Laptop, 
  UserCheck, 
  Shield, 
  Calendar, 
  Send, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  FileText 
} from 'lucide-react';

interface OnboardingEngineProps {
  employees: Employee[];
  currentRole: UserRole;
  onUpdateEmployee: (updated: Employee, logEntry: AuditLogEntry) => void;
  onSelectEmployee: (emp: Employee) => void;
}

export const OnboardingEngine: React.FC<OnboardingEngineProps> = ({
  employees,
  currentRole,
  onUpdateEmployee,
  onSelectEmployee,
}) => {
  const [selectedCountryTab, setSelectedCountryTab] = useState<APACCountry | 'All'>('All');
  const [filterOwner, setFilterOwner] = useState<'All' | 'HR Ops' | 'IT' | 'Manager' | 'Employee'>('All');
  const [selectedJoinerId, setSelectedJoinerId] = useState<string>(
    employees.find(e => e.status === 'Onboarding')?.id || employees[0]?.id || ''
  );

  const onboardingEmployees = employees.filter(
    e => e.status === 'Onboarding' || (e.onboardingTasks && e.onboardingTasks.some(t => !t.completed))
  );

  const activeEmployee = employees.find(e => e.id === selectedJoinerId) || onboardingEmployees[0] || employees[0];

  const handleToggleTask = (task: OnboardingTask) => {
    if (!activeEmployee || !activeEmployee.onboardingTasks) return;

    const newCompleted = !task.completed;
    const updatedTasks = activeEmployee.onboardingTasks.map(t =>
      t.id === task.id
        ? {
            ...t,
            completed: newCompleted,
            completedAt: newCompleted ? new Date().toISOString().split('T')[0] : undefined,
            completedBy: newCompleted ? currentRole : undefined,
          }
        : t
    );

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actorName: currentRole,
      actorRole: currentRole,
      employeeId: activeEmployee.id,
      employeeName: `${activeEmployee.firstName} ${activeEmployee.lastName}`,
      actionType: 'Update',
      fieldChanged: `Onboarding Task: ${task.title}`,
      oldValue: task.completed ? 'Completed' : 'Pending',
      newValue: newCompleted ? 'Completed' : 'Pending',
      justification: 'Automated onboarding workflow task execution.',
    };

    onUpdateEmployee({ ...activeEmployee, onboardingTasks: updatedTasks }, log);
  };

  const handleSimulateAutomatedBatch = () => {
    if (!activeEmployee || !activeEmployee.onboardingTasks) return;

    const updatedTasks = activeEmployee.onboardingTasks.map(t => {
      if (t.category === 'IT Provisioning' || t.category === 'HR Ops Welcome') {
        return {
          ...t,
          completed: true,
          completedAt: new Date().toISOString().split('T')[0],
          completedBy: 'Automated People Ops System',
        };
      }
      return t;
    });

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actorName: 'System Automation',
      actorRole: 'HR Ops Lead',
      employeeId: activeEmployee.id,
      employeeName: `${activeEmployee.firstName} ${activeEmployee.lastName}`,
      actionType: 'Update',
      fieldChanged: 'Batch Onboarding Automation Triggered',
      oldValue: 'Pre-boarding manual pending',
      newValue: 'IT and HR Ops Day 1 auto-provisioned',
      justification: 'Batch automation dispatched Google Workspace, Slack, and orientation invite.',
    };

    onUpdateEmployee({ ...activeEmployee, onboardingTasks: updatedTasks }, log);
  };

  const tasks = activeEmployee?.onboardingTasks || [];
  const filteredTasks = tasks.filter(t => {
    if (filterOwner !== 'All' && t.owner !== filterOwner) return false;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const overdueCount = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date('2026-10-08')).length;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Country-Specific Onboarding Engine
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Automated, legally compliant onboarding workflows tailored for India, Singapore, Australia, Japan, and the Philippines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateAutomatedBatch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulate Day 1 Provisioning</span>
            </button>
          </div>
        </div>
      </div>

      {/* Country Compliance Specs Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
        {/* India Card */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">🇮🇳 India Checklist</span>
            <span className="text-[10px] text-slate-500 font-mono">EPFO/ESI</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            EPFO Form 11 declaration, Gratuity Form F nomination, POSH charter, and 3-stage BGV.
          </p>
        </div>

        {/* Singapore Card */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">🇸🇬 Singapore Checklist</span>
            <span className="text-[10px] text-slate-500 font-mono">MOM/CPF</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            CPF submission account, MOM EP e-Services validity check, Employment Act KETs, PDPA notice.
          </p>
        </div>

        {/* Australia Card */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">🇦🇺 Australia Checklist</span>
            <span className="text-[10px] text-slate-500 font-mono">ATO/Super</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            ATO TFN declaration, Superannuation Standard Choice (12.0%), Fair Work NES, and VEVO.
          </p>
        </div>

        {/* Japan Card */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">🇯🇵 Japan Checklist</span>
            <span className="text-[10px] text-slate-500 font-mono">Kyokai Kenpo</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Shakai Hoken enrollment within 5 days, Koyo Hoken, MyNumber collection, Article 36 Agreement.
          </p>
        </div>

        {/* Philippines Card */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">🇵🇭 Philippines Checklist</span>
            <span className="text-[10px] text-slate-500 font-mono">SSS/BIR</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            SSS Form R-1A, PhilHealth PMRF, Pag-IBIG registration, BIR 1902 withholding tax setup.
          </p>
        </div>
      </div>

      {/* Main Two-Column Workflow Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Joiners Selection */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-sm">Active Joiners Pipeline</h2>
            <span className="text-xs text-slate-500 font-medium">
              {onboardingEmployees.length} Joiners
            </span>
          </div>

          <div className="space-y-2">
            {onboardingEmployees.map(emp => {
              const isSelected = emp.id === activeEmployee?.id;
              const empTasks = emp.onboardingTasks || [];
              const completed = empTasks.filter(t => t.completed).length;
              const percent = empTasks.length > 0 ? Math.round((completed / empTasks.length) * 100) : 0;
              const hasOverdue = empTasks.some(t => !t.completed && new Date(t.dueDate) < new Date('2026-10-08'));

              return (
                <div
                  key={emp.id}
                  onClick={() => setSelectedJoinerId(emp.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50/80 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 text-xs">
                        {emp.firstName} {emp.lastName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {emp.country} · {emp.jobTitle}
                      </div>
                    </div>
                    {hasOverdue && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800">
                        Overdue SLA
                      </span>
                    )}
                  </div>

                  {/* Progress Mini Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>Progress</span>
                      <span>{completed} / {empTasks.length} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-slate-900 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 spans): Active Joiner's Detailed Checklist */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
          {activeEmployee ? (
            <>
              {/* Joiner Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">
                      {activeEmployee.firstName} {activeEmployee.lastName}
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                      {activeEmployee.country}
                    </span>
                    <span className="text-xs text-slate-500">
                      Commencing: {activeEmployee.startDate}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Manager: {activeEmployee.lineManagerName} · Department: {activeEmployee.department}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">{progressPercent}% Completed</div>
                    <div className="text-[11px] text-slate-500">{completedCount} of {tasks.length} tasks</div>
                  </div>
                  <button
                    onClick={() => onSelectEmployee(activeEmployee)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    View Full HRIS Record
                  </button>
                </div>
              </div>

              {/* Owner Filter Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium overflow-x-auto no-scrollbar">
                  {(['All', 'HR Ops', 'IT', 'Manager', 'Employee'] as const).map(owner => (
                    <button
                      key={owner}
                      onClick={() => setFilterOwner(owner)}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        filterOwner === owner
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {owner}
                    </button>
                  ))}
                </div>

                {overdueCount > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{overdueCount} task(s) past SLA due date</span>
                  </div>
                )}
              </div>

              {/* Checklist Items */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {filteredTasks.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    No tasks match the selected filter.
                  </div>
                ) : (
                  filteredTasks.map(task => {
                    const isOverdue = !task.completed && new Date(task.dueDate) < new Date('2026-10-08');

                    return (
                      <div
                        key={task.id}
                        className={`p-4 flex items-start gap-3.5 transition-colors ${
                          task.completed ? 'bg-slate-50/50' : 'hover:bg-slate-50/70 bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task)}
                          className="mt-1 w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-slate-900 cursor-pointer"
                        />

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-semibold ${
                                task.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                              }`}
                            >
                              {task.title}
                            </span>

                            {task.isStatutoryMandatory && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase bg-amber-100 text-amber-800">
                                Statutory Mandatory
                              </span>
                            )}

                            {isOverdue && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase bg-red-100 text-red-800">
                                Overdue
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {task.guidanceNotes}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                            <span>Owner: <strong className="text-slate-700">{task.owner}</strong></span>
                            <span aria-hidden="true">·</span>
                            <span>Category: {task.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>Due: <strong className={isOverdue ? 'text-red-700' : 'text-slate-700'}>{task.dueDate}</strong></span>
                            {task.completedAt && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-emerald-700 font-medium">
                                  ✓ Completed {task.completedAt} by {task.completedBy || 'HR Ops'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Select a joiner to inspect their localized onboarding workflow.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
