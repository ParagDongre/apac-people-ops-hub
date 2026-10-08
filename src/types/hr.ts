export type APACCountry = 'India' | 'Singapore' | 'Australia' | 'Japan' | 'Philippines';

export type EmploymentType = 'Full-time Direct' | 'EOR (Deel/Remote)' | 'Independent Contractor';

export type EmployeeStatus = 'Active' | 'Onboarding' | 'On Leave' | 'Offboarding' | 'Terminated';

export type Department = 
  | 'Engineering' 
  | 'Product & Design' 
  | 'People Ops & Talent' 
  | 'Sales & Marketing' 
  | 'Customer Success' 
  | 'Finance & Legal';

export type UserRole = 
  | 'HR Ops Lead' 
  | 'People Generalist' 
  | 'Line Manager' 
  | 'Compliance Auditor';

export interface StatutoryDetailsIndia {
  pan: string; // Permanent Account Number
  aadhaarLast4: string;
  pfUan?: string; // Provident Fund Universal Account Number
  pfForm11Uploaded: boolean;
  esiApplicable: boolean;
  esiNumber?: string;
  gratuityNominationFormF: boolean;
  poshAcknowledged: boolean;
  bgvStatus: 'Verified' | 'In Progress' | 'Flagged' | 'Pending';
}

export interface StatutoryDetailsSingapore {
  nricFinLast4: string;
  passType: 'Citizen' | 'Permanent Resident' | 'Employment Pass (EP)' | 'S Pass';
  cpfApplicable: boolean;
  momNotificationCompleted: boolean;
  ir8aTaxConsented: boolean;
  pdpaConsentSigned: boolean;
  passExpiryDate?: string;
}

export interface StatutoryDetailsAustralia {
  tfnProvided: boolean;
  tfnLast3?: string;
  superFundName?: string;
  superUsi?: string; // Unique Superannuation Identifier
  superMemberNo?: string;
  fairWorkStatementAck: boolean;
  vevoRightToWorkVerified: boolean;
  visaType?: string;
  visaExpiryDate?: string;
}

export interface StatutoryDetailsJapan {
  myNumberCollected: boolean;
  shakaiHokenEnrolled: boolean; // Social Insurance (Health + Pension)
  koyoHokenEnrolled: boolean; // Employment Insurance
  commuterAllowanceJpy: number;
  article36AgreementAck: boolean; // Overtime agreement
  visaType?: string;
  visaExpiryDate?: string;
}

export interface StatutoryDetailsPhilippines {
  sssNumber?: string; // Social Security System
  philHealthNumber?: string;
  pagIbigNumber?: string; // HDMF
  birTin?: string; // Bureau of Internal Revenue Tax ID
  thirteenthMonthEligible: boolean;
  birForm1902Completed: boolean;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  category: 'Contract' | 'Statutory Form' | 'ID Proof' | 'Bank Form' | 'Policy Ack' | 'Visa/Permit';
  uploadDate: string;
  status: 'Verified' | 'Pending Review' | 'Missing' | 'Expired';
  expiryDate?: string;
  isMandatory: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  employeeId: string;
  employeeName: string;
  actionType: 'Create' | 'Update' | 'Document Verified' | 'Audit Remediation' | 'Status Change' | 'Payroll Adjustment' | 'Retention Archive';
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  justification?: string;
}

export interface OnboardingTask {
  id: string;
  title: string;
  category: 'Statutory Compliance' | 'IT Provisioning' | 'Manager & Team' | 'HR Ops Welcome' | 'Probation & Check-in';
  owner: 'HR Ops' | 'IT' | 'Manager' | 'Employee';
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  isStatutoryMandatory: boolean;
  countrySpecificDocName?: string;
  guidanceNotes: string;
}

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  workEmail: string;
  personalEmail: string;
  avatarUrl?: string;
  country: APACCountry;
  city: string;
  timezone: string;
  department: Department;
  jobTitle: string;
  lineManagerId: string;
  lineManagerName: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  startDate: string;
  probationEndDate: string;
  probationStatus: 'In Probation' | 'Confirmed' | 'Extended' | 'N/A';
  contractEndDate?: string;
  salary: {
    amount: number;
    currency: string;
    frequency: 'Annual' | 'Monthly';
  };
  statutory: {
    india?: StatutoryDetailsIndia;
    singapore?: StatutoryDetailsSingapore;
    australia?: StatutoryDetailsAustralia;
    japan?: StatutoryDetailsJapan;
    philippines?: StatutoryDetailsPhilippines;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bankDetails: {
    bankName: string;
    accountLast4: string;
    routingCode: string; // IFSC (IN) / Branch-Swift (SG) / BSB (AU) / Branch (JP)
    verified: boolean;
  };
  leaveBalances: {
    annual: number;
    sick: number;
    statutorySpecial: number; // E.g. casual (IN), childcare (SG), personal (AU)
    unpaidLeaveDaysTaken: number; // Explicit tracking for pre-payroll deduction
  };
  documents: EmployeeDocument[];
  onboardingTasks?: OnboardingTask[];
  retentionCategory: 'Active Employee' | 'Standard 7-Yr Statutory Hold' | 'Eligible for GDPR/PDPA Purge';
  notes?: string;
}

export interface AuditIssue {
  id: string;
  employeeId: string;
  employeeName: string;
  country: APACCountry;
  category: 
    | 'Missing Statutory Document'
    | 'Field Inconsistency'
    | 'Contract & Visa Expiry'
    | 'Privacy & Retention'
    | 'Duplicate / Unverified'
    | 'Payroll Pre-condition';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  remediationAction: string;
  autoFixable: boolean;
  status: 'Open' | 'Resolved' | 'Ignored';
  detectedAt: string;
}

export interface PayrollValidationItem {
  employeeId: string;
  employeeName: string;
  country: APACCountry;
  department: Department;
  currency: string;
  baseSalary: number;
  proRatedAdjustment: number;
  unpaidLeaveDeduction: number;
  statutoryContributionEmployer: number;
  statutoryContributionEmployee: number;
  grossPayable: number;
  netPayable: number;
  status: 'Ready' | 'Warning' | 'Blocked';
  flags: string[];
}

export interface HelpdeskFAQ {
  id: string;
  title: string;
  countries: ('All' | APACCountry)[];
  category: 'Leave Policy' | 'Statutory & Taxes' | 'Health & Benefits' | 'WFH & Equipment' | 'Probation & Lifecycle';
  summary: string;
  answer: string;
  statutoryReference?: string;
}
