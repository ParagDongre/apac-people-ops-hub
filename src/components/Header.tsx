import React from 'react';
import { UserRole } from '../types/hr';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  UserPlus, 
  Globe2 
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  headcount: number;
  openIssuesCount: number;
  onNewJoinerClick: () => void;
  onDocumentationClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  headcount,
  openIssuesCount,
  onNewJoinerClick,
  onDocumentationClick,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* Top Banner with branding and quick stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-2.5 flex-wrap gap-3">
          {/* Logo & Hub Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              <Globe2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">APAC People Ops Hub</span>
                <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium border border-amber-200">
                  Front-End Prototype · Synthetic Data
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                <span>Remote Operations Workflow</span>
                <span aria-hidden="true">·</span>
                <span>IN · SG · AU · JP · PH</span>
                <span aria-hidden="true">·</span>
                <span>Role-Based View Masking</span>
              </div>
            </div>
          </div>

          {/* Quick Real-Time Operational Signals */}
          <div className="hidden xl:flex items-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-semibold text-slate-900">{headcount}</span>
                <span className="text-slate-500 ml-1">Synthetic Records</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${openIssuesCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />
              <div>
                <span className={`font-semibold ${openIssuesCount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {openIssuesCount}
                </span>
                <span className="text-slate-500 ml-1">Compliance Flags</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-semibold text-slate-900">Oct 25, 2026</span>
                <span className="text-slate-500 ml-1">Simulation Cutoff</span>
              </div>
            </div>
          </div>

          {/* Right Action Cluster & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500 ml-1 shrink-0" />
              <label htmlFor="role-select" className="sr-only">
                Active View Role:
              </label>
              <select
                id="role-select"
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent text-xs font-semibold text-slate-800 pr-2 py-0.5 focus:outline-hidden cursor-pointer"
              >
                <option value="HR Ops Lead">HR Ops Lead (Full UI Access)</option>
                <option value="People Generalist">People Generalist</option>
                <option value="Line Manager">Line Manager (Masked Comp)</option>
                <option value="Compliance Auditor">Compliance Auditor (Read-Only)</option>
              </select>
            </div>

            {/* Documentation Pack Button */}
            <button
              onClick={onDocumentationClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-xs"
              title="View Onboarding Process Map, Data Retention Policy & Process Improvement Study"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Docs & Process Pack</span>
            </button>

            {/* New Joiner Button */}
            {currentRole !== 'Compliance Auditor' && currentRole !== 'Line Manager' && (
              <button
                onClick={onNewJoinerClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add Joiner</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
