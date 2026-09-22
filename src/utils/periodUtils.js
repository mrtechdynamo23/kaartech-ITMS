/**
 * KaarTech ITMS Control Tower — Period Model & Utilities
 * 
 * Enforces standard 3-month quarters:
 * Q1 = January – March (Months 1–3)
 * Q2 = April – June (Months 4–6)
 * Q3 = July – September (Months 7–9)
 * Q4 = October – December (Months 10–12)
 * 
 * Source of truth: The record's date (createdDate, resolvedDate, closedDate).
 */

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_SHORT_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const CURRENT_REPORTING_PERIOD = '2026-09';
export const CURRENT_REPORTING_DATE = '2026-09-30';

// Canonical Master Period Definitions
const ALL_PERIOD_DEFINITIONS = [
  { value: 'all', label: 'All Periods', group: 'All' },
  { value: 'ytd_2026', label: 'YTD 2026 (Jan – Sep)', group: 'YTD' },
  // Quarters
  { value: 'q1_2026', label: 'Q1 2026 (Jan – Mar)', group: 'Quarter', endMonth: '2026-03' },
  { value: 'q2_2026', label: 'Q2 2026 (Apr – Jun)', group: 'Quarter', endMonth: '2026-06' },
  { value: 'q3_2026', label: 'Q3 2026 (Jul – Sep)', group: 'Quarter', endMonth: '2026-09' },
  { value: 'q4_2026', label: 'Q4 2026 (Oct – Dec)', group: 'Quarter', endMonth: '2026-12' },
  // Months
  { value: '2026-01', label: 'Jan 2026', group: 'Month' },
  { value: '2026-02', label: 'Feb 2026', group: 'Month' },
  { value: '2026-03', label: 'Mar 2026', group: 'Month' },
  { value: '2026-04', label: 'Apr 2026', group: 'Month' },
  { value: '2026-05', label: 'May 2026', group: 'Month' },
  { value: '2026-06', label: 'Jun 2026', group: 'Month' },
  { value: '2026-07', label: 'Jul 2026', group: 'Month' },
  { value: '2026-08', label: 'Aug 2026', group: 'Month' },
  { value: '2026-09', label: 'Sep 2026', group: 'Month' },
  { value: '2026-10', label: 'Oct 2026', group: 'Month' },
  { value: '2026-11', label: 'Nov 2026', group: 'Month' },
  { value: '2026-12', label: 'Dec 2026', group: 'Month' },
];

// Canonical Period Options for Filter Dropdowns (Excludes future periods based on current reporting date)
export const PERIOD_OPTIONS = ALL_PERIOD_DEFINITIONS
  .filter(opt => {
    if (opt.group === 'Month') {
      return opt.value <= CURRENT_REPORTING_PERIOD;
    }
    if (opt.group === 'Quarter') {
      return opt.endMonth ? opt.endMonth <= CURRENT_REPORTING_PERIOD : true;
    }
    return true;
  })
  .map(({ endMonth, ...opt }) => opt);

/**
 * Normalizes a period key to standard format.
 * Supports legacy aliases like m_jan, 2026-01, q1, q1_2026, and text dates like 'Sep 2026'.
 */
export function normalizePeriodKey(period) {
  if (!period || period === 'all') return 'all';
  const p = String(period).toLowerCase().trim();
  if (p === 'ytd' || p === 'ytd_2026') return 'ytd_2026';
  if (p === 'q1' || p === 'q1_2026' || p.includes('q1')) return 'q1_2026';
  if (p === 'q2' || p === 'q2_2026' || p.includes('q2')) return 'q2_2026';
  if (p === 'q3' || p === 'q3_2026' || p.includes('q3')) return 'q3_2026';
  if (p === 'q4' || p === 'q4_2026' || p.includes('q4')) return 'q4_2026';

  const monthMap = {
    m_jan: '2026-01', m_feb: '2026-02', m_mar: '2026-03',
    m_apr: '2026-04', m_may: '2026-05', m_jun: '2026-06',
    m_jul: '2026-07', m_aug: '2026-08', m_sep: '2026-09',
    m_oct: '2026-10', m_nov: '2026-11', m_dec: '2026-12',
    jan: '2026-01', feb: '2026-02', mar: '2026-03',
    apr: '2026-04', may: '2026-05', jun: '2026-06',
    jul: '2026-07', aug: '2026-08', sep: '2026-09',
    oct: '2026-10', nov: '2026-11', dec: '2026-12',
    'jan 2026': '2026-01', 'feb 2026': '2026-02', 'mar 2026': '2026-03',
    'apr 2026': '2026-04', 'may 2026': '2026-05', 'jun 2026': '2026-06',
    'jul 2026': '2026-07', 'aug 2026': '2026-08', 'sep 2026': '2026-09',
    'oct 2026': '2026-10', 'nov 2026': '2026-11', 'dec 2026': '2026-12',
    'january 2026': '2026-01', 'february 2026': '2026-02', 'march 2026': '2026-03',
    'april 2026': '2026-04', 'may 2026': '2026-05', 'june 2026': '2026-06',
    'july 2026': '2026-07', 'august 2026': '2026-08', 'september 2026': '2026-09',
    'october 2026': '2026-10', 'november 2026': '2026-11', 'december 2026': '2026-12',
  };
  if (monthMap[p]) return monthMap[p];
  return p;
}

/**
 * Extracts derived Year, Month (1-12), and Quarter (1-4) from a date string (YYYY-MM-DD).
 */
export function getRecordDateInfo(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;

  const year = d.getFullYear();
  const month = d.getMonth() + 1; // 1-12
  const quarter = Math.ceil(month / 3); // 1-4
  const monthStr = String(month).padStart(2, '0');

  return {
    year,
    month,
    quarter,
    monthKey: `${year}-${monthStr}`,
    quarterKey: `q${quarter}_${year}`,
    monthName: MONTH_NAMES[month - 1],
    monthShort: MONTH_SHORT_NAMES[month - 1],
    label: `${MONTH_SHORT_NAMES[month - 1]} ${year}`,
  };
}

/**
 * Returns the [startDate, endDate] range for a given period key.
 */
export function getPeriodDateRange(periodKey, baseYear = 2026) {
  const norm = normalizePeriodKey(periodKey);
  if (norm === 'all' || norm === 'ytd_2026') {
    return {
      startDate: `${baseYear}-01-01`,
      endDate: `${baseYear}-12-31`,
      isWholeYear: true,
    };
  }

  if (norm === 'q1_2026') {
    return { startDate: `${baseYear}-01-01`, endDate: `${baseYear}-03-31`, quarter: 1 };
  }
  if (norm === 'q2_2026') {
    return { startDate: `${baseYear}-04-01`, endDate: `${baseYear}-06-30`, quarter: 2 };
  }
  if (norm === 'q3_2026') {
    return { startDate: `${baseYear}-07-01`, endDate: `${baseYear}-09-30`, quarter: 3 };
  }
  if (norm === 'q4_2026') {
    return { startDate: `${baseYear}-10-01`, endDate: `${baseYear}-12-31`, quarter: 4 };
  }

  // Monthly: e.g. 2026-05
  if (/^\d{4}-\d{2}$/.test(norm)) {
    const [y, m] = norm.split('-').map(Number);
    const lastDay = new Date(y, m, 0).getDate();
    return {
      startDate: `${norm}-01`,
      endDate: `${norm}-${String(lastDay).padStart(2, '0')}`,
      month: m,
    };
  }

  return {
    startDate: `${baseYear}-01-01`,
    endDate: `${baseYear}-12-31`,
  };
}

/**
 * Checks if a specific date falls within the selected period.
 */
export function isDateInPeriod(dateStr, periodKey) {
  const norm = normalizePeriodKey(periodKey);
  if (!norm || norm === 'all') return true;
  if (!dateStr) return false;

  const info = getRecordDateInfo(dateStr);
  if (!info) return false;

  if (norm === 'ytd_2026') {
    return info.year === 2026;
  }

  if (norm === 'q1_2026') return info.year === 2026 && info.quarter === 1;
  if (norm === 'q2_2026') return info.year === 2026 && info.quarter === 2;
  if (norm === 'q3_2026') return info.year === 2026 && info.quarter === 3;
  if (norm === 'q4_2026') return info.year === 2026 && info.quarter === 4;

  if (norm === info.monthKey) return true;

  // Legacy alias compatibility
  const legacyAliases = {
    '2026-01': 'm_jan', '2026-02': 'm_feb', '2026-03': 'm_mar',
    '2026-04': 'm_apr', '2026-05': 'm_may', '2026-06': 'm_jun',
    '2026-07': 'm_jul', '2026-08': 'm_aug', '2026-09': 'm_sep',
    '2026-10': 'm_oct', '2026-11': 'm_nov', '2026-12': 'm_dec',
  };
  return legacyAliases[info.monthKey] === norm;
}

// Aliases for compatibility
export const matchesPeriod = isDateInPeriod;
export const checkMatchesPeriod = isDateInPeriod;

/**
 * Determines if a ticket was active/open during a given period.
 * Lifecycle-aware logic:
 * - Ticket was created on or before the period's endDate.
 * - Ticket was either NOT resolved/closed before startDate, OR was resolved during/after startDate.
 */
export function isTicketOpenInPeriod(ticket, periodKey) {
  const norm = normalizePeriodKey(periodKey);
  if (norm === 'all') {
    return !['Closed', 'Resolved'].includes(ticket.status);
  }

  const { startDate, endDate } = getPeriodDateRange(norm);
  const created = ticket.createdDate;
  if (!created || created > endDate) return false;

  const isClosed = ['Closed', 'Resolved'].includes(ticket.status);
  if (!isClosed) {
    // Still currently open, and was created on or before period endDate -> was open during period!
    return true;
  }

  // If closed, check when it was closed
  const closed = ticket.closedDate || ticket.resolvedDate;
  if (!closed) {
    // If closed status but no closed date, fallback to created date in period
    return created >= startDate && created <= endDate;
  }

  // Was open during period if it was closed on or after the period startDate
  return closed >= startDate;
}

/**
 * Calculates lifecycle-aware backlog metrics for a dataset of tickets:
 * Opening Backlog + Inflow (Created in period) - Outflow (Closed in period) = Closing Backlog
 */
export function calculateBacklogLifecycle(tickets, periodKey) {
  const norm = normalizePeriodKey(periodKey);
  if (norm === 'all') {
    const total = tickets.length;
    const closed = tickets.filter(t => ['Closed', 'Resolved'].includes(t.status)).length;
    const open = total - closed;
    return {
      openingBacklog: 0,
      inflow: total,
      outflow: closed,
      closingBacklog: open,
      activeOpen: open,
      inflowTickets: tickets,
      openTickets: tickets.filter(t => !['Closed', 'Resolved'].includes(t.status)),
    };
  }

  const { startDate, endDate } = getPeriodDateRange(norm);

  // Opening Backlog: tickets created BEFORE startDate that were NOT closed before startDate
  const openingTickets = tickets.filter(t => {
    if (!t.createdDate || t.createdDate >= startDate) return false;
    const isClosed = ['Closed', 'Resolved'].includes(t.status);
    if (!isClosed) return true;
    const closed = t.closedDate || t.resolvedDate;
    return closed ? closed >= startDate : false;
  });

  // Inflow: tickets created DURING this period
  const inflowTickets = tickets.filter(t => {
    return t.createdDate && t.createdDate >= startDate && t.createdDate <= endDate;
  });

  // Outflow: tickets closed/resolved DURING this period
  const outflowTickets = tickets.filter(t => {
    const isClosed = ['Closed', 'Resolved'].includes(t.status);
    if (!isClosed) return false;
    const closed = t.closedDate || t.resolvedDate || t.createdDate;
    return closed >= startDate && closed <= endDate;
  });

  // Active Open Backlog during this period:
  // Tickets that were open at any point during this period
  const openTickets = tickets.filter(t => isTicketOpenInPeriod(t, norm));

  const openingBacklog = openingTickets.length;
  const inflow = inflowTickets.length;
  const outflow = outflowTickets.length;
  const closingBacklog = Math.max(0, openingBacklog + inflow - outflow);

  return {
    openingBacklog,
    inflow,
    outflow,
    closingBacklog,
    activeOpen: openTickets.length,
    openingTickets,
    inflowTickets,
    outflowTickets,
    openTickets,
  };
}

/**
 * Returns user-friendly formatted label for any period key
 */
export function formatPeriodLabel(periodKey) {
  const norm = normalizePeriodKey(periodKey);
  if (!norm || norm === 'all') return 'All Periods';
  if (norm === 'ytd_2026') return 'YTD 2026';
  if (norm === 'q1_2026') return 'Q1 2026';
  if (norm === 'q2_2026') return 'Q2 2026';
  if (norm === 'q3_2026') return 'Q3 2026';
  if (norm === 'q4_2026') return 'Q4 2026';

  if (/^\d{4}-\d{2}$/.test(norm)) {
    const [y, m] = norm.split('-').map(Number);
    const monthName = MONTH_SHORT_NAMES[m - 1] || '';
    return `${monthName} ${y}`;
  }

  const found = PERIOD_OPTIONS.find(o => o.value === norm);
  if (found) return found.label;

  return String(periodKey);
}

/**
 * Returns month keys array for a given period
 */
export function getPeriodMonthRange(periodKey, baseYear = 2026) {
  const norm = normalizePeriodKey(periodKey);
  if (norm === 'q1_2026') return [`${baseYear}-01`, `${baseYear}-02`, `${baseYear}-03`];
  if (norm === 'q2_2026') return [`${baseYear}-04`, `${baseYear}-05`, `${baseYear}-06`];
  if (norm === 'q3_2026') return [`${baseYear}-07`, `${baseYear}-08`, `${baseYear}-09`];
  if (norm === 'q4_2026') return [`${baseYear}-10`, `${baseYear}-11`, `${baseYear}-12`];
  if (/^\d{4}-\d{2}$/.test(norm)) return [norm];
  return [
    `${baseYear}-01`, `${baseYear}-02`, `${baseYear}-03`,
    `${baseYear}-04`, `${baseYear}-05`, `${baseYear}-06`,
    `${baseYear}-07`, `${baseYear}-08`, `${baseYear}-09`,
    `${baseYear}-10`, `${baseYear}-11`, `${baseYear}-12`
  ];
}

