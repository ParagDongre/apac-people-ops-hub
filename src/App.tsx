import React, { useState, useMemo } from 'react';
import { 
  Employee, 
  AuditLogEntry, 
  UserRole 
} from './types/hr';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { runWorkforceAudit } from './utils/auditEngine';
import { Header } from './components/Header';
import { NavigationTabs, ActiveTab } from './components/NavigationTabs';
import { HrisDirectory } from './components/HrisDirectory';
import { OnboardingEngine } from './components/OnboardingEngine';
import { AuditTool } from './components/AuditTool';
import { HelpdeskAndPayroll } from './components/HelpdeskAndPayroll';
import { DocumentationPack } from './components/DocumentationPack';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { VerificationLetterModal } from './components/VerificationLetterModal';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [currentRole, setCurrentRole] = useState<UserRole>('HR Ops Lead');
  const [activeTab, setActiveTab] = useState<ActiveTab>('hris');

  // Modals state
  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<Employee | null>(null);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [verificationLetterEmployee, setVerificationLetterEmployee] = useState<Employee | null>(null);

  // Compute live compliance issues count
  const auditSummary = useMemo(() => {
    return runWorkforceAudit(employees);
  }, [employees]);

  const onboardingCount = useMemo(() => {
    return employees.filter(e => e.status === 'Onboarding').length;
  }, [employees]);

  // Handlers for state updates
  const handleUpdateEmployee = (updated: Employee, logEntry: AuditLogEntry) => {
    setEmployees(prev => prev.map(e => (e.id === updated.id ? updated : e)));
    setAuditLogs(prev => [logEntry, ...prev]);

    // Keep drawer in sync if open
    if (selectedEmployeeForDetail && selectedEmployeeForDetail.id === updated.id) {
      setSelectedEmployeeForDetail(updated);
    }
  };

  const handleBatchUpdateEmployees = (updatedList: Employee[], newLogs: AuditLogEntry[]) => {
    setEmployees(updatedList);
    setAuditLogs(prev => [...newLogs, ...prev]);
  };

  const handleAddEmployee = (newEmployee: Employee, logEntry: AuditLogEntry) => {
    setEmployees(prev => [newEmployee, ...prev]);
    setAuditLogs(prev => [logEntry, ...prev]);
  };

  const handleLogAudit = (log: AuditLogEntry) => {
    setAuditLogs(prev => [log, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-slate-800 selection:text-white">
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        headcount={employees.length}
        openIssuesCount={auditSummary.totalIssuesFound}
        onNewJoinerClick={() => setIsAddEmployeeOpen(true)}
        onDocumentationClick={() => setActiveTab('documentation')}
      />

      {/* Module Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        openIssuesCount={auditSummary.totalIssuesFound}
        onboardingCount={onboardingCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'hris' && (
          <HrisDirectory
            employees={employees}
            auditLogs={auditLogs}
            currentRole={currentRole}
            onSelectEmployee={setSelectedEmployeeForDetail}
            onNewJoinerClick={() => setIsAddEmployeeOpen(true)}
          />
        )}

        {activeTab === 'onboarding' && (
          <OnboardingEngine
            employees={employees}
            currentRole={currentRole}
            onUpdateEmployee={handleUpdateEmployee}
            onSelectEmployee={setSelectedEmployeeForDetail}
          />
        )}

        {activeTab === 'audit' && (
          <AuditTool
            employees={employees}
            currentRole={currentRole}
            onUpdateEmployee={handleUpdateEmployee}
            onBatchUpdateEmployees={handleBatchUpdateEmployees}
          />
        )}

        {activeTab === 'helpdesk_payroll' && (
          <HelpdeskAndPayroll
            employees={employees}
            currentRole={currentRole}
            onOpenVerificationLetter={setVerificationLetterEmployee}
            onLogAudit={handleLogAudit}
          />
        )}

        {activeTab === 'documentation' && (
          <DocumentationPack />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">APAC People Ops Hub</span>
            <span aria-hidden="true">·</span>
            <span>Front-End Operational Prototype (13 Synthetic Records)</span>
            <span aria-hidden="true">·</span>
            <span>Statutory Rates as of 2026</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('documentation')}
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Onboarding Process Architecture & Retention Policy
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Employee 360 Detail Drawer/Modal */}
      {selectedEmployeeForDetail && (
        <EmployeeDetailModal
          employee={selectedEmployeeForDetail}
          currentRole={currentRole}
          auditLogs={auditLogs}
          onClose={() => setSelectedEmployeeForDetail(null)}
          onUpdateEmployee={handleUpdateEmployee}
          onOpenVerificationLetter={(emp) => setVerificationLetterEmployee(emp)}
        />
      )}

      {/* MODAL 2: Add New Joiner Modal */}
      {isAddEmployeeOpen && (
        <AddEmployeeModal
          currentRole={currentRole}
          onClose={() => setIsAddEmployeeOpen(false)}
          onAddEmployee={handleAddEmployee}
        />
      )}

      {/* MODAL 3: Employment Verification Letter Generator */}
      {verificationLetterEmployee && (
        <VerificationLetterModal
          employee={verificationLetterEmployee}
          employees={employees}
          onClose={() => setVerificationLetterEmployee(null)}
          onSelectAnotherEmployee={setVerificationLetterEmployee}
        />
      )}
    </div>
  );
}
