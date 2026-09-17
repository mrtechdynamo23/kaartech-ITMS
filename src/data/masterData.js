/**
 * KaarTech ITMS Control Tower — Master Data
 * 
 * Central master/configuration data per Section 68.
 * All source-confirmed data seeded from RFP.
 * Single source of truth — no duplicate datasets (Section 73).
 */


// ═══════════════════════════════════════════════════
// ENTITY MASTER — SOURCE-CONFIRMED (RFP Figure 4, Section 71)
// 34 enterprise entities as of June 2026. System supports dynamic add/remove.
// Operating in accordance with Saudi Arabia corporate and industrial standards.
// ═══════════════════════════════════════════════════
export const ENTITIES = [
  // Service Entities (27)
  { id: 'ENT-001', name: 'KaarTech Corp.', type: 'HQ', subType: 'Group HQ', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-002', name: 'KaarTech Business Services', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-003', name: 'KaarTech Commercial', type: 'Trading', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-004', name: 'KaarTech Global', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-005', name: 'KaarTech Technologies', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-006', name: 'KaarTech Advanced Concepts', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-007', name: 'KaarTech Support Services', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-008', name: 'KaarTech Security Systems', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-009', name: 'KaarTech Consulting Services', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-010', name: 'KaarTech Cyber Defense', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-011', name: 'KaarTech Earth & Geospatial', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-012', name: 'KaarTech Digital Solutions', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-013', name: 'KaarTech Aerospace', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-014', name: 'KaarTech Infrastructure', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-015', name: 'KaarTech Secure Comms', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-016', name: 'KaarTech Nordic Systems', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-017', name: 'KaarTech Enterprise Systems', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-018', name: 'KaarTech Telecom & Networks', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-019', name: 'KaarTech Marine Systems', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-020', name: 'KaarTech Intelligence Labs', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-021', name: 'KaarTech Autonomous Tech', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-022', name: 'KaarTech Power & Energy', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-023', name: 'KaarTech Digital Pulse', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-024', name: 'KaarTech Defense Systems', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-025', name: 'KaarTech Electronic Systems', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-026', name: 'KaarTech Data Center Tier 4', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-027', name: 'KaarTech Trust & Assurance', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },

  // Manufacturing Entities (7)
  { id: 'ENT-028', name: 'KaarTech Autonomous Systems', type: 'Manufacturing', calendarKey: 'manufacturing', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-029', name: 'KaarTech Precision Systems', type: 'Manufacturing', calendarKey: 'manufacturing', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-030', name: 'KaarTech Engineering Industries', type: 'Manufacturing', calendarKey: 'manufacturing', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-031', name: 'KaarTech Advanced Manufacturing', type: 'Manufacturing', calendarKey: 'manufacturing', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-032', name: 'KaarTech Materials Technology', type: 'Manufacturing', calendarKey: 'manufacturing', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-033', name: 'KaarTech Heavy Mobility', type: 'Manufacturing', calendarKey: 'manufacturing', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-034', name: 'KaarTech Precision Works', type: 'Manufacturing', calendarKey: 'manufacturing', country: 'Saudi Arabia', location: 'Riyadh', status: 'Active', goLiveStatus: 'Live' },
];

// ═══════════════════════════════════════════════════
// APPLICATION MASTER — SOURCE-CONFIRMED (RFP §3.1, Section 48)
// ═══════════════════════════════════════════════════
export const APPLICATIONS = [
  // In Scope
  { id: 'APP-001', name: 'SAP S/4HANA 2025', scope: 'In Scope', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP', technology: 'SAP', modules: 'MDG, GRC, AC, AM, PDMI', criticality: 'Critical', health: 'Healthy', hosting: 'On-Premise' },
  { id: 'APP-002', name: 'SAP Group Reporting', scope: 'In Scope', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP', technology: 'SAP', criticality: 'High', health: 'Healthy', hosting: 'On-Premise' },
  { id: 'APP-003', name: 'SAP Disclosure Management', scope: 'In Scope', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP', technology: 'SAP', criticality: 'High', health: 'Healthy', hosting: 'On-Premise' },
  { id: 'APP-004', name: 'SAP Global Trade Services (GTS)', scope: 'In Scope', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP', technology: 'SAP', criticality: 'High', health: 'Healthy', hosting: 'On-Premise' },
  { id: 'APP-005', name: 'SAP BW/4HANA + BPC 1.1', scope: 'In Scope', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation', vendor: 'SAP', technology: 'SAP', criticality: 'High', health: 'Healthy', hosting: 'On-Premise' },
  { id: 'APP-006', name: 'SAP Product Lifecycle Costing', scope: 'In Scope', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP', technology: 'SAP', criticality: 'Medium', health: 'Healthy', hosting: 'On-Premise' },
  { id: 'APP-007', name: 'SAP Process Orchestration', scope: 'In Scope', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP', technology: 'SAP', criticality: 'High', health: 'Healthy', hosting: 'On-Premise' },
  { id: 'APP-008', name: 'SAP MES', scope: 'In Scope', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP', technology: 'SAP', criticality: 'Critical', health: 'Healthy', hosting: 'On-Premise' },
  { id: 'APP-009', name: 'SAP MII', scope: 'In Scope', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP', technology: 'SAP', criticality: 'High', health: 'Healthy', hosting: 'On-Premise' },
  { id: 'APP-010', name: 'SAP SuccessFactors', scope: 'In Scope', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP', technology: 'Cloud', modules: 'HXM, Recruiting, Performance, Comp.', criticality: 'Critical', health: 'Healthy', hosting: 'Cloud' },
  { id: 'APP-011', name: 'SAP Ariba Sourcing', scope: 'In Scope', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP', technology: 'Cloud', criticality: 'High', health: 'Healthy', hosting: 'Cloud' },
  { id: 'APP-012', name: 'SAP Qualtrics Employee Engagement', scope: 'In Scope', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP', technology: 'Cloud', criticality: 'Medium', health: 'Healthy', hosting: 'Cloud' },
  { id: 'APP-013', name: 'SAP Analytics Cloud with Digital Boardroom', scope: 'In Scope', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation', vendor: 'SAP', technology: 'Cloud', criticality: 'High', health: 'Healthy', hosting: 'Cloud' },
  { id: 'APP-014', name: 'SAP xECM by Opentext', scope: 'In Scope', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP / Opentext', technology: 'SAP', criticality: 'Medium', health: 'Healthy', hosting: 'On-Premise' },
  { id: 'APP-015', name: 'SAP BTP - Portal Applications', scope: 'In Scope', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP', technology: 'Cloud', criticality: 'High', health: 'Healthy', hosting: 'Cloud' },
  { id: 'APP-016', name: 'SAP Cloud Platform Integration/Integration Suite', scope: 'In Scope', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration', vendor: 'SAP', technology: 'Cloud', criticality: 'Critical', health: 'Healthy', hosting: 'Cloud' },
  { id: 'APP-017', name: 'eVendor Portal', scope: 'In Scope', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration', vendor: 'Custom', technology: 'Web', criticality: 'Medium', health: 'Healthy', hosting: 'On-Premise' },
  { id: 'APP-018', name: 'Security Clearance Portal', scope: 'In Scope', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration', vendor: 'Custom', technology: 'Web', criticality: 'High', health: 'Healthy', hosting: 'On-Premise' },
  { id: 'APP-019', name: 'X-Range Portal', scope: 'In Scope', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration', vendor: 'Custom', technology: 'Web', criticality: 'Medium', health: 'Healthy', hosting: 'On-Premise' },
  { id: 'APP-020', name: 'Product Management Portal', scope: 'In Scope', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration', vendor: 'Custom', technology: 'Web', criticality: 'Medium', health: 'Healthy', hosting: 'On-Premise' },
  { id: 'APP-021', name: 'Microsoft Dynamics 365 Field Service Enterprise', scope: 'In Scope', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services', vendor: 'Microsoft', technology: 'Cloud', criticality: 'High', health: 'Healthy', hosting: 'Cloud' },
  { id: 'APP-022', name: 'Microsoft Dynamics Marketing Tenant', scope: 'In Scope', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services', vendor: 'Microsoft', technology: 'Cloud', criticality: 'Medium', health: 'Healthy', hosting: 'Cloud' },
  { id: 'APP-023', name: 'Microsoft Dynamics Sales Enterprise', scope: 'In Scope', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services', vendor: 'Microsoft', technology: 'Cloud', criticality: 'High', health: 'Healthy', hosting: 'Cloud' },
  { id: 'APP-024', name: 'Microsoft Project Server', scope: 'In Scope', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services', vendor: 'Microsoft', technology: 'Cloud', criticality: 'Medium', health: 'Healthy', hosting: 'Cloud' },
  { id: 'APP-025', name: 'Microsoft Power BI', scope: 'In Scope', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation', vendor: 'Microsoft', technology: 'Cloud', modules: 'for projects/CRM', criticality: 'Medium', health: 'Healthy', hosting: 'Cloud' },
  { id: 'APP-026', name: 'PMXSoft - Document Management', scope: 'In Scope', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration', vendor: 'PMXSoft', technology: 'Web', criticality: 'Medium', health: 'Healthy', hosting: 'On-Premise' },

  // Potential Extension — flagged distinctly
  { id: 'APP-027', name: 'SAP Signavio', scope: 'Potential Extension', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP', technology: 'Cloud', criticality: 'Medium', health: 'Evaluation', hosting: 'Cloud' },
  { id: 'APP-028', name: 'SAP LeanIX', scope: 'Potential Extension', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing', vendor: 'SAP', technology: 'Cloud', criticality: 'Medium', health: 'Evaluation', hosting: 'Cloud' },
  { id: 'APP-029', name: 'Joule Platform', scope: 'Potential Extension', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP', technology: 'Cloud', criticality: 'Medium', health: 'Evaluation', hosting: 'Cloud' },
  { id: 'APP-030', name: 'SAP IAS', scope: 'Potential Extension', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', vendor: 'SAP', technology: 'Cloud', criticality: 'Medium', health: 'Evaluation', hosting: 'Cloud' },
  { id: 'APP-031', name: 'Automation Anywhere', scope: 'Potential Extension', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation', vendor: 'Automation Anywhere', technology: 'Cloud', criticality: 'Medium', health: 'Evaluation', hosting: 'Cloud' },
  { id: 'APP-032', name: 'Outsystems', scope: 'Potential Extension', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration', vendor: 'Outsystems', technology: 'Cloud', criticality: 'Medium', health: 'Evaluation', hosting: 'Cloud' },
];

// ═══════════════════════════════════════════════════
// TRACK MASTER — SOURCE-CONFIRMED (Section 69)
// ═══════════════════════════════════════════════════
export const TRACKS = [
  { key: 'AMS-ON-RUN', location: 'Onsite', allocation: 'Dedicated', stream: 'AMS', code: 'AMS-ON-RUN' },
  { key: 'AMS-OF-RUN', location: 'Offshore', allocation: 'Dedicated', stream: 'AMS', code: 'AMS-OF-RUN' },
  { key: 'AMS-OF-Flex', location: 'Offshore', allocation: 'Shared', stream: 'AMS', code: 'AMS-OF-Flex' },
  { key: 'ENH-OF-RUN', location: 'Offshore', allocation: 'Dedicated', stream: 'Enhancement', code: 'ENH-OF-RUN' },
];

// ═══════════════════════════════════════════════════
// PROCESS GROUPS — mapped to Service Domains
// ═══════════════════════════════════════════════════
export const PROCESS_GROUPS = [
  { key: 'sales', label: 'Sales & Distribution', serviceDomainId: 'TWR-06' },
  { key: 'billing', label: 'Billing & Invoicing', serviceDomainId: 'TWR-06' },
  { key: 'production', label: 'Production Planning', serviceDomainId: 'TWR-06' },
  { key: 'quality', label: 'Quality Management', serviceDomainId: 'TWR-05' },
  { key: 'procurement', label: 'Procurement', serviceDomainId: 'TWR-06' },
  { key: 'invoiceProc', label: 'Invoice Processing', serviceDomainId: 'TWR-06' },
  { key: 'demandPlanning', label: 'Demand Planning', serviceDomainId: 'TWR-06' },
  { key: 'warehouse', label: 'Warehouse Management', serviceDomainId: 'TWR-06' },
  { key: 'sourcing', label: 'Strategic Sourcing', serviceDomainId: 'TWR-06' },
  { key: 'vendorMgmt', label: 'Vendor Management', serviceDomainId: 'TWR-07' },
  { key: 'assetMgmt', label: 'Asset Management', serviceDomainId: 'TWR-06' },
  { key: 'maintenance', label: 'Plant Maintenance', serviceDomainId: 'TWR-02' },
  { key: 'financials', label: 'Financial Accounting', serviceDomainId: 'TWR-06' },
  { key: 'controlling', label: 'Management Accounting', serviceDomainId: 'TWR-06' },
  { key: 'consolidation', label: 'Group Consolidation', serviceDomainId: 'TWR-06' },
  { key: 'payroll', label: 'Payroll & Benefits', serviceDomainId: 'TWR-06' },
  { key: 'talent', label: 'Talent Management', serviceDomainId: 'TWR-06' },
  { key: 'recruiting', label: 'Recruiting', serviceDomainId: 'TWR-06' },
];

// ═══════════════════════════════════════════════════
// TECHNOLOGY MASTER — DEMO
// ═══════════════════════════════════════════════════
export const TECHNOLOGIES = [
  { id: 'TECH-001', name: 'SAP S/4HANA', platform: 'SAP', version: '2025', vendor: 'SAP', appCount: 8, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-002', name: 'SAP BTP', platform: 'SAP Cloud', version: 'Latest', vendor: 'SAP', appCount: 3, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-003', name: 'SAP SuccessFactors', platform: 'SAP Cloud', version: 'Latest', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-004', name: 'SAP Ariba', platform: 'SAP Cloud', version: 'Latest', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-005', name: 'SAP Analytics Cloud', platform: 'SAP Cloud', version: 'Latest', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-006', name: 'SAP BW/4HANA', platform: 'SAP', version: '2.0', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-007', name: 'SAP Process Orchestration', platform: 'SAP', version: '7.5', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Mature' },
  { id: 'TECH-008', name: 'SAP MES/MII', platform: 'SAP', version: '15.4', vendor: 'SAP', appCount: 2, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-009', name: 'Microsoft Dynamics 365', platform: 'Microsoft Cloud', version: 'Latest', vendor: 'Microsoft', appCount: 3, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-010', name: 'Microsoft Power BI', platform: 'Microsoft Cloud', version: 'Latest', vendor: 'Microsoft', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-011', name: 'Microsoft Project Server', platform: 'Microsoft Cloud', version: '2021', vendor: 'Microsoft', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-012', name: 'SAP Cloud Integration Suite', platform: 'SAP Cloud', version: 'Latest', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-013', name: 'SAP GRC/AC', platform: 'SAP', version: '12.0', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-014', name: 'ABAP Stack', platform: 'SAP', version: '7.57', vendor: 'SAP', appCount: 8, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-015', name: 'SAP Fiori / UI5', platform: 'SAP', version: '1.120', vendor: 'SAP', appCount: 5, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-016', name: 'Opentext xECM', platform: 'Opentext', version: '23.4', vendor: 'Opentext', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-017', name: 'SAP GTS', platform: 'SAP', version: '2025', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-018', name: 'HANA Database', platform: 'SAP', version: '2.0 SPS07', vendor: 'SAP', appCount: 10, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-019', name: 'SAP Qualtrics', platform: 'SAP Cloud', version: 'Latest', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-020', name: 'PMXSoft DMS', platform: 'Custom', version: '5.2', vendor: 'PMXSoft', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
];

// ═══════════════════════════════════════════════════
// VENDOR MASTER — DEMO
// ═══════════════════════════════════════════════════
export const VENDORS = [
  { id: 'VND-001', name: 'SAP SE', type: 'OEM', appCount: 19, contact: 'SAP Support', status: 'Active' },
  { id: 'VND-002', name: 'Microsoft', type: 'OEM', appCount: 5, contact: 'Microsoft Support', status: 'Active' },
  { id: 'VND-003', name: 'Opentext', type: 'OEM', appCount: 1, contact: 'Opentext Support', status: 'Active' },
  { id: 'VND-004', name: 'PMXSoft', type: 'ISV', appCount: 1, contact: 'PMXSoft Support', status: 'Active' },
  { id: 'VND-005', name: 'Automation Anywhere', type: 'OEM', appCount: 1, contact: 'AA Support', status: 'Active' },
  { id: 'VND-006', name: 'Outsystems', type: 'OEM', appCount: 1, contact: 'Outsystems Support', status: 'Active' },
];

// ═══════════════════════════════════════════════════
// SERVICE DOMAINS & TOWERS — 7 Core RFP Service Domains
// ═══════════════════════════════════════════════════
export { SERVICE_DOMAINS, TOWERS, getServiceDomainById, getServiceDomainByName, getServiceDomainList } from './serviceDomains.js';
import { SERVICE_DOMAINS } from './serviceDomains.js';

// ═══════════════════════════════════════════════════
// ROLE MASTER — Structured Role Catalogue Across 7 Domains (Section 6 & 9)
// Levels: L1 | L2 | L3
// roleType: Common | Specialist
// ═══════════════════════════════════════════════════
export const ROLES = [
  // ── 1. IT Helpdesk & End User Services (TWR-01) ──
  {
    roleId: 'ROLE-001', role: 'Service Desk Analyst', roleName: 'Service Desk Analyst', roleCode: 'SD-L1',
    tower: 'TWR-01', serviceDomainId: 'TWR-01', serviceDomain: 'IT Helpdesk & End User Services',
    level: 'L1', roleType: 'Common',
    skills: ['Incident Triage', 'Service Request Logging', 'First-Call Resolution', 'Windows 11/10', 'Office 365 Support'],
    certifications: ['ITIL v4 Foundation', 'Microsoft Certified: Modern Desktop'],
    description: 'First point of contact for enterprise users handling tickets, initial triage, and standard request fulfillment.'
  },
  {
    roleId: 'ROLE-002', role: 'Senior Service Desk Analyst', roleName: 'Senior Service Desk Analyst', roleCode: 'SD-L2',
    tower: 'TWR-01', serviceDomainId: 'TWR-01', serviceDomain: 'IT Helpdesk & End User Services',
    level: 'L2', roleType: 'Common',
    skills: ['Advanced Troubleshooting', 'VIP Executive Support', 'Knowledge Management', 'SLA Escalation', 'Call Quality Coaching'],
    certifications: ['ITIL v4 Specialist', 'CompTIA A+'],
    description: 'Senior ticket handler handling complex escalation, VIP support, and knowledgebase authoring.'
  },
  {
    roleId: 'ROLE-003', role: 'Desktop Support Engineer', roleName: 'Desktop Support Engineer', roleCode: 'DS-ENG',
    tower: 'TWR-01', serviceDomainId: 'TWR-01', serviceDomain: 'IT Helpdesk & End User Services',
    level: 'L2', roleType: 'Common',
    skills: ['PC Hardware', 'OS Imaging', 'Endpoint Troubleshooting', 'Peripheral Setup', 'Intune Enrollment'],
    certifications: ['Microsoft Certified: Endpoint Administrator', 'CompTIA Network+'],
    description: 'Onsite desk-side engineering specialist ensuring flawless workplace hardware and OS readiness.'
  },
  {
    roleId: 'ROLE-004', role: 'End User Support Engineer', roleName: 'End User Support Engineer', roleCode: 'EUS-ENG',
    tower: 'TWR-01', serviceDomainId: 'TWR-01', serviceDomain: 'IT Helpdesk & End User Services',
    level: 'L2', roleType: 'Common',
    skills: ['Mobile Device Management', 'Hybrid Workplace', 'Virtual Desktop Infrastructure', 'M365 Apps'],
    certifications: ['Microsoft 365 Certified: Fundamentals'],
    description: 'Hybrid workplace mobility and client device maintenance specialist.'
  },
  {
    roleId: 'ROLE-005', role: 'Workplace Support Engineer', roleName: 'Workplace Support Engineer', roleCode: 'WSE-ENG',
    tower: 'TWR-01', serviceDomainId: 'TWR-01', serviceDomain: 'IT Helpdesk & End User Services',
    level: 'L2', roleType: 'Common',
    skills: ['Smart Meeting Rooms', 'Video Conferencing (Teams/Zoom)', 'Digital Signage', 'Printer Fleet'],
    certifications: ['AVIXA CTS', 'Zoom Rooms Administrator'],
    description: 'Collaborative AV infrastructure and smart meeting room support specialist.'
  },
  {
    roleId: 'ROLE-006', role: 'IT Support Specialist', roleName: 'IT Support Specialist', roleCode: 'ITS-SPEC',
    tower: 'TWR-01', serviceDomainId: 'TWR-01', serviceDomain: 'IT Helpdesk & End User Services',
    level: 'L2', roleType: 'Common',
    skills: ['Hardware Asset Management', 'Deployment Automation', 'Software Packaging', 'User Onboarding'],
    certifications: ['ITIL v4 Foundation'],
    description: 'End-to-end hardware provisioning and account provisioning engineer.'
  },
  {
    roleId: 'ROLE-007', role: 'Executive Support Specialist', roleName: 'Executive Support Specialist', roleCode: 'VIP-SPEC',
    tower: 'TWR-01', serviceDomainId: 'TWR-01', serviceDomain: 'IT Helpdesk & End User Services',
    level: 'L3', roleType: 'Specialist',
    skills: ['24/7 VIP Concierge Support', 'Secure Mobile Comms', 'High-Touch Escalation', 'Executive Event Tech'],
    certifications: ['ITIL v4 Managing Professional', 'Certified Information Systems Security Professional'],
    description: 'Dedicated white-glove technical specialist assigned to C-suite leadership.'
  },

  // ── 2. Infrastructure, Cloud, and Platform Services (TWR-02) ──
  {
    roleId: 'ROLE-008', role: 'Network Engineer', roleName: 'Network Engineer', roleCode: 'NET-ENG',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L2', roleType: 'Common',
    skills: ['Routing & Switching', 'VLAN Configuration', 'Cisco IOS', 'Firewall Rules', 'Wi-Fi 6 Operations'],
    certifications: ['CCNA', 'Fortinet NSE 4'],
    description: 'Maintains enterprise local and campus networks, switching fabrics, and edge access.'
  },
  {
    roleId: 'ROLE-009', role: 'Senior Network Engineer', roleName: 'Senior Network Engineer', roleCode: 'SR-NET',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L3', roleType: 'Specialist',
    skills: ['BGP/OSPF', 'SD-WAN Architecture', 'Multi-Site Datacenter Interconnect', 'Network Automation (Python/Ansible)'],
    certifications: ['CCNP Enterprise', 'Aruba Certified Network Professional'],
    description: 'Leads enterprise core routing, high-availability WAN links, and network automation.'
  },
  {
    roleId: 'ROLE-010', role: 'Network Architect', roleName: 'Network Architect', roleCode: 'NET-ARCH',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L3', roleType: 'Specialist',
    skills: ['Zero-Trust Architecture', 'Software Defined Networking', 'Cloud Interconnect', 'Campus Backbone Design'],
    certifications: ['CCIE Enterprise Infrastructure', 'AWS Certified Advanced Networking'],
    description: 'Designs global connectivity, SD-WAN fabrics, and zero-trust perimeter network layouts.'
  },
  {
    roleId: 'ROLE-011', role: 'System Administrator', roleName: 'System Administrator', roleCode: 'SYS-ADMIN',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L2', roleType: 'Common',
    skills: ['Active Directory', 'DNS/DHCP', 'Group Policy Objects', 'Server Patching', 'VMware ESXi'],
    certifications: ['Microsoft Certified: Windows Server Hybrid Core', 'VMware VCP-DCV'],
    description: 'Manages multi-domain directory services, hypervisors, and server lifecycle operations.'
  },
  {
    roleId: 'ROLE-012', role: 'Windows Administrator', roleName: 'Windows Administrator', roleCode: 'WIN-ADMIN',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L2', roleType: 'Common',
    skills: ['Windows Server 2022/2019', 'PowerShell Scripting', 'WSUS', 'Failover Clustering', 'Storage Spaces Direct'],
    certifications: ['Microsoft Certified: Windows Server Associate'],
    description: 'Specializes in Windows clustering, server hardening, and automation scripting.'
  },
  {
    roleId: 'ROLE-013', role: 'Linux Administrator', roleName: 'Linux Administrator', roleCode: 'LNX-ADMIN',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L2', roleType: 'Common',
    skills: ['RHEL / SUSE Linux Enterprise', 'Bash Scripting', 'SSH Key Governance', 'Kernel Tuning', 'NFS/iSCSI'],
    certifications: ['Red Hat Certified System Administrator (RHCSA)', 'Linux Foundation Certified SysAdmin'],
    description: 'Administers mission-critical SAP on Linux hosts, compute clusters, and storage nodes.'
  },
  {
    roleId: 'ROLE-014', role: 'Cloud Engineer', roleName: 'Cloud Engineer', roleCode: 'CLD-ENG',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L2', roleType: 'Specialist',
    skills: ['Azure IaaS/PaaS', 'Terraform', 'Resource Groups & RBAC', 'Cloud Networking', 'Cost Optimization'],
    certifications: ['Microsoft Certified: Azure Administrator Associate', 'AWS Certified SysOps Administrator'],
    description: 'Provisions, monitors, and optimizes cloud workloads and automated infrastructure.'
  },
  {
    roleId: 'ROLE-015', role: 'Azure Administrator', roleName: 'Azure Administrator', roleCode: 'AZ-ADMIN',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L2', roleType: 'Specialist',
    skills: ['Microsoft Entra ID', 'Azure Monitor / Log Analytics', 'Azure Virtual WAN', 'Backup Vaults'],
    certifications: ['Microsoft Certified: Azure Administrator Associate'],
    description: 'Dedicated enterprise Azure tenant governance and resource operations specialist.'
  },
  {
    roleId: 'ROLE-016', role: 'Microsoft 365 Administrator', roleName: 'Microsoft 365 Administrator', roleCode: 'M365-ADMIN',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L2', roleType: 'Common',
    skills: ['Exchange Online', 'SharePoint Online Admin', 'Teams Voice & Compliance', 'M365 Security Center'],
    certifications: ['Microsoft 365 Certified: Enterprise Administrator Expert'],
    description: 'Oversees SaaS productivity tenant, email hygiene, and compliance policies.'
  },
  {
    roleId: 'ROLE-017', role: 'Endpoint Engineer', roleName: 'Endpoint Engineer', roleCode: 'END-ENG',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L2', roleType: 'Common',
    skills: ['Microsoft Intune', 'Autopilot Configuration', 'Defender for Endpoint', 'App Packaging & Ring Deployments'],
    certifications: ['Microsoft Certified: Endpoint Administrator Associate'],
    description: 'Engineers centralized endpoint policies, automated configuration profiles, and compliance.'
  },
  {
    roleId: 'ROLE-018', role: 'Infrastructure Engineer', roleName: 'Infrastructure Engineer', roleCode: 'INF-ENG',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L2', roleType: 'Common',
    skills: ['HCI (Nutanix/vSAN)', 'Rack Server Lifecycle', 'SAN Fabric Zoning', 'UPS & Datacenter Power'],
    certifications: ['Nutanix Certified Professional', 'VMware VCP'],
    description: 'Maintains physical and hyperconverged datacenter hardware in Tier-4 facilities.'
  },
  {
    roleId: 'ROLE-019', role: 'Database Administrator', roleName: 'Database Administrator', roleCode: 'DBA',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L3', roleType: 'Specialist',
    skills: ['Oracle / MS SQL Server', 'Database Clustering & AlwaysOn', 'Performance Tuning', 'Backup & Point-in-Time Recovery'],
    certifications: ['Oracle Certified Professional', 'Microsoft Certified: Azure Database Administrator Associate'],
    description: 'Enterprise relational and non-relational database architect and performance tuner.'
  },
  {
    roleId: 'ROLE-020', role: 'Backup Administrator', roleName: 'Backup Administrator', roleCode: 'BKP-ADMIN',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L2', roleType: 'Common',
    skills: ['Veeam Backup & Replication', 'Commvault', 'Immutable Storage', 'Air-Gapped Backups', 'DR Testing'],
    certifications: ['Veeam Certified Engineer (VMCE)'],
    description: 'Ensures strict RPO/RTO adherence, ransomware-proof snapshotting, and disaster recovery.'
  },
  {
    roleId: 'ROLE-021', role: 'Storage Administrator', roleName: 'Storage Administrator', roleCode: 'STR-ADMIN',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L2', roleType: 'Specialist',
    skills: ['SAN/NAS Fabrics (Dell EMC/Pure Storage)', 'NVMe over Fabrics', 'Thin Provisioning', 'Storage Tiering'],
    certifications: ['Pure Storage Certified Associate', 'Dell EMC Information Storage and Management'],
    description: 'Manages petabyte-scale high-throughput enterprise flash arrays and replication.'
  },
  {
    roleId: 'ROLE-022', role: 'DevOps Engineer', roleName: 'DevOps Engineer', roleCode: 'DEVOPS',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L2', roleType: 'Specialist',
    skills: ['CI/CD Pipelines (Azure DevOps/GitHub)', 'Docker & Kubernetes', 'Infrastructure as Code (Terraform)', 'Monitoring (Prometheus/Grafana)'],
    certifications: ['Certified Kubernetes Administrator (CKA)', 'Azure DevOps Engineer Expert'],
    description: 'Automates deployment pipelines, container orchestration, and telemetry instrumentation.'
  },
  {
    roleId: 'ROLE-023', role: 'Platform Engineer', roleName: 'Platform Engineer', roleCode: 'PLT-ENG',
    tower: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    level: 'L3', roleType: 'Specialist',
    skills: ['Internal Developer Platforms', 'Helm / GitOps', 'Service Mesh', 'Scalability Engineering'],
    certifications: ['Certified Kubernetes Security Specialist (CKS)', 'AWS Solutions Architect Associate'],
    description: 'Builds self-service developer infrastructure and platform reliability frameworks.'
  },

  // ── 3. Applications, Digital, and Integration (TWR-03) ──
  {
    roleId: 'ROLE-024', role: 'Application Support Analyst', roleName: 'Application Support Analyst', roleCode: 'APP-SUP',
    tower: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    level: 'L1', roleType: 'Common',
    skills: ['Application Incident Triage', 'Log Analysis', 'SQL Querying', 'User Account Setup in Portals'],
    certifications: ['ITIL v4 Foundation'],
    description: 'Provides frontline application telemetry monitoring and functional query resolution.'
  },
  {
    roleId: 'ROLE-025', role: 'Application Developer', roleName: 'Application Developer', roleCode: 'APP-DEV',
    tower: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    level: 'L2', roleType: 'Common',
    skills: ['Full Software Lifecycle', 'Clean Architecture', 'Unit Testing', 'Secure Coding (OWASP Top 10)'],
    certifications: ['Oracle Certified Professional: Java SE Developer'],
    description: 'Builds and maintains enterprise business logic and internal workflow software.'
  },
  {
    roleId: 'ROLE-026', role: 'Full Stack Developer', roleName: 'Full Stack Developer', roleCode: 'FS-DEV',
    tower: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    level: 'L2', roleType: 'Common',
    skills: ['React', 'Node.js', 'PostgreSQL', 'RESTful APIs', 'Tailwind CSS / Vanilla CSS', 'TypeScript'],
    certifications: ['Meta Certified Front-End Developer', 'AWS Certified Developer Associate'],
    description: 'Engineers responsive frontends and resilient backend microservices for enterprise portals.'
  },
  {
    roleId: 'ROLE-027', role: 'Java Developer', roleName: 'Java Developer', roleCode: 'JAVA-DEV',
    tower: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    level: 'L2', roleType: 'Common',
    skills: ['Java 17/21', 'Spring Boot', 'Hibernate', 'Microservices', 'Kafka Messaging'],
    certifications: ['Oracle Certified Professional: Java Developer'],
    description: 'Develops high-concurrency backend services, messaging processors, and data interfaces.'
  },
  {
    roleId: 'ROLE-028', role: '.NET Developer', roleName: '.NET Developer', roleCode: 'DOTNET-DEV',
    tower: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    level: 'L2', roleType: 'Common',
    skills: ['C# / .NET Core 8', 'ASP.NET Web API', 'Entity Framework Core', 'Azure App Services'],
    certifications: ['Microsoft Certified: Azure Developer Associate'],
    description: 'Specializes in enterprise Microsoft stack applications, secure APIs, and background daemons.'
  },
  {
    roleId: 'ROLE-029', role: 'React Developer', roleName: 'React Developer', roleCode: 'REACT-DEV',
    tower: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    level: 'L2', roleType: 'Common',
    skills: ['React 18/19', 'State Management', 'Vite / Webpack', 'Responsive Web', 'WCAG Accessibility'],
    certifications: ['Certified Web Accessibility Specialist (WAS)'],
    description: 'Crafts performant, accessible, and RTL-compliant enterprise user interfaces.'
  },
  {
    roleId: 'ROLE-030', role: 'Integration Engineer', roleName: 'Integration Engineer', roleCode: 'INT-ENG',
    tower: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    level: 'L2', roleType: 'Specialist',
    skills: ['API Gateways', 'MuleSoft / Azure Integration Services', 'EDI / XML / JSON', 'Message Queuing'],
    certifications: ['MuleSoft Certified Developer', 'Azure Integration Developer'],
    description: 'Builds seamless hybrid integrations between on-premises and cloud SaaS ecosystems.'
  },
  {
    roleId: 'ROLE-031', role: 'API Developer', roleName: 'API Developer', roleCode: 'API-DEV',
    tower: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    level: 'L2', roleType: 'Specialist',
    skills: ['OpenAPI 3.0', 'GraphQL', 'OAuth2 / mTLS', 'Rate Limiting & Throttling', 'Postman Automated Testing'],
    certifications: ['Kong Certified API Specialist'],
    description: 'Designs governed, authenticated, and high-throughput enterprise API endpoints.'
  },
  {
    roleId: 'ROLE-032', role: 'Mobile Application Developer', roleName: 'Mobile Application Developer', roleCode: 'MOB-DEV',
    tower: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    level: 'L2', roleType: 'Specialist',
    skills: ['Flutter / React Native', 'iOS Swift / Android Kotlin', 'Mobile Security (OWASP MASVS)', 'Push Notifications'],
    certifications: ['Google Associate Android Developer'],
    description: 'Develops cross-platform native enterprise apps for mobile field forces and executive tablets.'
  },
  {
    roleId: 'ROLE-033', role: 'ServiceNow Developer', roleName: 'ServiceNow Developer', roleCode: 'SN-DEV',
    tower: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    level: 'L2', roleType: 'Specialist',
    skills: ['ServiceNow Workflows', 'Business Rules & Client Scripts', 'Service Portal Design', 'Flow Designer', 'REST Integrations'],
    certifications: ['ServiceNow Certified Application Developer (CAD)'],
    description: 'Customizes ServiceNow workflows, custom scopes, service catalog items, and automation.'
  },
  {
    roleId: 'ROLE-034', role: 'ServiceNow Administrator', roleName: 'ServiceNow Administrator', roleCode: 'SN-ADMIN',
    tower: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    level: 'L2', roleType: 'Specialist',
    skills: ['ITSM / ITOM / ITAM Setup', 'Instance Upgrades', 'Access Control Lists (ACLs)', 'CMDB Health & Discovery'],
    certifications: ['ServiceNow Certified System Administrator (CSA)'],
    description: 'Manages enterprise ServiceNow instance health, plugins, roles, and automated discovery.'
  },
  {
    roleId: 'ROLE-035', role: 'Digital Experience Specialist', roleName: 'Digital Experience Specialist', roleCode: 'DX-SPEC',
    tower: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    level: 'L2', roleType: 'Common',
    skills: ['Design Systems', 'Figma Prototyping', 'User Journey Mapping', 'Usability Audits', 'A/B Experimentation'],
    certifications: ['Nielsen Norman UX Master Certified'],
    description: 'Optimizes corporate employee portals, customer touchpoints, and digital ergonomics.'
  },

  // ── 4. Data, Analytics, AI, and Automation (TWR-04) ──
  {
    roleId: 'ROLE-036', role: 'Data Analyst', roleName: 'Data Analyst', roleCode: 'DATA-ANL',
    tower: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    level: 'L1', roleType: 'Common',
    skills: ['SQL Analytics', 'Excel Advanced Modeling', 'Descriptive Statistics', 'Data Cleansing', 'Dashboard Mockups'],
    certifications: ['Microsoft Certified: Power BI Data Analyst Associate'],
    description: 'Extracts data insights, analyzes operational anomalies, and builds executive KPI models.'
  },
  {
    roleId: 'ROLE-037', role: 'Data Engineer', roleName: 'Data Engineer', roleCode: 'DATA-ENG',
    tower: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    level: 'L2', roleType: 'Specialist',
    skills: ['PySpark', 'dbt', 'Data Lakehouse (Delta Lake/Parquet)', 'Airflow Orchestration', 'Snowflake / BigQuery'],
    certifications: ['Databricks Certified Data Engineer Associate', 'Azure Data Engineer Associate'],
    description: 'Constructs reliable, real-time and batch data pipelines from transactional engines to analytics.'
  },
  {
    roleId: 'ROLE-038', role: 'BI Developer', roleName: 'BI Developer', roleCode: 'BI-DEV',
    tower: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    level: 'L2', roleType: 'Common',
    skills: ['Data Warehousing (Kimball Star Schema)', 'SSIS / ETL Tools', 'SQL Server Analysis Services (SSAS)', 'Report Authoring'],
    certifications: ['Microsoft Certified: Data Analyst Associate'],
    description: 'Designs multidimensional semantic models and scheduled executive reporting deliverables.'
  },
  {
    roleId: 'ROLE-039', role: 'Power BI Developer', roleName: 'Power BI Developer', roleCode: 'PBI-DEV',
    tower: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    level: 'L2', roleType: 'Common',
    skills: ['DAX Optimization', 'Power Query (M)', 'Power BI Service Administration', 'Row-Level Security (RLS)', 'Paginated Reports'],
    certifications: ['Microsoft Certified: Power BI Data Analyst Associate (PL-300)'],
    description: 'Builds interactive, high-impact analytical dashboards, scorecards, and row-secure portals.'
  },
  {
    roleId: 'ROLE-040', role: 'Data Architect', roleName: 'Data Architect', roleCode: 'DATA-ARCH',
    tower: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    level: 'L3', roleType: 'Specialist',
    skills: ['Enterprise Data Models', 'Data Mesh Principles', 'Master Data Management (MDM)', 'Metadata Governance'],
    certifications: ['CDMP (Certified Data Management Professional)', 'Azure Solutions Architect Expert'],
    description: 'Defines corporate data topology, storage paradigms, lineage, and master data standards.'
  },
  {
    roleId: 'ROLE-041', role: 'Data Governance Specialist', roleName: 'Data Governance Specialist', roleCode: 'DG-SPEC',
    tower: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    level: 'L2', roleType: 'Specialist',
    skills: ['Data Cataloging (Purview/Collibra)', 'Data Privacy (PDPL / GDPR)', 'Quality KPIs', 'Stewardship Workflows'],
    certifications: ['CIPP/E Data Privacy', 'DAMA Certified Data Professional'],
    description: 'Enforces data quality rules, dictionary standardization, and Saudi PDPL compliance.'
  },
  {
    roleId: 'ROLE-042', role: 'AI Engineer', roleName: 'AI Engineer', roleCode: 'AI-ENG',
    tower: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    level: 'L2', roleType: 'Specialist',
    skills: ['Python', 'OpenAI / Azure Cognitive Services', 'Vector Databases (Pinecone/Milvus)', 'RAG Pipelines', 'LangChain'],
    certifications: ['Microsoft Certified: Azure AI Engineer Associate'],
    description: 'Deploys enterprise generative AI solutions, semantic search, and document intelligence agents.'
  },
  {
    roleId: 'ROLE-043', role: 'ML Engineer', roleName: 'ML Engineer', roleCode: 'ML-ENG',
    tower: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    level: 'L3', roleType: 'Specialist',
    skills: ['Scikit-Learn / PyTorch', 'MLflow / MLOps', 'Feature Store', 'Model Drift Monitoring', 'Predictive Maintenance Models'],
    certifications: ['AWS Certified Machine Learning - Specialty', 'Google Professional ML Engineer'],
    description: 'Trains, containerizes, and monitors predictive algorithms for asset uptime and ticket reduction.'
  },
  {
    roleId: 'ROLE-044', role: 'Automation Engineer', roleName: 'Automation Engineer', roleCode: 'AUTO-ENG',
    tower: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    level: 'L2', roleType: 'Specialist',
    skills: ['Power Automate', 'Python Scripting', 'API Orchestration', 'Business Process Automation', 'Task Mining'],
    certifications: ['Microsoft Certified: Power Automate RPA Developer Associate'],
    description: 'Eliminates repetitive manual workflows across HR, finance, and procurement systems.'
  },
  {
    roleId: 'ROLE-045', role: 'RPA Developer', roleName: 'RPA Developer', roleCode: 'RPA-DEV',
    tower: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    level: 'L2', roleType: 'Specialist',
    skills: ['UiPath / Automation Anywhere', 'Attended & Unattended Bots', 'OCR Extraction', 'Exception Handling Workflows'],
    certifications: ['UiPath Certified Advanced RPA Developer', 'Automation Anywhere Certified Master'],
    description: 'Designs, codes, and supports software robots handling cross-application data transfers.'
  },
  {
    roleId: 'ROLE-046', role: 'AI Solution Architect', roleName: 'AI Solution Architect', roleCode: 'AI-ARCH',
    tower: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    level: 'L3', roleType: 'Specialist',
    skills: ['Enterprise AI Architecture', 'Responsible AI & Bias Auditing', 'GPU Compute Optimization', 'LLM Governance'],
    certifications: ['Microsoft Certified: Azure AI Architect', 'TOGAF 9.2 Certified'],
    description: 'Establishes enterprise AI governance guardrails, infrastructure blueprints, and business case models.'
  },

  // ── 5. Architecture, Quality, and Testing (TWR-05) ──
  {
    roleId: 'ROLE-047', role: 'Enterprise Architect', roleName: 'Enterprise Architect', roleCode: 'ENT-ARCH',
    tower: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    level: 'L3', roleType: 'Specialist',
    skills: ['TOGAF Architecture Development Method (ADM)', 'Capability Roadmapping', 'Application Rationalization', 'Technology Governance'],
    certifications: ['TOGAF 9.2 Master / Enterprise Architecture Specialist'],
    description: 'Directs overall IT technology roadmaps, target architectures, and capability alignment.'
  },
  {
    roleId: 'ROLE-048', role: 'Solution Architect', roleName: 'Solution Architect', roleCode: 'SOL-ARCH',
    tower: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    level: 'L3', roleType: 'Specialist',
    skills: ['Cross-Tower Solutioning', 'High-Level Architecture (HLA)', 'Security & Compliance Alignment', 'Vendor Tech Evaluation'],
    certifications: ['AWS Certified Solutions Architect - Professional', 'Azure Solutions Architect Expert'],
    description: 'Translates complex business requirements into scalable, secure, and viable technical designs.'
  },
  {
    roleId: 'ROLE-049', role: 'Application Architect', roleName: 'Application Architect', roleCode: 'APP-ARCH',
    tower: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    level: 'L3', roleType: 'Specialist',
    skills: ['Domain-Driven Design (DDD)', 'Microservices Patterns', 'Code Quality Standards', 'Technical Debt Elimination'],
    certifications: ['Certified Software Architecture Professional'],
    description: 'Sets software architecture frameworks, patterns, and refactoring guidelines across squads.'
  },
  {
    roleId: 'ROLE-050', role: 'Cloud Architect', roleName: 'Cloud Architect', roleCode: 'CLD-ARCH',
    tower: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    level: 'L3', roleType: 'Specialist',
    skills: ['Well-Architected Framework', 'Cloud FinOps', 'Multi-Cloud Strategy', 'High Availability & Geo-Redundancy'],
    certifications: ['Microsoft Certified: Azure Solutions Architect Expert', 'FinOps Certified Practitioner'],
    description: 'Blueprints resilient multi-region cloud infrastructures and cost-effective cloud landing zones.'
  },
  {
    roleId: 'ROLE-051', role: 'Integration Architect', roleName: 'Integration Architect', roleCode: 'INT-ARCH',
    tower: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    level: 'L3', roleType: 'Specialist',
    skills: ['Enterprise Service Bus (ESB)', 'Event-Driven Architecture (EDA)', 'API Governance', 'B2B/EDI Gateway Standards'],
    certifications: ['MuleSoft Certified Platform Architect'],
    description: 'Governs enterprise-wide integration topologies, API contracts, and message protocols.'
  },
  {
    roleId: 'ROLE-052', role: 'Security Architect', roleName: 'Security Architect', roleCode: 'SEC-ARCH',
    tower: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    level: 'L3', roleType: 'Specialist',
    skills: ['NCA ECC Compliance', 'ISO 27001 Controls', 'Zero-Trust Architecture', 'Threat Modeling (STRIDE)', 'Cryptography'],
    certifications: ['CISSP (Certified Information Systems Security Professional)', 'SABSA Chartered Security Architect'],
    description: 'Designs end-to-end cybersecurity safeguards, identity boundaries, and regulatory compliance postures.'
  },
  {
    roleId: 'ROLE-053', role: 'QA Engineer', roleName: 'QA Engineer', roleCode: 'QA-ENG',
    tower: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    level: 'L2', roleType: 'Common',
    skills: ['Test Case Design', 'Regression Testing', 'Bug Tracking (Jira/Azure Test Plans)', 'API Verification'],
    certifications: ['ISTQB Certified Tester Foundation Level (CTFL)'],
    description: 'Executes structured functional testing, cross-browser validation, and quality sign-offs.'
  },
  {
    roleId: 'ROLE-054', role: 'Test Analyst', roleName: 'Test Analyst', roleCode: 'TEST-ANL',
    tower: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    level: 'L1', roleType: 'Common',
    skills: ['Test Execution', 'Defect Reproduction', 'Requirements Traceability Matrix (RTM)', 'User Story Analysis'],
    certifications: ['ISTQB Foundation'],
    description: 'Conducts day-to-day manual test runs, records execution evidence, and drafts defect logs.'
  },
  {
    roleId: 'ROLE-055', role: 'Automation Test Engineer', roleName: 'Automation Test Engineer', roleCode: 'AUTO-TEST',
    tower: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    level: 'L2', roleType: 'Specialist',
    skills: ['Playwright / Selenium', 'Cypress', 'CI/CD Pipeline Integration', 'Page Object Model', 'API Test Automation'],
    certifications: ['ISTQB Advanced Test Automation Engineer'],
    description: 'Authors automated regression test suites embedded into continuous integration pipelines.'
  },
  {
    roleId: 'ROLE-056', role: 'Performance Test Engineer', roleName: 'Performance Test Engineer', roleCode: 'PERF-TEST',
    tower: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    level: 'L2', roleType: 'Specialist',
    skills: ['JMeter', 'LoadRunner', 'Stress & Spike Testing', 'Server Bottleneck Analysis', 'APM Profiling'],
    certifications: ['LoadRunner Certified Professional'],
    description: 'Stress-tests enterprise systems under peak volumetric load and pinpoints resource bottlenecks.'
  },
  {
    roleId: 'ROLE-057', role: 'UAT Analyst', roleName: 'UAT Analyst', roleCode: 'UAT-ANL',
    tower: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    level: 'L1', roleType: 'Common',
    skills: ['Business User Enablement', 'UAT Script Authoring', 'Acceptance Criteria Validation', 'Release Readiness'],
    certifications: ['ISTQB Agile Tester'],
    description: 'Facilitates business superuser user acceptance testing and ensures operational sign-off.'
  },

  // ── 6. SAP ERP and SuccessFactors (TWR-06) ──
  {
    roleId: 'ROLE-058', role: 'SAP SD Functional Consultant', roleName: 'SAP SD Functional Consultant', roleCode: 'FC-SD',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L2', roleType: 'Common',
    skills: ['Sales Orders', 'Pricing Procedures', 'Billing & Invoicing', 'Credit Management', 'S/4HANA Sales'],
    certifications: ['SAP Certified Application Associate - SAP S/4HANA Sales'],
    description: 'Configures and supports end-to-end sales and order-to-cash processes in SAP S/4HANA.'
  },
  {
    roleId: 'ROLE-059', role: 'SAP FICO Functional Consultant', roleName: 'SAP FICO Functional Consultant', roleCode: 'FC-FICO',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L2', roleType: 'Common',
    skills: ['General Ledger (GL)', 'Accounts Payable/Receivable (AP/AR)', 'Asset Accounting (AA)', 'Cost Center Accounting', 'Financial Closing'],
    certifications: ['SAP Certified Application Associate - SAP S/4HANA Finance'],
    description: 'Oversees financial accounting, treasury, and controlling configurations in SAP S/4HANA.'
  },
  {
    roleId: 'ROLE-060', role: 'SAP MM Functional Consultant', roleName: 'SAP MM Functional Consultant', roleCode: 'FC-MM',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L2', roleType: 'Common',
    skills: ['Purchasing', 'Inventory Management', 'Valuation & Account Determination', 'MRP', 'Vendor Evaluation'],
    certifications: ['SAP Certified Application Associate - Sourcing & Procurement'],
    description: 'Manages materials management, procurement, purchase requisition workflows, and goods movement.'
  },
  {
    roleId: 'ROLE-061', role: 'SAP PP/QM Functional Consultant', roleName: 'SAP PP/QM Functional Consultant', roleCode: 'FC-PP',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L2', roleType: 'Common',
    skills: ['Bill of Materials (BOM)', 'Routings & Work Centers', 'Shop Floor Control', 'Inspection Lots', 'Quality Certificates'],
    certifications: ['SAP Certified Application Associate - S/4HANA Manufacturing'],
    description: 'Implements production planning, manufacturing operations, and quality assurance workflows.'
  },
  {
    roleId: 'ROLE-062', role: 'SAP EWM/TM Functional Consultant', roleName: 'SAP EWM/TM Functional Consultant', roleCode: 'FC-EWM',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L2', roleType: 'Specialist',
    skills: ['Wave Management', 'Slotting & Rearrangement', 'RF Integration', 'Freight Orders', 'Carrier Selection'],
    certifications: ['SAP Certified Application Associate - Extended Warehouse Management'],
    description: 'Directs extended warehouse automation and multi-modal logistics transport.'
  },
  {
    roleId: 'ROLE-063', role: 'SAP Ariba Consultant', roleName: 'SAP Ariba Consultant', roleCode: 'FC-Ariba',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L2', roleType: 'Specialist',
    skills: ['Ariba Sourcing', 'Contracts Management', 'Guided Buying', 'Supplier Lifecycle & Performance (SLP)', 'Cloud Integration Gateway (CIG)'],
    certifications: ['SAP Certified Application Associate - SAP Ariba Sourcing'],
    description: 'Configures cloud strategic procurement, supplier onboarding, and digital RFP management.'
  },
  {
    roleId: 'ROLE-064', role: 'SuccessFactors Consultant', roleName: 'SuccessFactors Consultant', roleCode: 'FC-SF',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L2', roleType: 'Specialist',
    skills: ['Employee Central (EC)', 'Performance & Goals', 'Succession & Development', 'MDF / Rules Engine', 'Role-Based Permissions (RBP)'],
    certifications: ['SAP Certified Application Associate - SAP SuccessFactors Employee Central'],
    description: 'Drives core HR data models, employee master management, and talent lifecycles in SuccessFactors.'
  },
  {
    roleId: 'ROLE-065', role: 'SAP PM/EAM Consultant', roleName: 'SAP PM/EAM Consultant', roleCode: 'FC-PM',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L2', roleType: 'Specialist',
    skills: ['Equipment & Functional Locations', 'Maintenance Notifications & Orders', 'Preventive Maintenance Schedules', 'Asset Disposals'],
    certifications: ['SAP Certified Application Associate - Enterprise Asset Management'],
    description: 'Configures Acquire-to-Dispose (A2D) industrial plant maintenance and field service schedules.'
  },
  {
    roleId: 'ROLE-066', role: 'SAP CO/PS Consultant', roleName: 'SAP CO/PS Consultant', roleCode: 'FC-CO',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L2', roleType: 'Common',
    skills: ['Product Costing', 'Profitability Analysis (CO-PA)', 'Work Breakdown Structures (WBS)', 'Project Settlement'],
    certifications: ['SAP Certified Application Associate - SAP S/4HANA Management Accounting'],
    description: 'Specializes in managerial cost accounting, multi-stage overhead allocations, and capital projects.'
  },
  {
    roleId: 'ROLE-067', role: 'Senior ABAP Developer', roleName: 'Senior ABAP Developer', roleCode: 'TC-ABAP',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L3', roleType: 'Common',
    skills: ['ABAP RESTful Application Programming (RAP)', 'CDS Views', 'BAdIs & Enhancement Framework', 'OData Services', 'Clean Core ABAP'],
    certifications: ['SAP Certified Development Specialist - ABAP for SAP HANA'],
    description: 'Leads custom core development, performance tuning, and Clean Core modernisation.'
  },
  {
    roleId: 'ROLE-068', role: 'SAP BASIS Administrator', roleName: 'SAP BASIS Administrator', roleCode: 'TC-BASIS',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L3', roleType: 'Specialist',
    skills: ['HANA DB Administration', 'Client Copies & System Copies', 'Transport Management System (STMS)', 'Kernel Upgrades', 'SAP Solution Manager'],
    certifications: ['SAP Certified Technology Associate - System Administration (SAP HANA)'],
    description: 'Ensures 99.9% uptime, backup integrity, and technical runtime performance across SAP landscapes.'
  },
  {
    roleId: 'ROLE-069', role: 'SAP Fiori/UI5 Developer', roleName: 'SAP Fiori/UI5 Developer', roleCode: 'TC-FIORI',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L2', roleType: 'Common',
    skills: ['SAPUI5', 'Fiori Elements', 'SAP Business Application Studio', 'Smart Controls', 'Fiori Launchpad Configuration'],
    certifications: ['SAP Certified Development Associate - SAP Fiori Application Developer'],
    description: 'Builds tailored Fiori user experiences and responsive transactional apps for business users.'
  },
  {
    roleId: 'ROLE-070', role: 'SAP BTP Consultant', roleName: 'SAP BTP Consultant', roleCode: 'FC-BTP',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L2', roleType: 'Specialist',
    skills: ['SAP BTP Subaccounts & Quotas', 'Cloud Foundry / Kyma Runtime', 'SAP Build Work Zone', 'SAP Destination Service'],
    certifications: ['SAP Certified Technology Associate - SAP BTP Architecture'],
    description: 'Architects cloud extensions, side-by-side apps, and unified enterprise portals on SAP BTP.'
  },
  {
    roleId: 'ROLE-071', role: 'SAP CPI Consultant', roleName: 'SAP CPI Consultant', roleCode: 'TC-CPI',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L2', roleType: 'Specialist',
    skills: ['Cloud Integration Suite', 'iFlow Development', 'Groovy Scripting', 'Security Artifacts', 'Error Handling & Alerting'],
    certifications: ['SAP Certified Development Associate - SAP Integration Suite'],
    description: 'Engineers cloud integration flows bridging S/4HANA with external SaaS and on-premise systems.'
  },
  {
    roleId: 'ROLE-072', role: 'SAP SAC Consultant', roleName: 'SAP SAC Consultant', roleCode: 'FC-SAC',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L2', roleType: 'Specialist',
    skills: ['SAP Analytics Cloud', 'Live Data Connections', 'SAC Planning Models', 'Digital Boardroom Stories', 'Predictive Forecasts'],
    certifications: ['SAP Certified Application Associate - SAP Analytics Cloud'],
    description: 'Develops executive board reporting, real-time financial dashboards, and budget planning models.'
  },
  {
    roleId: 'ROLE-073', role: 'SAP BW Consultant', roleName: 'SAP BW Consultant', roleCode: 'FC-BW',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L2', roleType: 'Specialist',
    skills: ['BW/4HANA 2.0', 'CompositeProviders & Advanced DSOs', 'Calculation Views in HANA', 'BEx Query Designer'],
    certifications: ['SAP Certified Application Associate - SAP BW/4HANA'],
    description: 'Manages enterprise corporate reporting warehouse, data staging, and historical trend repositories.'
  },
  {
    roleId: 'ROLE-074', role: 'SAP GRC Consultant', roleName: 'SAP GRC Consultant', roleCode: 'FC-GRC',
    tower: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    level: 'L2', roleType: 'Specialist',
    skills: ['Access Control (ARA/EAM/ARM/BRM)', 'Segregation of Duties (SoD) Rulebooks', 'Emergency Access Management (Firefighter)', 'Audit Trails'],
    certifications: ['SAP Certified Application Associate - SAP Access Control'],
    description: 'Enforces strict access control governance, emergency elevation audit trails, and SoD compliance.'
  },

  // ── 7. Service Management, Governance, and Delivery (TWR-07) ──
  {
    roleId: 'ROLE-075', role: 'AMS Team Lead', roleName: 'AMS Team Lead', roleCode: 'TL-AMS',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L3', roleType: 'Common',
    skills: ['Operational Delivery Governance', 'Resource Scheduling', 'Daily Incident Triage', 'SLA Adherence Management'],
    certifications: ['ITIL v4 Managing Professional', 'PMP'],
    description: 'Directs day-to-day operational support dispatch, ticket velocity, and engineer assignments.'
  },
  {
    roleId: 'ROLE-076', role: 'Senior Consultant', roleName: 'Senior Consultant', roleCode: 'SC-GEN',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L3', roleType: 'Common',
    skills: ['Cross-Functional Consulting', 'Solution Review', 'Client Stakeholder Advisory', 'Complex Root Cause Analysis'],
    certifications: ['ITIL v4 Specialist', 'TOGAF Foundation'],
    description: 'Provides senior analytical troubleshooting and architectural validation across multiple operational streams.'
  },
  {
    roleId: 'ROLE-077', role: 'ITSM Analyst', roleName: 'ITSM Analyst', roleCode: 'ITSM-ANL',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L1', roleType: 'Common',
    skills: ['ITIL Process Tracking', 'Incident Ageing Analysis', 'SLA Breaches Reporting', 'Service Metrics Collection'],
    certifications: ['ITIL v4 Foundation'],
    description: 'Tracks and publishes operational SLA performance metrics, queue health, and compliance records.'
  },
  {
    roleId: 'ROLE-078', role: 'ITSM Consultant', roleName: 'ITSM Consultant', roleCode: 'ITSM-CONS',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L2', roleType: 'Specialist',
    skills: ['ITIL 4 Alignment', 'Service Catalog Optimization', 'SLA Definition & Thresholds', 'Process Re-engineering'],
    certifications: ['ITIL v4 Specialist: Create, Deliver and Support (CDS)'],
    description: 'Designs and audits IT service workflows, operational agreements, and governance metrics.'
  },
  {
    roleId: 'ROLE-079', role: 'Service Delivery Manager', roleName: 'Service Delivery Manager', roleCode: 'SDM',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L3', roleType: 'Specialist',
    skills: ['Contractual SLA Governance', 'Client Relationship Leadership', 'Executive SteerCom Reporting', 'Financial Governance'],
    certifications: ['ITIL v4 Strategic Leader', 'PMP'],
    description: 'Accountable for contractual service level attainment, customer satisfaction, and executive stakeholder alignment.'
  },
  {
    roleId: 'ROLE-080', role: 'Service Manager', roleName: 'Service Manager', roleCode: 'SRV-MGR',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L3', roleType: 'Specialist',
    skills: ['Operations Management', 'Resource Capacity Planning', 'Major Incident Oversight', 'Continuous Service Improvement (CSI)'],
    certifications: ['ITIL v4 Managing Professional'],
    description: 'Oversees day-to-day service desk operations, staffing shifts, and cross-team service availability.'
  },
  {
    roleId: 'ROLE-081', role: 'Incident Manager', roleName: 'Incident Manager', roleCode: 'INC-MGR',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L2', roleType: 'Common',
    skills: ['Major Incident Management (MIM)', 'Bridge Command', 'Executive Flash Reports (DFR)', 'Post-Incident Review (PIR)'],
    certifications: ['ITIL v4 Specialist: Incident Management'],
    description: 'Chairs Priority 1 and 2 incident bridge calls, drives emergency restoration, and drafts PIR reports.'
  },
  {
    roleId: 'ROLE-082', role: 'Problem Manager', roleName: 'Problem Manager', roleCode: 'PRB-MGR',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L2', roleType: 'Common',
    skills: ['Root Cause Analysis (RCA - 5 Whys/Ishikawa)', 'Known Error Database (KEDB)', 'Proactive Trend Analysis', 'Recurring Defect Elimination'],
    certifications: ['ITIL v4 Specialist: Problem Management', 'Six Sigma Green Belt'],
    description: 'Investigates underlying systemic root causes, maintains the KEDB, and prevents incident recurrence.'
  },
  {
    roleId: 'ROLE-083', role: 'Change Manager', roleName: 'Change Manager', roleCode: 'CHG-MGR',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L2', roleType: 'Common',
    skills: ['Change Advisory Board (CAB) Chair', 'Collision Detection', 'Rollback Planning', 'Standard Change Standardization'],
    certifications: ['ITIL v4 Specialist: Change Enablement'],
    description: 'Chairs CAB, evaluates deployment risk, approves production maintenance windows, and protects stability.'
  },
  {
    roleId: 'ROLE-084', role: 'Configuration Manager', roleName: 'Configuration Manager', roleCode: 'CFG-MGR',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L2', roleType: 'Common',
    skills: ['CMDB Health Verification', 'CI Relationship Modeling', 'Automated Discovery Audits', 'Asset Reconciliation'],
    certifications: ['ITIL v4 Specialist: Service Configuration Management'],
    description: 'Governs Configuration Item (CI) baselines, dependencies, and CMDB completeness.'
  },
  {
    roleId: 'ROLE-085', role: 'Asset Manager', roleName: 'Asset Manager', roleCode: 'AST-MGR',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L2', roleType: 'Common',
    skills: ['Hardware Asset Management (HAM)', 'Software Asset Management (SAM)', 'License Compliance', 'Vendor Audits'],
    certifications: ['IAITAM Certified Software Asset Manager (CSAM)'],
    description: 'Tracks software license entitlements, hardware depreciations, and OEM procurement contracts.'
  },
  {
    roleId: 'ROLE-086', role: 'IT Governance Analyst', roleName: 'IT Governance Analyst', roleCode: 'GOV-ANL',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L2', roleType: 'Common',
    skills: ['COBIT Controls', 'Policy Authoring', 'Audit Preparation', 'KPI Scorecarding'],
    certifications: ['COBIT 2019 Foundation'],
    description: 'Audits internal operational conformity with corporate IT policies, standard operating procedures, and SLAs.'
  },
  {
    roleId: 'ROLE-087', role: 'IT Governance Manager', roleName: 'IT Governance Manager', roleCode: 'GOV-MGR',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L3', roleType: 'Specialist',
    skills: ['IT Governance Frameworks (COBIT/CGEIT)', 'Regulatory Compliance', 'Internal & External Audit Defense', 'Policy Enforcement'],
    certifications: ['CGEIT (Certified in the Governance of Enterprise IT)', 'CRISC'],
    description: 'Leads overarching IT governance, policy compliance, and SteerCom audit responses.'
  },
  {
    roleId: 'ROLE-088', role: 'PMO Analyst', roleName: 'PMO Analyst', roleCode: 'PMO-ANL',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L2', roleType: 'Common',
    skills: ['Project Milestone Tracking', 'Resource Allocation Analysis', 'Budget Variance Reports', 'Risk & Issue Registers (RAID)'],
    certifications: ['CAPM (Certified Associate in Project Management)'],
    description: 'Tracks release milestones, enhancement delivery schedules, and budget utilization across accounts.'
  },
  {
    roleId: 'ROLE-089', role: 'Project Manager', roleName: 'Project Manager', roleCode: 'PM',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L3', roleType: 'Specialist',
    skills: ['PMP / Agile Delivery', 'Scope & Budget Management', 'Stakeholder Management', 'Critical Path Method'],
    certifications: ['PMP (Project Management Professional)', 'PMI-ACP'],
    description: 'Delivers major technology transformations, migrations, and discrete enhancement projects on-time and within budget.'
  },
  {
    roleId: 'ROLE-090', role: 'Program Manager', roleName: 'Program Manager', roleCode: 'PGM',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L3', roleType: 'Specialist',
    skills: ['Multi-Project Portfolio Governance', 'Strategic Benefit Realization', 'Executive Communications', 'Vendor Contracting'],
    certifications: ['PgMP (Program Management Professional)', 'MSP (Managing Successful Programmes)'],
    description: 'Directs the complete multi-year IT Managed Services program and oversees all operational and project workstreams.'
  },
  {
    roleId: 'ROLE-091', role: 'Vendor Manager', roleName: 'Vendor Manager', roleCode: 'VND-MGR',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L2', roleType: 'Common',
    skills: ['Third-Party Underpinning Contracts (UC)', 'OEM SLA Monitoring (SAP/Microsoft)', 'QBR Coordination', 'Penalty Enforcement'],
    certifications: ['Certified Outsourcing Professional (COP)'],
    description: 'Manages technology partners, OEM support commitments, and supplier performance scorecards.'
  },
  {
    roleId: 'ROLE-092', role: 'Risk & Compliance Analyst', roleName: 'Risk & Compliance Analyst', roleCode: 'RC-ANL',
    tower: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    level: 'L2', roleType: 'Specialist',
    skills: ['Enterprise Risk Assessment', 'CAPA Tracking', 'Disaster Recovery Auditing', 'Regulatory Compliance'],
    certifications: ['CRISC (Certified in Risk and Information Systems Control)', 'ISO 27001 Lead Auditor'],
    description: 'Maintains the operational risk register, tracks remediation actions, and assures regulatory compliance.'
  }
];
