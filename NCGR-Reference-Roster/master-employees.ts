/**
 * Master Demo Dataset for NCGR ITMS Managed Operations
 * 355+ Employees — Fictional but internally consistent environment.
 * Towers: Infrastructure, Network, Service Desk, Applications, SAP, Database, Cloud, Security, Digital Workplace
 * Departments: IT Operations, Infrastructure, Applications, Service Management, Cyber Security, PMO, Enterprise Architecture, Digital Transformation
 *
 * Saudization Location Buckets (approved domains per Section 4):
 *   Program Management, Proj Mgmt & Mobilization, Integrated Command Center,
 *   Service Desk Mgmt, Tools Management, Service Assurance, Infrastructure,
 *   Application Mgmt, Backup and support services
 */

// ─── ROLE HISTORY INTERFACE ───────────────────────────────────
export interface RoleHistoryEntry {
  holder: string;
  holderId: string;
  roleName: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
}

export type EmployeeLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'SME/Manager';

export interface MasterEmployee {
  employeeId: string;
  name: string;
  role: string;
  tower: string;
  department: string;
  position: string;
  location: string;
  manager: string;
  mobile: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Standby' | 'Remote' | 'Training';
  shift: 'Morning (06:00-14:00)' | 'Evening (14:00-22:00)' | 'Night (22:00-06:00)';
  joiningDate: string;
  nationality: string;
  expatLocal: 'Local' | 'Expat';
  employmentType: 'Full-Time' | 'Contract' | 'Consultant';
  currentAssignment: string;
  /** Approved Saudization domain — mapped from tower/department */
  locationBucket: string;
  /** Historical record of who held this role before this person */
  roleHistory: RoleHistoryEntry[];
  /** Deterministic level classification based on position */
  level: EmployeeLevel;
  /** Gender */
  gender: 'Male' | 'Female';
}

/**
 * Deterministic level mapping from position.
 * Administrator/Analyst → L1, Engineer/Technician/Support Engineer → L2,
 * Senior Engineer/Senior Analyst/Specialist → L3,
 * Team Lead/Operations Lead/Coordinator/Lead Engineer → L4,
 * Manager/Architect/Consultant → SME/Manager
 */
export function getPositionLevel(position: string): EmployeeLevel {
  switch (position) {
    case 'Administrator':
    case 'Analyst':
      return 'L1';
    case 'Engineer':
    case 'Support Engineer':
    case 'Technician':
      return 'L2';
    case 'Senior Engineer':
    case 'Senior Analyst':
    case 'Specialist':
      return 'L3';
    case 'Team Lead':
    case 'Operations Lead':
    case 'Coordinator':
    case 'Lead Engineer':
      return 'L4';
    case 'Manager':
    case 'Architect':
    case 'Consultant':
      return 'SME/Manager';
    default:
      return 'L2';
  }
}

// ─── SAUDIZATION AUTHORITATIVE DATA (Section 4) ──────────────
export interface SaudizationDomainTarget {
  locationBucket: string;
  targetPct: number;
  actualPct: number;
  status: 'OK' | 'NOT OK';
}

export const SAUDIZATION_TARGETS: SaudizationDomainTarget[] = [
  { locationBucket: 'Program Management', targetPct: 50, actualPct: 50, status: 'OK' },
  { locationBucket: 'Proj Mgmt & Mobilization', targetPct: 60, actualPct: 83, status: 'OK' },
  { locationBucket: 'Integrated Command Center', targetPct: 90, actualPct: 93, status: 'OK' },
  { locationBucket: 'Service Desk Mgmt', targetPct: 100, actualPct: 100, status: 'OK' },
  { locationBucket: 'Tools Management', targetPct: 60, actualPct: 65, status: 'OK' },
  { locationBucket: 'Service Assurance', targetPct: 90, actualPct: 82, status: 'NOT OK' },
  { locationBucket: 'Infrastructure', targetPct: 60, actualPct: 61, status: 'OK' },
  { locationBucket: 'Application Mgmt', targetPct: 60, actualPct: 40, status: 'NOT OK' },
  { locationBucket: 'Backup and support services', targetPct: 60, actualPct: 100, status: 'OK' },
];

export const LOCATION_BUCKETS = SAUDIZATION_TARGETS.map(s => s.locationBucket);

/**
 * Mapping from (tower, department) → approved Saudization location bucket.
 * Each tower maps to one primary Saudization domain.
 */
function getTowerLocationBucket(tower: string, department: string): string {
  if (department === 'PMO') return 'Program Management';
  if (department === 'Digital Transformation' || department === 'Enterprise Architecture') return 'Proj Mgmt & Mobilization';
  switch (tower) {
    case 'Service Desk': return department === 'Service Management' ? 'Service Desk Mgmt' : 'Integrated Command Center';
    case 'Network': return 'Integrated Command Center';
    case 'Infrastructure': return 'Infrastructure';
    case 'Database': return 'Infrastructure';
    case 'Cloud': return 'Infrastructure';
    case 'Applications': return 'Application Mgmt';
    case 'SAP': return 'Application Mgmt';
    case 'Security': return 'Service Assurance';
    case 'Digital Workplace': return 'Backup and support services';
    default: return 'Tools Management';
  }
}

// ─── DETERMINISTIC SEEDED PRNG ────────────────────────────────
// Replaces Math.random() for stable, reproducible data across reloads
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}
const rng = seededRandom(42_7316);

// ─── HELPER: Generate synthetic Saudi phone numbers ────────────
const phonePrefixes = ['50', '53', '54', '55', '56', '57', '58', '59'];
let phoneIdx = 0;
function genPhone(): string {
  const p = phonePrefixes[phoneIdx % phonePrefixes.length];
  phoneIdx++;
  const a = String(100 + (phoneIdx * 37 + 284) % 900);
  const b = String(1000 + (phoneIdx * 73 + 4716) % 9000);
  return `+966 ${p} ${a} ${b}`;
}

export const TOWERS = ['Infrastructure', 'Network', 'Service Desk', 'Applications', 'SAP', 'Database', 'Cloud', 'Security', 'Digital Workplace'] as const;
export const DEPARTMENTS = ['IT Operations', 'Infrastructure', 'Applications', 'Service Management', 'Cyber Security', 'PMO', 'Enterprise Architecture', 'Digital Transformation'] as const;

// ─── Name pools ───────────────────────────────────────────────
const firstNamesMale = ['Ahmed', 'Mohammed', 'Khalid', 'Fahad', 'Omar', 'Abdullah', 'Sultan', 'Turki', 'Faisal', 'Saeed', 'Nasser', 'Yousef', 'Ibrahim', 'Saleh', 'Hamad', 'Mansour', 'Majed', 'Rashid', 'Ali', 'Hassan', 'Waleed', 'Bandar', 'Mishal', 'Nawaf', 'Saud', 'Tariq', 'Ziad', 'Abdulaziz', 'Abdulrahman', 'Badr'];
const firstNamesFemale = ['Sara', 'Noura', 'Aisha', 'Huda', 'Layla', 'Fatima', 'Maha', 'Reem', 'Dalal', 'Hanan', 'Lama', 'Nada', 'Abeer', 'Amira', 'Bushra', 'Dina', 'Eman', 'Ghada', 'Hessa', 'Jawahir'];
const lastNames = ['Al-Harbi', 'Al-Qahtani', 'Al-Dosari', 'Al-Otaibi', 'Al-Shammari', 'Al-Ghamdi', 'Al-Mutairi', 'Al-Zahrani', 'Al-Malki', 'Al-Subaie', 'Al-Rashidi', 'Al-Yami', 'Al-Enezi', 'Al-Dossary', 'Al-Hajri', 'Al-Khaldi', 'Al-Salem', 'Al-Tamimi', 'Al-Juhani', 'Al-Bogami', 'Al-Thani', 'Al-Fadhli', 'Al-Ahmadi', 'Al-Harthy', 'Al-Dawsari'];
const expatFirstMale = ['Rakesh', 'Arjun', 'Vivek', 'Daniel', 'Pradeep', 'Sanjay', 'Rajesh', 'Vikram', 'Amit', 'Suresh', 'Manoj', 'Anand', 'Ravi', 'Deepak', 'Ashok', 'Ganesh', 'Naveen', 'Karthik', 'Prasad', 'Venkat'];
const expatFirstFemale = ['Priya', 'Sneha', 'Meera', 'Divya', 'Kavitha', 'Reshma', 'Lakshmi', 'Anjali', 'Nisha', 'Swati'];
const expatLastNames = ['Kumar', 'Nair', 'Menon', 'Mathew', 'Srinivasan', 'Sharma', 'Patel', 'Reddy', 'Iyer', 'Pillai', 'Verma', 'Singh', 'Gupta', 'Das', 'Rao', 'Joshi', 'Bhat', 'Mishra', 'Pandey', 'Choudhary'];

const positions = ['Senior Engineer', 'Engineer', 'Lead Engineer', 'Team Lead', 'Manager', 'Senior Analyst', 'Analyst', 'Specialist', 'Administrator', 'Coordinator', 'Architect', 'Consultant', 'Technician', 'Operations Lead', 'Support Engineer'];
const shifts: MasterEmployee['shift'][] = ['Morning (06:00-14:00)', 'Evening (14:00-22:00)', 'Night (22:00-06:00)'];
const statuses: MasterEmployee['status'][] = ['Active', 'Active', 'Active', 'Active', 'Active', 'Active', 'Active', 'Active', 'On Leave', 'Remote', 'Training', 'Standby'];
const locations = ['Riyadh Primary', 'Riyadh DR', 'Jeddah Office', 'Remote'];
const assignments = ['NCGR ITMS Operations', 'NCGR Infrastructure Program', 'NCGR Application Services', 'NCGR Security Operations', 'NCGR Cloud Migration', 'NCGR Digital Workplace', 'NCGR SAP Operations', 'NCGR Network Operations', 'NCGR Service Desk Operations'];

// ─── Previous role holder name pools (for role history) ───────
const prevHolderNames = [
  'Tariq Al-Rashidi', 'Bandar Al-Dawsari', 'Mishal Al-Subaie', 'Saud Al-Enezi',
  'Nawaf Al-Hajri', 'Ziad Al-Bogami', 'Abdulrahman Al-Thani', 'Badr Al-Fadhli',
  'Hessa Al-Harthy', 'Jawahir Al-Khaldi', 'Ganesh Rao', 'Naveen Das',
  'Karthik Joshi', 'Prasad Bhat', 'Venkat Mishra', 'Ashok Pandey',
  'Deepak Choudhary', 'Manoj Verma', 'Anand Singh', 'Ravi Gupta',
];

// Authoritative Previous Role Holder overrides for key resources to match KT records exactly
const KNOWN_PREV_HOLDERS: Record<string, string> = {
  'Ahmed Al-Qahtani': 'Tariq Al-Rashidi',
  'Mohammed Al-Dosari': 'Bandar Al-Dawsari',
  'Sara Al-Otaibi': 'Mishal Al-Subaie',
  'Omar Al-Mutairi': 'Saud Al-Enezi',
  'Aisha Rahman': 'Nawaf Al-Hajri',
  'Noura Al-Qahtani': 'Ganesh Rao',
  'Layla Hassan': 'Deepak Choudhary',
  'Huda Al-Salem': 'Karthik Joshi',
  'Fahad Al-Subaie': 'Ziad Al-Bogami',
  'Khalid Al-Ghamdi': 'Abdulrahman Al-Thani',
  'Reem Al-Zahrani': 'Badr Al-Fadhli',
  'Sultan Al-Malki': 'Hessa Al-Harthy',
  'Turki Al-Subaie': 'Jawahir Al-Khaldi',
};

function generateRoleHistory(empIdx: number, role: string, joiningDate: string, empName?: string): RoleHistoryEntry[] {
  const history: RoleHistoryEntry[] = [];
  const joinYear = parseInt(joiningDate.substring(0, 4)) || 2023;

  // If there is an authoritative previous role holder for this person, always include them as 1st previous holder
  if (empName && KNOWN_PREV_HOLDERS[empName]) {
    const primaryPrev = KNOWN_PREV_HOLDERS[empName];
    history.push({
      holder: primaryPrev,
      holderId: `NCGR-PREV-${100 + (empIdx % 50)}`,
      roleName: role,
      startDate: `${joinYear - 2}-01-15`,
      endDate: `${joinYear}-01-10`,
      durationMonths: 24,
    });
    return history;
  }

  const numPrev = 1 + (empIdx % 2); // 1 or 2 previous holders
  for (let p = numPrev; p >= 1; p--) {
    const prevName = prevHolderNames[(empIdx * 3 + p) % prevHolderNames.length];
    const startYear = joinYear - p - 1;
    const endYear = joinYear - p + 1;
    const startMonth = String(1 + ((empIdx + p * 5) % 12)).padStart(2, '0');
    const endMonth = String(1 + ((empIdx + p * 7) % 12)).padStart(2, '0');
    const duration = 12 + (empIdx + p * 3) % 18;
    history.push({
      holder: prevName,
      holderId: `NCGR-${900 + empIdx + p}`,
      roleName: role,
      startDate: `${startYear}-${startMonth}-01`,
      endDate: `${endYear}-${endMonth}-28`,
      durationMonths: duration,
    });
  }
  return history;
}

/**
 * Per-domain expat rate that matches the approved Saudization actuals.
 * localRate = actualPct / 100. We use this to decide Local vs Expat.
 */
const domainLocalRate: Record<string, number> = {};
for (const t of SAUDIZATION_TARGETS) {
  domainLocalRate[t.locationBucket] = t.actualPct / 100;
}

function generateEmployees(): MasterEmployee[] {
  const employees: MasterEmployee[] = [];
  let idCounter = 1001;

  // ─── LEADERSHIP (15 key people — preserved from original) ────
  // Gender for leadership: Sara, Aisha, Priya, Noura, Layla, Huda are Female
  const leadershipFemaleNames = new Set(['Sara Al-Otaibi', 'Aisha Rahman', 'Priya Nair', 'Noura Al-Qahtani', 'Layla Hassan', 'Huda Al-Salem']);
  const leadershipBase = [
    { employeeId: 'NCGR-1001', name: 'Faisal Al-Harbi', role: 'ITMS Service Delivery Manager', tower: 'Service Desk', department: 'Service Management', position: 'Manager', location: 'Riyadh Primary', manager: 'Executive Leadership', mobile: '+966 55 284 7316', email: 'faisal.alharbi@demo.ncgr.local', status: 'Active' as const, shift: 'Morning (06:00-14:00)' as const, joiningDate: '2022-03-15', nationality: 'Saudi', expatLocal: 'Local' as const, employmentType: 'Full-Time' as const, currentAssignment: 'NCGR ITMS Operations' },
    { employeeId: 'NCGR-1002', name: 'Ahmed Al-Qahtani', role: 'Infrastructure Operations Lead', tower: 'Infrastructure', department: 'Infrastructure', position: 'Operations Lead', location: 'Riyadh Primary', manager: 'Faisal Al-Harbi', mobile: '+966 54 671 9284', email: 'ahmed.alqahtani@demo.ncgr.local', status: 'Active' as const, shift: 'Morning (06:00-14:00)' as const, joiningDate: '2022-05-01', nationality: 'Saudi', expatLocal: 'Local' as const, employmentType: 'Full-Time' as const, currentAssignment: 'NCGR Infrastructure Program' },
    { employeeId: 'NCGR-1003', name: 'Mohammed Al-Dosari', role: 'Network Operations Lead', tower: 'Network', department: 'Infrastructure', position: 'Operations Lead', location: 'Riyadh Primary', manager: 'Faisal Al-Harbi', mobile: '+966 50 394 6158', email: 'mohammed.aldosari@demo.ncgr.local', status: 'Active' as const, shift: 'Morning (06:00-14:00)' as const, joiningDate: '2022-06-10', nationality: 'Saudi', expatLocal: 'Local' as const, employmentType: 'Full-Time' as const, currentAssignment: 'NCGR Network Operations' },
    { employeeId: 'NCGR-1004', name: 'Sara Al-Otaibi', role: 'Application Support Lead', tower: 'Applications', department: 'Applications', position: 'Operations Lead', location: 'Riyadh Primary', manager: 'Faisal Al-Harbi', mobile: '+966 55 728 4163', email: 'sara.alotaibi@demo.ncgr.local', status: 'Active' as const, shift: 'Morning (06:00-14:00)' as const, joiningDate: '2023-01-15', nationality: 'Saudi', expatLocal: 'Local' as const, employmentType: 'Full-Time' as const, currentAssignment: 'NCGR Application Services' },
    { employeeId: 'NCGR-1005', name: 'Khalid Al-Shammari', role: 'NOC Senior Engineer', tower: 'Network', department: 'IT Operations', position: 'Senior Engineer', location: 'Riyadh Primary', manager: 'Mohammed Al-Dosari', mobile: '+966 53 641 9275', email: 'khalid.alshammari@demo.ncgr.local', status: 'Active' as const, shift: 'Night (22:00-06:00)' as const, joiningDate: '2023-03-20', nationality: 'Saudi', expatLocal: 'Local' as const, employmentType: 'Full-Time' as const, currentAssignment: 'NCGR Network Operations' },
    { employeeId: 'NCGR-1006', name: 'Priya Nair', role: 'Cloud Engineer', tower: 'Cloud', department: 'Infrastructure', position: 'Engineer', location: 'Riyadh Primary', manager: 'Ahmed Al-Qahtani', mobile: '+966 56 318 4729', email: 'priya.nair@demo.ncgr.local', status: 'Active' as const, shift: 'Morning (06:00-14:00)' as const, joiningDate: '2023-04-12', nationality: 'Indian', expatLocal: 'Expat' as const, employmentType: 'Full-Time' as const, currentAssignment: 'NCGR Cloud Migration' },
    { employeeId: 'NCGR-1007', name: 'Omar Al-Mutairi', role: 'Database Administrator', tower: 'Database', department: 'Infrastructure', position: 'Administrator', location: 'Riyadh DR', manager: 'Ahmed Al-Qahtani', mobile: '+966 54 285 7319', email: 'omar.almutairi@demo.ncgr.local', status: 'Active' as const, shift: 'Evening (14:00-22:00)' as const, joiningDate: '2022-09-01', nationality: 'Saudi', expatLocal: 'Local' as const, employmentType: 'Full-Time' as const, currentAssignment: 'NCGR ITMS Operations' },
    { employeeId: 'NCGR-1008', name: 'Aisha Rahman', role: 'Service Desk Lead', tower: 'Service Desk', department: 'Service Management', position: 'Team Lead', location: 'Riyadh Primary', manager: 'Faisal Al-Harbi', mobile: '+966 55 416 8293', email: 'aisha.rahman@demo.ncgr.local', status: 'Active' as const, shift: 'Morning (06:00-14:00)' as const, joiningDate: '2023-02-01', nationality: 'Saudi', expatLocal: 'Local' as const, employmentType: 'Full-Time' as const, currentAssignment: 'NCGR Service Desk Operations' },
    { employeeId: 'NCGR-1009', name: 'Arjun Menon', role: 'Automation Engineer', tower: 'Applications', department: 'Digital Transformation', position: 'Engineer', location: 'Riyadh Primary', manager: 'Faisal Al-Harbi', mobile: '+966 56 729 3154', email: 'arjun.menon@demo.ncgr.local', status: 'Active' as const, shift: 'Morning (06:00-14:00)' as const, joiningDate: '2023-07-15', nationality: 'Indian', expatLocal: 'Expat' as const, employmentType: 'Full-Time' as const, currentAssignment: 'NCGR ITMS Operations' },
    { employeeId: 'NCGR-1010', name: 'Noura Al-Qahtani', role: 'Program Manager', tower: 'Service Desk', department: 'PMO', position: 'Manager', location: 'Riyadh Primary', manager: 'Faisal Al-Harbi', mobile: '+966 55 831 4627', email: 'noura.alqahtani@demo.ncgr.local', status: 'Active' as const, shift: 'Morning (06:00-14:00)' as const, joiningDate: '2022-01-10', nationality: 'Saudi', expatLocal: 'Local' as const, employmentType: 'Full-Time' as const, currentAssignment: 'NCGR ITMS Operations' },
    { employeeId: 'NCGR-1011', name: 'Rakesh Kumar', role: 'Infrastructure Engineer', tower: 'Infrastructure', department: 'Infrastructure', position: 'Engineer', location: 'Riyadh DR', manager: 'Ahmed Al-Qahtani', mobile: '+966 54 316 7825', email: 'rakesh.kumar@demo.ncgr.local', status: 'Active' as const, shift: 'Evening (14:00-22:00)' as const, joiningDate: '2023-05-18', nationality: 'Indian', expatLocal: 'Expat' as const, employmentType: 'Full-Time' as const, currentAssignment: 'NCGR Infrastructure Program' },
    { employeeId: 'NCGR-1012', name: 'Layla Hassan', role: 'Digital Workplace Engineer', tower: 'Digital Workplace', department: 'IT Operations', position: 'Engineer', location: 'Riyadh Primary', manager: 'Ahmed Al-Qahtani', mobile: '+966 55 692 4173', email: 'layla.hassan@demo.ncgr.local', status: 'Active' as const, shift: 'Morning (06:00-14:00)' as const, joiningDate: '2023-08-01', nationality: 'Saudi', expatLocal: 'Local' as const, employmentType: 'Full-Time' as const, currentAssignment: 'NCGR Digital Workplace' },
    { employeeId: 'NCGR-1013', name: 'Daniel Mathew', role: 'Security Engineer', tower: 'Security', department: 'Cyber Security', position: 'Engineer', location: 'Riyadh Primary', manager: 'Faisal Al-Harbi', mobile: '+966 56 483 9217', email: 'daniel.mathew@demo.ncgr.local', status: 'Active' as const, shift: 'Morning (06:00-14:00)' as const, joiningDate: '2023-06-01', nationality: 'Indian', expatLocal: 'Expat' as const, employmentType: 'Full-Time' as const, currentAssignment: 'NCGR Security Operations' },
    { employeeId: 'NCGR-1014', name: 'Huda Al-Salem', role: 'Change Manager', tower: 'Service Desk', department: 'Service Management', position: 'Manager', location: 'Riyadh Primary', manager: 'Faisal Al-Harbi', mobile: '+966 54 817 3264', email: 'huda.alsalem@demo.ncgr.local', status: 'Active' as const, shift: 'Morning (06:00-14:00)' as const, joiningDate: '2022-11-15', nationality: 'Saudi', expatLocal: 'Local' as const, employmentType: 'Full-Time' as const, currentAssignment: 'NCGR ITMS Operations' },
    { employeeId: 'NCGR-1015', name: 'Vivek Srinivasan', role: 'PMO Analyst', tower: 'Service Desk', department: 'PMO', position: 'Analyst', location: 'Riyadh Primary', manager: 'Noura Al-Qahtani', mobile: '+966 55 374 8291', email: 'vivek.srinivasan@demo.ncgr.local', status: 'Active' as const, shift: 'Morning (06:00-14:00)' as const, joiningDate: '2023-09-01', nationality: 'Indian', expatLocal: 'Expat' as const, employmentType: 'Full-Time' as const, currentAssignment: 'NCGR ITMS Operations' },
  ];

  const leadership: MasterEmployee[] = leadershipBase.map((l, idx) => ({
    ...l,
    locationBucket: getTowerLocationBucket(l.tower, l.department),
    roleHistory: generateRoleHistory(idx, l.role, l.joiningDate, l.name),
    level: getPositionLevel(l.position),
    gender: leadershipFemaleNames.has(l.name) ? 'Female' as const : 'Male' as const,
  }));

  employees.push(...leadership);
  idCounter = 1016;

  // ─── GENERATE REMAINING 340 EMPLOYEES ────────────────────────
  const towerDistribution: { tower: string; department: string; count: number }[] = [
    { tower: 'Infrastructure', department: 'Infrastructure', count: 55 },
    { tower: 'Network', department: 'Infrastructure', count: 40 },
    { tower: 'Service Desk', department: 'Service Management', count: 50 },
    { tower: 'Applications', department: 'Applications', count: 45 },
    { tower: 'SAP', department: 'Applications', count: 30 },
    { tower: 'Database', department: 'Infrastructure', count: 25 },
    { tower: 'Cloud', department: 'Infrastructure', count: 30 },
    { tower: 'Security', department: 'Cyber Security', count: 35 },
    { tower: 'Digital Workplace', department: 'IT Operations', count: 30 },
  ];

  // Managers per tower (from leadership)
  const towerManagers: Record<string, string> = {
    'Infrastructure': 'Ahmed Al-Qahtani',
    'Network': 'Mohammed Al-Dosari',
    'Service Desk': 'Aisha Rahman',
    'Applications': 'Sara Al-Otaibi',
    'SAP': 'Sara Al-Otaibi',
    'Database': 'Omar Al-Mutairi',
    'Cloud': 'Priya Nair',
    'Security': 'Daniel Mathew',
    'Digital Workplace': 'Layla Hassan',
  };

  for (const dist of towerDistribution) {
    const bucket = getTowerLocationBucket(dist.tower, dist.department);
    const localRate = domainLocalRate[bucket] ?? 0.65;

    for (let i = 0; i < dist.count; i++) {
      const isExpat = rng() >= localRate;
      const isFemale = rng() < 0.3;
      let name: string;
      if (isExpat) {
        const first = isFemale
          ? expatFirstFemale[(idCounter + i) % expatFirstFemale.length]
          : expatFirstMale[(idCounter + i) % expatFirstMale.length];
        const last = expatLastNames[(idCounter + i * 3) % expatLastNames.length];
        name = `${first} ${last}`;
      } else {
        const first = isFemale
          ? firstNamesFemale[(idCounter + i) % firstNamesFemale.length]
          : firstNamesMale[(idCounter + i) % firstNamesMale.length];
        const last = lastNames[(idCounter + i * 7) % lastNames.length];
        name = `${first} ${last}`;
      }

      const pos = positions[(idCounter + i) % positions.length];
      const role = `${dist.tower} ${pos}`;
      const shift = shifts[(idCounter + i) % shifts.length];
      const status = statuses[(idCounter + i) % statuses.length];
      const loc = locations[(idCounter + i) % locations.length];
      const year = 2022 + ((idCounter + i) % 4);
      const month = String(1 + ((idCounter + i) % 12)).padStart(2, '0');
      const day = String(1 + ((idCounter + i) % 28)).padStart(2, '0');
      const emailName = name.toLowerCase().replace(/[^a-z ]/g, '').replace(/ /g, '.');
      const empTypeSeed = rng();

      employees.push({
        employeeId: `NCGR-${idCounter}`,
        name,
        role,
        tower: dist.tower,
        department: dist.department,
        position: pos,
        location: loc,
        manager: towerManagers[dist.tower] || 'Faisal Al-Harbi',
        mobile: genPhone(),
        email: `${emailName}@demo.ncgr.local`,
        status,
        shift,
        joiningDate: `${year}-${month}-${day}`,
        nationality: isExpat ? (rng() < 0.7 ? 'Indian' : 'Pakistani') : 'Saudi',
        expatLocal: isExpat ? 'Expat' : 'Local',
        employmentType: empTypeSeed < 0.1 ? 'Contract' : empTypeSeed < 0.15 ? 'Consultant' : 'Full-Time',
        currentAssignment: assignments[(idCounter + i) % assignments.length],
        locationBucket: bucket,
        roleHistory: generateRoleHistory(idCounter - 1001, role, `${year}-${month}-${day}`, name),
        level: getPositionLevel(pos),
        gender: isFemale ? 'Female' : 'Male',
      });
      idCounter++;
    }
  }

  return employees;
}

export const masterEmployees: MasterEmployee[] = generateEmployees();

// ─── SAUDIZATION HELPERS ──────────────────────────────────────
export interface SaudizationDomainStat {
  locationBucket: string;
  totalCount: number;
  saudiCount: number;
  targetPct: number;
  actualPct: number;
  status: 'OK' | 'NOT OK';
}

/**
 * Returns per-domain Saudization stats. For the domain-level Target/Actual/%/Status,
 * the approved figures from SAUDIZATION_TARGETS are authoritative (Section 4).
 * The Saudi/Total counts come from the actual employee dataset.
 */
export function getSaudizationStats(): { domains: SaudizationDomainStat[]; overallPct: number; overallSaudiCount: number; overallTotal: number } {
  const totalSaudi = masterEmployees.filter(e => e.expatLocal === 'Local').length;
  const overallPct = masterEmployees.length > 0 ? Math.round((totalSaudi / masterEmployees.length) * 100) : 0;

  const domains: SaudizationDomainStat[] = SAUDIZATION_TARGETS.map(t => {
    const domainEmps = masterEmployees.filter(e => e.locationBucket === t.locationBucket);
    const domainSaudi = domainEmps.filter(e => e.expatLocal === 'Local').length;
    return {
      locationBucket: t.locationBucket,
      totalCount: domainEmps.length,
      saudiCount: domainSaudi,
      targetPct: t.targetPct,
      actualPct: t.actualPct, // Authoritative approved figure
      status: t.status,
    };
  });

  return { domains, overallPct, overallSaudiCount: totalSaudi, overallTotal: masterEmployees.length };
}

// Helper to get employee by ID
export function getEmployeeById(id: string): MasterEmployee | undefined {
  return masterEmployees.find(e => e.employeeId === id);
}

// Helper to get employee by name
export function getEmployeeByName(name: string): MasterEmployee | undefined {
  return masterEmployees.find(e => e.name === name);
}

// ─── ACTIVITY CHECKLIST DATA ──────────────────────────────────
export interface ActivityItem {
  id: string;
  activity: string;
  tower: string;
  owner: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  dueTime: string;
  completionPct: number;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Overdue';
  lastCompleted: string;
  nextDue: string;
  remarks: string;
}

export const activityChecklistItems: ActivityItem[] = [
  { id: 'ACT-CHK-01', activity: 'Daily Infrastructure Health Review', tower: 'Infrastructure', owner: 'Ahmed Al-Qahtani', frequency: 'Daily', dueTime: '08:00 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 07:45 AM', nextDue: '2026-08-13 08:00 AM', remarks: '286 compute nodes verified' },
  { id: 'ACT-CHK-02', activity: 'NOC Monitoring Validation', tower: 'Network', owner: 'Khalid Al-Shammari', frequency: 'Daily', dueTime: '06:30 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 06:15 AM', nextDue: '2026-08-13 06:30 AM', remarks: '1,248 monitored assets normal' },
  { id: 'ACT-CHK-03', activity: 'Network Device Health Review', tower: 'Network', owner: 'Mohammed Al-Dosari', frequency: 'Daily', dueTime: '09:00 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 08:50 AM', nextDue: '2026-08-13 09:00 AM', remarks: '48 core network switches verified' },
  { id: 'ACT-CHK-04', activity: 'Database Backup Validation', tower: 'Database', owner: 'Omar Al-Mutairi', frequency: 'Daily', dueTime: '07:00 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 06:45 AM', nextDue: '2026-08-13 07:00 AM', remarks: '34 enterprise DB backups successful' },
  { id: 'ACT-CHK-05', activity: 'Cloud Capacity Review', tower: 'Cloud', owner: 'Priya Nair', frequency: 'Weekly', dueTime: '11:00 AM', completionPct: 60, status: 'In Progress', lastCompleted: '2026-08-05 10:30 AM', nextDue: '2026-08-12 11:00 AM', remarks: 'GCP & Azure quota check in progress' },
  { id: 'ACT-CHK-06', activity: 'Application Batch Validation', tower: 'Applications', owner: 'Sara Al-Otaibi', frequency: 'Daily', dueTime: '08:30 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 08:15 AM', nextDue: '2026-08-13 08:30 AM', remarks: 'SAP & Oracle batch runs cleared' },
  { id: 'ACT-CHK-07', activity: 'Backup Restore Test', tower: 'Infrastructure', owner: 'Rakesh Kumar', frequency: 'Weekly', dueTime: '02:00 PM', completionPct: 0, status: 'Overdue', lastCompleted: '2026-07-29 02:00 PM', nextDue: '2026-08-05 02:00 PM', remarks: 'Requires DR storage array access' },
  { id: 'ACT-CHK-08', activity: 'Security Patch Compliance Review', tower: 'Security', owner: 'Daniel Mathew', frequency: 'Weekly', dueTime: '04:00 PM', completionPct: 40, status: 'Pending', lastCompleted: '2026-08-05 03:30 PM', nextDue: '2026-08-12 04:00 PM', remarks: 'Patching compliance at 94.2%' },
  { id: 'ACT-CHK-09', activity: 'ServiceNow Integration Health Check', tower: 'Applications', owner: 'Arjun Menon', frequency: 'Daily', dueTime: '09:30 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 09:10 AM', nextDue: '2026-08-13 09:30 AM', remarks: 'REST APIs & CMDB discovery active' },
  { id: 'ACT-CHK-10', activity: 'Major Incident Readiness Check', tower: 'Service Desk', owner: 'Aisha Rahman', frequency: 'Weekly', dueTime: '10:00 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-10 09:45 AM', nextDue: '2026-08-17 10:00 AM', remarks: 'On-call bridge lines operational' },
  { id: 'ACT-CHK-11', activity: 'DR Replication Validation', tower: 'Database', owner: 'Omar Al-Mutairi', frequency: 'Weekly', dueTime: '12:00 PM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-08 11:30 AM', nextDue: '2026-08-15 12:00 PM', remarks: 'Riyadh DR lag < 15 seconds' },
  { id: 'ACT-CHK-12', activity: 'Monitoring Alert Review', tower: 'Network', owner: 'Khalid Al-Shammari', frequency: 'Daily', dueTime: '05:00 PM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-11 04:50 PM', nextDue: '2026-08-12 05:00 PM', remarks: 'Triage rules tuned for Splunk' },
  { id: 'ACT-CHK-13', activity: 'Vendor Action Review', tower: 'Service Desk', owner: 'Noura Al-Qahtani', frequency: 'Weekly', dueTime: '03:00 PM', completionPct: 30, status: 'Pending', lastCompleted: '2026-08-05 02:30 PM', nextDue: '2026-08-12 03:00 PM', remarks: 'Reviewing Gulf Tech SLA report' },
  { id: 'ACT-CHK-14', activity: 'Shift Handover Quality Review', tower: 'Service Desk', owner: 'Faisal Al-Harbi', frequency: 'Daily', dueTime: '07:30 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 07:20 AM', nextDue: '2026-08-13 07:30 AM', remarks: 'Handover logs complete for all towers' },
  { id: 'ACT-CHK-15', activity: 'Weekly Operational Governance Review', tower: 'Service Desk', owner: 'Faisal Al-Harbi', frequency: 'Weekly', dueTime: '05:00 PM', completionPct: 20, status: 'Pending', lastCompleted: '2026-08-05 04:30 PM', nextDue: '2026-08-12 05:00 PM', remarks: 'Agenda prepared for SDM sync' },
  { id: 'ACT-CHK-16', activity: 'SAP Basis Daily Health Check', tower: 'SAP', owner: 'Sara Al-Otaibi', frequency: 'Daily', dueTime: '07:30 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 07:15 AM', nextDue: '2026-08-13 07:30 AM', remarks: 'All SAP systems green' },
  { id: 'ACT-CHK-17', activity: 'Digital Workplace Patch Review', tower: 'Digital Workplace', owner: 'Layla Hassan', frequency: 'Weekly', dueTime: '10:00 AM', completionPct: 75, status: 'In Progress', lastCompleted: '2026-08-05 09:45 AM', nextDue: '2026-08-12 10:00 AM', remarks: '45 endpoints pending patches' },
  { id: 'ACT-CHK-18', activity: 'Cloud Cost Anomaly Review', tower: 'Cloud', owner: 'Priya Nair', frequency: 'Daily', dueTime: '10:00 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 09:50 AM', nextDue: '2026-08-13 10:00 AM', remarks: 'No anomalies detected' },
];

// ─── HANDOVER LOGS DATA ───────────────────────────────────────
export interface HandoverRecord {
  id: string;
  date: string;
  outgoingEngineer: string;
  incomingEngineer: string;
  tower: string;
  shift: string;
  criticalEvents: string;
  openIncidents: string;
  pendingActions: string;
  risks: string;
  dependencies: string;
  status: 'Completed' | 'Attention Required' | 'In Progress';
}

export const handoverLogsList: HandoverRecord[] = [
  { id: 'HL-2401', date: '2026-08-12', outgoingEngineer: 'Mohammed Al-Dosari', incomingEngineer: 'Khalid Al-Shammari', tower: 'Network', shift: 'Morning → Evening', criticalEvents: 'Core router B interface reset performed at 10:15 AM', openIncidents: 'INC-26082 (P2 WAN Latency)', pendingActions: 'Verify BGP route metrics', risks: 'High WAN utilization during peak hours', dependencies: 'STC Link Provider', status: 'Completed' },
  { id: 'HL-2402', date: '2026-08-12', outgoingEngineer: 'Rakesh Kumar', incomingEngineer: 'Ahmed Al-Qahtani', tower: 'Infrastructure', shift: 'Night → Morning', criticalEvents: 'VMware host ESX-04 maintenance mode cleared', openIncidents: 'None', pendingActions: 'Run backup restore test on INF-003', risks: 'Memory utilization at 83% on host ESX-02', dependencies: 'Storage SAN Array', status: 'Completed' },
  { id: 'HL-2403', date: '2026-08-12', outgoingEngineer: 'Omar Al-Mutairi', incomingEngineer: 'Ahmed Al-Qahtani', tower: 'Database', shift: 'Evening → Night', criticalEvents: 'Oracle RAC DR node sync catchup initiated', openIncidents: 'INC-26083 (DB Replication Delay)', pendingActions: 'Monitor redo log apply rate', risks: 'Replication lag increased to 45s', dependencies: 'Riyadh DR Link', status: 'Attention Required' },
  { id: 'HL-2404', date: '2026-08-11', outgoingEngineer: 'Khalid Al-Shammari', incomingEngineer: 'Aisha Rahman', tower: 'Service Desk', shift: 'Night → Morning', criticalEvents: 'Splunk ITSI alert volume normal overnight', openIncidents: 'INC-26081 (P1 App Connectivity)', pendingActions: 'Follow up with Application Support Lead', risks: 'Connection pool warning', dependencies: 'Oracle DB Pool', status: 'Completed' },
  { id: 'HL-2405', date: '2026-08-11', outgoingEngineer: 'Priya Nair', incomingEngineer: 'Ahmed Al-Qahtani', tower: 'Cloud', shift: 'Morning → Evening', criticalEvents: 'GCP compute quota expansion request submitted', openIncidents: 'None', pendingActions: 'Review Azure SQL autoscale logs', risks: 'Cloud spend variance +4.7%', dependencies: 'Cloud Team', status: 'Completed' },
  { id: 'HL-2406', date: '2026-08-11', outgoingEngineer: 'Sara Al-Otaibi', incomingEngineer: 'Arjun Menon', tower: 'Applications', shift: 'Morning → Evening', criticalEvents: 'SAP PO transaction throughput restored', openIncidents: 'INC-26081', pendingActions: 'Verify evening batch schedule', risks: 'High memory usage on WebLogic app server', dependencies: 'Middleware Team', status: 'Completed' },
  { id: 'HL-2407', date: '2026-08-10', outgoingEngineer: 'Daniel Mathew', incomingEngineer: 'Layla Hassan', tower: 'Security', shift: 'Morning → Evening', criticalEvents: 'BeyondTrust PAM policy update deployed', openIncidents: 'None', pendingActions: 'Audit privileged access logs', risks: '14 certificate renewals approaching', dependencies: 'AppViewX PKI', status: 'Completed' },
  { id: 'HL-2408', date: '2026-08-10', outgoingEngineer: 'Layla Hassan', incomingEngineer: 'Aisha Rahman', tower: 'Digital Workplace', shift: 'Evening → Night', criticalEvents: 'Teams & Exchange hybrid sync verified', openIncidents: 'None', pendingActions: 'Patch 45 remote endpoints', risks: 'VPN gateway CPU spike', dependencies: 'STC ExpressRoute', status: 'Completed' },
  { id: 'HL-2409', date: '2026-08-10', outgoingEngineer: 'Arjun Menon', incomingEngineer: 'Faisal Al-Harbi', tower: 'Applications', shift: 'Morning → Evening', criticalEvents: 'Ansible remediation job expansion active', openIncidents: 'None', pendingActions: 'Review AI bot response logs', risks: 'Low training dataset for RCA assist', dependencies: 'ITSM Knowledge Base', status: 'Completed' },
  { id: 'HL-2410', date: '2026-08-09', outgoingEngineer: 'Huda Al-Salem', incomingEngineer: 'Faisal Al-Harbi', tower: 'Service Desk', shift: 'Morning → Evening', criticalEvents: 'CAB meeting approved 3 changes for weekend', openIncidents: 'CHG-1092', pendingActions: 'Distribute approved change schedule', risks: 'Emergency patch pending approval', dependencies: 'CAB Lead', status: 'Completed' },
  { id: 'HL-2411', date: '2026-08-09', outgoingEngineer: 'Vivek Srinivasan', incomingEngineer: 'Noura Al-Qahtani', tower: 'Service Desk', shift: 'Morning → Evening', criticalEvents: 'Monthly cloud budget review completed', openIncidents: 'None', pendingActions: 'Prepare WSR slide', risks: 'Idle VM cleanup pending owner approval', dependencies: 'Cloud Lead', status: 'Completed' },
  { id: 'HL-2412', date: '2026-08-08', outgoingEngineer: 'Mohammed Al-Dosari', incomingEngineer: 'Khalid Al-Shammari', tower: 'Network', shift: 'Evening → Night', criticalEvents: 'SD-WAN failover test successful', openIncidents: 'None', pendingActions: 'Verify WAN telemetry in SolarWinds', risks: 'Jeddah link latency elevated', dependencies: 'Telecom Vendor', status: 'Completed' },
  { id: 'HL-2413', date: '2026-08-08', outgoingEngineer: 'Ahmed Al-Qahtani', incomingEngineer: 'Rakesh Kumar', tower: 'Infrastructure', shift: 'Morning → Evening', criticalEvents: 'SAN storage firmware upgrade complete', openIncidents: 'None', pendingActions: 'Verify SAN multipathing on ESXi', risks: 'Storage volume at 72% capacity', dependencies: 'Vendor Support', status: 'Completed' },
  { id: 'HL-2414', date: '2026-08-07', outgoingEngineer: 'Omar Al-Mutairi', incomingEngineer: 'Ahmed Al-Qahtani', tower: 'Database', shift: 'Morning → Evening', criticalEvents: 'PostgreSQL cluster maintenance completed', openIncidents: 'None', pendingActions: 'Validate DB connection pool', risks: 'High query latency on reporting DB', dependencies: 'App Support', status: 'Completed' },
  { id: 'HL-2415', date: '2026-08-07', outgoingEngineer: 'Aisha Rahman', incomingEngineer: 'Khalid Al-Shammari', tower: 'Service Desk', shift: 'Evening → Night', criticalEvents: 'Service Desk queue cleared before shift end', openIncidents: '2 P3 tickets open', pendingActions: 'First-line triage for night tickets', risks: 'Reduced staffing during night shift', dependencies: 'On-Call Roster', status: 'Completed' },
];

// ─── OPERATIONS MOM & ACTIONS DATA ────────────────────────────
export interface MomAction {
  id: string;
  meeting: string;
  tower: string;
  date: string;
  action: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Overdue';
  age: string;
  escalationRequired: boolean;
}

export const momActionsList: MomAction[] = [
  { id: 'ACT-001', meeting: 'Daily ITMS Ops Standup', tower: 'Infrastructure', date: '2026-08-10', action: 'Complete backup restore validation on INF-003 compute cluster', owner: 'Rakesh Kumar', priority: 'High', dueDate: '2026-08-15', status: 'In Progress', age: '2 days', escalationRequired: false },
  { id: 'ACT-002', meeting: 'Weekly Network Tower Governance', tower: 'Network', date: '2026-08-08', action: 'Review recurring WAN utilization alerts on STC link', owner: 'Mohammed Al-Dosari', priority: 'Medium', dueDate: '2026-08-14', status: 'Open', age: '4 days', escalationRequired: false },
  { id: 'ACT-003', meeting: 'ServiceNow Platform Review', tower: 'Applications', date: '2026-08-05', action: 'Complete ServiceNow CMDB data-quality reconciliation for 4,300 CIs', owner: 'Arjun Menon', priority: 'High', dueDate: '2026-08-18', status: 'In Progress', age: '7 days', escalationRequired: false },
  { id: 'ACT-004', meeting: 'Monthly Cloud Steering', tower: 'Cloud', date: '2026-08-01', action: 'Finalize cloud cost optimization candidates for GCP Compute Engine', owner: 'Vivek Srinivasan', priority: 'Medium', dueDate: '2026-08-20', status: 'Open', age: '11 days', escalationRequired: false },
  { id: 'ACT-005', meeting: 'NOC Operations Review', tower: 'Network', date: '2026-08-09', action: 'Close overdue monitoring coverage gaps for container nodes', owner: 'Khalid Al-Shammari', priority: 'High', dueDate: '2026-08-13', status: 'Open', age: '3 days', escalationRequired: true },
  { id: 'ACT-006', meeting: 'Database Operations Sync', tower: 'Database', date: '2026-08-07', action: 'Upgrade Oracle RAC interconnect bandwidth to 40Gbps', owner: 'Omar Al-Mutairi', priority: 'High', dueDate: '2026-08-25', status: 'In Progress', age: '5 days', escalationRequired: false },
  { id: 'ACT-007', meeting: 'Security Operations Governance', tower: 'Security', date: '2026-08-06', action: 'Automate ACME protocol integration for internal PKI certificates', owner: 'Daniel Mathew', priority: 'High', dueDate: '2026-08-18', status: 'In Progress', age: '6 days', escalationRequired: false },
  { id: 'ACT-008', meeting: 'Application Support Standup', tower: 'Applications', date: '2026-08-11', action: 'Tune AppDynamics APM latency threshold rules for SAP PO', owner: 'Sara Al-Otaibi', priority: 'Medium', dueDate: '2026-08-16', status: 'In Progress', age: '1 day', escalationRequired: false },
  { id: 'ACT-009', meeting: 'Cloud Governance Committee', tower: 'Cloud', date: '2026-08-04', action: 'Schedule automated shutdown for non-production dev clusters', owner: 'Priya Nair', priority: 'Medium', dueDate: '2026-08-22', status: 'Open', age: '8 days', escalationRequired: false },
  { id: 'ACT-010', meeting: 'Service Desk Review', tower: 'Service Desk', date: '2026-08-10', action: 'Update level-1 password reset Knowledge Base article KB-108', owner: 'Aisha Rahman', priority: 'Low', dueDate: '2026-08-17', status: 'Completed', age: '2 days', escalationRequired: false },
  { id: 'ACT-011', meeting: 'Program Management Office', tower: 'Service Desk', date: '2026-08-03', action: 'Obtain commercial sign-off for Splunk license capacity expansion', owner: 'Noura Al-Qahtani', priority: 'High', dueDate: '2026-08-12', status: 'Overdue', age: '9 days', escalationRequired: true },
  { id: 'ACT-012', meeting: 'Change Advisory Board', tower: 'Service Desk', date: '2026-08-09', action: 'Review emergency patch backout procedure for Oracle RAC cluster', owner: 'Huda Al-Salem', priority: 'High', dueDate: '2026-08-14', status: 'Completed', age: '3 days', escalationRequired: false },
  { id: 'ACT-013', meeting: 'Digital Workplace Sync', tower: 'Digital Workplace', date: '2026-08-08', action: 'Deploy Teams video endpoint bandwidth optimization policy', owner: 'Layla Hassan', priority: 'Low', dueDate: '2026-08-19', status: 'Open', age: '4 days', escalationRequired: false },
  { id: 'ACT-014', meeting: 'Daily ITMS Ops Standup', tower: 'Service Desk', date: '2026-08-12', action: 'Confirm NOC night shift standby replacement resource assignment', owner: 'Faisal Al-Harbi', priority: 'High', dueDate: '2026-08-12', status: 'Completed', age: '0 days', escalationRequired: false },
  { id: 'ACT-015', meeting: 'Vendor SIAM Review', tower: 'Service Desk', date: '2026-08-02', action: 'Audit Gulf Technology Services SLA penalty calculation report', owner: 'Noura Al-Qahtani', priority: 'Medium', dueDate: '2026-08-28', status: 'Open', age: '10 days', escalationRequired: false },
  { id: 'ACT-016', meeting: 'SAP Basis Review', tower: 'SAP', date: '2026-08-11', action: 'Plan SAP ECC upgrade window for Q4 release', owner: 'Sara Al-Otaibi', priority: 'High', dueDate: '2026-08-30', status: 'In Progress', age: '1 day', escalationRequired: false },
  { id: 'ACT-017', meeting: 'Security Review', tower: 'Security', date: '2026-08-12', action: 'Complete vulnerability remediation for critical CVEs', owner: 'Daniel Mathew', priority: 'High', dueDate: '2026-08-16', status: 'In Progress', age: '0 days', escalationRequired: true },
];

// ─── LEAVE MANAGEMENT DATA ────────────────────────────────────
export interface LeaveRecord {
  id: string;
  employee: string;
  employeeId: string;
  tower: string;
  leaveType: 'Annual Leave' | 'Emergency Leave' | 'Sick Leave' | 'Training Leave';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  submittedDate: string;
  reportingManager: string;
  approver: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Cancelled';
  backupResource: string;
}

export const leaveRecordsList: LeaveRecord[] = [
  { id: 'LEV-101', employee: 'Faisal Al-Harbi', employeeId: 'NCGR-1001', tower: 'Service Desk', leaveType: 'Annual Leave', startDate: '2026-08-20', endDate: '2026-08-22', days: 3, reason: 'Family vacation', submittedDate: '2026-08-01', reportingManager: 'Executive Leadership', approver: 'Noura Al-Qahtani', status: 'Approved', backupResource: 'Huda Al-Salem' },
  { id: 'LEV-102', employee: 'Omar Al-Mutairi', employeeId: 'NCGR-1007', tower: 'Database', leaveType: 'Annual Leave', startDate: '2026-08-25', endDate: '2026-08-29', days: 5, reason: 'Personal travel', submittedDate: '2026-08-05', reportingManager: 'Ahmed Al-Qahtani', approver: 'Ahmed Al-Qahtani', status: 'Pending', backupResource: 'Ahmed Al-Qahtani' },
  { id: 'LEV-103', employee: 'Rakesh Kumar', employeeId: 'NCGR-1011', tower: 'Infrastructure', leaveType: 'Emergency Leave', startDate: '2026-08-10', endDate: '2026-08-11', days: 2, reason: 'Family emergency', submittedDate: '2026-08-09', reportingManager: 'Ahmed Al-Qahtani', approver: 'Ahmed Al-Qahtani', status: 'Approved', backupResource: 'Ahmed Al-Qahtani' },
  { id: 'LEV-104', employee: 'Sara Al-Otaibi', employeeId: 'NCGR-1004', tower: 'Applications', leaveType: 'Training Leave', startDate: '2026-09-01', endDate: '2026-09-03', days: 3, reason: 'AWS Solutions Architect training', submittedDate: '2026-08-10', reportingManager: 'Faisal Al-Harbi', approver: 'Faisal Al-Harbi', status: 'Pending', backupResource: 'Arjun Menon' },
  { id: 'LEV-105', employee: 'Khalid Al-Shammari', employeeId: 'NCGR-1005', tower: 'Network', leaveType: 'Sick Leave', startDate: '2026-08-04', endDate: '2026-08-05', days: 2, reason: 'Medical appointment', submittedDate: '2026-08-03', reportingManager: 'Mohammed Al-Dosari', approver: 'Mohammed Al-Dosari', status: 'Approved', backupResource: 'Mohammed Al-Dosari' },
  { id: 'LEV-106', employee: 'Priya Nair', employeeId: 'NCGR-1006', tower: 'Cloud', leaveType: 'Annual Leave', startDate: '2026-09-10', endDate: '2026-09-18', days: 7, reason: 'Home country visit', submittedDate: '2026-08-01', reportingManager: 'Ahmed Al-Qahtani', approver: 'Ahmed Al-Qahtani', status: 'Approved', backupResource: 'Rakesh Kumar' },
  { id: 'LEV-107', employee: 'Daniel Mathew', employeeId: 'NCGR-1013', tower: 'Security', leaveType: 'Training Leave', startDate: '2026-08-18', endDate: '2026-08-19', days: 2, reason: 'CISSP certification prep', submittedDate: '2026-08-05', reportingManager: 'Faisal Al-Harbi', approver: 'Faisal Al-Harbi', status: 'Pending', backupResource: 'Layla Hassan' },
  { id: 'LEV-108', employee: 'Arjun Menon', employeeId: 'NCGR-1009', tower: 'Applications', leaveType: 'Annual Leave', startDate: '2026-08-28', endDate: '2026-09-02', days: 4, reason: 'Personal travel', submittedDate: '2026-08-10', reportingManager: 'Faisal Al-Harbi', approver: 'Faisal Al-Harbi', status: 'Pending', backupResource: 'Priya Nair' },
  { id: 'LEV-109', employee: 'Layla Hassan', employeeId: 'NCGR-1012', tower: 'Digital Workplace', leaveType: 'Emergency Leave', startDate: '2026-07-28', endDate: '2026-07-29', days: 2, reason: 'Family matter', submittedDate: '2026-07-27', reportingManager: 'Ahmed Al-Qahtani', approver: 'Ahmed Al-Qahtani', status: 'Approved', backupResource: 'Aisha Rahman' },
  { id: 'LEV-110', employee: 'Aisha Rahman', employeeId: 'NCGR-1008', tower: 'Service Desk', leaveType: 'Annual Leave', startDate: '2026-09-05', endDate: '2026-09-12', days: 6, reason: 'Annual vacation', submittedDate: '2026-08-08', reportingManager: 'Faisal Al-Harbi', approver: 'Faisal Al-Harbi', status: 'Pending', backupResource: 'Huda Al-Salem' },
  { id: 'LEV-111', employee: 'Mohammed Al-Dosari', employeeId: 'NCGR-1003', tower: 'Network', leaveType: 'Annual Leave', startDate: '2026-09-15', endDate: '2026-09-22', days: 6, reason: 'Personal travel', submittedDate: '2026-08-05', reportingManager: 'Faisal Al-Harbi', approver: 'Faisal Al-Harbi', status: 'Pending', backupResource: 'Khalid Al-Shammari' },
  { id: 'LEV-112', employee: 'Ahmed Al-Qahtani', employeeId: 'NCGR-1002', tower: 'Infrastructure', leaveType: 'Annual Leave', startDate: '2026-10-01', endDate: '2026-10-08', days: 6, reason: 'Family holiday', submittedDate: '2026-08-01', reportingManager: 'Faisal Al-Harbi', approver: 'Faisal Al-Harbi', status: 'Approved', backupResource: 'Rakesh Kumar' },
  { id: 'LEV-113', employee: 'Noura Al-Qahtani', employeeId: 'NCGR-1010', tower: 'Service Desk', leaveType: 'Training Leave', startDate: '2026-08-24', endDate: '2026-08-25', days: 2, reason: 'PMP certification workshop', submittedDate: '2026-08-08', reportingManager: 'Faisal Al-Harbi', approver: 'Faisal Al-Harbi', status: 'Approved', backupResource: 'Vivek Srinivasan' },
  { id: 'LEV-114', employee: 'Huda Al-Salem', employeeId: 'NCGR-1014', tower: 'Service Desk', leaveType: 'Annual Leave', startDate: '2026-09-20', endDate: '2026-09-25', days: 5, reason: 'Personal time off', submittedDate: '2026-08-10', reportingManager: 'Faisal Al-Harbi', approver: 'Faisal Al-Harbi', status: 'Pending', backupResource: 'Faisal Al-Harbi' },
  { id: 'LEV-115', employee: 'Vivek Srinivasan', employeeId: 'NCGR-1015', tower: 'Service Desk', leaveType: 'Sick Leave', startDate: '2026-08-01', endDate: '2026-08-01', days: 1, reason: 'Unwell', submittedDate: '2026-07-31', reportingManager: 'Noura Al-Qahtani', approver: 'Noura Al-Qahtani', status: 'Approved', backupResource: 'Noura Al-Qahtani' },
  { id: 'LEV-116', employee: 'Sultan Al-Malki', employeeId: 'NCGR-1020', tower: 'Infrastructure', leaveType: 'Annual Leave', startDate: '2026-08-22', endDate: '2026-08-26', days: 3, reason: 'Personal travel', submittedDate: '2026-08-08', reportingManager: 'Ahmed Al-Qahtani', approver: 'Ahmed Al-Qahtani', status: 'Pending', backupResource: 'Rakesh Kumar' },
  { id: 'LEV-117', employee: 'Turki Al-Zahrani', employeeId: 'NCGR-1025', tower: 'Network', leaveType: 'Sick Leave', startDate: '2026-08-13', endDate: '2026-08-14', days: 2, reason: 'Medical leave', submittedDate: '2026-08-12', reportingManager: 'Mohammed Al-Dosari', approver: 'Mohammed Al-Dosari', status: 'Pending', backupResource: 'Khalid Al-Shammari' },
  { id: 'LEV-118', employee: 'Abdulaziz Al-Rashidi', employeeId: 'NCGR-1035', tower: 'SAP', leaveType: 'Annual Leave', startDate: '2026-09-01', endDate: '2026-09-05', days: 5, reason: 'Family event', submittedDate: '2026-08-10', reportingManager: 'Sara Al-Otaibi', approver: 'Sara Al-Otaibi', status: 'Pending', backupResource: 'Sara Al-Otaibi' },
];

// ─── ATTENDANCE DATA ──────────────────────────────────────────
export interface AttendanceRecord {
  id: string;
  employee: string;
  employeeId: string;
  tower: string;
  date: string;
  shift: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'On Leave' | 'Absent' | 'Remote' | 'Training';
  workLocation: string;
}

export const attendanceRecordsList: AttendanceRecord[] = masterEmployees.map((emp, idx) => ({
  id: `ATT-${1000 + idx + 1}`,
  employee: emp.name,
  employeeId: emp.employeeId,
  tower: emp.tower,
  date: '2026-08-12',
  shift: emp.shift,
  checkIn: emp.status === 'On Leave' || emp.status === 'Training' ? 'N/A' : emp.shift.startsWith('Morning') ? '05:55 AM' : emp.shift.startsWith('Evening') ? '01:52 PM' : '09:50 PM',
  checkOut: emp.status === 'On Leave' || emp.status === 'Training' ? 'N/A' : emp.shift.startsWith('Morning') ? '02:05 PM' : emp.shift.startsWith('Evening') ? '10:05 PM' : '06:05 AM',
  status: emp.status === 'On Leave' ? 'On Leave' : emp.status === 'Training' ? 'Training' : emp.status === 'Remote' ? 'Remote' : emp.status === 'Standby' ? 'Absent' : 'Present',
  workLocation: emp.location,
}));

// ─── EMPLOYEE STATS HELPERS ───────────────────────────────────
export function getEmployeeStats(towerFilter?: string) {
  const filtered = towerFilter && towerFilter !== 'All Towers'
    ? masterEmployees.filter(e => e.tower === towerFilter)
    : masterEmployees;

  const total = filtered.length;
  const present = filtered.filter(e => e.status === 'Active' || e.status === 'Remote').length;
  const onLeave = filtered.filter(e => e.status === 'On Leave').length;
  const training = filtered.filter(e => e.status === 'Training').length;
  const absent = filtered.filter(e => e.status === 'Standby').length;
  const other = total - present - onLeave - training - absent;

  return { total, present, onLeave, training, absent, other };
}

export function getEmployeeStatsByTower() {
  const towers = [...new Set(masterEmployees.map(e => e.tower))];
  return towers.map(tower => ({
    tower,
    ...getEmployeeStats(tower),
  }));
}
