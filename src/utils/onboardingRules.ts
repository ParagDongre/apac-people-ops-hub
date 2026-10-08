import { APACCountry, OnboardingTask } from '../types/hr';

export function generateCountryOnboardingTasks(
  country: APACCountry,
  startDateStr: string,
  employeeName: string
): OnboardingTask[] {
  const start = new Date(startDateStr);
  const addDays = (d: Date, days: number) => {
    const res = new Date(d);
    res.setDate(res.getDate() + days);
    return res.toISOString().split('T')[0];
  };

  const commonCoreTasks: OnboardingTask[] = [
    {
      id: `task-it-1`,
      title: 'IT Hardware & WFH Equipment Dispatch',
      category: 'IT Provisioning',
      owner: 'IT',
      dueDate: addDays(start, -5),
      completed: false,
      isStatutoryMandatory: false,
      guidanceNotes: 'Dispatch pre-configured MacBook/ThinkPad with YubiKey and encrypted disk image to residential address.',
    },
    {
      id: `task-it-2`,
      title: 'Google Workspace, Slack & 1Password Provisioning',
      category: 'IT Provisioning',
      owner: 'IT',
      dueDate: addDays(start, -2),
      completed: false,
      isStatutoryMandatory: false,
      guidanceNotes: 'Set up company email, MFA enforcement, role-based GitHub/Jira access, and welcome email alias.',
    },
    {
      id: `task-hr-welcome`,
      title: 'People Ops Day 1 Welcome & Orientation Session',
      category: 'HR Ops Welcome',
      owner: 'HR Ops',
      dueDate: addDays(start, 0),
      completed: false,
      isStatutoryMandatory: false,
      guidanceNotes: '30-minute virtual onboarding: walk through company handbook, remote perks, HRIS portal, and culture.',
    },
    {
      id: `task-mgr-intro`,
      title: 'Manager 1:1 & First Week Project Roadmap Alignment',
      category: 'Manager & Team',
      owner: 'Manager',
      dueDate: addDays(start, 2),
      completed: false,
      isStatutoryMandatory: false,
      guidanceNotes: 'Set initial 30-day deliverables, assign onboarding buddy, and schedule team social welcome.',
    },
    {
      id: `task-30day-review`,
      title: '30-Day Check-in & Early Pulse Survey',
      category: 'Probation & Check-in',
      owner: 'HR Ops',
      dueDate: addDays(start, 30),
      completed: false,
      isStatutoryMandatory: false,
      guidanceNotes: 'Review onboarding sentiment, manager feedback, and unblock any tool or process bottlenecks.',
    },
    {
      id: `task-probation-eval`,
      title: 'Probation Period Formal Assessment & Sign-off',
      category: 'Probation & Check-in',
      owner: 'Manager',
      dueDate: addDays(start, 90),
      completed: false,
      isStatutoryMandatory: true,
      guidanceNotes: 'Line manager submits confirmation or extension recommendation before statutory notification window.',
    },
  ];

  let countrySpecificTasks: OnboardingTask[] = [];

  switch (country) {
    case 'India':
      countrySpecificTasks = [
        {
          id: `in-pf-form11`,
          title: 'EPF Declaration (Form 11) & UAN Verification',
          category: 'Statutory Compliance',
          owner: 'Employee',
          dueDate: addDays(start, 3),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'EPFO Form 11 Declaration',
          guidanceNotes: 'Mandatory under Employees\' Provident Funds Scheme 1952. Capture previous UAN or register new EPFO member ID.',
        },
        {
          id: `in-pan-aadhaar`,
          title: 'PAN Card & Aadhaar Linkage Verification',
          category: 'Statutory Compliance',
          owner: 'HR Ops',
          dueDate: addDays(start, 1),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'PAN & Masked Aadhaar Copy',
          guidanceNotes: 'Verify name matching with NSDL database for Section 192 TDS tax deductions.',
        },
        {
          id: `in-gratuity-f`,
          title: 'Gratuity Nomination (Form F) Sign-off',
          category: 'Statutory Compliance',
          owner: 'Employee',
          dueDate: addDays(start, 14),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'Payment of Gratuity Act Form F',
          guidanceNotes: 'Mandatory statutory nomination under Section 6 of Payment of Gratuity Act 1972.',
        },
        {
          id: `in-posh-ack`,
          title: 'POSH (Prevention of Sexual Harassment) Module Completion',
          category: 'Statutory Compliance',
          owner: 'Employee',
          dueDate: addDays(start, 10),
          completed: false,
          isStatutoryMandatory: true,
          guidanceNotes: 'Mandatory statutory training and Internal Complaints Committee (ICC) charter acknowledgement.',
        },
        {
          id: `in-bgv-check`,
          title: 'Third-Party Background Verification (BGV) Clearance',
          category: 'Statutory Compliance',
          owner: 'HR Ops',
          dueDate: addDays(start, 21),
          completed: false,
          isStatutoryMandatory: true,
          guidanceNotes: 'Verify highest educational credential, last 2 employers reliving letters, and permanent address proof.',
        },
      ];
      break;

    case 'Singapore':
      countrySpecificTasks = [
        {
          id: `sg-cpf-setup`,
          title: 'CPF Board Employer Contribution Account Enrollment',
          category: 'Statutory Compliance',
          owner: 'HR Ops',
          dueDate: addDays(start, 5),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'CPF Submission Number Setup',
          guidanceNotes: 'Verify Singapore Citizen or PR status for mandatory Central Provident Fund tier contributions.',
        },
        {
          id: `sg-mom-ep`,
          title: 'MOM Work Pass e-Service Validation (EP/S-Pass)',
          category: 'Statutory Compliance',
          owner: 'HR Ops',
          dueDate: addDays(start, 0),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'MOM Work Pass Card / IPA Letter',
          guidanceNotes: 'Check validity on MOM EP Online portal; issue pass card within 14 days of arrival if new issuance.',
        },
        {
          id: `sg-kets-contract`,
          title: 'Key Employment Terms (KETs) Statutory Agreement',
          category: 'Statutory Compliance',
          owner: 'HR Ops',
          dueDate: addDays(start, 14),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'Signed KETs Employment Contract',
          guidanceNotes: 'Compliant with Singapore Employment Act Section 95A: working hours, probation, notice, medical benefits.',
        },
        {
          id: `sg-ir8a-consent`,
          title: 'IRAS Auto-Inclusion Scheme (AIS) & IR8A Setup',
          category: 'Statutory Compliance',
          owner: 'HR Ops',
          dueDate: addDays(start, 7),
          completed: false,
          isStatutoryMandatory: true,
          guidanceNotes: 'Register employee NRIC/FIN in payroll system for IRAS year-end tax filing transmission.',
        },
        {
          id: `sg-pdpa-consent`,
          title: 'PDPA Employee Personal Data Notice & Consent',
          category: 'Statutory Compliance',
          owner: 'Employee',
          dueDate: addDays(start, 2),
          completed: false,
          isStatutoryMandatory: true,
          guidanceNotes: 'Collect acknowledgement for employment-related personal data processing under Singapore PDPA 2012.',
        },
      ];
      break;

    case 'Australia':
      countrySpecificTasks = [
        {
          id: `au-tfn-dec`,
          title: 'ATO Tax File Number (TFN) Declaration',
          category: 'Statutory Compliance',
          owner: 'Employee',
          dueDate: addDays(start, 7),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'ATO TFN Declaration Form NAT 3092',
          guidanceNotes: 'Required within 28 days of start; withholding applies at top marginal rate (47%) if TFN is withheld.',
        },
        {
          id: `au-super-choice`,
          title: 'Superannuation Standard Choice Form (Fund Selection / USI)',
          category: 'Statutory Compliance',
          owner: 'Employee',
          dueDate: addDays(start, 10),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'Superannuation Standard Choice Form NAT 13080',
          guidanceNotes: '12.0% Superannuation Guarantee (legislated rate from 1 July 2025). Collect APRA fund USI/Member Number or verify ATO stapled fund.',
        },
        {
          id: `au-fair-work`,
          title: 'Fair Work Information Statement & NES Acknowledgement',
          category: 'Statutory Compliance',
          owner: 'Employee',
          dueDate: addDays(start, 1),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'Signed Fair Work Information Statement Ack',
          guidanceNotes: 'Mandatory under Fair Work Act 2009 Section 125 before or as soon as possible after commencement.',
        },
        {
          id: `au-vevo-check`,
          title: 'Department of Home Affairs VEVO Right to Work Check',
          category: 'Statutory Compliance',
          owner: 'HR Ops',
          dueDate: addDays(start, 0),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'VEVO Entitlement Verification Record',
          guidanceNotes: 'Verify unlimited work rights or record visa subclass 482/485 condition flags.',
        },
        {
          id: `au-wfh-ergo`,
          title: 'Work Health and Safety (WHS) Remote Ergonomic Self-Check',
          category: 'HR Ops Welcome',
          owner: 'Employee',
          dueDate: addDays(start, 7),
          completed: false,
          isStatutoryMandatory: true,
          guidanceNotes: 'Model WHS laws mandate home office safety inspection questionnaire and display screen assessment.',
        },
      ];
      break;

    case 'Japan':
      countrySpecificTasks = [
        {
          id: `jp-shakai-hoken`,
          title: 'Shakai Hoken (Health & Pension Insurance) Enrollment',
          category: 'Statutory Compliance',
          owner: 'HR Ops',
          dueDate: addDays(start, 5),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'Kyokai Kenpo & Nenkin Enrollment Application',
          guidanceNotes: 'Must be submitted to Japan Pension Service (Nenkin Jimusho) within 5 days of joining.',
        },
        {
          id: `jp-koyo-hoken`,
          title: 'Koyo Hoken (Employment Insurance) Bureau Registration',
          category: 'Statutory Compliance',
          owner: 'HR Ops',
          dueDate: addDays(start, 10),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'Hello Work Registration Slip',
          guidanceNotes: 'File with Public Employment Security Office (Hello Work) by 10th of following month.',
        },
        {
          id: `jp-mynumber`,
          title: 'Individual Number (MyNumber) Secure Collection',
          category: 'Statutory Compliance',
          owner: 'HR Ops',
          dueDate: addDays(start, 7),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'MyNumber Copy with ID Verification',
          guidanceNotes: 'Strict statutory handling under Act on the Use of Numbers to Identify a Specific Individual. Zero unencrypted storage.',
        },
        {
          id: `jp-36-kyotei`,
          title: 'Article 36 Agreement (36協定) Overtime Rules Acknowledgement',
          category: 'Statutory Compliance',
          owner: 'Employee',
          dueDate: addDays(start, 3),
          completed: false,
          isStatutoryMandatory: true,
          guidanceNotes: 'Labor Standards Act Article 36 statutory limit explanation (max 45 hrs/mo, 360 hrs/yr normal limit).',
        },
        {
          id: `jp-commuter-teate`,
          title: 'Commuter & Remote Work Allowance (Zaitaku Teate) Setup',
          category: 'HR Ops Welcome',
          owner: 'HR Ops',
          dueDate: addDays(start, 5),
          completed: false,
          isStatutoryMandatory: false,
          guidanceNotes: 'Tax-free commuter allowance calculation (up to ¥150,000/mo) or standard monthly remote stipend (¥15,000).',
        },
      ];
      break;

    case 'Philippines':
      countrySpecificTasks = [
        {
          id: `ph-sss-r1a`,
          title: 'Social Security System (SSS) Form R-1A Employment Reporting',
          category: 'Statutory Compliance',
          owner: 'HR Ops',
          dueDate: addDays(start, 7),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'SSS Employment Report Confirmation',
          guidanceNotes: 'Report new hire to SSS within 30 days of employment start under Social Security Act of 2018.',
        },
        {
          id: `ph-philhealth`,
          title: 'PhilHealth PMRF Member Registration Update',
          category: 'Statutory Compliance',
          owner: 'Employee',
          dueDate: addDays(start, 10),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'PhilHealth PMRF Form',
          guidanceNotes: 'Submit PhilHealth Identification Number (PIN) for National Health Insurance Program monthly deductions.',
        },
        {
          id: `ph-pagibig`,
          title: 'Pag-IBIG (HDMF) Member Data Record Validation',
          category: 'Statutory Compliance',
          owner: 'Employee',
          dueDate: addDays(start, 10),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'Pag-IBIG MID Confirmation',
          guidanceNotes: 'Register Home Development Mutual Fund MID for mandatory monthly savings and provident benefits.',
        },
        {
          id: `ph-bir-1902`,
          title: 'BIR Form 1902 / 2316 Withholding Tax Registration',
          category: 'Statutory Compliance',
          owner: 'Employee',
          dueDate: addDays(start, 14),
          completed: false,
          isStatutoryMandatory: true,
          countrySpecificDocName: 'BIR Form 1902 / Previous Employer 2316',
          guidanceNotes: 'Application for registration for individuals earning purely compensation income for BIR annual tax reconciliation.',
        },
      ];
      break;
  }

  return [...countrySpecificTasks, ...commonCoreTasks];
}
