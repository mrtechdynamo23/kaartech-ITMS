import { SERVICE_DOMAINS } from './serviceDomains';
/**
 * KaarTech ITMS Control Tower — Organization Data & Hierarchy Engine
 * 
 * Source of truth: Resource Master (RESOURCES) in demoData.js
 * and Service Domains & Tracks in masterData.js.
 * 
 * Provides:
 * - Structured 4-tier organization tree:
 *   Tier 1: AMS Leadership / SteerCom
 *   Tier 2: Service Domains (Order to Cash, Estimate to Margin, Procure to Pay, Design to Ship, Source to Pay, Acquire to Dispose, Record to Report)
 *   Tier 3: Capability / Delivery Teams (Process Groups)
 *   Tier 4: Specialized Resources
 * - Normalized reporting relationships (who reports to whom, direct reports)
 * - Hierarchy metrics (counts, onsite/offshore, tracks, allocation)
 * - Search & Filter path ancestry solver (keeps hierarchy visible)
 * - Recent organization restructuring & assignment changes
 */

import { RESOURCES } from './demoData';
import { TRACKS, ENTITIES } from './masterData';

// ── Leadership SteerCom ──
export const LEADERSHIP_STEERCOM = [
  {
    id: 'LEAD-01',
    name: 'Dr. Tariq Al Nuaimi',
    role: 'KaarTech AMS Program Director',
    entity: 'KaarTech Corporate HQ',
    focus: 'Strategic Alignment, SteerCom Governance & Service Level Agreements',
    tier: 'Executive',
    location: 'Onsite (Riyadh HQ)',
    email: 'tariq.alnuaimi@kaartech.com',
    phone: '+966-11-XXX-0001',
    reportsTo: 'Enterprise SteerCom / CIO',
    status: 'Active',
  },
  {
    id: 'RES-002', // Links to actual resource in Master
    name: 'Fatima Al-Otaibi',
    role: 'AMS Delivery Lead',
    entity: 'KaarTech Business Services',
    focus: 'Overall Operational Delivery, Cross-Domain Escalation & Service Performance',
    tier: 'Operations Command',
    location: 'Onsite',
    email: 'fatima.z@kaartech.com',
    phone: '+966-55-XXX-1002',
    reportsTo: 'Dr. Tariq Al Nuaimi',
    status: 'Active',
    positionId: 'POS-002',
    track: 'AMS-ON-RUN',
    serviceDomain: 'SAP ERP and SuccessFactors',
  },
  {
    id: 'RES-004', // Links to actual resource in Master
    name: 'Sara Al Marzouqi',
    role: 'Quality & Governance Lead',
    entity: 'KaarTech Technologies',
    focus: 'Audit, Risk Compliance, CAPA Verification & Continuous Improvement',
    tier: 'Quality & Governance',
    location: 'Onsite',
    email: 'sara.m@kaartech.com',
    phone: '+966-55-XXX-1004',
    reportsTo: 'Fatima Al-Otaibi',
    status: 'Active',
    positionId: 'POS-004',
    track: 'AMS-ON-RUN',
    serviceDomain: 'SAP ERP and SuccessFactors',
  },
];

// ── Domain Lead Mappings (from resources) ──

// ── Service Domain Lead Mappings (from 7 Core RFP Domains) ──
export const SERVICE_DOMAIN_LEADS = {
  'TWR-01': 'RES-027', // Sultan Al Dhahiri (Helpdesk & End User Services)
  'TWR-02': 'RES-020', // Suresh Krishnan (Infrastructure, Cloud & Platform)
  'TWR-03': 'RES-014', // Sunita Reddy (Applications, Digital & Integration)
  'TWR-04': 'RES-012', // Lakshmi Devi (Data, Analytics, AI & Automation)
  'TWR-05': 'RES-017', // Mariam Al Suwaidi (Architecture, Quality & Testing)
  'TWR-06': 'RES-001', // Khalid Al Hashimi (SAP ERP & SuccessFactors)
  'TWR-07': 'RES-002', // Fatima Al-Otaibi (Service Management, Governance & Delivery)
};
export const DOMAIN_LEADS = SERVICE_DOMAIN_LEADS;

// ── Helper: Get Entity Object by ID ──
export function getEntityById(entityId) {
  return ENTITIES.find(e => e.id === entityId) || { id: entityId, name: 'Enterprise Entity', location: 'Riyadh' };
}

// ── Helper: Get Resource by ID ──
export function getResourceById(resId) {
  return RESOURCES.find(r => r.id === resId) || null;
}

// ── Build Enriched Resource with Direct Reports & Computed Fields ──
export function getEnrichedResources() {
  const resourceMap = new Map();

  // Include LEAD-01 (SteerCom Program Director)
  const director = LEADERSHIP_STEERCOM[0];
  resourceMap.set('LEAD-01', {
    id: 'LEAD-01',
    positionId: 'POS-DIR-001',
    name: director.name,
    role: director.role,
    serviceDomain: 'Service Management, Governance, and Delivery',
    processGroup: 'SteerCom Governance',
    track: 'AMS-ON-RUN',
    allocation: 'Dedicated',
    nationality: 'Saudi Arabia',
    location: 'Onsite',
    onboardingDate: '2025-06-01',
    reportingManager: null,
    status: 'Active',
    gender: 'Male',
    skill: 'Executive Leadership, SteerCom Governance, Defense IT Strategy',
    certification: 'PMP, ITIL v4 Master, TOGAF 9.2',
    phone: director.phone || '+966-11-XXX-0001',
    email: director.email || 'tariq.alnuaimi@kaartech.com',
    entity: 'ENT-001',
    entityObj: getEntityById('ENT-001'),
    directReports: ['RES-002'],
    managerInfo: { id: 'CIO', name: 'Enterprise CIO', role: 'Group CIO', serviceDomain: 'Service Management, Governance, and Delivery' },
  });

  RESOURCES.forEach(res => {
    resourceMap.set(res.id, {
      ...res,
      directReports: [],
      managerInfo: null,
      allocation: res.track === 'AMS-OF-Flex' ? 'Shared' : 'Dedicated',
      entityObj: getEntityById(res.entity),
    });
  });

  // Wire direct reports and manager info
  resourceMap.forEach(res => {
    if (res.reportingManager && resourceMap.has(res.reportingManager)) {
      const manager = resourceMap.get(res.reportingManager);
      manager.directReports.push(res.id);
      res.managerInfo = {
        id: manager.id,
        name: manager.name,
        role: manager.role,
        serviceDomain: manager.serviceDomain,
      };
    } else if (!res.reportingManager && res.id !== 'LEAD-01') {
      // Top delivery lead reports to Program Director
      res.managerInfo = {
        id: 'LEAD-01',
        name: 'Dr. Tariq Al Nuaimi',
        role: 'KaarTech AMS Program Director',
        serviceDomain: 'Service Management, Governance, and Delivery',
      };
    }
  });

  return Array.from(resourceMap.values());
}

// ── Organization Summary Metrics ──
export function getOrganizationMetrics() {
  const enriched = getEnrichedResources();
  const totalResources = enriched.length;
  const onsiteCount = enriched.filter(r => r.location === 'Onsite').length;
  const offshoreCount = enriched.filter(r => r.location === 'Offshore').length;
  const dedicatedCount = enriched.filter(r => r.allocation === 'Dedicated').length;
  const sharedFlexCount = enriched.filter(r => r.allocation === 'Shared').length;
  const saudiNationals = enriched.filter(r => r.nationality === 'Saudi Arabia').length;

  // Managers/Leads: Delivery lead + domain leads + anyone with direct reports
  const managerIds = new Set(
    enriched.filter(r => r.directReports.length > 0 || Object.values(SERVICE_DOMAIN_LEADS).includes(r.id) || Object.values(DOMAIN_LEADS).includes(r.id)).map(r => r.id)
  );

  // Teams: unique domain + processGroup combinations
  const teamsSet = new Set(enriched.map(r => `${r.serviceDomain}::${r.processGroup}`));

  // Track breakdown
  const trackCounts = {};
  TRACKS.forEach(tr => {
    trackCounts[tr.key] = enriched.filter(r => r.track === tr.key).length;
  });

  return {
    totalResources,
    onsiteCount,
    offshoreCount,
    onsitePercentage: Math.round((onsiteCount / totalResources) * 100),
    offshorePercentage: Math.round((offshoreCount / totalResources) * 100),
    dedicatedCount,
    sharedFlexCount,
    totalManagers: managerIds.size + 1, // + Dr. Tariq Al Nuaimi
    managerIds: Array.from(managerIds),
    activeTeamsCount: teamsSet.size,
    totalDomainsCount: SERVICE_DOMAINS.length,
    saudiNationals,
    saudizationRate: Math.round((saudiNationals / totalResources) * 100),
    trackCounts,
  };
}

// ── Member Change History Mapping ──
/**
 * Tracks documented personnel and assignment movements per team/posting.
 * Connects directly with RECENT_ORGANIZATION_CHANGES governance log:
 * - Production Planning: 3 member changes (Hassan Al Nuaimi onsite shift, Suresh Krishnan ENH track transition, Priya Nair lead rotation)
 * - Quality Management: 2 member changes (Sultan Al Dhahiri QM onsite assignment [CHG-006], Ankit Patel flex pool mobilization [CHG-002])
 * - Strategic Sourcing: 2 member changes (Nisha Varma enhancement sprint allocation [CHG-003], Noura Al Shamsi lead rotation)
 * - Vendor Management: 1 member change (Aisha Khalfan onsite rotation at Enterprise HQ [CHG-004])
 * - Invoice Processing: 1 member change (Sunita Reddy dedicated sprint transition [CHG-003])
 * - Financial Accounting: 1 member change (Fatima Al-Otaibi operational command handover [CHG-001])
 * - All other teams: 0 member changes (badge hidden)
 */
export const TEAM_MEMBER_CHANGE_COUNTS = {
  'SAP ERP and SuccessFactors::Production Planning': 3,
  'SAP ERP and SuccessFactors::Quality Management': 2,
  'SAP ERP and SuccessFactors::Strategic Sourcing': 2,
  'SAP ERP and SuccessFactors::Vendor Management': 1,
  'SAP ERP and SuccessFactors::Invoice Processing': 1,
  'SAP ERP and SuccessFactors::Financial Accounting': 1,
  'TWR-06::Production Planning': 3,
  'TWR-06::Quality Management': 2,
  'TWR-06::Strategic Sourcing': 2,
  'TWR-06::Vendor Management': 1,
  'TWR-06::Invoice Processing': 1,
  'TWR-06::Financial Accounting': 1,
  'Production Planning': 3,
  'Quality Management': 2,
  'Strategic Sourcing': 2,
  'Vendor Management': 1,
  'Invoice Processing': 1,
  'Financial Accounting': 1,
};

export const RESOURCE_MEMBER_CHANGE_COUNTS = {
  'RES-005': 3, // Priya Nair (Production Planning - 3 member changes)
  'RES-013': 2, // Hassan Al Nuaimi (Production Planning)
  'RES-020': 1, // Suresh Krishnan (Manufacturing)
  'RES-009': 2, // Ankit Patel (Quality Management)
  'RES-027': 2, // Sultan Al Dhahiri (Quality Management)
  'RES-008': 1, // Noura Al Shamsi (Strategic Sourcing)
  'RES-026': 2, // Nisha Varma (Strategic Sourcing)
  'RES-010': 1, // Aisha Khalfan (Vendor Management)
  'RES-014': 1, // Sunita Reddy (Invoice Processing)
  'RES-002': 1, // Fatima Al-Otaibi (Financial Accounting)
};

export function getMemberChangeCountForResource(resourceId) {
  const cleanId = String(resourceId || '').replace(/^res-/, '');
  return RESOURCE_MEMBER_CHANGE_COUNTS[cleanId] || 0;
}

export function getMemberChangeCountForTeam(domain, teamName) {
  const key = `${domain}::${teamName}`;
  return TEAM_MEMBER_CHANGE_COUNTS[key] || TEAM_MEMBER_CHANGE_COUNTS[teamName] || 0;
}

// ── Build Hierarchical Organization Tree ──
export function buildOrganizationTree() {
  const enrichedResources = getEnrichedResources();
  const metrics = getOrganizationMetrics();

  // Root Node: KaarTech ITMS Leadership & SteerCom
  const rootNode = {
    id: 'org-root',
    type: 'leadership',
    name: 'KaarTech ITMS Leadership & SteerCom',
    director: LEADERSHIP_STEERCOM[0],
    deliveryLead: LEADERSHIP_STEERCOM[1],
    governanceLead: LEADERSHIP_STEERCOM[2],
    resourceCount: metrics.totalResources,
    memberChangeCount: 0,
    onsiteCount: metrics.onsiteCount,
    offshoreCount: metrics.offshoreCount,
    children: [],
  };

  // Tier 2: 7 Core RFP Service Domains
  SERVICE_DOMAINS.forEach(domain => {
    const domainResources = enrichedResources.filter(r => 
      r.serviceDomainId === domain.id || r.towerId === domain.id
    );
    const domainLeadId = SERVICE_DOMAIN_LEADS[domain.id] || domain.defaultManager;
    const domainLead = enrichedResources.find(r => r.id === domainLeadId) || domainResources[0] || null;

    // Group resources by Process Group / Capability Team
    const processGroupMap = new Map();
    domainResources.forEach(res => {
      const pgKey = res.processGroup || 'Operational Support';
      if (!processGroupMap.has(pgKey)) {
        processGroupMap.set(pgKey, []);
      }
      processGroupMap.get(pgKey).push(res);
    });

    const teams = [];
    processGroupMap.forEach((members, pgName) => {
      const lead = members.find(m => m.directReports && m.directReports.length > 0) || members[0];
      const teamOnsite = members.filter(m => m.location === 'Onsite').length;
      const teamOffshore = members.filter(m => m.location === 'Offshore').length;
      const memberChangeCount = getMemberChangeCountForTeam(domain.code, pgName);

      const teamNode = {
        id: `team-${domain.id}-${pgName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        type: 'team',
        name: pgName,
        domainKey: domain.id,
        domainCode: domain.code,
        domainName: domain.name,
        lead,
        resourceCount: members.length,
        memberChangeCount,
        onsiteCount: teamOnsite,
        offshoreCount: teamOffshore,
        tracks: Array.from(new Set(members.map(m => m.track))),
        members: members.map(m => ({
          id: `res-${m.id}`,
          rawId: m.id,
          type: 'resource',
          memberChangeCount: getMemberChangeCountForResource(m.id),
          data: m,
        })),
      };

      teams.push(teamNode);
    });

    const domainMemberChangeCount = teams.reduce((acc, t) => acc + (t.memberChangeCount || 0), 0);
    const activeCount = domainResources.filter(r => r.status === 'Active').length;
    const availableCount = domainResources.filter(r => (r.availability || 0) >= 95).length;
    const onLeaveCount = domainResources.filter(r => r.status === 'On Leave').length;
    const criticalCount = domainResources.filter(r => r.level === 'L3').length;
    const slaAvg = domainResources.length > 0 
      ? Math.round(domainResources.reduce((acc, r) => acc + (r.slaHealth || 95), 0) / domainResources.length)
      : 96;

    const domainNode = {
      id: `domain-${domain.id}`,
      type: 'domain',
      code: domain.code,
      name: domain.name,
      shortName: domain.shortName,
      abbreviation: domain.code,
      lead: domainLead,
      headcount: domainResources.length,
      resourceCount: domainResources.length,
      activeCount,
      availableCount,
      onLeaveCount,
      criticalCount,
      assignmentCount: domainResources.length,
      slaHealth: slaAvg,
      memberChangeCount: domainMemberChangeCount,
      onsiteCount: domainResources.filter(r => r.location === 'Onsite').length,
      offshoreCount: domainResources.filter(r => r.location === 'Offshore').length,
      teamCount: teams.length,
      children: teams,
    };

    rootNode.children.push(domainNode);
  });

  rootNode.memberChangeCount = rootNode.children.reduce((acc, d) => acc + (d.memberChangeCount || 0), 0);

  return rootNode;
}

// ── Search & Filter Path Ancestry Matcher ──
/**
 * Evaluates nodes against search term and filters.
 * Returns:
 * - matchedNodeIds: Set of IDs that directly matched
 * - ancestorNodeIds: Set of IDs of ancestors that MUST be expanded to reveal matches
 * - isMatchFound: boolean
 */
export function solveHierarchyMatches(tree, searchTerm = '', filters = {}) {
  const matchedNodeIds = new Set();
  const ancestorNodeIds = new Set();
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const domainFilter = filters.domain && filters.domain !== 'all' ? filters.domain : null;
  const locationFilter = filters.location && filters.location !== 'all' ? filters.location : null;
  const trackFilter = filters.track && filters.track !== 'all' ? filters.track : null;
  const statusFilter = filters.status && filters.status !== 'all' ? filters.status : null;

  function matchesResource(res) {
    if (!res) return false;
    // Filter check
    if (domainFilter && res.serviceDomain !== domainFilter && res.serviceDomainId !== domainFilter) return false;
    if (locationFilter && res.location !== locationFilter) return false;
    if (trackFilter && res.track !== trackFilter) return false;
    if (statusFilter && res.status !== statusFilter) return false;

    // Search check
    if (!normalizedSearch) return true;
    const searchTarget = [
      res.name,
      res.id,
      res.positionId,
      res.role,
      res.serviceDomain,
      res.serviceDomainId,
      res.processGroup,
      res.track,
      res.location,
      res.nationality,
      res.skill,
      res.certification,
      res.email,
      res.managerInfo ? res.managerInfo.name : '',
    ].join(' ').toLowerCase();

    return searchTarget.includes(normalizedSearch);
  }

  function matchesTeam(team) {
    if (domainFilter && team.domainKey !== domainFilter) return false;
    if (locationFilter && team.onsiteCount === 0 && locationFilter === 'Onsite') return false;
    if (locationFilter && team.offshoreCount === 0 && locationFilter === 'Offshore') return false;
    if (trackFilter && !team.tracks.includes(trackFilter)) return false;

    if (!normalizedSearch) return true;
    const searchTarget = [
      team.name,
      team.domainKey,
      team.domainName,
      team.lead ? team.lead.name : '',
    ].join(' ').toLowerCase();

    return searchTarget.includes(normalizedSearch);
  }

  function matchesDomain(domain) {
    if (domainFilter && domain.code !== domainFilter) return false;
    if (locationFilter && domain.onsiteCount === 0 && locationFilter === 'Onsite') return false;
    if (locationFilter && domain.offshoreCount === 0 && locationFilter === 'Offshore') return false;

    if (!normalizedSearch) return true;
    const searchTarget = [
      domain.code,
      domain.name,
      domain.lead ? domain.lead.name : '',
    ].join(' ').toLowerCase();

    return searchTarget.includes(normalizedSearch);
  }

  // Traverse tree
  tree.children.forEach(domain => {
    const domainMatchesSelf = matchesDomain(domain);
    let domainHasMatchingDescendant = false;

    domain.children.forEach(team => {
      const teamMatchesSelf = matchesTeam(team);
      let teamHasMatchingMember = false;

      team.members.forEach(memberNode => {
        if (matchesResource(memberNode.data)) {
          matchedNodeIds.add(memberNode.id);
          teamHasMatchingMember = true;
        }
      });

      if (teamMatchesSelf || teamHasMatchingMember) {
        matchedNodeIds.add(team.id);
        ancestorNodeIds.add(domain.id);
        domainHasMatchingDescendant = true;
        if (teamHasMatchingMember) {
          ancestorNodeIds.add(team.id);
        }
      }
    });

    if (domainMatchesSelf || domainHasMatchingDescendant) {
      matchedNodeIds.add(domain.id);
      ancestorNodeIds.add(tree.id);
    }
  });

  return {
    matchedNodeIds,
    ancestorNodeIds,
    isFilterActive: Boolean(normalizedSearch || domainFilter || locationFilter || trackFilter || statusFilter),
    matchCount: matchedNodeIds.size,
  };
}

// ── Recent Organization Changes ──
export const RECENT_ORGANIZATION_CHANGES = [
  {
    id: 'CHG-001',
    date: '2026-06-18',
    category: 'Leadership Appointment',
    title: 'Fatima Al-Otaibi Confirmed as AMS Delivery Lead',
    description: 'Operational delivery command consolidated across all 7 ITMS Service Domains.',
    affectedDomain: 'Cross-Domain',
    personnel: 'Fatima Al-Otaibi (RES-002)',
    location: 'Onsite (Riyadh HQ)',
    status: 'Completed',
  },
  {
    id: 'CHG-002',
    date: '2026-06-24',
    category: 'Capacity Realignment',
    title: 'Ankit Patel Assigned to SAP ERP Flex Pool',
    description: 'Specialist mobilization under AMS-OF-Flex track to support manufacturing delivery surges across manufacturing entities.',
    affectedDomain: 'SAP ERP and SuccessFactors',
    personnel: 'Ankit Patel (RES-009)',
    location: 'Offshore (Delivery Center)',
    status: 'Active',
  },
  {
    id: 'CHG-003',
    date: '2026-07-02',
    category: 'Track Allocation',
    title: 'Dedicated Enhancement Stream Allocation',
    description: 'Sunita Reddy (RES-014) and Nisha Varma (RES-026) transitioned to ENH-OF-RUN for dedicated SAP enhancement sprints.',
    affectedDomain: 'SAP ERP and SuccessFactors',
    personnel: 'Sunita Reddy, Nisha Varma',
    location: 'Offshore Dedicated',
    status: 'Completed',
  },
  {
      id: 'CHG-004',
      date: '2026-07-20',
      type: 'relocation',
      badge: 'Location Transfer',
      title: 'Aisha Khalfan Stationed at Enterprise Commercial Hub',
      description: 'Onsite vendor management lead positioned at Enterprise Corporate HQ for direct vendor alignment and procurement governance.',
      affectedId: 'RES-010',
      affectedName: 'Aisha Khalfan',
      affectedRole: 'Functional Consultant',
      serviceDomain: 'SAP ERP and SuccessFactors',
      location: 'KaarTech Corporate HQ',
      status: 'Completed',
  },
  {
    id: 'CHG-005',
    date: '2026-07-28',
    category: 'Governance Milestone',
    title: 'Executive SteerCom Governance Baseline Ratified',
    description: 'Dr. Tariq Al Nuaimi convened Q3 AMS Governance Council; 100% contracted baseline compliance verified with zero staffing gaps.',
    affectedDomain: 'SteerCom',
    personnel: 'Dr. Tariq Al Nuaimi (LEAD-01)',
    location: 'KaarTech Group HQ',
    status: 'Ratified',
  },
  {
    id: 'CHG-006',
    date: '2026-08-04',
    category: 'Specialization Expansion',
    title: 'Sultan Al Dhahiri Assigned to Manufacturing QM Onsite Lead',
    description: 'Onsite SAP QM specialist operationalized to support high-precision manufacturing quality assurance workflows.',
    affectedDomain: 'SAP ERP and SuccessFactors',
    personnel: 'Sultan Al Dhahiri (RES-027)',
    location: 'Onsite (Manufacturing Plant)',
    status: 'Active',
  },
];
