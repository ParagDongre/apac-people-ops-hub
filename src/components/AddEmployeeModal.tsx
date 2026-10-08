import React, { useState } from 'react';
import { 
  Employee, 
  APACCountry, 
  Department, 
  EmploymentType, 
  UserRole, 
  AuditLogEntry 
} from '../types/hr';
import { generateCountryOnboardingTasks } from '../utils/onboardingRules';
import { X, UserPlus, Globe, Building, DollarSign } from 'lucide-react';

interface AddEmployeeModalProps {
  currentRole: UserRole;
  onClose: () => void;
  onAddEmployee: (newEmployee: Employee, logEntry: AuditLogEntry) => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  currentRole,
  onClose,
  onAddEmployee,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState<APACCountry>('India');
  const [city, setCity] = useState('Bengaluru');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [jobTitle, setJobTitle] = useState('');
  const [lineManagerName, setLineManagerName] = useState('Eileen Tan');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time Direct');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [salaryAmount, setSalaryAmount] = useState<number>(2400000);

  // Country specific states
  const [inPan, setInPan] = useState('');
  const [inAadhaar, setInAadhaar] = useState('');
  const [sgPassType, setSgPassType] = useState<'Citizen' | 'Permanent Resident' | 'Employment Pass (EP)' | 'S Pass'>('Citizen');
  const [sgNric, setSgNric] = useState('');
  const [auSuperFund, setAuSuperFund] = useState('AustralianSuper');
  const [auTfnProvided, setAuTfnProvided] = useState(true);
  const [jpCommuter, setJpCommuter] = useState(15000);

  const defaultCurrencies: Record<APACCountry, string> = {
    India: 'INR',
    Singapore: 'SGD',
    Australia: 'AUD',
    Japan: 'JPY',
    Philippines: 'PHP',
  };

  const defaultCities: Record<APACCountry, string[]> = {
    India: ['Bengaluru', 'Pune', 'Delhi NCR', 'Hyderabad', 'Mumbai'],
    Singapore: ['Singapore'],
    Australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
    Japan: ['Tokyo', 'Osaka', 'Fukuoka', 'Yokohama'],
    Philippines: ['Manila', 'Cebu City', 'Davao City'],
  };

  const handleCountryChange = (c: APACCountry) => {
    setCountry(c);
    setCity(defaultCities[c][0]);
    if (c === 'India') setSalaryAmount(2500000);
    else if (c === 'Singapore') setSalaryAmount(96000);
    else if (c === 'Australia') setSalaryAmount(140000);
    else if (c === 'Japan') setSalaryAmount(9000000);
    else if (c === 'Philippines') setSalaryAmount(1200000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !jobTitle) return;

    const empId = `emp-${country.toLowerCase().slice(0, 2)}-${Date.now().toString().slice(-4)}`;
    const empNumber = `AP-${country.toUpperCase().slice(0, 2)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const start = new Date(startDate);
    const probEnd = new Date(start);
    probEnd.setDate(probEnd.getDate() + 90);

    const statutory: any = {};
    if (country === 'India') {
      statutory.india = {
        pan: inPan || 'PANPending',
        aadhaarLast4: inAadhaar || '0000',
        pfUan: '',
        pfForm11Uploaded: false,
        esiApplicable: false,
        gratuityNominationFormF: false,
        poshAcknowledged: false,
        bgvStatus: 'Pending',
      };
    } else if (country === 'Singapore') {
      statutory.singapore = {
        nricFinLast4: sgNric || '000A',
        passType: sgPassType,
        cpfApplicable: sgPassType === 'Citizen' || sgPassType === 'Permanent Resident',
        momNotificationCompleted: true,
        ir8aTaxConsented: true,
        pdpaConsentSigned: false,
      };
    } else if (country === 'Australia') {
      statutory.australia = {
        tfnProvided: auTfnProvided,
        tfnLast3: '123',
        superFundName: auSuperFund,
        superUsi: 'STA0100AU',
        fairWorkStatementAck: false,
        vevoRightToWorkVerified: true,
      };
    } else if (country === 'Japan') {
      statutory.japan = {
        myNumberCollected: false,
        shakaiHokenEnrolled: false,
        koyoHokenEnrolled: false,
        commuterAllowanceJpy: jpCommuter,
        article36AgreementAck: false,
      };
    } else if (country === 'Philippines') {
      statutory.philippines = {
        sssNumber: 'Pending',
        thirteenthMonthEligible: true,
        birForm1902Completed: false,
      };
    }

    const tasks = generateCountryOnboardingTasks(country, startDate, `${firstName} ${lastName}`);

    const newEmp: Employee = {
      id: empId,
      employeeNumber: empNumber,
      firstName,
      lastName,
      workEmail: email,
      personalEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      country,
      city,
      timezone: country === 'India' ? 'Asia/Kolkata (IST)' : country === 'Singapore' ? 'Asia/Singapore (SGT)' : country === 'Australia' ? 'Australia/Sydney (AEST)' : country === 'Japan' ? 'Asia/Tokyo (JST)' : 'Asia/Manila (PHT)',
      department,
      jobTitle,
      lineManagerId: 'emp-sg-1',
      lineManagerName,
      employmentType,
      status: 'Onboarding',
      startDate,
      probationEndDate: probEnd.toISOString().split('T')[0],
      probationStatus: 'In Probation',
      salary: {
        amount: salaryAmount,
        currency: defaultCurrencies[country],
        frequency: 'Annual',
      },
      statutory,
      emergencyContact: {
        name: 'Primary Next of Kin',
        relationship: 'Family',
        phone: '+1 555 0192',
      },
      bankDetails: {
        bankName: 'Commercial Bank',
        accountLast4: '0000',
        routingCode: 'BRANCH-01',
        verified: false,
      },
      leaveBalances: {
        annual: 20,
        sick: 10,
        statutorySpecial: 3,
        unpaidLeaveDaysTaken: 0,
      },
      documents: [
        {
          id: `doc-${Date.now()}-offer`,
          name: 'Signed Employment Contract',
          category: 'Contract',
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'Verified',
          isMandatory: true,
        },
      ],
      onboardingTasks: tasks,
      retentionCategory: 'Active Employee',
    };

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actorName: currentRole,
      actorRole: currentRole,
      employeeId: newEmp.id,
      employeeName: `${firstName} ${lastName}`,
      actionType: 'Create',
      fieldChanged: 'New Employee Profile Provisioned',
      oldValue: 'null',
      newValue: `Joined ${country} as ${jobTitle} (${department}). Onboarding tasks generated.`,
      justification: 'Automated workflow execution for approved offer requisition.',
    };

    onAddEmployee(newEmp, log);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">Provision New APAC Joiner</h3>
              <p className="text-xs text-slate-400">
                Country-aware onboarding: generates localized compliance checklist & audit record.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-800 flex-1">
          {/* Section: Basic Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Vikram"
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Joshi"
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Work Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. v.joshi@remoteapac.internal"
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Commencement / Start Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-xs"
              />
            </div>
          </div>

          {/* Section: Location & Department */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="font-bold text-slate-900 block text-xs">Jurisdiction & Employment Structure</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">APAC Country *</label>
                <select
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value as APACCountry)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-800 font-medium text-xs"
                >
                  <option value="India">🇮🇳 India</option>
                  <option value="Singapore">🇸🇬 Singapore</option>
                  <option value="Australia">🇦🇺 Australia</option>
                  <option value="Japan">🇯🇵 Japan</option>
                  <option value="Philippines">🇵🇭 Philippines</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Base City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-800 text-xs"
                >
                  {defaultCities[country].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Contract Vehicle</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-800 text-xs"
                >
                  <option value="Full-time Direct">Full-time Direct</option>
                  <option value="EOR (Deel/Remote)">EOR (Deel/Remote)</option>
                  <option value="Independent Contractor">Independent Contractor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-800 text-xs"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="People Ops & Talent">People Ops & Talent</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Customer Success">Customer Success</option>
                  <option value="Finance & Legal">Finance & Legal</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Designation / Role *</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Line Manager</label>
                <input
                  type="text"
                  value={lineManagerName}
                  onChange={(e) => setLineManagerName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-800 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section: Country-Specific Statutory Form */}
          <div className="p-4 border border-emerald-200 bg-emerald-50/40 rounded-xl space-y-3">
            <span className="font-bold text-slate-900 block text-xs">
              Localized Statutory Requirements ({country})
            </span>

            {country === 'India' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Permanent Account Number (PAN)</label>
                  <input
                    type="text"
                    value={inPan}
                    onChange={(e) => setInPan(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Aadhaar (Last 4 digits)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={inAadhaar}
                    onChange={(e) => setInAadhaar(e.target.value)}
                    placeholder="e.g. 9812"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {country === 'Singapore' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">MOM Pass / Residency Status</label>
                  <select
                    value={sgPassType}
                    onChange={(e) => setSgPassType(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
                  >
                    <option value="Citizen">Singapore Citizen</option>
                    <option value="Permanent Resident">Singapore PR</option>
                    <option value="Employment Pass (EP)">Employment Pass (EP)</option>
                    <option value="S Pass">S Pass</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">NRIC / FIN (Last 4 chars)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={sgNric}
                    onChange={(e) => setSgNric(e.target.value.toUpperCase())}
                    placeholder="e.g. 543B"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs font-mono uppercase"
                  />
                </div>
              </div>
            )}

            {country === 'Australia' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nominated Super Fund</label>
                  <select
                    value={auSuperFund}
                    onChange={(e) => setAuSuperFund(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
                  >
                    <option value="AustralianSuper">AustralianSuper (APRA)</option>
                    <option value="Hostplus">Hostplus (APRA)</option>
                    <option value="Aware Super">Aware Super</option>
                    <option value="ART Super">Australian Retirement Trust</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="au-tfn"
                    checked={auTfnProvided}
                    onChange={(e) => setAuTfnProvided(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <label htmlFor="au-tfn" className="text-slate-700 font-medium">
                    TFN Declaration Provided (Avoids 47% top rate)
                  </label>
                </div>
              </div>
            )}

            {country === 'Japan' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Monthly Commuter / Remote Allowance (JPY)</label>
                  <input
                    type="number"
                    value={jpCommuter}
                    onChange={(e) => setJpCommuter(parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs font-mono"
                  />
                </div>
                <div className="text-slate-500 pt-5">
                  Shakai Hoken (Kyokai Kenpo) & Article 36 agreements will be queued for Day 1 filing.
                </div>
              </div>
            )}

            {country === 'Philippines' && (
              <div className="text-slate-600">
                Statutory mandatory benefit checklist for SSS, PhilHealth, Pag-IBIG, and 13th Month Pay will be pre-loaded into Day 1 onboarding workflow.
              </div>
            )}
          </div>

          {/* Section: Remuneration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Annual Base Salary ({defaultCurrencies[country]}) *
              </label>
              <input
                type="number"
                required
                value={salaryAmount}
                onChange={(e) => setSalaryAmount(parseInt(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-xs font-mono"
              />
            </div>
            <div className="text-slate-500 text-[11px] pt-4">
              <strong>Auto-currency lock:</strong> Local statutory currency ({defaultCurrencies[country]}) is enforced to prevent payroll feed rejection.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs flex items-center gap-2"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Create Joiner & Generate Checklist</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
