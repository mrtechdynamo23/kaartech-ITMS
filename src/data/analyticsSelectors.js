/**
 * KaarTech ITMS Control Tower — Dynamic Analytics & Data Selectors
 * Derives operational analytics, distributions, time-series trends, ageing buckets,
 * and unified calendar events directly from master & demo datasets.
 */
import { incidents, serviceRequests, enhancements, problems, RESOURCES, audits, findings, risks, ctas, licenses, knowledgeArticles, customerFeedback } from './demoData.js';
import { ENTITIES, APPLICATIONS, TRACKS } from './masterData.js';
import { SLA_POLICIES, OVERALL_MONTHLY_RESOLUTION_TARGET } from './config.js';
import { SERVICE_DOMAINS, groupByServiceDomain } from './serviceDomains.js';
import {
  matchesPeriod as checkMatchesPeriod,
  isTicketOpenInPeriod,
  calculateBacklogLifecycle,
  MONTH_SHORT_NAMES,
  getPeriodDateRange,
} from '../utils/periodUtils.js';

// ── Re-export Period Scope Matcher for backwards compatibility ──
export function matchesPeriod(dateStr, period) {
  return checkMatchesPeriod(dateStr, period);
}

// ═══════════════════════════════════════════════════
// 1. INCIDENT ANALYTICS SELECTORS (Section 18)
// ═══════════════════════════════════════════════════
export function getIncidentAnalytics(filter = {}) {
  if (filter.recordType && filter.recordType !== 'all' && filter.recordType !== 'Incident') {
    return {
      total: 0,
      open: 0,
      openingBacklog: 0,
      inflow: 0,
      outflow: 0,
      closingBacklog: 0,
      p1: 0,
      p2: 0,
      p3: 0,
      p4: 0,
      breached: 0,
      atRisk: 0,
      responseSla: 98.4,
      resolutionSla: 98.0,
      priorityDistribution: [],
      monthlyTrend: [],
      ageingBuckets: [],
      slaComparison: [],
      exceptionQueue: [],
      serviceDomainDistribution: [],
      filteredList: [],
    };
  }

  // Base filtering without period to support backlog lifecycle calculation
  const baseFiltered = incidents.filter(item => {
    if (filter.entity && filter.entity !== 'all' && item.entity !== filter.entity) return false;
    if (filter.serviceDomain && filter.serviceDomain !== 'all' && item.serviceDomainId !== filter.serviceDomain && item.serviceDomain !== filter.serviceDomain) return false;
    if (filter.domain && filter.domain !== 'all' && item.serviceDomain !== filter.domain) return false;
    if (filter.priority && filter.priority !== 'all' && item.priority !== filter.priority) return false;
    if (filter.status && filter.status !== 'all' && item.status !== filter.status) return false;
    if (filter.app && filter.app !== 'all' && item.application !== filter.app) return false;
    return true;
  });

  // Calculate lifecycle-aware backlog (Opening + Inflow - Outflow = Closing)
  const backlog = calculateBacklogLifecycle(baseFiltered, filter.period || 'all');

  // Filtered list for display in table and current period KPIs
  const filtered = baseFiltered.filter(item => {
    if (filter.period && filter.period !== 'all') {
      return isTicketOpenInPeriod(item, filter.period) || checkMatchesPeriod(item.createdDate, filter.period);
    }
    return true;
  });

  const inflowTickets = backlog.inflowTickets;
  const total = filter.period && filter.period !== 'all' ? inflowTickets.length : filtered.length;
  const p1 = filtered.filter(i => i.priority === 'P1');
  const p2 = filtered.filter(i => i.priority === 'P2');
  const p3 = filtered.filter(i => i.priority === 'P3');
  const p4 = filtered.filter(i => i.priority === 'P4');
  
  // Lifecycle-aware open count
  const openCount = backlog.activeOpen;
  const breached = filtered.filter(i => i.slaStatus === 'Breached');
  const atRisk = filtered.filter(i => i.slaStatus === 'At Risk');

  // Priority Distribution for Donut
  const priorityDistribution = [
    { name: 'P1 - Critical', value: p1.length, color: '#DC2626', key: 'P1' },
    { name: 'P2 - High', value: p2.length, color: '#D97706', key: 'P2' },
    { name: 'P3 - Medium', value: p3.length, color: '#2563EB', key: 'P3' },
    { name: 'P4 - Low', value: p4.length, color: '#71777C', key: 'P4' },
  ];

  // Dynamic Monthly Created vs Closed Trend across active months
  const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
  const monthlyTrend = months.map(m => {
    const mBacklog = calculateBacklogLifecycle(baseFiltered, m);
    const mCreated = baseFiltered.filter(i => i.createdDate && i.createdDate.startsWith(m)).length;
    const mClosed = baseFiltered.filter(i => {
      const d = i.closedDate || i.resolvedDate || i.createdDate;
      return d && d.startsWith(m) && ['Closed', 'Resolved'].includes(i.status);
    }).length;
    const mBreached = baseFiltered.filter(i => i.createdDate && i.createdDate.startsWith(m) && i.slaStatus === 'Breached').length;
    const [, mo] = m.split('-');
    return {
      month: `${MONTH_SHORT_NAMES[Number(mo) - 1]} 2026`,
      Created: mCreated,
      Closed: mClosed,
      Open: mBacklog.closingBacklog,
      Breached: mBreached,
    };
  });

  // 5 Ageing Buckets: 0–3 days, 4–7 days, 8–15 days, 16–30 days, 30+ days
  const ageingBuckets = [
    { bucket: '0–3 days', count: Math.round(openCount * 0.45), color: '#0D9F6E' },
    { bucket: '4–7 days', count: Math.round(openCount * 0.30), color: '#2563EB' },
    { bucket: '8–15 days', count: Math.round(openCount * 0.15), color: '#D97706' },
    { bucket: '16–30 days', count: Math.round(openCount * 0.08), color: '#EA580C' },
    { bucket: '30+ days', count: Math.max(0, openCount - Math.round(openCount * 0.98)), color: '#DC2626' },
  ];

  // Response vs Resolution SLA Performance
  const slaComparison = [
    { metric: 'P1 (30m / 4h)', Response: 100, Resolution: p1.length ? Math.round((p1.filter(i => i.slaStatus !== 'Breached').length / p1.length) * 100) : 100, Target: 98 },
    { metric: 'P2 (2h / 8h)', Response: 98, Resolution: p2.length ? Math.round((p2.filter(i => i.slaStatus !== 'Breached').length / p2.length) * 100) : 98, Target: 98 },
    { metric: 'P3 (1d / 2d)', Response: 98, Resolution: p3.length ? Math.round((p3.filter(i => i.slaStatus !== 'Breached').length / p3.length) * 100) : 98, Target: 98 },
    { metric: 'P4 (2d / 4d)', Response: 99, Resolution: p4.length ? Math.round((p4.filter(i => i.slaStatus !== 'Breached').length / p4.length) * 100) : 98, Target: 98 },
  ];

  // Critical Exception Queue
  const exceptionQueue = filtered.filter(i => i.priority === 'P1' || i.priority === 'P2' || i.slaStatus === 'Breached' || i.slaStatus === 'At Risk');

  const resolutionMetCount = filtered.filter(i => i.slaStatus !== 'Breached').length;
  const resolutionSla = filtered.length ? Math.round((resolutionMetCount / filtered.length) * 100) : 98.0;

  return {
    total,
    open: openCount,
    openingBacklog: backlog.openingBacklog,
    inflow: backlog.inflow,
    outflow: backlog.outflow,
    closingBacklog: backlog.closingBacklog,
    p1: p1.length,
    p2: p2.length,
    p3: p3.length,
    p4: p4.length,
    breached: breached.length,
    atRisk: atRisk.length,
    responseSla: 98.4,
    resolutionSla,
    priorityDistribution,
    monthlyTrend,
    ageingBuckets,
    slaComparison,
    exceptionQueue,
    serviceDomainDistribution: groupByServiceDomain(filtered),
    filteredList: filtered,
  };
}

// ═══════════════════════════════════════════════════
// 2. SERVICE REQUEST ANALYTICS SELECTORS (Section 19)
// ═══════════════════════════════════════════════════
export function getServiceRequestAnalytics(filter = {}) {
  if (filter.recordType && filter.recordType !== 'all' && filter.recordType !== 'Service Request') {
    return {
      total: 0,
      open: 0,
      openingBacklog: 0,
      inflow: 0,
      outflow: 0,
      closingBacklog: 0,
      fulfilled: 0,
      slaPercent: 98.0,
      categoryDistribution: [],
      classificationDistribution: [],
      categoryMonthly: [],
      monthlyTrend: [],
      ageingBuckets: [],
      serviceDomainDistribution: [],
      filteredList: [],
    };
  }

  // CRITICAL PRIORITY RULE (Item 10):
  // Service Requests do NOT have P1, P2, or P3 priorities.
  // Selecting P1, P2, or P3 MUST return 0 Service Requests!
  if (filter.priority && filter.priority !== 'all') {
    if (['P1', 'P2', 'P3'].includes(filter.priority)) {
      return {
        total: 0,
        open: 0,
        openingBacklog: 0,
        inflow: 0,
        outflow: 0,
        closingBacklog: 0,
        fulfilled: 0,
        slaPercent: 98.0,
        categoryDistribution: [],
        classificationDistribution: [],
        categoryMonthly: [],
        monthlyTrend: [],
        ageingBuckets: [],
        serviceDomainDistribution: [],
        filteredList: [],
      };
    }
  }

  const baseFiltered = serviceRequests.filter(item => {
    if (filter.entity && filter.entity !== 'all' && item.entity !== filter.entity) return false;
    if (filter.serviceDomain && filter.serviceDomain !== 'all' && item.serviceDomainId !== filter.serviceDomain && item.serviceDomain !== filter.serviceDomain) return false;
    if (filter.domain && filter.domain !== 'all' && item.serviceDomain !== filter.domain) return false;
    if (filter.priority && filter.priority !== 'all') {
      if (filter.priority === 'P4' && item.priority !== 'P4') return false;
    }
    if (filter.status && filter.status !== 'all' && item.status !== filter.status) return false;
    if (filter.app && filter.app !== 'all' && item.application !== filter.app) return false;
    return true;
  });

  const backlog = calculateBacklogLifecycle(baseFiltered, filter.period || 'all');

  const filtered = baseFiltered.filter(item => {
    if (filter.period && filter.period !== 'all') {
      return isTicketOpenInPeriod(item, filter.period) || checkMatchesPeriod(item.createdDate, filter.period);
    }
    return true;
  });

  const total = filter.period && filter.period !== 'all' ? backlog.inflowTickets.length : filtered.length;
  const openCount = backlog.activeOpen;
  const fulfilled = filtered.filter(s => ['Closed', 'Resolved'].includes(s.status));

  // Category Distribution (replacing Standard vs Major per Item 15)
  const categoryCounts = {};
  filtered.forEach(s => {
    const cat = s.category || 'Configuration Request';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const colors = ['#2563EB', '#6B1D2A', '#0D9F6E', '#D97706', '#7C3AED', '#EC4899', '#0891B2'];
  const categoryDistribution = Object.entries(categoryCounts).map(([name, value], idx) => ({
    name,
    value,
    color: colors[idx % colors.length],
  }));

  // Backwards compatibility alias
  const classificationDistribution = categoryDistribution;

  // Category Fulfilment Velocity
  const categoryMonthly = Object.entries(categoryCounts).slice(0, 5).map(([category, count]) => ({
    category,
    Created: count,
    Closed: Math.max(1, Math.round(count * 0.95)),
    Target: count,
  }));

  // Dynamic Monthly Trend across 2026 active months
  const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
  const monthlyTrend = months.map(m => {
    const mCreated = baseFiltered.filter(s => s.createdDate && s.createdDate.startsWith(m)).length;
    const mClosed = baseFiltered.filter(s => {
      const d = s.closedDate || s.resolvedDate || s.createdDate;
      return d && d.startsWith(m) && ['Closed', 'Resolved'].includes(s.status);
    }).length;
    const mBacklog = calculateBacklogLifecycle(baseFiltered, m);
    const [, mo] = m.split('-');
    return {
      month: `${MONTH_SHORT_NAMES[Number(mo) - 1]} 2026`,
      Created: mCreated,
      Closed: mClosed,
      Open: mBacklog.closingBacklog,
    };
  });

  // Open SR Ageing Buckets
  const ageingBuckets = [
    { bucket: '0–3 days', count: Math.round(openCount * 0.50), color: '#0D9F6E' },
    { bucket: '4–7 days', count: Math.round(openCount * 0.30), color: '#2563EB' },
    { bucket: '8–15 days', count: Math.round(openCount * 0.12), color: '#D97706' },
    { bucket: '16–30 days', count: Math.round(openCount * 0.06), color: '#EA580C' },
    { bucket: '30+ days', count: Math.max(0, openCount - Math.round(openCount * 0.98)), color: '#DC2626' },
  ];

  return {
    total,
    open: openCount,
    openingBacklog: backlog.openingBacklog,
    inflow: backlog.inflow,
    outflow: backlog.outflow,
    closingBacklog: backlog.closingBacklog,
    fulfilled: fulfilled.length,
    slaPercent: filtered.length ? Math.round((filtered.filter(s => s.slaStatus === 'Met').length / filtered.length) * 100) : 98.0,
    categoryDistribution,
    classificationDistribution,
    categoryMonthly,
    monthlyTrend,
    ageingBuckets,
    serviceDomainDistribution: groupByServiceDomain(filtered),
    filteredList: filtered,
  };
}

// ═══════════════════════════════════════════════════
// 3. ENHANCEMENT ANALYTICS SELECTORS (Section 20)
// ═══════════════════════════════════════════════════
export function getEnhancementAnalytics(filter = {}) {
  const filtered = enhancements.filter(item => {
    if (filter.entity && filter.entity !== 'all' && item.entity !== filter.entity) return false;
    if (filter.serviceDomain && filter.serviceDomain !== 'all' && item.serviceDomainId !== filter.serviceDomain && item.serviceDomain !== filter.serviceDomain) return false;
    if (filter.domain && filter.domain !== 'all' && item.serviceDomain !== filter.domain) return false;
    if (filter.status && filter.status !== 'all' && item.status !== filter.status) return false;
    if (filter.app && filter.app !== 'all' && item.application !== filter.app) return false;
    if (filter.period && !checkMatchesPeriod(item.createdDate, filter.period)) return false;
    return true;
  });

  const total = filtered.length;
  const minor = filtered.filter(e => e.category === 'Minor' || (e.timeCountHrs && e.timeCountHrs <= 80));
  const major = filtered.filter(e => e.category === 'Major' || (e.timeCountHrs && e.timeCountHrs > 80));
  const inBuild = filtered.filter(e => ['In Development', 'Testing', 'Approved'].includes(e.status));
  const deployed = filtered.filter(e => ['Deployed', 'Closed'].includes(e.status));
  const totalHours = filtered.reduce((acc, curr) => acc + (curr.timeCountHrs || 40), 0);

  // Minor vs Major Scale Donut
  const scaleDistribution = [
    { name: 'Minor (≤80h)', value: minor.length, color: '#2563EB' },
    { name: 'Major (>80h)', value: major.length, color: '#7C3AED' },
  ];

  // Delivery Pipeline Stages
  const pipelineStages = [
    { stage: 'Draft', count: filtered.filter(e => e.status === 'Draft').length, color: '#9CA3AB' },
    { stage: 'Under Review', count: filtered.filter(e => e.status === 'Under Review').length, color: '#2563EB' },
    { stage: 'Approved', count: filtered.filter(e => e.status === 'Approved').length, color: '#6B1D2A' },
    { stage: 'In Dev / Test', count: inBuild.length, color: '#D97706' },
    { stage: 'Deployed / Closed', count: deployed.length, color: '#0D9F6E' },
  ];

  // Dynamic Monthly Trend derived from filtered enhancements
  const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
  const monthlyTrend = months.map(m => {
    const inMonth = filtered.filter(e => e.createdDate && e.createdDate.startsWith(m));
    const closedInMonth = inMonth.filter(e => e.status === 'Closed' || e.status === 'Deployed');
    const hours = inMonth.reduce((sum, e) => sum + (e.timeCountHrs || 40), 0);
    const [, mo] = m.split('-');
    return {
      month: `${MONTH_SHORT_NAMES[Number(mo) - 1]} 2026`,
      Created: inMonth.length,
      Closed: closedInMonth.length,
      Hours: hours,
    };
  });

  // Ageing of active Enhancements
  const openCount = total - deployed.length;
  const ageingBuckets = [
    { bucket: '0–15 days', count: Math.round(openCount * 0.4), color: '#0D9F6E' },
    { bucket: '16–30 days', count: Math.round(openCount * 0.3), color: '#2563EB' },
    { bucket: '31–60 days', count: Math.round(openCount * 0.2), color: '#D97706' },
    { bucket: '> 60 days', count: Math.max(0, openCount - Math.round(openCount * 0.9)), color: '#DC2626' },
  ];

  return {
    total,
    minor: minor.length,
    major: major.length,
    inBuild: inBuild.length,
    deployed: deployed.length,
    totalHours,
    scaleDistribution,
    pipelineStages,
    monthlyTrend,
    ageingBuckets,
    serviceDomainDistribution: groupByServiceDomain(filtered),
    filteredList: filtered,
  };
}

export function getProblemAnalytics(filter = {}) {
  const filtered = problems.filter(item => {
    if (filter.serviceDomain && filter.serviceDomain !== 'all' && item.serviceDomainId !== filter.serviceDomain && item.serviceDomain !== filter.serviceDomain) return false;
    if (filter.domain && filter.domain !== 'all' && item.serviceDomain !== filter.domain) return false;
    if (filter.status && filter.status !== 'all' && item.status !== filter.status) return false;
    if (filter.app && filter.app !== 'all' && item.application !== filter.app) return false;
    if (filter.period && !checkMatchesPeriod(item.createdDate, filter.period)) return false;
    return true;
  });

  const total = filtered.length;
  const open = filtered.filter(p => p.status === 'Open' || p.status === 'In Progress');
  const rcaPending = filtered.filter(p => p.rcaStatus === 'Pending' || p.rcaStatus === 'Not Started');
  const closed = filtered.filter(p => p.status === 'Closed');
  const rcaDelivered = filtered.filter(p => p.rcaStatus === 'Delivered');

  // Dynamic monthly trend
  const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
  const monthlyTrend = months.map(m => {
    const inMonth = filtered.filter(p => p.createdDate && p.createdDate.startsWith(m));
    const closedInMonth = inMonth.filter(p => p.status === 'Closed');
    const [, mo] = m.split('-');
    return {
      month: `${MONTH_SHORT_NAMES[Number(mo) - 1]} 2026`,
      Logged: inMonth.length,
      Resolved: closedInMonth.length,
      RcaDelivered: inMonth.filter(p => p.rcaStatus === 'Delivered').length,
    };
  });

  // Ageing profile
  const ageingBuckets = [
    { bucket: '0–7 days', count: Math.round(open.length * 0.4), color: '#0D9F6E' },
    { bucket: '8–14 days', count: Math.round(open.length * 0.3), color: '#2563EB' },
    { bucket: '15–30 days', count: Math.round(open.length * 0.2), color: '#D97706' },
    { bucket: '30+ days', count: Math.max(0, open.length - Math.round(open.length * 0.9)), color: '#DC2626' },
  ];

  return {
    total,
    open: open.length,
    rcaPending: rcaPending.length,
    rcaDelivered: rcaDelivered.length,
    closed: closed.length,
    monthlyTrend,
    ageingBuckets,
    serviceDomainDistribution: groupByServiceDomain(filtered),
    filteredList: filtered,
  };
}


// ═══════════════════════════════════════════════════
// 4. GLOBAL CALENDAR AGGREGATOR (Section 22 & 46)
export function getGlobalCalendarEvents() {
  const events = [];

  // 1. Audits & Compliance Assessments
  const auditEvents = [
    // June 2026
    { id: 'CAL-AUD-001', title: 'ISO 27001 InfoSec Surveillance Audit', date: '2026-06-11', time: '09:00 – 17:00 AST', owner: 'Ahmad Al-Otaibi', status: 'Completed', priority: 'High', typeLabel: 'InfoSec Audit', desc: 'Annual surveillance audit of cloud infrastructure and Riyadh data center controls.' },
    { id: 'CAL-AUD-002', title: 'Mid-Year SAP S/4HANA Compliance & SOD Audit', date: '2026-06-15', time: '10:00 – 16:30 AST', owner: 'Fatima Al Mansoori', status: 'Completed', priority: 'High', typeLabel: 'Financial Compliance', desc: 'Segregation of Duties (SOD) and GRC access control review across 34 entities.' },
    { id: 'CAL-AUD-003', title: 'ZATCA E-Invoicing Systems Readiness Review', date: '2026-06-26', time: '11:00 – 15:00 AST', owner: 'Tariq Al Dhaheri', status: 'Completed', priority: 'Medium', typeLabel: 'Tax Compliance', desc: 'Zakat, Tax and Customs Authority (ZATCA) Phase 2 electronic invoicing interface and schema validation audit.' },
    // July 2026
    { id: 'CAL-AUD-004', title: 'SOC 2 Type II Controls Walkthrough with KPMG', date: '2026-07-08', time: '09:30 – 18:00 AST', owner: 'KPMG Lead Auditor', status: 'Completed', priority: 'High', typeLabel: 'External Attestation', desc: 'Trust Services Criteria evaluation for security, availability, and processing integrity.' },
    { id: 'CAL-AUD-005', title: 'NCA ECC Enterprise Cyber Assurance Assessment', date: '2026-07-16', time: '09:00 – 16:00 AST', owner: 'NCA Lead Assessor', status: 'Completed', priority: 'Critical', typeLabel: 'Cyber Assurance', desc: 'National Cybersecurity Authority (NCA) critical enterprise systems classification and cryptographic enclave review.' },
    { id: 'CAL-AUD-006', title: 'Disaster Recovery Readiness Simulation (DC1 to DC2)', date: '2026-07-22', time: '08:00 – 14:00 AST', owner: 'Rashid Al Dhaheri', status: 'Completed', priority: 'Critical', typeLabel: 'Business Continuity', desc: 'Total failover simulation from Riyadh DC1 to Jeddah DR facility for S/4HANA & MES.' },
    // August 2026
    { id: 'CAL-AUD-007', title: 'ISO 20000 IT Service Management Audit', date: '2026-08-05', time: '09:00 – 17:00 AST', owner: 'SGS External Assessor', status: 'Completed', priority: 'High', typeLabel: 'ITSM Standards', desc: 'Verification of incident, problem, change, and SLA governance practices.' },
    { id: 'CAL-AUD-008', title: 'SAP License Entitlement True-Up & Compliance Review', date: '2026-08-14', time: '11:00 – 15:00 AST', owner: 'SAP License Advisory', status: 'Completed', priority: 'Medium', typeLabel: 'Vendor Governance', desc: 'Annual user licensing verification across FUEs, Digital Access, and BTP consumption.' },
    { id: 'CAL-AUD-009', title: 'ITIL Continuous Service Improvement Quality Gate', date: '2026-08-26', time: '14:00 – 17:00 AST', owner: 'Quality Assurance Board', status: 'Completed', priority: 'Medium', typeLabel: 'Process Audit', desc: 'Quarterly review of problem management root cause analysis and KEDB runbook quality.' },
    // September 2026
    { id: 'CAL-AUD-010', title: 'S/4HANA 2025 SP03 Core Upgrade Pre-Validation Audit', date: '2026-09-07', time: '10:00 – 16:00 AST', owner: 'Architecture Review Board', status: 'Scheduled', priority: 'High', typeLabel: 'Architecture Quality', desc: 'Pre-upgrade code quality scan, ABAP test cockpit, and HANA compatibility check.' },
    { id: 'CAL-AUD-011', title: 'Third-Party Defense Supplier Risk Assessment', date: '2026-09-17', time: '09:00 – 15:00 AST', owner: 'Vendor Risk Lead', status: 'Scheduled', priority: 'Medium', typeLabel: 'Supply Chain Audit', desc: 'Security assessment of external defense contractors connecting to KaarTech Enterprise via VPN.' },
    { id: 'CAL-AUD-012', title: 'Q3 Privileged Access (PAM) & Firefighter Audit', date: '2026-09-25', time: '13:00 – 17:00 AST', owner: 'InfoSec Governance', status: 'Scheduled', priority: 'High', typeLabel: 'Security Audit', desc: 'Quarterly audit of all elevated SAP basis permissions and production firefighter session logs.' },
    // October 2026
    { id: 'CAL-AUD-013', title: 'Annual Red Team Penetration Testing Debrief', date: '2026-10-06', time: '10:00 – 16:00 AST', owner: 'Cyber Defense Command', status: 'Scheduled', priority: 'Critical', typeLabel: 'Cyber Assessment', desc: 'Debrief on external penetration drill results against BTP endpoints and mobile gateways.' },
    { id: 'CAL-AUD-014', title: 'Defense Export Control (ITAR) S/4HANA Audit', date: '2026-10-15', time: '09:30 – 15:00 AST', owner: 'Legal & Export Compliance', status: 'Scheduled', priority: 'High', typeLabel: 'Export Compliance', desc: 'Verification of dual-use item classification and munitions inventory segregation in SAP.' },
    { id: 'CAL-AUD-015', title: 'ISO 22301 Business Continuity Management Audit', date: '2026-10-27', time: '09:00 – 17:00 AST', owner: 'External Assessor (BSI)', status: 'Scheduled', priority: 'High', typeLabel: 'BCP Certification', desc: 'Formal external audit for ISO 22301 business continuity management certification.' },
    // November 2026
    { id: 'CAL-AUD-016', title: 'Enterprise Cloud Security & Sovereign Alignment Review', date: '2026-11-09', time: '10:00 – 16:30 AST', owner: 'Cloud Architecture Board', status: 'Scheduled', priority: 'High', typeLabel: 'Cloud Compliance', desc: 'Assessment of Azure Sovereign Cloud KSA and SAP RISE private cloud security configurations.' },
    { id: 'CAL-AUD-017', title: 'Pre-Year-End GRC Firefighter Log & SOD Review', date: '2026-11-19', time: '11:00 – 16:00 AST', owner: 'Fatima Al Mansoori', status: 'Scheduled', priority: 'High', typeLabel: 'Financial Compliance', desc: 'Pre-audit clean-up of conflicting permissions and SOD violations across finance modules.' },
    { id: 'CAL-AUD-018', title: 'Database Encryption & Key Vault Verification', date: '2026-11-25', time: '14:00 – 17:00 AST', owner: 'Security Architecture Lead', status: 'Scheduled', priority: 'Medium', typeLabel: 'Crypto Audit', desc: 'Verification of HSM encryption keys, TLS 1.3 enforcement, and database column-level salts.' },
    // December 2026
    { id: 'CAL-AUD-019', title: 'Annual IT General Controls (ITGC) PwC Audit', date: '2026-12-07', time: '09:00 – 18:00 AST', owner: 'PwC External Audit Team', status: 'Scheduled', priority: 'Critical', typeLabel: 'External Financial Audit', desc: 'Mandatory statutory financial audit covering change management, access, and operations.' },
    { id: 'CAL-AUD-020', title: 'Comprehensive Year-End AMS Service Quality Gate', date: '2026-12-14', time: '10:00 – 15:00 AST', owner: 'KaarTech Group Internal Audit', status: 'Scheduled', priority: 'High', typeLabel: 'Contractual Audit', desc: 'Contractual verification of AMS delivery commitments, SLA scores, and penalty ledger.' },
  ];

  auditEvents.forEach(a => {
    events.push({
      id: a.id,
      title: a.title,
      type: 'audit',
      typeLabel: a.typeLabel,
      date: a.date,
      time: a.time,
      owner: a.owner,
      status: a.status,
      priority: a.priority,
      badgeColor: 'badge-warning',
      description: a.desc,
    });
  });

  // 2. Production Releases & Deployments (CAB Approved)
  const releaseEvents = [
    // June 2026
    { id: 'CAL-REL-001', title: 'S/4HANA Emergency Hotfix & Fiscal Tax Patch', date: '2026-06-08', time: '23:00 – 02:00 AST', owner: 'CAB Lead', status: 'Deployed', priority: 'High', typeLabel: 'Hotfix Deployment', desc: 'Corrective pricing condition update and Saudi ZATCA VAT reporting patch.' },
    { id: 'CAL-REL-002', title: 'SuccessFactors Delta Integration Pack v4.2', date: '2026-06-17', time: '22:00 – 01:30 AST', owner: 'Integration Lead', status: 'Deployed', priority: 'Medium', typeLabel: 'Cloud Release', desc: 'Employee Central cost center mapping sync improvements.' },
    { id: 'CAL-REL-003', title: 'Enterprise B2B Supplier Portal Security Patch', date: '2026-06-24', time: '23:00 – 01:00 AST', owner: 'Security Engineering', status: 'Deployed', priority: 'Medium', typeLabel: 'Portal Patch', desc: 'Multi-factor authentication session hardening for external defense suppliers.' },
    { id: 'CAL-REL-004', title: 'KaarTech Enterprise June Sprint Major Release Cutover', date: '2026-06-30', time: '21:00 – 05:00 AST', owner: 'Release Management', status: 'Deployed', priority: 'P1', typeLabel: 'Major Release', desc: '22 approved change requests packaged for production rollout.' },
    // July 2026
    { id: 'CAL-REL-005', title: 'SAP CPI Integration Suite Flow Re-certification Release', date: '2026-07-10', time: '23:00 – 02:00 AST', owner: 'Integration Broker Lead', status: 'Deployed', priority: 'High', typeLabel: 'Middleware Patch', desc: 'Secure certificate rotation and OData pipe throughput optimization.' },
    { id: 'CAL-REL-006', title: 'Mid-Year Tax Engine & E-Invoicing Regulatory Release', date: '2026-07-15', time: '22:00 – 03:00 AST', owner: 'Financial Systems Lead', status: 'Deployed', priority: 'High', typeLabel: 'Regulatory Release', desc: 'Mandatory ZATCA compliance update for automated VAT clearance.' },
    { id: 'CAL-REL-007', title: 'Mobile Fiori Launchpad User Experience Patch', date: '2026-07-21', time: '22:30 – 01:00 AST', owner: 'UX Engineering', status: 'Deployed', priority: 'Low', typeLabel: 'UX Update', desc: 'Biometric login and push notification optimizations for executive approval workflows.' },
    { id: 'CAL-REL-008', title: 'July KaarTech Enterprise Production Maintenance Release', date: '2026-07-31', time: '22:00 – 04:00 AST', owner: 'CAB Lead', status: 'Deployed', priority: 'High', typeLabel: 'Monthly Release', desc: 'Standard monthly maintenance sprint with 18 packaged enhancement fixes.' },
    // August 2026
    { id: 'CAL-REL-009', title: 'Microsoft Dynamics 365 CRM Sprint Release', date: '2026-08-07', time: '23:00 – 02:00 AST', owner: 'CRM Tech Lead', status: 'Deployed', priority: 'Medium', typeLabel: 'Cloud Release', desc: 'Customer Corner field service dispatch and portal telemetry enhancements.' },
    { id: 'CAL-REL-010', title: 'Enterprise MES Shopfloor Dispatch Connector v3.1', date: '2026-08-18', time: '22:00 – 01:30 AST', owner: 'Manufacturing IT Lead', status: 'Deployed', priority: 'High', typeLabel: 'MES Connector', desc: 'Real-time production order execution sync between manufacturing plant floor and S/4HANA.' },
    { id: 'CAL-REL-011', title: 'KaarTech Enterprise August Maintenance Bundle Deployment', date: '2026-08-28', time: '22:00 – 04:00 AST', owner: 'CAB Release Manager', status: 'Deployed', priority: 'High', typeLabel: 'Major Release', desc: '14 approved CAB change requests packaged for production rollout.' },
    // September 2026
    { id: 'CAL-REL-012', title: 'SAC Executive Boardroom Telemetry Optimization Patch', date: '2026-09-10', time: '22:00 – 01:00 AST', owner: 'Analytics Lead', status: 'Scheduled', priority: 'Medium', typeLabel: 'BI Analytics Patch', desc: 'Query performance tuning for SteerCom live widgets and mobile board access.' },
    { id: 'CAL-REL-013', title: 'OpenText xECM Enterprise Document Metadata Sync', date: '2026-09-18', time: '23:00 – 02:00 AST', owner: 'Content Services Lead', status: 'Scheduled', priority: 'Medium', typeLabel: 'ECM Patch', desc: 'Automated engineering drawing classification and secure optical OCR index.' },
    { id: 'CAL-REL-014', title: 'KaarTech Enterprise September Production Sprint Release', date: '2026-09-28', time: '21:00 – 04:00 AST', owner: 'CAB Release Manager', status: 'Scheduled', priority: 'P1', typeLabel: 'Major Release', desc: 'Q3 closeout release incorporating 26 approved enhancement packages.' },
    // October 2026
    { id: 'CAL-REL-015', title: 'S/4HANA Feature Pack 02 Application Rollout', date: '2026-10-09', time: '21:00 – 05:00 AST', owner: 'SAP Core Architecture', status: 'Approved', priority: 'P1', typeLabel: 'Feature Pack', desc: 'S/4HANA FP02 upgrade activating advanced variant configuration and serial tracking.' },
    { id: 'CAL-REL-016', title: 'SAP BTP Event Mesh Enterprise Broker Upgrade', date: '2026-10-16', time: '23:00 – 02:30 AST', owner: 'Integration Architect', status: 'Scheduled', priority: 'High', typeLabel: 'Middleware Release', desc: 'Upgrading enterprise event mesh routing for low-latency telemetry between manufacturing plants.' },
    { id: 'CAL-REL-017', title: 'Enterprise Logistics Track & Trace Release', date: '2026-10-23', time: '22:00 – 01:30 AST', owner: 'Supply Chain Lead', status: 'Scheduled', priority: 'Medium', typeLabel: 'Logistics Release', desc: 'RFID-enabled enterprise asset tracking integration with S/4HANA Extended Warehouse.' },
    { id: 'CAL-REL-018', title: 'October KaarTech Enterprise Maintenance Bundle Release', date: '2026-10-30', time: '22:00 – 04:00 AST', owner: 'CAB Release Manager', status: 'Scheduled', priority: 'High', typeLabel: 'Monthly Release', desc: 'Standard monthly maintenance bundle with 16 functional enhancements.' },
    // November 2026
    { id: 'CAL-REL-019', title: 'SuccessFactors Year-End Performance Module Patch', date: '2026-11-06', time: '22:00 – 01:00 AST', owner: 'HR Tech Lead', status: 'Scheduled', priority: 'Medium', typeLabel: 'HR Cloud Patch', desc: 'Year-end appraisal workflow configuration and bonus compensation calculation rules.' },
    { id: 'CAL-REL-020', title: 'Ariba Network Supplier Guided Sourcing Release', date: '2026-11-13', time: '23:00 – 02:00 AST', owner: 'Procurement Systems Lead', status: 'Scheduled', priority: 'High', typeLabel: 'Procurement Release', desc: 'Ariba Guided Sourcing activation for strategic industrial tier-1 subcontracting.' },
    { id: 'CAL-REL-021', title: 'SAP Analytics Cloud Q4 Predictive Engine Release', date: '2026-11-20', time: '22:00 – 01:30 AST', owner: 'Data Analytics Lead', status: 'Scheduled', priority: 'Medium', typeLabel: 'Analytics Release', desc: 'Smart Discovery predictive algorithms for spare parts consumption forecasting.' },
    { id: 'CAL-REL-022', title: 'November KaarTech Enterprise Production Sprint Release', date: '2026-11-27', time: '21:00 – 04:30 AST', owner: 'CAB Release Manager', status: 'Scheduled', priority: 'P1', typeLabel: 'Major Release', desc: 'Pre-freeze production release deploying 24 approved enterprise change packages.' },
    // December 2026
    { id: 'CAL-REL-023', title: 'Year-End Statutory Payroll & Saudi GOSI Tax Update', date: '2026-12-04', time: '22:00 – 02:00 AST', owner: 'HR Operations Lead', status: 'Scheduled', priority: 'High', typeLabel: 'Payroll Patch', desc: 'Statutory pension contribution updates and Saudi national social security tables.' },
    { id: 'CAL-REL-024', title: 'Core S/4HANA Security Patch & Kernel Update', date: '2026-12-11', time: '22:00 – 03:00 AST', owner: 'BASIS Lead', status: 'Scheduled', priority: 'High', typeLabel: 'Kernel Update', desc: 'SAP NetWeaver 7.55 security kernel patch and OpenSSL cryptographic library refresh.' },
    { id: 'CAL-REL-025', title: 'KaarTech Enterprise Q4 Pre-Freeze Stabilization Release', date: '2026-12-18', time: '21:00 – 04:00 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'P1', typeLabel: 'Major Release', desc: 'Final production deployment prior to annual financial close change moratorium.' },
  ];

  releaseEvents.forEach(r => {
    events.push({
      id: r.id,
      title: r.title,
      type: 'release',
      typeLabel: r.typeLabel,
      date: r.date,
      time: r.time,
      owner: r.owner,
      status: r.status,
      priority: r.priority,
      badgeColor: 'badge-info',
      description: r.desc,
    });
  });

  // 3. Transformation Milestones & Program Gates
  const milestoneEvents = [
    // June 2026
    { id: 'CAL-PRG-001', title: 'Wave 1 Final Stabilization & Warranty Handover', date: '2026-06-22', time: '10:00 AST', owner: 'Program Director', entity: 'All 34 KaarTech Entities', status: 'Completed', priority: 'High', desc: 'Formal conclusion of post-go-live hypercare warranty phase for Wave 1 entities.' },
    // July 2026
    { id: 'CAL-PRG-002', title: 'S/4HANA Manufacturing Phase 2 Blueprint Sign-Off', date: '2026-07-06', time: '11:00 AST', owner: 'Enterprise Architect', entity: 'KaarTech Advanced Manufacturing, Heavy Mobility', status: 'Completed', priority: 'High', desc: 'Formal steering committee sign-off on detailed industrial manufacturing functional design.' },
    { id: 'CAL-PRG-003', title: 'Wave 2 SuccessFactors HXM Harmonization Go-Live', date: '2026-07-20', time: '10:00 AST', owner: 'Sara Al Marzouqi', entity: 'All 34 KaarTech Entities', status: 'Completed', priority: 'High', desc: 'Global rollout of unified talent management and performance compensation.' },
    // August 2026
    { id: 'CAL-PRG-004', title: 'Ariba Supplier Network Wave 2 Activation (250 Suppliers)', date: '2026-08-10', time: '09:30 AST', owner: 'Procurement Transformation', entity: 'KaarTech Group Procurement', status: 'Completed', priority: 'Medium', desc: 'Onboarding 250 local industrial sub-tier suppliers onto automated digital purchase orders.' },
    { id: 'CAL-PRG-005', title: 'Robotic Process Automation Bot 5 (Procure-to-Pay Reconciler) Pilot', date: '2026-08-20', time: '09:00 AST', owner: 'Innovation Lead', entity: 'KaarTech HQ, Advanced Manufacturing', status: 'Completed', priority: 'Medium', desc: 'Autonomous OCR three-way match bot deployment into pilot entities.' },
    // September 2026
    { id: 'CAL-PRG-006', title: 'KaarTech ITMS AI Incident Co-Pilot Pilot Launch', date: '2026-09-08', time: '08:30 AST', owner: 'AI Strategy Lead', entity: 'AMS General Shift CoE', status: 'Scheduled', priority: 'High', desc: 'Pilot rollout of generative resolution recommendation co-pilot for L2 engineers.' },
    { id: 'CAL-PRG-007', title: 'Wave 3 S/4HANA Manufacturing Phase 2 Cutover Gate', date: '2026-09-20', time: '08:00 AST', owner: 'Fatima Al-Otaibi', entity: 'KaarTech Advanced Manufacturing, Materials Tech', status: 'Scheduled', priority: 'P1', desc: 'Pre-cutover dry run, inventory opening balance reconciliation, and plant validation.' },
    // October 2026
    { id: 'CAL-PRG-008', title: 'Plant MES to S/4HANA Shopfloor Go-Live Gate', date: '2026-10-12', time: '09:00 AST', owner: 'Manufacturing Systems Lead', entity: 'KaarTech Precision Works, Heavy Mobility', status: 'Scheduled', priority: 'P1', desc: 'Live cutover of automated CNC machine work order feedback directly into S/4HANA.' },
    { id: 'CAL-PRG-009', title: 'Enterprise Hybrid Data Lake Milestone 3', date: '2026-10-26', time: '11:00 AST', owner: 'Data Lake Architect', entity: 'KaarTech HQ', status: 'Scheduled', priority: 'High', desc: 'Consolidation of telemetry pipelines from 34 entities into Riyadh sovereign lake.' },
    // November 2026
    { id: 'CAL-PRG-010', title: 'Automated Self-Healing Runbook v2.0 Production Launch', date: '2026-11-16', time: '10:00 AST', owner: 'Automation Engineering', entity: 'All Entities', status: 'Scheduled', priority: 'High', desc: 'Production activation of 12 self-healing scripts for SAP lock clears and interface retries.' },
    { id: 'CAL-PRG-011', title: 'KaarTech Enterprise Annual Program Architectural Gate Review', date: '2026-11-30', time: '14:00 AST', owner: 'Steering Committee', entity: 'All 34 KaarTech Entities', status: 'Scheduled', priority: 'P1', desc: 'Yearly architectural health review and technology roadmap approval for 2027.' },
    // December 2026
    { id: 'CAL-PRG-012', title: '2027 AMS Strategy & Capacity Horizon Sign-Off', date: '2026-12-15', time: '10:00 AST', owner: 'Dr. Tariq Al Nuaimi', entity: 'KaarTech Group Executive Board', status: 'Scheduled', priority: 'P1', desc: 'Executive sign-off on 2027 AMS staffing allocations, SLA targets, and innovation credits.' },
  ];

  milestoneEvents.forEach(m => {
    events.push({
      id: m.id,
      title: m.title,
      type: 'milestone',
      typeLabel: 'Transformation Gate',
      date: m.date,
      time: m.time,
      owner: m.owner,
      entity: m.entity,
      status: m.status,
      priority: m.priority,
      badgeColor: 'badge-primary',
      description: m.desc,
    });
  });

  // 4. Change Freezes (Strict Governance Moratoriums)
  const freezeEvents = [
    // June 2026
    { id: 'CAL-FRZ-001', title: 'Mid-Year Financial Books Consolidation Freeze', date: '2026-06-20', endDate: '2026-06-23', time: 'Full Day Freeze', owner: 'CFO Policy Directive', status: 'Enforced', priority: 'P1', desc: 'Production change moratorium across Financial & ERP modules for H1 audit closing.' },
    // July 2026
    { id: 'CAL-FRZ-002', title: 'Disaster Recovery Live Simulation Maintenance Freeze', date: '2026-07-24', endDate: '2026-07-26', time: 'Weekend Freeze (Fri–Sun)', owner: 'Enterprise Architecture', status: 'Enforced', priority: 'P1', desc: 'Full production transport freeze during DC1 to DC2 failover drill.' },
    // August 2026
    { id: 'CAL-FRZ-003', title: 'August CAB Infrastructure Maintenance Freeze', date: '2026-08-29', endDate: '2026-08-31', time: 'Weekend Freeze', owner: 'Group Infrastructure', status: 'Enforced', priority: 'High', desc: 'Network backbone switch firmware upgrades and edge security appliance patching.' },
    // September 2026
    { id: 'CAL-FRZ-004', title: 'Q3 Close System Stabilization Freeze Window', date: '2026-09-29', endDate: '2026-09-30', time: 'Full Day Freeze', owner: 'SteerCom Policy', status: 'Enforced', priority: 'P1', desc: 'Mandatory change freeze during Q3 quarterly financial closing.' },
    // October 2026
    { id: 'CAL-FRZ-005', title: 'Saudi National Day & Year-End Stabilization Freeze', date: '2026-10-21', endDate: '2026-10-25', time: 'Moratorium Window', owner: 'Group Executive Directive', status: 'Enforced', priority: 'P1', desc: 'High-alert system change freeze during national holiday and operational stabilization.' },
    // November 2026
    { id: 'CAL-FRZ-006', title: 'Pre-Year-End Audit Stabilization Freeze', date: '2026-11-26', endDate: '2026-11-29', time: 'Full Weekend Freeze', owner: 'Finance & Audit Committee', status: 'Enforced', priority: 'P1', desc: 'Strict transport freeze prior to annual statutory financial ledger audit.' },
    // December 2026
    { id: 'CAL-FRZ-007', title: 'Annual Fiscal Year-End Financial Close Moratorium', date: '2026-12-21', endDate: '2026-12-31', time: 'Annual Moratorium', owner: 'CFO Policy Directive', status: 'Enforced', priority: 'P1', desc: 'Total moratorium on non-emergency code transports during annual book closing.' },
  ];

  freezeEvents.forEach(f => {
    events.push({
      id: f.id,
      title: f.title,
      type: 'freeze',
      typeLabel: 'Change Freeze Window',
      date: f.date,
      endDate: f.endDate,
      time: f.time,
      owner: f.owner,
      status: f.status,
      priority: f.priority,
      badgeColor: 'badge-error',
      description: f.desc,
    });
  });

  // 5. SteerComs, Operational Reviews & Entity WSRs
  const meetingEvents = [
    // June 2026
    { id: 'CAL-MTG-001', title: 'Monthly Executive SteerCom Review (MSR) - May Sign-Off', date: '2026-06-01', time: '14:00 – 16:00 AST', owner: 'Dr. Tariq Al Nuaimi', status: 'Completed', priority: 'High', desc: 'Monthly contractual SLA sign-off, penalty ledger review, and innovation credits.' },
    { id: 'CAL-MTG-002', title: 'Weekly CAB Review & Change Triage Session', date: '2026-06-02', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-003', title: 'Weekly Service Review (WSR) with KaarTech Heavy Mobility', date: '2026-06-04', time: '10:00 – 11:30 AST', owner: 'Ravi Shankar', status: 'Completed', priority: 'Medium', desc: 'Review open tickets, shopfloor MES tickets, and RCA action items.' },
    { id: 'CAL-MTG-004', title: 'Weekly CAB Review & Change Triage Session', date: '2026-06-09', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-005', title: 'Weekly Service Review (WSR) with KaarTech Advanced Manufacturing', date: '2026-06-11', time: '10:00 – 11:30 AST', owner: 'Priya Nair', status: 'Completed', priority: 'Medium', desc: 'Triage batch job locking and shopfloor plant floor tickets with manufacturing IT.' },
    { id: 'CAL-MTG-006', title: 'Weekly CAB Review & Change Triage Session', date: '2026-06-16', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-007', title: 'Weekly Service Review (WSR) with KaarTech Precision Works', date: '2026-06-18', time: '10:00 – 11:30 AST', owner: 'Ravi Shankar', status: 'Completed', priority: 'Medium', desc: 'Precision manufacturing Bill of Materials (BOM) sync and serial tracking.' },
    { id: 'CAL-MTG-008', title: 'Weekly CAB Review & Change Triage Session', date: '2026-06-23', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-009', title: 'Weekly Service Review (WSR) with KaarTech HQ', date: '2026-06-25', time: '14:00 – 15:30 AST', owner: 'Fatima Al-Otaibi', status: 'Completed', priority: 'High', desc: 'Executive reporting, SLA score attainment, and upcoming release approvals.' },
    { id: 'CAL-MTG-010', title: 'Weekly CAB Review & Change Triage Session', date: '2026-06-30', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    // July 2026
    { id: 'CAL-MTG-011', title: 'Weekly Service Review (WSR) with KaarTech Autonomous Systems', date: '2026-07-02', time: '10:00 – 11:30 AST', owner: 'Noura Al Shamsi', status: 'Completed', priority: 'Medium', desc: 'Autonomous systems spare parts supply chain tickets and Ariba supplier integration.' },
    { id: 'CAL-MTG-012', title: 'Monthly Executive SteerCom Review (MSR) - June Sign-Off', date: '2026-07-06', time: '14:00 – 16:00 AST', owner: 'Dr. Tariq Al Nuaimi', status: 'Completed', priority: 'High', desc: 'Monthly contractual SLA sign-off, penalty ledger review, and innovation credits.' },
    { id: 'CAL-MTG-013', title: 'Weekly CAB Review & Change Triage Session', date: '2026-07-07', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-014', title: 'Weekly Service Review (WSR) with KaarTech Materials Technology', date: '2026-07-09', time: '10:00 – 11:30 AST', owner: 'Tariq Al Dhaheri', status: 'Completed', priority: 'Medium', desc: 'Industrial materials inventory tracking and plant maintenance work orders.' },
    { id: 'CAL-MTG-015', title: 'Weekly CAB Review & Change Triage Session', date: '2026-07-14', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-016', title: 'Weekly Service Review (WSR) with KaarTech Engineering Industries', date: '2026-07-16', time: '10:00 – 11:30 AST', owner: 'Priya Nair', status: 'Completed', priority: 'Medium', desc: 'Industrial machining work centers and Quality Management inspection lots.' },
    { id: 'CAL-MTG-017', title: 'Weekly CAB Review & Change Triage Session', date: '2026-07-21', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-018', title: 'Weekly Service Review (WSR) with KaarTech Cyber Defense', date: '2026-07-23', time: '11:00 – 12:30 AST', owner: 'Deepak Kumar', status: 'Completed', priority: 'Medium', desc: 'Cyber academy student invoicing and SuccessFactors learning integration.' },
    { id: 'CAL-MTG-019', title: 'Weekly CAB Review & Change Triage Session', date: '2026-07-28', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-020', title: 'Weekly Service Review (WSR) with KaarTech Secure Comms', date: '2026-07-30', time: '10:00 – 11:30 AST', owner: 'Noura Al Shamsi', status: 'Completed', priority: 'Medium', desc: 'Secure telecom equipment supply chain and hardware serialization.' },
    // August 2026
    { id: 'CAL-MTG-021', title: 'Monthly Executive SteerCom Review (MSR) - July Sign-Off', date: '2026-08-03', time: '14:00 – 16:00 AST', owner: 'Dr. Tariq Al Nuaimi', status: 'Completed', priority: 'High', desc: 'H2 service level performance audit, SLA compliance, and staffing metrics.' },
    { id: 'CAL-MTG-022', title: 'Weekly CAB Review & Change Triage Session', date: '2026-08-04', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-023', title: 'Weekly Service Review (WSR) with KaarTech Support Services', date: '2026-08-06', time: '10:00 – 11:30 AST', owner: 'Tariq Al Dhaheri', status: 'Completed', priority: 'Medium', desc: 'Field service simulator maintenance and procurement workflows.' },
    { id: 'CAL-MTG-024', title: 'Weekly CAB Review & Change Triage Session', date: '2026-08-11', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-025', title: 'Weekly Service Review (WSR) with KaarTech Aerospace', date: '2026-08-13', time: '10:00 – 11:30 AST', owner: 'Priya Nair', status: 'Completed', priority: 'Medium', desc: 'Aviation service flight hours billing and asset depreciation schedules.' },
    { id: 'CAL-MTG-026', title: 'Weekly CAB Review & Change Triage Session', date: '2026-08-18', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-027', title: 'Weekly Service Review (WSR) with KaarTech Marine Systems', date: '2026-08-20', time: '10:00 – 11:30 AST', owner: 'Ravi Shankar', status: 'Completed', priority: 'Medium', desc: 'Marine vessel retrofit project accounting and subcontractor milestones.' },
    { id: 'CAL-MTG-028', title: 'Weekly CAB Review & Change Triage Session', date: '2026-08-25', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-029', title: 'Quarterly Customer Satisfaction (CSAT) Entity Review', date: '2026-08-27', time: '14:00 – 16:00 AST', owner: 'Customer Corner Lead', status: 'Completed', priority: 'High', desc: 'Cross-entity customer sentiment analysis, verbatim review, and action plans.' },
    // September 2026
    { id: 'CAL-MTG-030', title: 'Weekly CAB Review & Change Triage Session', date: '2026-09-01', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-031', title: 'Monthly Executive SteerCom Review (MSR) - August Sign-Off', date: '2026-09-02', time: '14:00 – 16:00 AST', owner: 'Dr. Tariq Al Nuaimi', status: 'Scheduled', priority: 'High', desc: 'SteerCom review of August availability, incident deflection, and capacity.' },
    { id: 'CAL-MTG-032', title: 'Weekly Service Review (WSR) with KaarTech Heavy Mobility', date: '2026-09-03', time: '10:00 – 11:30 AST', owner: 'Ravi Shankar', status: 'Scheduled', priority: 'Medium', desc: 'Heavy mobility production batch traceability and plant inventory sync.' },
    { id: 'CAL-MTG-033', title: 'Weekly CAB Review & Change Triage Session', date: '2026-09-08', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-034', title: 'Weekly Service Review (WSR) with KaarTech Advanced Manufacturing', date: '2026-09-10', time: '10:00 – 11:30 AST', owner: 'Priya Nair', status: 'Scheduled', priority: 'Medium', desc: 'Review of shopfloor scrap logging tickets and batch master changes.' },
    { id: 'CAL-MTG-035', title: 'Weekly CAB Review & Change Triage Session', date: '2026-09-15', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-036', title: 'Weekly Service Review (WSR) with KaarTech Autonomous Systems', date: '2026-09-17', time: '10:00 – 11:30 AST', owner: 'Noura Al Shamsi', status: 'Scheduled', priority: 'Medium', desc: 'Autonomous vehicle telemetry integration and maintenance order scheduling.' },
    { id: 'CAL-MTG-037', title: 'Weekly CAB Review & Change Triage Session', date: '2026-09-22', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-038', title: 'Weekly Service Review (WSR) with KaarTech HQ Executive', date: '2026-09-24', time: '14:00 – 15:30 AST', owner: 'Fatima Al-Otaibi', status: 'Scheduled', priority: 'High', desc: 'Quarterly SLA review, scorecard analysis, and upcoming release sign-offs.' },
    { id: 'CAL-MTG-039', title: 'Weekly CAB Review & Change Triage Session', date: '2026-09-29', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    // October 2026
    { id: 'CAL-MTG-040', title: 'Weekly Service Review (WSR) with KaarTech Precision Works', date: '2026-10-01', time: '10:00 – 11:30 AST', owner: 'Ravi Shankar', status: 'Scheduled', priority: 'Medium', desc: 'Precision manufacturing plant orders and serial barcode scanning.' },
    { id: 'CAL-MTG-041', title: 'Monthly Executive SteerCom Review (MSR) - September Sign-Off', date: '2026-10-05', time: '14:00 – 16:00 AST', owner: 'Dr. Tariq Al Nuaimi', status: 'Scheduled', priority: 'High', desc: 'Q3 formal contractual sign-off, penalty performance credits, and budget review.' },
    { id: 'CAL-MTG-042', title: 'Weekly CAB Review & Change Triage Session', date: '2026-10-06', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-043', title: 'Weekly Service Review (WSR) with KaarTech Materials Technology', date: '2026-10-08', time: '10:00 – 11:30 AST', owner: 'Tariq Al Dhaheri', status: 'Scheduled', priority: 'Medium', desc: 'Materials chemical inventory receipts and hazardous transport docs.' },
    { id: 'CAL-MTG-044', title: 'Weekly CAB Review & Change Triage Session', date: '2026-10-13', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-045', title: 'Weekly Service Review (WSR) with KaarTech Engineering Industries', date: '2026-10-15', time: '10:00 – 11:30 AST', owner: 'Priya Nair', status: 'Scheduled', priority: 'Medium', desc: 'Precision CNC tool life tracking and equipment maintenance work centers.' },
    { id: 'CAL-MTG-046', title: 'Weekly CAB Review & Change Triage Session', date: '2026-10-20', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-047', title: 'Weekly Service Review (WSR) with KaarTech Secure Comms', date: '2026-10-22', time: '10:00 – 11:30 AST', owner: 'Noura Al Shamsi', status: 'Scheduled', priority: 'Medium', desc: 'Secure telecom hardware supply chain and customer warranty portal.' },
    { id: 'CAL-MTG-048', title: 'Weekly CAB Review & Change Triage Session', date: '2026-10-27', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-049', title: 'Weekly Service Review (WSR) with KaarTech Cyber Defense', date: '2026-10-29', time: '11:00 – 12:30 AST', owner: 'Deepak Kumar', status: 'Scheduled', priority: 'Medium', desc: 'Cyber training course billing, LMS integration, and student portal access.' },
    // November 2026
    { id: 'CAL-MTG-050', title: 'Monthly Executive SteerCom Review (MSR) - October Sign-Off', date: '2026-11-02', time: '14:00 – 16:00 AST', owner: 'Dr. Tariq Al Nuaimi', status: 'Scheduled', priority: 'High', desc: 'Executive SteerCom sign-off on October service levels and capacity plans.' },
    { id: 'CAL-MTG-051', title: 'Weekly CAB Review & Change Triage Session', date: '2026-11-03', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-052', title: 'Weekly Service Review (WSR) with KaarTech Support Services', date: '2026-11-05', time: '10:00 – 11:30 AST', owner: 'Tariq Al Dhaheri', status: 'Scheduled', priority: 'Medium', desc: 'Field service academy instructor scheduling and procurement asset management.' },
    { id: 'CAL-MTG-053', title: 'Weekly CAB Review & Change Triage Session', date: '2026-11-10', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-054', title: 'Weekly Service Review (WSR) with KaarTech Aerospace', date: '2026-11-12', time: '10:00 – 11:30 AST', owner: 'Priya Nair', status: 'Scheduled', priority: 'Medium', desc: 'Flight simulator flight log reconciliation and student pilot training records.' },
    { id: 'CAL-MTG-055', title: 'Weekly CAB Review & Change Triage Session', date: '2026-11-17', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-056', title: 'Weekly Service Review (WSR) with KaarTech Marine Systems', date: '2026-11-19', time: '10:00 – 11:30 AST', owner: 'Ravi Shankar', status: 'Scheduled', priority: 'Medium', desc: 'Marine vessel overhaul project milestones and supplier billing reconciliations.' },
    { id: 'CAL-MTG-057', title: 'Weekly CAB Review & Change Triage Session', date: '2026-11-24', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-058', title: 'Quarterly Customer Satisfaction (CSAT) Entity Review', date: '2026-11-26', time: '14:00 – 16:00 AST', owner: 'Customer Corner Lead', status: 'Scheduled', priority: 'High', desc: 'Entity-by-entity CSAT sentiment scorecards and resolution feedback.' },
    // December 2026
    { id: 'CAL-MTG-059', title: 'Weekly CAB Review & Change Triage Session', date: '2026-12-01', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-060', title: 'Monthly Executive SteerCom Review (MSR) - November Sign-Off', date: '2026-12-02', time: '14:00 – 16:00 AST', owner: 'Dr. Tariq Al Nuaimi', status: 'Scheduled', priority: 'High', desc: 'Monthly review of November operations, SLA scorecards, and year-end outlook.' },
    { id: 'CAL-MTG-061', title: 'Weekly Service Review (WSR) with KaarTech Heavy Mobility', date: '2026-12-03', time: '10:00 – 11:30 AST', owner: 'Ravi Shankar', status: 'Scheduled', priority: 'Medium', desc: 'Year-end inventory count preparation and shopfloor manufacturing reconciliation.' },
    { id: 'CAL-MTG-062', title: 'Weekly CAB Review & Change Triage Session', date: '2026-12-08', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-063', title: 'Weekly Service Review (WSR) with KaarTech Advanced Manufacturing', date: '2026-12-10', time: '10:00 – 11:30 AST', owner: 'Priya Nair', status: 'Scheduled', priority: 'Medium', desc: 'Annual plant inventory freeze coordination and financial WIP valuation.' },
    { id: 'CAL-MTG-064', title: 'Weekly CAB Review & Change Triage Session', date: '2026-12-15', time: '11:00 – 12:30 AST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Final pre-moratorium Change Advisory Board meeting.' },
    { id: 'CAL-MTG-065', title: 'Weekly Service Review (WSR) with KaarTech HQ Finance', date: '2026-12-17', time: '14:00 – 15:30 AST', owner: 'Fatima Al-Otaibi', status: 'Scheduled', priority: 'High', desc: 'Annual closing operational support plan, 24/7 financial close coverage roster.' },
  ];

  meetingEvents.forEach(m => {
    events.push({
      id: m.id,
      title: m.title,
      type: 'meeting',
      typeLabel: 'Operational Review',
      date: m.date,
      time: m.time,
      owner: m.owner,
      status: m.status,
      priority: m.priority,
      badgeColor: 'badge-primary',
      description: m.desc,
    });
  });

  // 6. Knowledge, SOPs & User Enablement Workshops
  const trainingEvents = [
    // June 2026
    { id: 'CAL-TRN-001', title: 'S/4HANA Sales Order Pricing & Lock Optimization Masterclass', date: '2026-06-16', time: '11:00 – 13:00 AST', owner: 'Khalid Al Hashimi', status: 'Completed', priority: 'Medium', desc: 'Interactive workshop for end-users on sales order batch lock avoidance.' },
    { id: 'CAL-TRN-002', title: 'Ariba Guided Sourcing Punchout Optimization Clinic', date: '2026-06-28', time: '14:00 – 16:00 AST', owner: 'Noura Al Shamsi', status: 'Completed', priority: 'Medium', desc: 'Procurement training on catalog punchout carts and supplier approval chains.' },
    // July 2026
    { id: 'CAL-TRN-003', title: 'Plant Floor MES Work Order Reconciliation Clinic', date: '2026-07-13', time: '10:00 – 12:00 AST', owner: 'Priya Nair', status: 'Completed', priority: 'Medium', desc: 'Shopfloor supervisor training on scrap yield recording and batch confirmation.' },
    { id: 'CAL-TRN-004', title: 'OpenText xECM ArchiveLink Configuration Workshop', date: '2026-07-29', time: '14:00 – 15:30 AST', owner: 'Opentext Lead', status: 'Completed', priority: 'Low', desc: 'Defense document retention policies and automated PDF archiving.' },
    // August 2026
    { id: 'CAL-TRN-005', title: 'Enterprise KEDB Runbook Authoring & Shift-Left Session', date: '2026-08-12', time: '10:00 – 12:00 AST', owner: 'Knowledge Lead', status: 'Completed', priority: 'Medium', desc: 'Training resolvers to document L1/L2 repeatable solutions into the KEDB.' },
    { id: 'CAL-TRN-006', title: 'S/4HANA HANA 2.0 Database SPS07 Patch Dry Run', date: '2026-08-25', time: '14:00 – 17:00 AST', owner: 'BASIS Lead', status: 'Completed', priority: 'High', desc: 'Technical BASIS team dry run for database patch script sequencing.' },
    // September 2026
    { id: 'CAL-TRN-007', title: 'Shift Handover & Escalation Governance Refresh', date: '2026-09-14', time: '11:00 – 12:30 AST', owner: 'General Shift Commander', status: 'Scheduled', priority: 'Medium', desc: 'Standard operating procedures for seamless General Shift incident handover.' },
    { id: 'CAL-TRN-008', title: 'SAC Executive Predictive Analytics & Story Boarding Clinic', date: '2026-09-23', time: '14:00 – 16:00 AST', owner: 'Analytics Lead', status: 'Scheduled', priority: 'Medium', desc: 'Training business analysts on creating custom drill-down tiles in SAC.' },
    // October 2026
    { id: 'CAL-TRN-009', title: 'Zero-Trust Network Access & IAM MFA Protocol Workshop', date: '2026-10-14', time: '10:00 – 12:00 AST', owner: 'Cybersecurity Trainer', status: 'Scheduled', priority: 'Medium', desc: 'Defense contractor security protocols and passwordless access token handling.' },
    { id: 'CAL-TRN-010', title: 'Advanced Production Planning & Detailed Scheduling (PP-DS)', date: '2026-10-28', time: '13:00 – 16:00 AST', owner: 'Supply Chain Architect', status: 'Scheduled', priority: 'High', desc: 'Masterclass for factory planners on automated capacity constraint scheduling.' },
    // November 2026
    { id: 'CAL-TRN-011', title: 'Defense Munitions Material Master Best Practices', date: '2026-11-11', time: '10:00 – 12:00 AST', owner: 'Materials Management Lead', status: 'Scheduled', priority: 'Medium', desc: 'Strict serialization and batch tracking configuration for ordnance items.' },
    { id: 'CAL-TRN-012', title: 'Ariba Contract Workspace & Milestone Invoicing Clinic', date: '2026-11-23', time: '14:00 – 16:00 AST', owner: 'Ariba Lead', status: 'Scheduled', priority: 'Medium', desc: 'Training procurement specialists on milestone payment releases and compliance gates.' },
    // December 2026
    { id: 'CAL-TRN-013', title: 'Year-End Financial Closing Playbook & Runbook Walkthrough', date: '2026-12-09', time: '10:00 – 13:00 AST', owner: 'Financial Systems Lead', status: 'Scheduled', priority: 'High', desc: 'Step-by-step walkthrough of automated foreign currency revaluation and ledger balance carryforward.' },
    { id: 'CAL-TRN-014', title: '2027 Operational Readiness & Disaster Recovery Clinic', date: '2026-12-16', time: '14:00 – 16:30 AST', owner: 'Disaster Recovery Lead', status: 'Scheduled', priority: 'Medium', desc: 'Review of emergency call trees, satellite failover communications, and DC2 hot-standby readiness.' },
  ];

  trainingEvents.forEach(t => {
    events.push({
      id: t.id,
      title: t.title,
      type: 'training',
      typeLabel: 'User Enablement',
      date: t.date,
      time: t.time,
      owner: t.owner,
      status: t.status,
      priority: t.priority,
      badgeColor: 'badge-success',
      description: t.desc,
    });
  });

  return events.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// ═══════════════════════════════════════════════════
// 5. EXECUTIVE BOARD SELECTORS (Section 16)
// ═══════════════════════════════════════════════════
export function getExecutiveBoardData(filter = {}) {
  const incAnalytics = getIncidentAnalytics(filter);
  const srAnalytics = getServiceRequestAnalytics(filter);
  const enhAnalytics = getEnhancementAnalytics(filter);

  // Total tickets for the selected scope
  const totalTickets = incAnalytics.total + srAnalytics.total + enhAnalytics.total;

  // P1 and P2 metrics calculated from underlying incident data
  const p1Incidents = incAnalytics.filteredList.filter(i => i.priority === 'P1');
  const p2Incidents = incAnalytics.filteredList.filter(i => i.priority === 'P2');

  const p1Count = p1Incidents.length;
  const p1Sla = p1Count > 0
    ? Math.round((p1Incidents.filter(i => i.slaStatus !== 'Breached' && i.resolutionSla !== 'Breached').length / p1Count) * 100)
    : 100;

  const p2Count = p2Incidents.length;
  const p2Sla = p2Count > 0
    ? Math.round((p2Incidents.filter(i => i.slaStatus !== 'Breached' && i.resolutionSla !== 'Breached').length / p2Count) * 100)
    : 100;

  // Contractual Resolution SLA Performance Trend (Dynamically generated from underlying data)
  const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
  const slaTrend = months.map(m => {
    const [, mo] = m.split('-');
    const mIncidents = incidents.filter(i => i.createdDate && i.createdDate.startsWith(m));
    const mBreached = mIncidents.filter(i => i.slaStatus === 'Breached').length;
    const total = mIncidents.length;
    const actualRes = total > 0 ? +(((total - mBreached) / total) * 100).toFixed(1) : 98.0;
    return {
      month: MONTH_SHORT_NAMES[Number(mo) - 1],
      Resolution: Math.min(100, Math.max(90, actualRes)),
      Target: OVERALL_MONTHLY_RESOLUTION_TARGET,
    };
  });

  // Overall Ticket Mix (Incidents, SRs, Enhancements, Problems)
  const ticketMix = [
    { name: 'Incidents', value: incAnalytics.total, color: '#6B1D2A' },
    { name: 'Service Requests', value: srAnalytics.total, color: '#2563EB' },
    { name: 'Enhancements', value: enhAnalytics.total, color: '#7C3AED' },
    { name: 'Problem RCAs', value: Math.max(1, Math.round(problems.length * (filter.period?.startsWith('m_') ? 0.35 : 1))), color: '#0D9F6E' },
  ];

  // Application Health Breakdown
  const appHealth = [
    { name: 'Healthy (Green)', value: 24, color: '#0D9F6E' },
    { name: 'Degraded / At Risk', value: 2, color: '#D97706' },
    { name: 'Critical Outage', value: 0, color: '#DC2626' },
  ];

  // Resource Compliance (Plan vs Actual FTEs)
  const resourceCompliance = [
    { track: 'AMS-ON-RUN', Plan: 14, Actual: 14, Coverage: '100%' },
    { track: 'AMS-OF-RUN', Plan: 10, Actual: 10, Coverage: '100%' },
    { track: 'AMS-OF-Flex', Plan: 3, Actual: 3, Coverage: '100%' },
    { track: 'ENH-OF-RUN', Plan: 3, Actual: 3, Coverage: '100%' },
  ];

  // Dynamic Executive CSAT derived from customer feedback in period
  const periodFeedback = customerFeedback.filter(f => {
    if (filter.period && filter.period !== 'all') {
      return checkMatchesPeriod(f.date, filter.period);
    }
    return true;
  });
  const fbTotal = periodFeedback.length || 1;
  const excCount = periodFeedback.filter(f => f.rating === 'Excellent' || f.rating === 'Very Satisfied').length;
  const vgCount = periodFeedback.filter(f => f.rating === 'Very Good' || f.rating === 'Satisfied').length;
  const gdCount = periodFeedback.filter(f => f.rating === 'Good' || f.rating === 'Neutral').length;
  const avgCount = periodFeedback.filter(f => f.rating === 'Average' || f.rating === 'Dissatisfied').length;
  const poorCount = periodFeedback.filter(f => f.rating === 'Poor' || f.rating === 'Very Dissatisfied').length;

  // Formula per Item 40: CSAT = (Satisfied + Very Satisfied) / Total * 100
  const dynamicCsatScore = Math.round(((excCount + vgCount) / fbTotal) * 100);

  const executiveCsat = {
    overall: dynamicCsatScore,
    target: 90,
    status: dynamicCsatScore >= 90 ? 'success' : 'warning',
    distribution: [
      { name: 'Very Satisfied', pct: Math.round((excCount / fbTotal) * 100), color: '#0D9F6E' },
      { name: 'Satisfied', pct: Math.round((vgCount / fbTotal) * 100), color: '#2563EB' },
      { name: 'Neutral', pct: Math.round((gdCount / fbTotal) * 100), color: '#6366F1' },
      { name: 'Dissatisfied', pct: Math.round((avgCount / fbTotal) * 100), color: '#D97706' },
      { name: 'Very Dissatisfied', pct: Math.round((poorCount / fbTotal) * 100), color: '#DC2626' },
    ],
  };

  return {
    overallHealth: 96.4,
    slaScore: incAnalytics.resolutionSla,
    totalTickets,
    p1Count,
    p1Sla,
    p2Count,
    p2Sla,
    p1p2Active: p1Count + p2Count,
    appEstateHealth: 99.98,
    resourceCoverage: 100,
    slaTrend,
    ticketMix,
    appHealth,
    resourceCompliance,
    executiveCsat,
    exceptionQueue: incAnalytics.exceptionQueue.slice(0, 5),
    incidentsCount: incAnalytics.total,
    srCount: srAnalytics.total,
    enhCount: enhAnalytics.total,
  };
}

// ═══════════════════════════════════════════════════
// 6. SERVICE OPERATION SELECTORS (Section 12 & 13)
// ═══════════════════════════════════════════════════
export function getServiceOperationMetrics() {
  // 26 applications * 720 hours/month = 18,720 operating hours
  const totalOperatingHours = 26 * 720;
  const criticalOutages = incidents.filter(i => i.priority === 'P1' && i.slaStatus === 'Breached').length;
  const failureCount = Math.max(14, criticalOutages > 0 ? criticalOutages * 5 : 14);
  const mtbfHours = (totalOperatingHours / failureCount).toFixed(1);

  return {
    mtbfHours: `${mtbfHours}h`,
    mtbfRaw: parseFloat(mtbfHours),
    mtbfTarget: '≥ 1,200h',
    totalDrPlanned: 4,
    totalDrCompleted: 4,
    drSuccessRate: 100,
    drDrillScore: '100% Pass',
  };
}

// ═══════════════════════════════════════════════════
// 7. RESOURCE UTILIZATION SELECTORS (Section 5)
// ═══════════════════════════════════════════════════
export function getResourceUtilizationMetrics(resourceId) {
  const rawId = typeof resourceId === 'object' ? resourceId?.id : resourceId;
  const numId = parseInt(String(rawId || '').replace(/\D/g, ''), 10) || 1;
  const allocatedHours = 160;
  // Deterministic utilized hours based on resource ID: between 144h and 156h
  const variance = ((numId * 7 + 11) % 13);
  const utilizedHours = 144 + variance;
  const utilization = Math.round((utilizedHours / allocatedHours) * 100);

  return {
    resourceId: rawId,
    allocatedHours,
    utilizedHours,
    utilization,
    utilizationFormatted: `${utilization}%`,
  };
}

export function getOverallResourceUtilization() {
  const totalAllocated = RESOURCES.length * 160; // 30 * 160 = 4800h
  let totalUtilized = 0;
  RESOURCES.forEach(r => {
    const m = getResourceUtilizationMetrics(r.id);
    totalUtilized += m.utilizedHours;
  });
  const overallUtilization = ((totalUtilized / totalAllocated) * 100).toFixed(1);

  return {
    overallUtilization: parseFloat(overallUtilization),
    overallUtilizationFormatted: `${overallUtilization}%`,
    totalAllocated,
    totalUtilized,
  };
}

