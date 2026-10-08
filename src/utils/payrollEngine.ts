import { Employee, PayrollValidationItem } from '../types/hr';

export function generateMonthlyPayrollFeed(
  employees: Employee[],
  payrollMonth: string = 'October 2026'
): PayrollValidationItem[] {
  const result: PayrollValidationItem[] = [];

  for (const emp of employees) {
    if (emp.status === 'Terminated' && emp.retentionCategory === 'Eligible for GDPR/PDPA Purge') {
      continue;
    }

    // Convert annual salary to monthly if needed
    const monthlyBase = emp.salary.frequency === 'Annual'
      ? Math.round(emp.salary.amount / 12)
      : emp.salary.amount;

    const flags: string[] = [];
    let status: 'Ready' | 'Warning' | 'Blocked' = 'Ready';

    // 1. Check joiner proration
    let proRatedAdjustment = 0;
    const start = new Date(emp.startDate);
    const payrollStart = new Date('2026-10-01');
    const payrollEnd = new Date('2026-10-31');

    if (start > payrollStart && start <= payrollEnd) {
      const activeDays = 31 - start.getDate() + 1;
      const fullDays = 31;
      const proRatedSalary = Math.round((monthlyBase / fullDays) * activeDays);
      proRatedAdjustment = proRatedSalary - monthlyBase; // negative difference
      flags.push(`Mid-month Joiner (Joined Oct ${start.getDate()}): Pro-rated for ${activeDays} days`);
    }

    // 2. Check Unpaid Leave (derived directly from employee record's unpaidLeaveDaysTaken)
    let unpaidLeaveDeduction = 0;
    if (emp.leaveBalances.unpaidLeaveDaysTaken > 0) {
      const unpaidDays = emp.leaveBalances.unpaidLeaveDaysTaken;
      const dailyRate = Math.round(monthlyBase / 22);
      unpaidLeaveDeduction = dailyRate * unpaidDays;
      flags.push(`Unpaid Leave: ${unpaidDays} days recorded LWP (-${emp.salary.currency} ${unpaidLeaveDeduction.toLocaleString()})`);
    }

    // 3. Bank Verification check
    if (!emp.bankDetails.verified) {
      flags.push('CRITICAL: Bank details unverified. Payout cannot be released.');
      status = 'Blocked';
    }

    // 4. Statutory details check
    // India: Missing PAN blocks transmission because EPFO mandates PAN and Section 206AA imposes 20% penalty
    // Australia: Missing TFN triggers a Warning (ATO allows employer payment, but mandates top marginal 47% withholding)
    if (emp.country === 'India' && !emp.statutory.india?.pan) {
      flags.push('BLOCKED: Missing PAN. Mandatory for EPFO & Section 206AA TDS compliance.');
      status = 'Blocked';
    } else if (emp.country === 'Australia' && !emp.statutory.australia?.tfnProvided) {
      flags.push('WARNING: No TFN provided. ATO top marginal rate (47%) will apply to PAYG.');
      if (status !== 'Blocked') status = 'Warning';
    } else if (emp.country === 'Singapore' && !emp.statutory.singapore?.nricFinLast4) {
      flags.push('BLOCKED: Missing NRIC/FIN identifier.');
      status = 'Blocked';
    }

    // 5. Calculate statutory contributions estimates (Rates as of 2026; verify against local authorities)
    let statutoryContributionEmployee = 0;
    let statutoryContributionEmployer = 0;

    const grossSalary = monthlyBase + proRatedAdjustment - unpaidLeaveDeduction;

    switch (emp.country) {
      case 'India':
        // EPF: capped on 15,000 wage ceiling or actuals
        const epfBase = Math.min(grossSalary, 15000);
        statutoryContributionEmployee = Math.round(epfBase * 0.12);
        statutoryContributionEmployer = Math.round(epfBase * 0.12);
        break;
      case 'Singapore':
        if (emp.statutory.singapore?.cpfApplicable) {
          // CPF Ordinary Wage (OW) monthly ceiling: S$8,000 as of 1 Jan 2026
          const cpfCappedSalary = Math.min(grossSalary, 8000);
          statutoryContributionEmployee = Math.round(cpfCappedSalary * 0.20);
          statutoryContributionEmployer = Math.round(cpfCappedSalary * 0.17);
        }
        break;
      case 'Australia':
        // Superannuation Guarantee: 12.0% employer contribution (legislated rate from 1 July 2025)
        statutoryContributionEmployer = Math.round(grossSalary * 0.120);
        statutoryContributionEmployee = 0; // PAYG income tax withholding handled separately by payroll bureau
        break;
      case 'Japan':
        if (emp.statutory.japan?.shakaiHokenEnrolled) {
          statutoryContributionEmployee = Math.round(grossSalary * 0.145);
          statutoryContributionEmployer = Math.round(grossSalary * 0.155);
        }
        break;
      case 'Philippines':
        statutoryContributionEmployee = Math.round(grossSalary * 0.045);
        statutoryContributionEmployer = Math.round(grossSalary * 0.085);
        break;
    }

    // Note: Estimated net excludes personal income tax (PAYG/TDS/IRAS) which depends on tax declarations
    const netPayable = Math.max(0, grossSalary - statutoryContributionEmployee);

    if (flags.length > 0 && status === 'Ready') {
      status = 'Warning';
    }

    result.push({
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      country: emp.country,
      department: emp.department,
      currency: emp.salary.currency,
      baseSalary: monthlyBase,
      proRatedAdjustment,
      unpaidLeaveDeduction,
      statutoryContributionEmployer,
      statutoryContributionEmployee,
      grossPayable: grossSalary,
      netPayable,
      status,
      flags,
    });
  }

  return result;
}

export function exportPayrollCsv(items: PayrollValidationItem[], employees: Employee[]): string {
  const headers = [
    'Employee ID',
    'Employee Name',
    'Country',
    'Department',
    'Currency',
    'Monthly Base',
    'Proration Adj',
    'Unpaid Leave Deductions',
    'Gross Payable',
    'Employee Statutory Ded',
    'Employer Statutory Contribution',
    'Est. Net Payable (Pre-Tax)',
    'Bank Name',
    'Routing/IFSC/BSB',
    'Account (Last 4)',
    'Status',
    'Validation Flags',
  ];

  const empMap = new Map(employees.map(e => [e.id, e]));

  const rows = items.map(item => {
    const emp = empMap.get(item.employeeId);
    return [
      item.employeeId,
      `"${item.employeeName}"`,
      item.country,
      `"${item.department}"`,
      item.currency,
      item.baseSalary,
      item.proRatedAdjustment,
      item.unpaidLeaveDeduction,
      item.grossPayable,
      item.statutoryContributionEmployee,
      item.statutoryContributionEmployer,
      item.netPayable,
      `"${emp?.bankDetails.bankName || ''}"`,
      `"${emp?.bankDetails.routingCode || ''}"`,
      `"${emp?.bankDetails.accountLast4 || ''}"`,
      item.status,
      `"${item.flags.join('; ')}"`,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
