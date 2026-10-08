import { Employee, AuditIssue, APACCountry } from '../types/hr';

export interface AuditSummary {
  totalEmployeesScanned: number;
  totalIssuesFound: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  healthScore: number; // 0 - 100
  categoryBreakdown: Record<string, number>;
  countryBreakdown: Record<APACCountry, number>;
  issues: AuditIssue[];
}

export const SIMULATION_BASELINE_DATE = '2026-10-08';

export function runWorkforceAudit(employees: Employee[]): AuditSummary {
  const issues: AuditIssue[] = [];
  const today = new Date(SIMULATION_BASELINE_DATE);

  // Track duplicates on full unique identifiers only (avoids false positives from masked last-4 strings)
  const seenTaxIds: Map<string, string> = new Map();
  const seenBankAccounts: Map<string, string> = new Map();

  for (const emp of employees) {
    // Skip already purged employees
    if (emp.retentionCategory === 'Eligible for GDPR/PDPA Purge' && emp.status === 'Terminated') {
      issues.push({
        id: `audit-retention-${emp.id}`,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        country: emp.country,
        category: 'Privacy & Retention',
        severity: 'Critical',
        title: 'Statutory Retention Window Expired (GDPR / PDPA / Privacy Act)',
        description: `Employee separated >7 years ago. Statutory retention period has elapsed. Continuing to store unredacted PII violates GDPR Article 17 ("Right to Erasure") and APAC privacy principles.`,
        remediationAction: 'Execute automated PII field redaction and anonymize profile for statutory audit archive.',
        autoFixable: true,
        status: 'Open',
        detectedAt: today.toISOString().split('T')[0],
      });
      continue;
    }

    // 1. Missing Statutory Documents
    if (emp.status === 'Active' || emp.status === 'Onboarding') {
      if (emp.country === 'India') {
        const pfMissing = !emp.statutory.india?.pfForm11Uploaded;
        if (pfMissing) {
          issues.push({
            id: `audit-in-pf-${emp.id}`,
            employeeId: emp.id,
            employeeName: `${emp.firstName} ${emp.lastName}`,
            country: 'India',
            category: 'Missing Statutory Document',
            severity: 'High',
            title: 'Missing EPFO Form 11 Declaration',
            description: 'Employee Provident Fund declaration Form 11 is not on file. Required under EPFO regulations for statutory pension and provident fund compliance.',
            remediationAction: 'Send automated e-sign request for EPFO Form 11 and capture UAN in HRIS.',
            autoFixable: true,
            status: 'Open',
            detectedAt: today.toISOString().split('T')[0],
          });
        }
        if (emp.statutory.india && !emp.statutory.india.gratuityNominationFormF) {
          issues.push({
            id: `audit-in-grat-${emp.id}`,
            employeeId: emp.id,
            employeeName: `${emp.firstName} ${emp.lastName}`,
            country: 'India',
            category: 'Missing Statutory Document',
            severity: 'Medium',
            title: 'Payment of Gratuity Act Form F Nomination Pending',
            description: 'Nomination form required under Section 6 of Payment of Gratuity Act 1972 is missing from employee file.',
            remediationAction: 'Issue Gratuity Form F template to employee with reminder.',
            autoFixable: true,
            status: 'Open',
            detectedAt: today.toISOString().split('T')[0],
          });
        }
      }

      if (emp.country === 'Singapore') {
        if (emp.statutory.singapore && !emp.statutory.singapore.pdpaConsentSigned) {
          issues.push({
            id: `audit-sg-pdpa-${emp.id}`,
            employeeId: emp.id,
            employeeName: `${emp.firstName} ${emp.lastName}`,
            country: 'Singapore',
            category: 'Privacy & Retention',
            severity: 'Critical',
            title: 'PDPA Employee Data Collection Consent Missing',
            description: 'Singapore Personal Data Protection Act requires explicit employee acknowledgment for collection, use, and disclosure of employee records.',
            remediationAction: 'Dispatch Singapore PDPA Employee Consent Form via DocuSign.',
            autoFixable: true,
            status: 'Open',
            detectedAt: today.toISOString().split('T')[0],
          });
        }
      }

      if (emp.country === 'Australia') {
        if (emp.statutory.australia && !emp.statutory.australia.superFundName && !emp.statutory.australia.superUsi) {
          issues.push({
            id: `audit-au-super-${emp.id}`,
            employeeId: emp.id,
            employeeName: `${emp.firstName} ${emp.lastName}`,
            country: 'Australia',
            category: 'Missing Statutory Document',
            severity: 'Critical',
            title: 'Missing Superannuation Standard Choice Form (NAT 13080)',
            description: 'Australian Superannuation Guarantee mandates choice of fund or ATO stapled fund check before monthly super contribution run (12.0% legislated rate from July 2025).',
            remediationAction: 'Trigger ATO Stapled Super Fund lookup or dispatch Super Choice form.',
            autoFixable: true,
            status: 'Open',
            detectedAt: today.toISOString().split('T')[0],
          });
        }
        if (emp.statutory.australia && !emp.statutory.australia.fairWorkStatementAck) {
          issues.push({
            id: `audit-au-fairwork-${emp.id}`,
            employeeId: emp.id,
            employeeName: `${emp.firstName} ${emp.lastName}`,
            country: 'Australia',
            category: 'Missing Statutory Document',
            severity: 'Medium',
            title: 'Fair Work Information Statement Acknowledgment Missing',
            description: 'Mandatory under Fair Work Act 2009 Section 125. Failure to provide attracts statutory civil penalty exposure.',
            remediationAction: 'Send automated NES Fair Work notice confirmation.',
            autoFixable: true,
            status: 'Open',
            detectedAt: today.toISOString().split('T')[0],
          });
        }
      }

      if (emp.country === 'Japan') {
        if (emp.statutory.japan && !emp.statutory.japan.shakaiHokenEnrolled) {
          issues.push({
            id: `audit-jp-shakai-${emp.id}`,
            employeeId: emp.id,
            employeeName: `${emp.firstName} ${emp.lastName}`,
            country: 'Japan',
            category: 'Missing Statutory Document',
            severity: 'Critical',
            title: 'Shakai Hoken (Social Insurance) Enrollment Overdue',
            description: 'Full-time employees in Japan must be enrolled in Health Insurance & Welfare Pension within 5 days of hiring.',
            remediationAction: 'Flag for Labor & Social Security Attorney (Sharoushi) urgent filing.',
            autoFixable: false,
            status: 'Open',
            detectedAt: today.toISOString().split('T')[0],
          });
        }
      }
    }

    // 2. Currency & Location Inconsistency
    const expectedCurrencies: Record<APACCountry, string> = {
      India: 'INR',
      Singapore: 'SGD',
      Australia: 'AUD',
      Japan: 'JPY',
      Philippines: 'PHP',
    };
    if (emp.salary.currency !== expectedCurrencies[emp.country] && emp.employmentType === 'Full-time Direct') {
      issues.push({
        id: `audit-curr-${emp.id}`,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        country: emp.country,
        category: 'Field Inconsistency',
        severity: 'High',
        title: `Currency Inconsistency for ${emp.country} Direct Hire`,
        description: `Employee is stationed in ${emp.country} on Full-time Direct contract, but base salary is denominated in ${emp.salary.currency} instead of statutory local currency ${expectedCurrencies[emp.country]}. Local statutory deductions and payroll bureau feeds will fail.`,
        remediationAction: `Correct base currency to ${expectedCurrencies[emp.country]} or confirm international transfer rider.`,
        autoFixable: true,
        status: 'Open',
        detectedAt: today.toISOString().split('T')[0],
      });
    }

    // 3. Imminent Visa / Work Pass Expiry (< 45 days)
    const checkVisaExpiry = (expiryStr?: string, docName: string = 'Work Pass') => {
      if (!expiryStr) return;
      const expiry = new Date(expiryStr);
      const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 45 && diffDays >= 0) {
        issues.push({
          id: `audit-visa-${emp.id}`,
          employeeId: emp.id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          country: emp.country,
          category: 'Contract & Visa Expiry',
          severity: diffDays <= 20 ? 'Critical' : 'High',
          title: `${docName} Expiring in ${diffDays} Days`,
          description: `${docName} expires on ${expiryStr}. Work authorization lapses if renewal is not processed with authorities (MOM Singapore / DHA Australia / Immigration Japan).`,
          remediationAction: 'Initiate work pass renewal filing with legal counsel or sponsor portal.',
          autoFixable: false,
          status: 'Open',
          detectedAt: today.toISOString().split('T')[0],
        });
      } else if (diffDays < 0) {
        issues.push({
          id: `audit-visa-exp-${emp.id}`,
          employeeId: emp.id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          country: emp.country,
          category: 'Contract & Visa Expiry',
          severity: 'Critical',
          title: `${docName} Has Expired (${Math.abs(diffDays)} Days Ago)`,
          description: `Right to work documentation has lapsed on ${expiryStr}. Immediate suspension or emergency extension required.`,
          remediationAction: 'Immediate HR escalations to General Counsel & Line Manager.',
          autoFixable: false,
          status: 'Open',
          detectedAt: today.toISOString().split('T')[0],
        });
      }
    };

    if (emp.statutory.singapore?.passExpiryDate) {
      checkVisaExpiry(emp.statutory.singapore.passExpiryDate, `Singapore ${emp.statutory.singapore.passType}`);
    }
    if (emp.statutory.australia?.visaExpiryDate) {
      checkVisaExpiry(emp.statutory.australia.visaExpiryDate, `Australia Visa (${emp.statutory.australia.visaType || 'Subclass 482'})`);
    }

    // 4. Overdue Probation Confirmation
    if (emp.probationStatus === 'In Probation') {
      const probDate = new Date(emp.probationEndDate);
      if (probDate < today) {
        const daysOverdue = Math.ceil((today.getTime() - probDate.getTime()) / (1000 * 60 * 60 * 24));
        issues.push({
          id: `audit-prob-${emp.id}`,
          employeeId: emp.id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          country: emp.country,
          category: 'Field Inconsistency',
          severity: 'Medium',
          title: `Probation Review Overdue by ${daysOverdue} Days`,
          description: `Probation period scheduled to end on ${emp.probationEndDate} has passed without formal confirmation or extension logged. In several jurisdictions (e.g. India, Japan), silence can imply deemed confirmation.`,
          remediationAction: 'Prompt line manager to complete probation assessment form.',
          autoFixable: true,
          status: 'Open',
          detectedAt: today.toISOString().split('T')[0],
        });
      }
    }

    // 5. Unverified Bank Details for Active Payroll
    if ((emp.status === 'Active' || emp.status === 'Onboarding') && !emp.bankDetails.verified) {
      issues.push({
        id: `audit-bank-${emp.id}`,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        country: emp.country,
        category: 'Payroll Pre-condition',
        severity: 'High',
        title: 'Unverified Bank Account / Routing Details',
        description: `Bank details for ${emp.bankDetails.bankName || 'Bank'} have not passed automated penny-drop or branch code validation (${emp.bankDetails.routingCode || 'Missing routing'}). Payroll disbursement will fail.`,
        remediationAction: 'Dispatch bank verification micro-deposit or request official bank statement proof.',
        autoFixable: true,
        status: 'Open',
        detectedAt: today.toISOString().split('T')[0],
      });
    }

    // 6. Emergency Contact Missing
    if (!emp.emergencyContact?.name || !emp.emergencyContact?.phone) {
      issues.push({
        id: `audit-emg-${emp.id}`,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        country: emp.country,
        category: 'Field Inconsistency',
        severity: 'Low',
        title: 'Incomplete Emergency Contact Information',
        description: 'Duty of care requirement: Remote employee profile lacks complete next-of-kin or emergency contact details.',
        remediationAction: 'Send self-service portal prompt to employee to update emergency details.',
        autoFixable: true,
        status: 'Open',
        detectedAt: today.toISOString().split('T')[0],
      });
    }

    // 7. Duplicate Tax Identifier Check (Evaluates full identifiers like Indian PAN or Philippine TIN to avoid false positives from masked last-4 strings)
    const fullTaxId = emp.country === 'India' ? emp.statutory.india?.pan 
      : emp.country === 'Philippines' ? emp.statutory.philippines?.birTin
      : undefined;

    if (fullTaxId && fullTaxId.trim().length > 4 && fullTaxId !== 'Pending' && fullTaxId !== 'PANPending') {
      const existing = seenTaxIds.get(`${emp.country}-${fullTaxId}`);
      if (existing) {
        issues.push({
          id: `audit-dup-tax-${emp.id}`,
          employeeId: emp.id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          country: emp.country,
          category: 'Duplicate / Unverified',
          severity: 'Critical',
          title: `Duplicate Full Tax Identifier Detected (${fullTaxId})`,
          description: `Full tax identifier matches employee record "${existing}". Possible duplicate onboarding profile or shared PAN/TIN entered.`,
          remediationAction: 'Merge duplicate employee profiles or verify individual tax identity document.',
          autoFixable: false,
          status: 'Open',
          detectedAt: today.toISOString().split('T')[0],
        });
      } else {
        seenTaxIds.set(`${emp.country}-${fullTaxId}`, `${emp.firstName} ${emp.lastName} (${emp.employeeNumber})`);
      }
    }
  }

  // Calculate Breakdown and Score
  const critical = issues.filter(i => i.severity === 'Critical').length;
  const high = issues.filter(i => i.severity === 'High').length;
  const medium = issues.filter(i => i.severity === 'Medium').length;
  const low = issues.filter(i => i.severity === 'Low').length;

  // Health Score algorithm: starts at 100, penalized by issue weights
  const penalty = (critical * 12) + (high * 6) + (medium * 3) + (low * 1);
  const healthScore = Math.max(15, Math.min(100, Math.round(100 - (penalty / Math.max(1, employees.length * 0.4)))));

  const categoryBreakdown: Record<string, number> = {};
  for (const i of issues) {
    categoryBreakdown[i.category] = (categoryBreakdown[i.category] || 0) + 1;
  }

  const countryBreakdown: Record<APACCountry, number> = {
    India: 0,
    Singapore: 0,
    Australia: 0,
    Japan: 0,
    Philippines: 0,
  };
  for (const i of issues) {
    countryBreakdown[i.country] = (countryBreakdown[i.country] || 0) + 1;
  }

  return {
    totalEmployeesScanned: employees.length,
    totalIssuesFound: issues.length,
    criticalIssues: critical,
    highIssues: high,
    mediumIssues: medium,
    lowIssues: low,
    healthScore,
    categoryBreakdown,
    countryBreakdown,
    issues,
  };
}
