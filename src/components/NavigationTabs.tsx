import React from 'react';
import { 
  Users, 
  CheckSquare, 
  ShieldAlert, 
  ReceiptText, 
  BookOpen 
} from 'lucide-react';

export type ActiveTab = 'hris' | 'onboarding' | 'audit' | 'helpdesk_payroll' | 'documentation';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  openIssuesCount: number;
  onboardingCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  openIssuesCount,
  onboardingCount,
}) => {
  const tabs = [
    {
      id: 'hris' as ActiveTab,
      label: 'Core HRIS & Directory',
      description: 'Employee profiles, statutory forms, compensation & change logs',
      icon: Users,
    },
    {
      id: 'onboarding' as ActiveTab,
      label: 'Country Onboarding Workflows',
      description: 'Localized checklists for IN, SG, AU, JP, PH with SLA monitors',
      icon: CheckSquare,
      badge: onboardingCount > 0 ? `${onboardingCount} in progress` : undefined,
    },
    {
      id: 'audit' as ActiveTab,
      label: 'Data Audit & Privacy Guard',
      description: 'Discrepancy engine, GDPR retention, statutory gap detection',
      icon: ShieldAlert,
      badge: openIssuesCount > 0 ? `${openIssuesCount} flags` : undefined,
      badgeVariant: openIssuesCount > 0 ? 'amber' : 'emerald',
    },
    {
      id: 'helpdesk_payroll' as ActiveTab,
      label: 'Helpdesk & Payroll Feed',
      description: 'APAC policies, verification letters & pre-payroll error detector',
      icon: ReceiptText,
    },
    {
      id: 'documentation' as ActiveTab,
      label: 'Documentation & Process Pack',
      description: 'Swimlane process map, GDPR policy & automation ROI study',
      icon: BookOpen,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar" aria-label="Modules">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-slate-800 text-slate-200'
                        : tab.badgeVariant === 'amber'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
