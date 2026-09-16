/**
 * KaarTech ITMS Control Tower — Primary Service Domain Master
 * 
 * SOURCED FROM RFP SOW:
 * The 7 primary Service Domains constitute the authoritative taxonomy across the entire portal:
 * 1. IT Helpdesk & End User Services (TWR-01)
 * 2. Infrastructure, Cloud, and Platform Services (TWR-02)
 * 3. Applications, Digital, and Integration (TWR-03)
 * 4. Data, Analytics, AI, and Automation (TWR-04)
 * 5. Architecture, Quality, and Testing (TWR-05)
 * 6. SAP ERP and SuccessFactors (TWR-06)
 * 7. Service Management, Governance, and Delivery (TWR-07)
 */

export const SERVICE_DOMAINS = [
  {
    id: 'TWR-01',
    towerId: 'TWR-01',
    code: 'EUS',
    shortCode: 'EUS',
    name: 'IT Helpdesk & End User Services',
    shortName: 'Helpdesk & End User',
    description: 'L1/L2 multi-channel service desk, VIP executive support, desktop engineering, modern workplace platforms, endpoint deployment, and first-contact resolution.',
    icon: 'Headphones',
    color: '#2563EB',
    rfpCapabilities: [
      'IT Service Management and User Services',
    ],
    defaultManager: 'RES-027',
  },
  {
    id: 'TWR-02',
    towerId: 'TWR-02',
    code: 'ICP',
    shortCode: 'ICP',
    name: 'Infrastructure, Cloud, and Platform Services',
    shortName: 'Infra & Cloud',
    description: 'Hybrid cloud (Azure/AWS), datacenter operations, hyperconverged compute, virtualization, enterprise storage, network/SD-WAN, Linux/Windows administration, and backup/DR.',
    icon: 'Cloud',
    color: '#0D9F6E',
    rfpCapabilities: [
      'Infrastructure, Network, and Data Center',
      'Cloud, Microsoft 365, and Workplace Platforms',
      'IT Security Operations Support',
    ],
    defaultManager: 'RES-020',
  },
  {
    id: 'TWR-03',
    towerId: 'TWR-03',
    code: 'ADI',
    shortCode: 'ADI',
    name: 'Applications, Digital, and Integration',
    shortName: 'Apps & Digital',
    description: 'Custom web/mobile applications, enterprise portals, API management, integration middleware, ServiceNow development & administration, and digital experience solutions.',
    icon: 'Layers',
    color: '#7C3AED',
    rfpCapabilities: [
      'Non-ERP Applications and Digital Solutions',
    ],
    defaultManager: 'RES-014',
  },
  {
    id: 'TWR-04',
    towerId: 'TWR-04',
    code: 'DAA',
    shortCode: 'DAA',
    name: 'Data, Analytics, AI, and Automation',
    shortName: 'Data & AI',
    description: 'Enterprise data warehousing, Power BI, analytics engineering, ETL pipelines, AI/ML model deployment, robotic process automation (RPA), and intelligent workflows.',
    icon: 'BarChart3',
    color: '#D97706',
    rfpCapabilities: [
      'Data, Analytics, Automation, and AI',
    ],
    defaultManager: 'RES-012',
  },
  {
    id: 'TWR-05',
    towerId: 'TWR-05',
    code: 'AQT',
    shortCode: 'AQT',
    name: 'Architecture, Quality, and Testing',
    shortName: 'Arch & Testing',
    description: 'Enterprise & solution architecture, QA governance, automated testing suites, performance engineering, security architecture, and change enablement.',
    icon: 'Shield',
    color: '#DC2626',
    rfpCapabilities: [
      'Architecture, Project Delivery, and IT Governance',
      'Testing, Change Enablement, Training, and Documentation',
      'IT Security Operations Support',
    ],
    defaultManager: 'RES-017',
  },
  {
    id: 'TWR-06',
    towerId: 'TWR-06',
    code: 'SAP',
    shortCode: 'SAP',
    name: 'SAP ERP and SuccessFactors',
    shortName: 'SAP ERP & SF',
    description: 'Core SAP S/4HANA (FICO, MM, SD, PM/EAM, PP, QM, EWM), SAP BTP, SuccessFactors HXM, SAP Ariba, SAP Analytics Cloud, ABAP/Fiori development, and BASIS administration.',
    icon: 'Monitor',
    color: '#6B1D2A',
    rfpCapabilities: [
      'ERP and Enterprise Business Applications',
    ],
    defaultManager: 'RES-001',
  },
  {
    id: 'TWR-07',
    towerId: 'TWR-07',
    code: 'SMG',
    shortCode: 'SMG',
    name: 'Service Management, Governance, and Delivery',
    shortName: 'Governance & Delivery',
    description: 'ITIL service operations, contractual SLA compliance, PMO delivery governance, vendor management, risk & audit compliance, and continuous service improvement.',
    icon: 'Target',
    color: '#0891B2',
    rfpCapabilities: [
      'IT Service Management and User Services',
      'Architecture, Project Delivery, and IT Governance',
      'Testing, Change Enablement, Training, and Documentation',
      'IT Security Operations Support',
    ],
    defaultManager: 'RES-002',
  },
];

// ── Selectors & Helper Functions ──

export function getServiceDomainById(id) {
  if (!id) return SERVICE_DOMAINS[0];
  return SERVICE_DOMAINS.find(d => d.id === id || d.towerId === id) || SERVICE_DOMAINS[0];
}

export function getServiceDomainByName(name) {
  if (!name) return SERVICE_DOMAINS[0];
  const q = name.toLowerCase().trim();
  return SERVICE_DOMAINS.find(d => 
    d.name.toLowerCase() === q || 
    d.shortName.toLowerCase() === q ||
    d.code.toLowerCase() === q
  ) || SERVICE_DOMAINS[0];
}

export function getServiceDomainList() {
  return SERVICE_DOMAINS;
}

export function getServiceDomainForResource(resource) {
  if (!resource) return SERVICE_DOMAINS[0];
  return getServiceDomainById(resource.serviceDomainId || resource.towerId);
}

export function getServiceDomainForRole(role) {
  if (!role) return SERVICE_DOMAINS[0];
  return getServiceDomainById(role.serviceDomainId || role.tower);
}

export function getServiceDomainForAssignment(assignment) {
  if (!assignment) return SERVICE_DOMAINS[0];
  return getServiceDomainById(assignment.serviceDomainId || assignment.towerId);
}

export function getServiceDomainForIncident(incident) {
  if (!incident) return SERVICE_DOMAINS[0];
  return getServiceDomainById(incident.serviceDomainId);
}

export function getServiceDomainForRequest(request) {
  if (!request) return SERVICE_DOMAINS[0];
  return getServiceDomainById(request.serviceDomainId);
}

export function getServiceDomainForEnhancement(enhancement) {
  if (!enhancement) return SERVICE_DOMAINS[0];
  return getServiceDomainById(enhancement.serviceDomainId);
}

export function getServiceDomainForApplication(app) {
  if (!app) return SERVICE_DOMAINS[0];
  return getServiceDomainById(app.serviceDomainId);
}

/**
 * Aggregates any record array across all 7 canonical Service Domains.
 * Guarantees zero-count domains are preserved and never omitted.
 */
export function groupByServiceDomain(records = [], domainKey = 'serviceDomainId') {
  return SERVICE_DOMAINS.map(sd => {
    const matching = records.filter(r => {
      const val = r[domainKey] || r.serviceDomain || r.serviceDomainId;
      return val === sd.id || val === sd.name || val === sd.code;
    });
    return {
      id: sd.id,
      code: sd.code,
      name: sd.name,
      shortName: sd.shortName,
      color: sd.color,
      count: matching.length,
      records: matching,
    };
  });
}

// Backward-compatible alias
export const TOWERS = SERVICE_DOMAINS;
