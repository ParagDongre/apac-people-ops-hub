import { Employee, AuditLogEntry, HelpdeskFAQ } from '../types/hr';
import { generateCountryOnboardingTasks } from '../utils/onboardingRules';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-in-1',
    employeeNumber: 'AP-IN-0101',
    firstName: 'Aarav',
    lastName: 'Sharma',
    preferredName: 'Aarav',
    workEmail: 'aarav.sharma@remoteapac.internal',
    personalEmail: 'aarav.sharma@example.com',
    country: 'India',
    city: 'Bengaluru',
    timezone: 'Asia/Kolkata (IST)',
    department: 'Engineering',
    jobTitle: 'Senior Distributed Systems Engineer',
    lineManagerId: 'emp-sg-1',
    lineManagerName: 'Eileen Tan',
    employmentType: 'Full-time Direct',
    status: 'Active',
    startDate: '2024-03-15',
    probationEndDate: '2024-06-15',
    probationStatus: 'Confirmed',
    salary: {
      amount: 3200000,
      currency: 'INR',
      frequency: 'Annual',
    },
    statutory: {
      india: {
        pan: 'ABCPS1234F',
        aadhaarLast4: '8821',
        pfUan: '100987654321',
        pfForm11Uploaded: true,
        esiApplicable: false,
        gratuityNominationFormF: true,
        poshAcknowledged: true,
        bgvStatus: 'Verified',
      },
    },
    emergencyContact: {
      name: 'Pooja Sharma',
      relationship: 'Spouse',
      phone: '+91 98450 12345',
    },
    bankDetails: {
      bankName: 'HDFC Bank Ltd',
      accountLast4: '4392',
      routingCode: 'HDFC0001234',
      verified: true,
    },
    leaveBalances: {
      annual: 16.5,
      sick: 8,
      statutorySpecial: 5,
      unpaidLeaveDaysTaken: 0,
    },
    documents: [
      { id: 'doc-in-1-1', name: 'Signed Employment Contract', category: 'Contract', uploadDate: '2024-03-01', status: 'Verified', isMandatory: true },
      { id: 'doc-in-1-2', name: 'EPFO Form 11 Declaration', category: 'Statutory Form', uploadDate: '2024-03-16', status: 'Verified', isMandatory: true },
      { id: 'doc-in-1-3', name: 'PAN Card Copy', category: 'ID Proof', uploadDate: '2024-03-05', status: 'Verified', isMandatory: true },
      { id: 'doc-in-1-4', name: 'Gratuity Form F Nomination', category: 'Statutory Form', uploadDate: '2024-03-20', status: 'Verified', isMandatory: true },
    ],
    retentionCategory: 'Active Employee',
  },

  {
    id: 'emp-in-2',
    employeeNumber: 'AP-IN-0102',
    firstName: 'Priya',
    lastName: 'Venkatesh',
    preferredName: 'Priya',
    workEmail: 'priya.v@remoteapac.internal',
    personalEmail: 'priya.venkat@example.com',
    country: 'India',
    city: 'Pune',
    timezone: 'Asia/Kolkata (IST)',
    department: 'Product & Design',
    jobTitle: 'Lead Product Designer',
    lineManagerId: 'emp-sg-1',
    lineManagerName: 'Eileen Tan',
    employmentType: 'Full-time Direct',
    status: 'Active',
    startDate: '2024-08-01',
    probationEndDate: '2024-11-01',
    probationStatus: 'Confirmed',
    salary: {
      amount: 2800000,
      currency: 'INR',
      frequency: 'Annual',
    },
    statutory: {
      india: {
        pan: 'BHKPV9876K',
        aadhaarLast4: '3419',
        pfUan: '101234567890',
        pfForm11Uploaded: true,
        esiApplicable: false,
        gratuityNominationFormF: true,
        poshAcknowledged: true,
        bgvStatus: 'Verified',
      },
    },
    emergencyContact: {
      name: 'Ramesh Venkatesh',
      relationship: 'Father',
      phone: '+91 97654 22110',
    },
    bankDetails: {
      bankName: 'ICICI Bank',
      accountLast4: '9812',
      routingCode: 'ICIC0000104',
      verified: true,
    },
    leaveBalances: {
      annual: 12,
      sick: 6,
      statutorySpecial: 4,
      unpaidLeaveDaysTaken: 0,
    },
    documents: [
      { id: 'doc-in-2-1', name: 'Signed Employment Contract', category: 'Contract', uploadDate: '2024-07-25', status: 'Verified', isMandatory: true },
      { id: 'doc-in-2-2', name: 'EPFO Form 11', category: 'Statutory Form', uploadDate: '2024-08-05', status: 'Verified', isMandatory: true },
    ],
    retentionCategory: 'Active Employee',
  },

  {
    id: 'emp-in-3',
    employeeNumber: 'AP-IN-0103',
    firstName: 'Devendra',
    lastName: 'Patel',
    preferredName: 'Dev',
    workEmail: 'devendra.patel@remoteapac.internal',
    personalEmail: 'dev.patel92@example.com',
    country: 'India',
    city: 'Ahmedabad',
    timezone: 'Asia/Kolkata (IST)',
    department: 'Engineering',
    jobTitle: 'Backend Go Engineer',
    lineManagerId: 'emp-in-1',
    lineManagerName: 'Aarav Sharma',
    employmentType: 'Full-time Direct',
    status: 'Onboarding',
    startDate: '2026-09-28',
    probationEndDate: '2026-12-28',
    probationStatus: 'In Probation',
    salary: {
      amount: 2200000,
      currency: 'INR',
      frequency: 'Annual',
    },
    statutory: {
      india: {
        pan: 'CKMPP4455Q',
        aadhaarLast4: '1102',
        pfUan: '', // AUDIT ISSUE: Missing Form 11 and UAN
        pfForm11Uploaded: false,
        esiApplicable: false,
        gratuityNominationFormF: false, // AUDIT ISSUE: Missing Form F
        poshAcknowledged: false,
        bgvStatus: 'In Progress',
      },
    },
    emergencyContact: {
      name: 'Geeta Patel',
      relationship: 'Mother',
      phone: '+91 94260 88991',
    },
    bankDetails: {
      bankName: 'Axis Bank Ltd',
      accountLast4: '5561',
      routingCode: 'UTIB0000210',
      verified: false, // AUDIT ISSUE: Unverified bank before payroll
    },
    leaveBalances: {
      annual: 1.5,
      sick: 1,
      statutorySpecial: 0,
      unpaidLeaveDaysTaken: 2, // 2 days LWP recorded for pre-payroll deduction
    },
    documents: [
      { id: 'doc-in-3-1', name: 'Signed Employment Offer', category: 'Contract', uploadDate: '2026-09-20', status: 'Verified', isMandatory: true },
      { id: 'doc-in-3-2', name: 'EPFO Form 11', category: 'Statutory Form', uploadDate: '', status: 'Missing', isMandatory: true },
      { id: 'doc-in-3-3', name: 'Gratuity Form F', category: 'Statutory Form', uploadDate: '', status: 'Missing', isMandatory: true },
    ],
    retentionCategory: 'Active Employee',
  },

  {
    id: 'emp-sg-1',
    employeeNumber: 'AP-SG-0201',
    firstName: 'Eileen',
    lastName: 'Tan',
    preferredName: 'Eileen',
    workEmail: 'eileen.tan@remoteapac.internal',
    personalEmail: 'eileen.tan.sg@example.com',
    country: 'Singapore',
    city: 'Singapore',
    timezone: 'Asia/Singapore (SGT)',
    department: 'People Ops & Talent',
    jobTitle: 'Head of People Operations (APAC)',
    lineManagerId: 'exec-1',
    lineManagerName: 'CEO Office',
    employmentType: 'Full-time Direct',
    status: 'Active',
    startDate: '2023-01-10',
    probationEndDate: '2023-04-10',
    probationStatus: 'Confirmed',
    salary: {
      amount: 168000,
      currency: 'SGD',
      frequency: 'Annual',
    },
    statutory: {
      singapore: {
        nricFinLast4: '412A',
        passType: 'Citizen',
        cpfApplicable: true,
        momNotificationCompleted: true,
        ir8aTaxConsented: true,
        pdpaConsentSigned: true,
      },
    },
    emergencyContact: {
      name: 'Kenneth Lim',
      relationship: 'Spouse',
      phone: '+65 9123 4567',
    },
    bankDetails: {
      bankName: 'DBS Bank Ltd',
      accountLast4: '7789',
      routingCode: '7171-003',
      verified: true,
    },
    leaveBalances: {
      annual: 18,
      sick: 14,
      statutorySpecial: 6,
      unpaidLeaveDaysTaken: 0,
    },
    documents: [
      { id: 'doc-sg-1-1', name: 'Employment Agreement (KETs)', category: 'Contract', uploadDate: '2023-01-05', status: 'Verified', isMandatory: true },
      { id: 'doc-sg-1-2', name: 'PDPA Consent Form', category: 'Policy Ack', uploadDate: '2023-01-10', status: 'Verified', isMandatory: true },
    ],
    retentionCategory: 'Active Employee',
  },

  {
    id: 'emp-sg-2',
    employeeNumber: 'AP-SG-0202',
    firstName: 'Matthieu',
    lastName: 'Laurent',
    preferredName: 'Matt',
    workEmail: 'matt.laurent@remoteapac.internal',
    personalEmail: 'm.laurent@example.com',
    country: 'Singapore',
    city: 'Singapore',
    timezone: 'Asia/Singapore (SGT)',
    department: 'Sales & Marketing',
    jobTitle: 'Regional Enterprise Account Director',
    lineManagerId: 'emp-sg-1',
    lineManagerName: 'Eileen Tan',
    employmentType: 'Full-time Direct',
    status: 'Active',
    startDate: '2024-11-01',
    probationEndDate: '2025-02-01',
    probationStatus: 'Confirmed',
    salary: {
      amount: 195000,
      currency: 'SGD',
      frequency: 'Annual',
    },
    statutory: {
      singapore: {
        nricFinLast4: '883C',
        passType: 'Employment Pass (EP)',
        cpfApplicable: false,
        momNotificationCompleted: true,
        ir8aTaxConsented: true,
        pdpaConsentSigned: true,
        passExpiryDate: '2026-10-26', // AUDIT ISSUE: EP expiring in 18 days!
      },
    },
    emergencyContact: {
      name: 'Sophie Laurent',
      relationship: 'Spouse',
      phone: '+65 8234 5678',
    },
    bankDetails: {
      bankName: 'OCBC Bank',
      accountLast4: '1092',
      routingCode: '7339-501',
      verified: true,
    },
    leaveBalances: {
      annual: 14,
      sick: 12,
      statutorySpecial: 2,
      unpaidLeaveDaysTaken: 0,
    },
    documents: [
      { id: 'doc-sg-2-1', name: 'Signed Employment Agreement', category: 'Contract', uploadDate: '2024-10-20', status: 'Verified', isMandatory: true },
      { id: 'doc-sg-2-2', name: 'MOM Employment Pass Card Copy', category: 'Visa/Permit', uploadDate: '2024-10-26', status: 'Verified', expiryDate: '2026-10-26', isMandatory: true },
    ],
    retentionCategory: 'Active Employee',
  },

  {
    id: 'emp-sg-3',
    employeeNumber: 'AP-SG-0203',
    firstName: 'Wei Ling',
    lastName: 'Chua',
    preferredName: 'Wei Ling',
    workEmail: 'weiling.chua@remoteapac.internal',
    personalEmail: 'wlchua.sg@example.com',
    country: 'Singapore',
    city: 'Singapore',
    timezone: 'Asia/Singapore (SGT)',
    department: 'Finance & Legal',
    jobTitle: 'Senior People Operations Specialist',
    lineManagerId: 'emp-sg-1',
    lineManagerName: 'Eileen Tan',
    employmentType: 'Full-time Direct',
    status: 'Onboarding',
    startDate: '2026-10-01',
    probationEndDate: '2027-01-01',
    probationStatus: 'In Probation',
    salary: {
      amount: 84000,
      currency: 'SGD',
      frequency: 'Annual',
    },
    statutory: {
      singapore: {
        nricFinLast4: '298F',
        passType: 'Citizen',
        cpfApplicable: true,
        momNotificationCompleted: true,
        ir8aTaxConsented: true,
        pdpaConsentSigned: false, // AUDIT ISSUE: PDPA Consent missing
      },
    },
    emergencyContact: {
      name: 'Chua Boon Heng',
      relationship: 'Father',
      phone: '+65 9345 6789',
    },
    bankDetails: {
      bankName: 'UOB Ltd',
      accountLast4: '3819',
      routingCode: '7375-012',
      verified: true,
    },
    leaveBalances: {
      annual: 3.5,
      sick: 3,
      statutorySpecial: 1,
      unpaidLeaveDaysTaken: 0,
    },
    documents: [
      { id: 'doc-sg-3-1', name: 'KETs Employment Contract', category: 'Contract', uploadDate: '2026-09-25', status: 'Verified', isMandatory: true },
      { id: 'doc-sg-3-2', name: 'PDPA Consent Form', category: 'Policy Ack', uploadDate: '', status: 'Missing', isMandatory: true },
    ],
    retentionCategory: 'Active Employee',
  },

  {
    id: 'emp-au-1',
    employeeNumber: 'AP-AU-0301',
    firstName: 'Liam',
    lastName: 'O\'Connor',
    preferredName: 'Liam',
    workEmail: 'liam.oconnor@remoteapac.internal',
    personalEmail: 'liam.oc@example.com',
    country: 'Australia',
    city: 'Sydney',
    timezone: 'Australia/Sydney (AEST)',
    department: 'Engineering',
    jobTitle: 'Staff Infrastructure & Security Engineer',
    lineManagerId: 'emp-in-1',
    lineManagerName: 'Aarav Sharma',
    employmentType: 'Full-time Direct',
    status: 'Active',
    startDate: '2023-07-15',
    probationEndDate: '2023-10-15',
    probationStatus: 'Confirmed',
    salary: {
      amount: 185000,
      currency: 'AUD',
      frequency: 'Annual',
    },
    statutory: {
      australia: {
        tfnProvided: true,
        tfnLast3: '719',
        superFundName: 'AustralianSuper',
        superUsi: 'STA0100AU',
        superMemberNo: '9841203',
        fairWorkStatementAck: true,
        vevoRightToWorkVerified: true,
      },
    },
    emergencyContact: {
      name: 'Chloe O\'Connor',
      relationship: 'Spouse',
      phone: '+61 412 345 678',
    },
    bankDetails: {
      bankName: 'Commonwealth Bank of Australia',
      accountLast4: '9211',
      routingCode: '062-000',
      verified: true,
    },
    leaveBalances: {
      annual: 15,
      sick: 10,
      statutorySpecial: 2,
      unpaidLeaveDaysTaken: 0,
    },
    documents: [
      { id: 'doc-au-1-1', name: 'Fair Work Information Statement Ack', category: 'Policy Ack', uploadDate: '2023-07-15', status: 'Verified', isMandatory: true },
      { id: 'doc-au-1-2', name: 'Superannuation Standard Choice Form', category: 'Statutory Form', uploadDate: '2023-07-16', status: 'Verified', isMandatory: true },
      { id: 'doc-au-1-3', name: 'ATO TFN Declaration', category: 'Statutory Form', uploadDate: '2023-07-18', status: 'Verified', isMandatory: true },
    ],
    retentionCategory: 'Active Employee',
  },

  {
    id: 'emp-au-2',
    employeeNumber: 'AP-AU-0302',
    firstName: 'Callum',
    lastName: 'Wright',
    preferredName: 'Cal',
    workEmail: 'callum.wright@remoteapac.internal',
    personalEmail: 'cal.wright.au@example.com',
    country: 'Australia',
    city: 'Melbourne',
    timezone: 'Australia/Melbourne (AEST)',
    department: 'Customer Success',
    jobTitle: 'Senior Technical Customer Success Specialist',
    lineManagerId: 'emp-sg-1',
    lineManagerName: 'Eileen Tan',
    employmentType: 'Full-time Direct',
    status: 'Active',
    startDate: '2025-02-01',
    probationEndDate: '2025-05-01',
    probationStatus: 'In Probation', // AUDIT ISSUE: Overdue probation confirmation (from May 2025)
    salary: {
      amount: 130000,
      currency: 'AUD',
      frequency: 'Annual',
    },
    statutory: {
      australia: {
        tfnProvided: true,
        tfnLast3: '448',
        superFundName: '', // AUDIT ISSUE: Missing Super choice form & fund
        superUsi: '',
        fairWorkStatementAck: true,
        vevoRightToWorkVerified: true,
      },
    },
    emergencyContact: {
      name: 'Jessica Wright',
      relationship: 'Partner',
      phone: '+61 498 765 432',
    },
    bankDetails: {
      bankName: 'ANZ Banking Group',
      accountLast4: '3341',
      routingCode: '013-006',
      verified: true,
    },
    leaveBalances: {
      annual: 10,
      sick: 7,
      statutorySpecial: 1,
      unpaidLeaveDaysTaken: 2, // 2 days LWP recorded for pre-payroll deduction
    },
    documents: [
      { id: 'doc-au-2-1', name: 'Employment Contract', category: 'Contract', uploadDate: '2025-01-20', status: 'Verified', isMandatory: true },
      { id: 'doc-au-2-2', name: 'Super Choice NAT 13080', category: 'Statutory Form', uploadDate: '', status: 'Missing', isMandatory: true },
    ],
    retentionCategory: 'Active Employee',
  },

  {
    id: 'emp-au-3',
    employeeNumber: 'AP-AU-0303',
    firstName: 'Amelia',
    lastName: 'Barnes',
    preferredName: 'Amelia',
    workEmail: 'amelia.barnes@remoteapac.internal',
    personalEmail: 'amelia.b@example.com',
    country: 'Australia',
    city: 'Brisbane',
    timezone: 'Australia/Brisbane (AEST)',
    department: 'Engineering',
    jobTitle: 'Frontend Engineer',
    lineManagerId: 'emp-au-1',
    lineManagerName: 'Liam O\'Connor',
    employmentType: 'Full-time Direct',
    status: 'Active',
    startDate: '2025-08-15',
    probationEndDate: '2025-11-15',
    probationStatus: 'Confirmed',
    salary: {
      amount: 145000,
      currency: 'INR', // AUDIT ISSUE: Currency Inconsistency! (Australia employee in INR)
      frequency: 'Annual',
    },
    statutory: {
      australia: {
        tfnProvided: false, // AUDIT ISSUE: Missing TFN
        fairWorkStatementAck: false, // AUDIT ISSUE: Fair Work statement missing ack
        vevoRightToWorkVerified: true,
      },
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '', // AUDIT ISSUE: Emergency contact empty
    },
    bankDetails: {
      bankName: 'Westpac Banking Corp',
      accountLast4: '1190',
      routingCode: '032-001',
      verified: false,
    },
    leaveBalances: {
      annual: 8,
      sick: 5,
      statutorySpecial: 0,
      unpaidLeaveDaysTaken: 0,
    },
    documents: [
      { id: 'doc-au-3-1', name: 'Employment Agreement', category: 'Contract', uploadDate: '2025-08-10', status: 'Verified', isMandatory: true },
    ],
    retentionCategory: 'Active Employee',
  },

  {
    id: 'emp-jp-1',
    employeeNumber: 'AP-JP-0401',
    firstName: 'Kenji',
    lastName: 'Sato',
    preferredName: 'Kenji',
    workEmail: 'kenji.sato@remoteapac.internal',
    personalEmail: 'sato.kenji.tokyo@example.com',
    country: 'Japan',
    city: 'Tokyo',
    timezone: 'Asia/Tokyo (JST)',
    department: 'Engineering',
    jobTitle: 'Senior Cloud Reliability Engineer',
    lineManagerId: 'emp-in-1',
    lineManagerName: 'Aarav Sharma',
    employmentType: 'Full-time Direct',
    status: 'Active',
    startDate: '2024-04-01',
    probationEndDate: '2024-07-01',
    probationStatus: 'Confirmed',
    salary: {
      amount: 11500000,
      currency: 'JPY',
      frequency: 'Annual',
    },
    statutory: {
      japan: {
        myNumberCollected: true,
        shakaiHokenEnrolled: true,
        koyoHokenEnrolled: true,
        commuterAllowanceJpy: 15000,
        article36AgreementAck: true,
      },
    },
    emergencyContact: {
      name: 'Yuka Sato',
      relationship: 'Spouse',
      phone: '+81 90 1234 5678',
    },
    bankDetails: {
      bankName: 'Mitsubishi UFJ Financial Group (MUFG)',
      accountLast4: '8820',
      routingCode: '0005-001',
      verified: true,
    },
    leaveBalances: {
      annual: 14,
      sick: 0, // In Japan statutory Nenkyu used
      statutorySpecial: 5,
      unpaidLeaveDaysTaken: 0,
    },
    documents: [
      { id: 'doc-jp-1-1', name: 'Labor Standards Act Notice (労働条件通知書)', category: 'Contract', uploadDate: '2024-03-25', status: 'Verified', isMandatory: true },
      { id: 'doc-jp-1-2', name: 'Article 36 Agreement Acknowledgement', category: 'Policy Ack', uploadDate: '2024-04-02', status: 'Verified', isMandatory: true },
    ],
    retentionCategory: 'Active Employee',
  },

  {
    id: 'emp-jp-2',
    employeeNumber: 'AP-JP-0402',
    firstName: 'Hana',
    lastName: 'Tanaka',
    preferredName: 'Hana',
    workEmail: 'hana.tanaka@remoteapac.internal',
    personalEmail: 'hana.tanaka.jp@example.com',
    country: 'Japan',
    city: 'Osaka',
    timezone: 'Asia/Tokyo (JST)',
    department: 'Sales & Marketing',
    jobTitle: 'Solutions Architect (Japan Enterprise)',
    lineManagerId: 'emp-sg-2',
    lineManagerName: 'Matthieu Laurent',
    employmentType: 'Full-time Direct',
    status: 'Onboarding',
    startDate: '2026-10-05',
    probationEndDate: '2027-01-05',
    probationStatus: 'In Probation',
    salary: {
      amount: 9800000,
      currency: 'JPY',
      frequency: 'Annual',
    },
    statutory: {
      japan: {
        myNumberCollected: false,
        shakaiHokenEnrolled: false, // AUDIT ISSUE: Shakai Hoken enrollment overdue (>5 days)
        koyoHokenEnrolled: false,
        commuterAllowanceJpy: 15000,
        article36AgreementAck: true,
      },
    },
    emergencyContact: {
      name: 'Takeshi Tanaka',
      relationship: 'Brother',
      phone: '+81 80 9876 5432',
    },
    bankDetails: {
      bankName: 'Sumitomo Mitsui Banking Corp (SMBC)',
      accountLast4: '4190',
      routingCode: '0009-221',
      verified: true,
    },
    leaveBalances: {
      annual: 10,
      sick: 0,
      statutorySpecial: 3,
      unpaidLeaveDaysTaken: 0,
    },
    documents: [
      { id: 'doc-jp-2-1', name: 'Working Conditions Notification', category: 'Contract', uploadDate: '2026-10-01', status: 'Verified', isMandatory: true },
      { id: 'doc-jp-2-2', name: 'Social Insurance Enrollment Application', category: 'Statutory Form', uploadDate: '', status: 'Missing', isMandatory: true },
    ],
    retentionCategory: 'Active Employee',
  },

  {
    id: 'emp-ph-1',
    employeeNumber: 'AP-PH-0501',
    firstName: 'Maria Cristina',
    lastName: 'Reyes',
    preferredName: 'Cris',
    workEmail: 'cris.reyes@remoteapac.internal',
    personalEmail: 'cris.reyes.ph@example.com',
    country: 'Philippines',
    city: 'Manila',
    timezone: 'Asia/Manila (PHT)',
    department: 'Customer Success',
    jobTitle: 'Technical Support Lead (24x7 APAC)',
    lineManagerId: 'emp-sg-1',
    lineManagerName: 'Eileen Tan',
    employmentType: 'EOR (Deel/Remote)',
    status: 'Active',
    startDate: '2024-05-10',
    probationEndDate: '2024-11-10',
    probationStatus: 'Confirmed',
    salary: {
      amount: 1440000,
      currency: 'PHP',
      frequency: 'Annual',
    },
    statutory: {
      philippines: {
        sssNumber: '04-1234567-8',
        philHealthNumber: '12-345678901-2',
        pagIbigNumber: '1234-5678-9012',
        birTin: '123-456-789-000',
        thirteenthMonthEligible: true,
        birForm1902Completed: true,
      },
    },
    emergencyContact: {
      name: 'Danilo Reyes',
      relationship: 'Spouse',
      phone: '+63 917 123 4567',
    },
    bankDetails: {
      bankName: 'BDO Unibank',
      accountLast4: '6612',
      routingCode: '010530667',
      verified: true,
    },
    leaveBalances: {
      annual: 15,
      sick: 10,
      statutorySpecial: 5,
      unpaidLeaveDaysTaken: 0,
    },
    documents: [
      { id: 'doc-ph-1-1', name: 'EOR Services Agreement', category: 'Contract', uploadDate: '2024-05-01', status: 'Verified', isMandatory: true },
      { id: 'doc-ph-1-2', name: 'BIR Form 2316 Certificate', category: 'Statutory Form', uploadDate: '2024-05-12', status: 'Verified', isMandatory: true },
    ],
    retentionCategory: 'Active Employee',
  },

  {
    id: 'emp-term-1',
    employeeNumber: 'AP-IN-0014',
    firstName: 'Vikram',
    lastName: 'Choudhary',
    preferredName: 'Vikram',
    workEmail: 'vikram.choudhary.archived@remoteapac.internal',
    personalEmail: 'vikram.c.old@example.com',
    country: 'India',
    city: 'Delhi NCR',
    timezone: 'Asia/Kolkata (IST)',
    department: 'Engineering',
    jobTitle: 'Former DevOps Engineer',
    lineManagerId: 'emp-in-1',
    lineManagerName: 'Aarav Sharma',
    employmentType: 'Full-time Direct',
    status: 'Terminated',
    startDate: '2018-02-01',
    probationEndDate: '2018-05-01',
    probationStatus: 'Confirmed',
    contractEndDate: '2019-06-30', // AUDIT ISSUE: Terminated >7 years ago (GDPR right to erasure eligible!)
    salary: {
      amount: 1800000,
      currency: 'INR',
      frequency: 'Annual',
    },
    statutory: {
      india: {
        pan: 'ABCPS1234F', // AUDIT ISSUE: Duplicate PAN matches Aarav Sharma!
        aadhaarLast4: '0091',
        pfUan: '100019283746',
        pfForm11Uploaded: true,
        esiApplicable: false,
        gratuityNominationFormF: true,
        poshAcknowledged: true,
        bgvStatus: 'Verified',
      },
    },
    emergencyContact: {
      name: 'Sunita Choudhary',
      relationship: 'Spouse',
      phone: '+91 98110 99887',
    },
    bankDetails: {
      bankName: 'State Bank of India',
      accountLast4: '0912',
      routingCode: 'SBIN0001122',
      verified: true,
    },
    leaveBalances: {
      annual: 0,
      sick: 0,
      statutorySpecial: 0,
      unpaidLeaveDaysTaken: 0,
    },
    documents: [
      { id: 'doc-term-1-1', name: 'Relieving & Experience Letter', category: 'Contract', uploadDate: '2019-06-30', status: 'Verified', isMandatory: true },
    ],
    retentionCategory: 'Eligible for GDPR/PDPA Purge',
  },
];

// Initialize onboarding tasks for all employees
INITIAL_EMPLOYEES.forEach(emp => {
  emp.onboardingTasks = generateCountryOnboardingTasks(
    emp.country,
    emp.startDate,
    `${emp.firstName} ${emp.lastName}`
  );
  // Mark completed for active confirmed employees
  if (emp.status === 'Active' && emp.probationStatus === 'Confirmed') {
    emp.onboardingTasks.forEach(t => {
      t.completed = true;
      t.completedAt = t.dueDate;
    });
  }
});

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-07 16:45 SGT',
    actorName: 'Eileen Tan',
    actorRole: 'HR Ops Lead',
    employeeId: 'emp-in-3',
    employeeName: 'Devendra Patel',
    actionType: 'Create',
    fieldChanged: 'Employee Record Created',
    oldValue: 'null',
    newValue: 'Status: Onboarding, Country: India, Role: Backend Go Engineer',
    justification: 'New hire requisition approved for Backend team.',
  },
  {
    id: 'log-2',
    timestamp: '2026-10-07 14:20 SGT',
    actorName: 'Marcus Wong',
    actorRole: 'People Generalist',
    employeeId: 'emp-sg-2',
    employeeName: 'Matthieu Laurent',
    actionType: 'Update',
    fieldChanged: 'Employment Pass Renewal Initiation',
    oldValue: 'Expiry: 2026-10-26 (Valid)',
    newValue: 'Status: Renewal In Progress with MOM',
    justification: 'Automated 30-day work pass alert triggered renewal submission.',
  },
  {
    id: 'log-3',
    timestamp: '2026-10-06 11:15 SGT',
    actorName: 'Eileen Tan',
    actorRole: 'HR Ops Lead',
    employeeId: 'emp-jp-2',
    employeeName: 'Hana Tanaka',
    actionType: 'Document Verified',
    fieldChanged: 'Working Conditions Notification (労働条件通知書)',
    oldValue: 'Pending',
    newValue: 'Verified & Executed',
    justification: 'Compliant with Japan Labor Standards Act Article 15.',
  },
  {
    id: 'log-4',
    timestamp: '2026-10-05 09:30 SGT',
    actorName: 'Liam O\'Connor',
    actorRole: 'Line Manager',
    employeeId: 'emp-au-1',
    employeeName: 'Liam O\'Connor',
    actionType: 'Update',
    fieldChanged: 'Annual Leave Request Approved',
    oldValue: 'Balance: 18.0 days',
    newValue: 'Balance: 15.0 days (3 days approved)',
    justification: 'Planned family leave during Australian school holidays.',
  },
  {
    id: 'log-5',
    timestamp: '2026-10-04 17:00 SGT',
    actorName: 'System Compliance Guard',
    actorRole: 'Compliance Auditor',
    employeeId: 'emp-au-3',
    employeeName: 'Amelia Barnes',
    actionType: 'Audit Remediation',
    fieldChanged: 'Audit Rule Triggered',
    oldValue: 'Unflagged',
    newValue: 'Flagged: Currency Mismatch (INR vs AUD)',
    justification: 'Automated workforce nightly audit integrity check.',
  },
];

export const HELPDESK_FAQS: HelpdeskFAQ[] = [
  {
    id: 'faq-1',
    title: 'Statutory Annual Leave Entitlements by Country',
    countries: ['All', 'India', 'Singapore', 'Australia', 'Japan', 'Philippines'],
    category: 'Leave Policy',
    summary: 'Minimum statutory leave days and company policies across APAC jurisdictions.',
    answer: `Remote APAC provides a standardized **20 days paid annual leave** baseline for all full-time employees, which meets or exceeds statutory requirements across all territories:
- **India**: Factories/Shops & Establishments Act requires 15–18 days earned leave. We provide 20 days + 10 regional public holidays + 12 sick/casual days.
- **Singapore**: MOM Employment Act mandates minimum 7 days (increasing to 14 days by year 8). We provide 20 days + 11 statutory public holidays + 14 days paid outpatient sick leave.
- **Australia**: National Employment Standards (NES) under Fair Work Act mandates 4 weeks (20 days) paid annual leave + 10 days paid personal/carer's leave.
- **Japan**: Labor Standards Act Article 39 mandates 10 days after 6 months. We provide 20 days pro-rated from month 1 + 16 national public holidays (Shukujitsu).
- **Philippines**: Labor Code mandates 5 days Service Incentive Leave (SIL). We provide 20 days paid leave + regular/special non-working holidays.`,
    statutoryReference: 'Fair Work NES (AU), MOM Employment Act (SG), Labor Standards Act (JP), EPFO/Factories Act (IN)',
  },
  {
    id: 'faq-2',
    title: 'How do I request an official Employment Verification Letter?',
    countries: ['All'],
    category: 'Probation & Lifecycle',
    summary: 'Automated letter generation for mortgage, visa, rental, or banking applications.',
    answer: `You can instantly generate and download a digitally signed Employment Verification Letter directly from the **Helpdesk & Verification Portal** in this Hub! 

Our automated generator includes:
1. Official company letterhead and Singapore registered entity details.
2. Verified job title, commencement date, and active employment status.
3. Total compensation figure (optional toggle for housing/mortgage vs general visa verification).
4. Authorized People Ops signature & digital seal.

If your consular authority requires a customized embassy cover note or wet-ink signature, submit a request through the Helpdesk ticket form.`,
  },
  {
    id: 'faq-3',
    title: 'Remote Home Office & Ergonomic Setup Reimbursement ($1,000 USD Allowance)',
    countries: ['All'],
    category: 'WFH & Equipment',
    summary: 'Eligibility, allowable expenses, and how to submit a WFH equipment purchase order.',
    answer: `All permanent employees receive a one-time **$1,000 USD equivalent (in local currency)** WFH setup stipend upon joining, plus a recurring **$75 USD / month** internet and mobile connectivity subsidy:
- **Allowable items**: Ergonomic desk chairs (Herman Miller, Steelcase, etc.), motorized standing desks, secondary external monitors, ergonomic keyboards/mice, noise-canceling headsets, monitor arms, footrests.
- **Submission Process**: Submit receipt via the **Helpdesk Purchase Request** tab with proof of purchase. Reimbursed in the next monthly payroll cycle under tax-free WFH reimbursement rules (ATO remote work deduction compliant in AU, IRAS non-taxable expense in SG).`,
  },
  {
    id: 'faq-4',
    title: 'Statutory Pension & Provident Fund: CPF, EPF, Superannuation & Nenkin',
    countries: ['India', 'Singapore', 'Australia', 'Japan'],
    category: 'Statutory & Taxes',
    summary: 'Employer vs employee contribution rates and monthly remittance deadlines.',
    answer: `Statutory retirement savings are deducted and remitted automatically:
- **India (EPF)**: 12% employee contribution + 12% employer contribution (split 8.33% EPS / 3.67% EPF) remitted to EPFO by the 15th of each month.
- **Singapore (CPF)**: Citizens & Permanent Residents receive up to 17% employer + 20% employee contribution (age-tiered) remitted to CPF Board by the 14th of each month.
- **Australia (Superannuation)**: 12.0% Superannuation Guarantee (SG) legislated rate from July 2025 paid quarterly by employer into your nominated APRA fund or ATO stapled super fund.
- **Japan (Nenkin / Shakai Hoken)**: Welfare Pension (Kousei Nenkin) is 18.3% shared equally 50/50 (9.15% employee / 9.15% employer) remitted to Japan Pension Service.`,
    statutoryReference: 'EPFO Scheme 1952, CPF Act Cap 36, Superannuation Guarantee (Administration) Act 1992, National Pension Act (Japan)',
  },
  {
    id: 'faq-5',
    title: 'Probation Periods, Reviews & Passing Confirmation in APAC',
    countries: ['All'],
    category: 'Probation & Lifecycle',
    summary: 'Standard probation duration, 30/60/90-day check-ins, and notice period during probation.',
    answer: `Standard probation across APAC is **3 months** (90 days), with formal check-ins at Day 30, Day 60, and Day 90:
- Notice period during probation is **14 days** (or 1 week in Australia/Singapore depending on contract clause) on either side.
- Upon successful review, a formal **Confirmation of Employment Letter** is issued by People Ops.
- In countries like Japan, probation is legally treated as an employment contract with reserved right of termination (解約権留保付雇用契約), requiring objective, socially reasonable grounds for non-confirmation.`,
  },
];
