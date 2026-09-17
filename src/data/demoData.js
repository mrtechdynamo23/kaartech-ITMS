/**
 * KaarTech ITMS Control Tower — Demo / Simulated Data
 * 
 * CLASSIFICATION: DEMO — All data in this file is simulated.
 * Uses fictional identities only (Section 77).
 * Every record has valid cross-relationships (Section 75).
 * Do NOT present this as live enterprise operational data.
 */

import { ENTITIES, APPLICATIONS, TRACKS } from './masterData.js';
import { SERVICE_DOMAINS } from './serviceDomains.js';
import { RESOLVER_GROUPS, RESOLVER_TIERS, AGEING_BUCKETS } from './config.js';

// ── Helper: Random pick ──
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

// ═══════════════════════════════════════════════════
// RESOURCE MASTER — DEMO (Section 41)
// Fictional identities only. Single canonical source.
// ═══════════════════════════════════════════════════
export const RESOURCES = [
  // ── 1. IT Helpdesk & End User Services (TWR-01) ──
  {
    id: 'RES-027', resourceId: 'RES-027', positionId: 'POS-027', name: 'Sultan Al Dhahiri',
    track: 'AMS-ON-RUN', serviceDomain: 'IT Helpdesk & End User Services', processGroup: 'Executive VIP Support',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L3', roleType: 'Specialist',
    location: 'Onsite', onboardingDate: '2025-08-01', startDate: '2025-08-01', endDate: '2027-08-31',
    reportingManager: 'RES-002', manager: 'Fatima Al-Otaibi', status: 'Active', gender: 'Male',
    skill: 'Executive VIP Concierge Support, Desktop Fleet & Unified Comms',
    certification: 'ITIL v4 Managing Professional', phone: '+966-55-XXX-1027', email: 'sultan.d@kaartech.com',
    entity: 'ENT-001', role: 'Executive Support Specialist', roleCode: 'VIP-SPEC',
    towerId: 'TWR-01', serviceDomainId: 'TWR-01', serviceDomain: 'IT Helpdesk & End User Services',
    experience: 11, relevantExperience: 9, employmentRelationship: 'Permanent',
    education: 'BSc Computer Systems Engineering, King Fahd University of Petroleum & Minerals (KFUPM)',
    professionalSummary: 'Executive IT support specialist delivering white-glove technology support, secure mobile communications, and smart boardrooms for C-level leadership.',
    certifications: ['ITIL v4 Managing Professional', 'Microsoft 365 Enterprise Administrator Expert', 'CompTIA Security+'],
    technologies: ['Windows 11 Enterprise', 'Microsoft Intune', 'Teams Rooms', 'Apple iOS MDM', 'Cisco Webex'],
    comparableClientExperience: 'Lead VIP Support Specialist at Saudi Aramco & STC Corporate Headquarters.',
    keyAssignments: ['Executive Boardroom Modernization', 'C-Suite Mobile Device Security', 'SteerCom Live Event Operations'],
    languages: ['Arabic', 'English'], availability: 98, slaHealth: 98, currentAssignment: 'Executive Support & Workplace Concierge'
  },
  {
    id: 'RES-031', resourceId: 'RES-031', positionId: 'POS-031', name: 'Faisal Al Ghamdi',
    track: 'AMS-ON-RUN', serviceDomain: 'IT Helpdesk & End User Services', processGroup: 'Service Desk Operations',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L2', roleType: 'Common',
    location: 'Onsite', onboardingDate: '2025-09-01', startDate: '2025-09-01', endDate: '2027-08-31',
    reportingManager: 'RES-027', manager: 'Sultan Al Dhahiri', status: 'Active', gender: 'Male',
    skill: 'Incident Triage, First-Contact Resolution & Endpoint Diagnostics',
    certification: 'ITIL v4 Specialist: CDS', phone: '+966-55-XXX-1031', email: 'faisal.g@kaartech.com',
    entity: 'ENT-001', role: 'Senior Service Desk Analyst', roleCode: 'SD-L2',
    towerId: 'TWR-01', serviceDomainId: 'TWR-01', serviceDomain: 'IT Helpdesk & End User Services',
    experience: 7, relevantExperience: 5, employmentRelationship: 'Permanent',
    education: 'BSc Information Technology, King Saud University',
    professionalSummary: 'Senior service desk specialist driving high first-contact resolution (FCR), incident dispatch accuracy, and knowledgebase governance.',
    certifications: ['ITIL v4 Specialist: Create, Deliver & Support', 'CompTIA A+', 'HDI Support Center Analyst'],
    technologies: ['ServiceNow ITSM', 'Active Directory', 'Azure AD', 'Remote Assist', 'Windows 10/11'],
    comparableClientExperience: 'Senior Helpdesk Specialist at SABIC Shared Services & Al Rajhi Bank.',
    keyAssignments: ['Service Desk Shift Lead', 'Self-Service Portal Catalog Enhancement', 'FCR Optimization Taskforce'],
    languages: ['Arabic', 'English'], availability: 96, slaHealth: 97, currentAssignment: 'Onsite Service Desk Shift Operations'
  },
  {
    id: 'RES-032', resourceId: 'RES-032', positionId: 'POS-032', name: 'Zaid Mansoor',
    track: 'AMS-OF-RUN', serviceDomain: 'IT Helpdesk & End User Services', processGroup: 'Service Desk Operations',
    nationality: 'Jordanian', resourceType: 'Expatriate', level: 'L1', roleType: 'Common',
    location: 'Offshore', onboardingDate: '2025-10-15', startDate: '2025-10-15', endDate: '2027-08-31',
    reportingManager: 'RES-031', manager: 'Faisal Al Ghamdi', status: 'Active', gender: 'Male',
    skill: 'Multi-Channel Ticket Handling & User Account Provisioning',
    certification: 'ITIL v4 Foundation', phone: '+962-79-XXX-1032', email: 'zaid.m@kaartech.com',
    entity: 'ENT-001', role: 'Service Desk Analyst', roleCode: 'SD-L1',
    towerId: 'TWR-01', serviceDomainId: 'TWR-01', serviceDomain: 'IT Helpdesk & End User Services',
    experience: 4, relevantExperience: 3, employmentRelationship: 'Permanent',
    education: 'BSc Computer Information Systems, University of Jordan',
    professionalSummary: 'Dedicated frontline service desk analyst handling multi-channel phone, portal, and chat ticket logging with swift initial triage.',
    certifications: ['ITIL v4 Foundation', 'Microsoft Certified: Modern Desktop Fundamentals'],
    technologies: ['ServiceNow', 'Office 365', 'Exchange Admin Center', 'BitLocker Administration'],
    comparableClientExperience: 'Tier 1 Support Analyst for Zain Telecom & regional enterprise accounts.',
    keyAssignments: ['24/7 Global Ticket Queue Triage', 'Password Self-Service Reset Automation'],
    languages: ['Arabic', 'English'], availability: 95, slaHealth: 94, currentAssignment: 'Offshore Service Desk Level-1'
  },
  {
    id: 'RES-033', resourceId: 'RES-033', positionId: 'POS-033', name: 'Huda Al Harbi',
    track: 'AMS-ON-RUN', serviceDomain: 'IT Helpdesk & End User Services', processGroup: 'Field Desktop Support',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L2', roleType: 'Common',
    location: 'Onsite', onboardingDate: '2025-08-15', startDate: '2025-08-15', endDate: '2027-08-31',
    reportingManager: 'RES-027', manager: 'Sultan Al Dhahiri', status: 'Active', gender: 'Female',
    skill: 'Desktop Hardware Lifecycle & Automated OS Provisioning',
    certification: 'Microsoft Certified: Endpoint Administrator', phone: '+966-55-XXX-1033', email: 'huda.h@kaartech.com',
    entity: 'ENT-002', role: 'Desktop Support Engineer', roleCode: 'DS-ENG',
    towerId: 'TWR-01', serviceDomainId: 'TWR-01', serviceDomain: 'IT Helpdesk & End User Services',
    experience: 6, relevantExperience: 5, employmentRelationship: 'Permanent',
    education: 'BSc Computer Engineering, Princess Nourah University',
    professionalSummary: 'Workplace engineer managing enterprise PC refresh programs, Intune autopilot provisioning, and field device troubleshooting.',
    certifications: ['Microsoft Certified: Endpoint Administrator', 'CompTIA Network+'],
    technologies: ['Microsoft Intune', 'Autopilot', 'Dell Command Suite', 'HP Client Management', 'BitLocker'],
    comparableClientExperience: 'Workplace Support Lead at Riyadh Airports Company & Ministry of Health.',
    keyAssignments: ['HQ Laptop Fleet Refresh (1,200 devices)', 'Zero-Touch Intune Deployment Pipeline'],
    languages: ['Arabic', 'English'], availability: 97, slaHealth: 96, currentAssignment: 'Onsite Desktop Engineering & Provisioning'
  },
  {
    id: 'RES-034', resourceId: 'RES-034', positionId: 'POS-034', name: 'Kevin Thomas',
    track: 'AMS-OF-RUN', serviceDomain: 'IT Helpdesk & End User Services', processGroup: 'Workplace Engineering',
    nationality: 'Indian', resourceType: 'Expatriate', level: 'L2', roleType: 'Common',
    location: 'Offshore', onboardingDate: '2025-10-01', startDate: '2025-10-01', endDate: '2027-08-31',
    reportingManager: 'RES-031', manager: 'Faisal Al Ghamdi', status: 'Active', gender: 'Male',
    skill: 'Virtual Desktop Infrastructure (VDI) & Application Packaging',
    certification: 'Citrix Certified Professional - Virtualization (CCP-V)', phone: '+91-98XXX-1034', email: 'kevin.t@kaartech.com',
    entity: 'ENT-001', role: 'Workplace Support Engineer', roleCode: 'WSE-ENG',
    towerId: 'TWR-01', serviceDomainId: 'TWR-01', serviceDomain: 'IT Helpdesk & End User Services',
    experience: 8, relevantExperience: 6, employmentRelationship: 'Permanent',
    education: 'BTech Information Technology, Cochin University of Science and Technology',
    professionalSummary: 'End-user platform specialist focused on Azure Virtual Desktop (AVD), Citrix Cloud virtual workspaces, and secure remote application streaming.',
    certifications: ['Citrix Certified Professional (CCP-V)', 'Azure Virtual Desktop Specialty'],
    technologies: ['Azure Virtual Desktop', 'Citrix Workspace', 'MSIX App Attach', 'FSLogix Profiles', 'PowerShell'],
    comparableClientExperience: 'Enterprise VDI Administrator for Al Rajhi Bank and Saudi Enterprise operations.',
    keyAssignments: ['Enterprise Virtual Desktop Migration to Azure', 'Secure Contractor Access Sandbox'],
    languages: ['English', 'Hindi', 'Malayalam'], availability: 94, slaHealth: 95, currentAssignment: 'Offshore Workplace Virtualization Support'
  },

  // ── 2. Infrastructure, Cloud, and Platform Services (TWR-02) ──
  {
    id: 'RES-020', resourceId: 'RES-020', positionId: 'POS-020', name: 'Suresh Krishnan',
    track: 'AMS-OF-RUN', serviceDomain: 'IT Helpdesk & End User Services', processGroup: 'Hybrid Cloud & Datacenter',
    nationality: 'Indian', resourceType: 'Expatriate', level: 'L3', roleType: 'Specialist',
    location: 'Offshore', onboardingDate: '2025-10-01', startDate: '2025-10-01', endDate: '2027-08-31',
    reportingManager: 'RES-002', manager: 'Fatima Al-Otaibi', status: 'Active', gender: 'Male',
    skill: 'Hybrid Cloud Engineering, Azure Landing Zones & Hyperconverged Datacenters',
    certification: 'Microsoft Certified: Azure Solutions Architect Expert', phone: '+91-98XXX-1020', email: 'suresh.k@kaartech.com',
    entity: 'ENT-001', role: 'Cloud Engineer', roleCode: 'CLD-ENG',
    towerId: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    experience: 13, relevantExperience: 11, employmentRelationship: 'Permanent',
    education: 'BTech Computer Science, Anna University',
    professionalSummary: 'Senior infrastructure and hybrid cloud architect with extensive experience leading multi-tenant Azure landing zones, Nutanix HCI compute clusters, and Tier-4 DR.',
    certifications: ['Azure Solutions Architect Expert', 'AWS Certified Solutions Architect Professional', 'Terraform Associate'],
    technologies: ['Microsoft Azure', 'AWS', 'Terraform', 'VMware vSphere', 'Nutanix Prism', 'Azure Monitor'],
    comparableClientExperience: 'Lead Cloud Infrastructure Architect for Qatar Energy & Etisalat Cloud Services.',
    keyAssignments: ['Production S/4HANA Azure IaaS Migration', 'Hybrid Multi-Region Cloud DR Architecture', 'Cloud Governance & FinOps'],
    languages: ['English', 'Hindi', 'Tamil'], availability: 95, slaHealth: 97, currentAssignment: 'Hybrid Cloud Operations & Infrastructure Support'
  },
  {
    id: 'RES-023', resourceId: 'RES-023', positionId: 'POS-023', name: 'Yousuf Al Kaabi',
    track: 'AMS-ON-RUN', serviceDomain: 'IT Helpdesk & End User Services', processGroup: 'Server & Systems Administration',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L2', roleType: 'Common',
    location: 'Onsite', onboardingDate: '2025-09-01', startDate: '2025-09-01', endDate: '2027-08-31',
    reportingManager: 'RES-020', manager: 'Suresh Krishnan', status: 'Active', gender: 'Male',
    skill: 'Windows Server 2022 Clustering, Active Directory & Nutanix AHV',
    certification: 'Microsoft Certified: Windows Server Hybrid Administrator', phone: '+966-55-XXX-1023', email: 'yousuf.k@kaartech.com',
    entity: 'ENT-028', role: 'Windows Administrator', roleCode: 'WIN-ADMIN',
    towerId: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    experience: 8, relevantExperience: 6, employmentRelationship: 'Permanent',
    education: 'BSc Computer Engineering, King Fahd University of Petroleum & Minerals (KFUPM)',
    professionalSummary: 'Systems engineer ensuring 99.99% server availability, failover clustering, Active Directory replication, and monthly OS security patch compliance.',
    certifications: ['Microsoft Certified: Windows Server Hybrid Administrator', 'CompTIA Server+'],
    technologies: ['Windows Server 2022', 'Active Directory Domain Services', 'PowerShell 7', 'WSUS', 'VMware ESXi'],
    comparableClientExperience: 'Systems Administrator at Saudi Electricity Company (SEC) & Riyadh Metro.',
    keyAssignments: ['Core Active Directory Forest Consolidation', 'Enterprise Automated Patch Management Program'],
    languages: ['Arabic', 'English'], availability: 97, slaHealth: 98, currentAssignment: 'Onsite Windows & Compute Operations'
  },
  {
    id: 'RES-035', resourceId: 'RES-035', positionId: 'POS-035', name: 'Abdullah Al Otaibi',
    track: 'AMS-ON-RUN', serviceDomain: 'IT Helpdesk & End User Services', processGroup: 'Network & Connectivity',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L2', roleType: 'Common',
    location: 'Onsite', onboardingDate: '2025-08-01', startDate: '2025-08-01', endDate: '2027-08-31',
    reportingManager: 'RES-020', manager: 'Suresh Krishnan', status: 'Active', gender: 'Male',
    skill: 'Enterprise SD-WAN, Cisco Core Routing & Palo Alto Next-Gen Firewalls',
    certification: 'Cisco Certified Network Professional (CCNP Enterprise)', phone: '+966-55-XXX-1035', email: 'abdullah.o@kaartech.com',
    entity: 'ENT-001', role: 'Network Engineer', roleCode: 'NET-ENG',
    towerId: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    experience: 9, relevantExperience: 7, employmentRelationship: 'Permanent',
    education: 'BSc Telecommunications Engineering, King Saud University',
    professionalSummary: 'Senior network engineer designing mission-critical campus backbones, SD-WAN interconnects between 34 corporate entities, and firewall security policies.',
    certifications: ['CCNP Enterprise', 'Palo Alto Networks Certified Network Security Engineer (PCNSE)'],
    technologies: ['Cisco Catalyst 9000', 'Palo Alto Firewalls', 'Silver Peak SD-WAN', 'F5 BIG-IP LTM', 'Wireshark'],
    comparableClientExperience: 'Network Operations Engineer at Mobily & National Water Company.',
    keyAssignments: ['Multi-Site SD-WAN Deployment across 34 Entities', 'High-Availability Datacenter Dual-Homed BGP'],
    languages: ['Arabic', 'English'], availability: 96, slaHealth: 96, currentAssignment: 'Enterprise Network & Edge Connectivity'
  },
  {
    id: 'RES-021', resourceId: 'RES-021', positionId: 'POS-021', name: 'Abdulrahman Darwish',
    track: 'AMS-ON-RUN', serviceDomain: 'IT Helpdesk & End User Services', processGroup: 'Productivity Platforms',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L2', roleType: 'Common',
    location: 'Onsite', onboardingDate: '2025-09-15', startDate: '2025-09-15', endDate: '2027-08-31',
    reportingManager: 'RES-020', manager: 'Suresh Krishnan', status: 'Active', gender: 'Male',
    skill: 'Microsoft 365 Tenant Governance, Exchange Online & SharePoint Architecture',
    certification: 'Microsoft 365 Certified: Enterprise Administrator Expert', phone: '+966-55-XXX-1021', email: 'abdulrahman.d@kaartech.com',
    entity: 'ENT-002', role: 'Microsoft 365 Administrator', roleCode: 'M365-ADMIN',
    towerId: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    experience: 7, relevantExperience: 5, employmentRelationship: 'Permanent',
    education: 'BSc Business Information Technology, Imam Mohammad Ibn Saud Islamic University',
    professionalSummary: 'Specialist overseeing enterprise SaaS productivity platforms, hybrid Exchange mail flow, data retention policies, and Microsoft Teams governance.',
    certifications: ['Microsoft 365 Certified: Enterprise Administrator Expert', 'MS-700 Teams Administrator'],
    technologies: ['Exchange Online', 'SharePoint Online', 'Microsoft Entra ID', 'PowerShell for M365', 'Purview Compliance'],
    comparableClientExperience: 'M365 Cloud Administrator at Saudi Industrial Development Fund (SIDF).',
    keyAssignments: ['Exchange Hybrid Mailbox Migration to O365 Cloud', 'Tenant Security Baseline Hardening'],
    languages: ['Arabic', 'English'], availability: 96, slaHealth: 97, currentAssignment: 'Microsoft 365 Workplace Services'
  },
  {
    id: 'RES-019', resourceId: 'RES-019', positionId: 'POS-019', name: 'Hind Al Mazrouei',
    track: 'AMS-ON-RUN', serviceDomain: 'IT Helpdesk & End User Services', processGroup: 'Database Administration',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L3', roleType: 'Specialist',
    location: 'Onsite', onboardingDate: '2025-08-15', startDate: '2025-08-15', endDate: '2027-08-31',
    reportingManager: 'RES-020', manager: 'Suresh Krishnan', status: 'Active', gender: 'Female',
    skill: 'Enterprise Database Clustering, AlwaysOn Availability & Performance Tuning',
    certification: 'Microsoft Certified: Azure Database Administrator Associate', phone: '+966-55-XXX-1019', email: 'hind.m@kaartech.com',
    entity: 'ENT-001', role: 'Database Administrator', roleCode: 'DBA',
    towerId: 'TWR-02', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services',
    experience: 10, relevantExperience: 8, employmentRelationship: 'Permanent',
    education: 'MSc Database Systems, Effat University',
    professionalSummary: 'Senior DBA architecting high-availability SQL Server and Oracle databases supporting corporate ERP extensions, portal backends, and warehouse ETL.',
    certifications: ['Azure Database Administrator Associate', 'Oracle Certified Professional (OCP) DBA'],
    technologies: ['MS SQL Server 2022', 'Oracle 19c', 'Azure SQL Managed Instance', 'AlwaysOn AG', 'T-SQL Optimization'],
    comparableClientExperience: 'Lead Database Administrator at Alinma Bank & Saudi Customs.',
    keyAssignments: ['SQL Server AlwaysOn Multi-Subnet Cluster Implementation', 'Mission-Critical Database DR Rehearsals'],
    languages: ['Arabic', 'English'], availability: 97, slaHealth: 98, currentAssignment: 'Enterprise Database Operations & Uptime'
  },

  // ── 3. Applications, Digital, and Integration (TWR-03) ──
  {
    id: 'RES-014', resourceId: 'RES-014', positionId: 'POS-014', name: 'Sunita Reddy',
    track: 'ENH-OF-RUN', serviceDomain: 'Applications, Digital, and Integration', processGroup: 'Application Development',
    nationality: 'Indian', resourceType: 'Expatriate', level: 'L3', roleType: 'Specialist',
    location: 'Offshore', onboardingDate: '2025-10-01', startDate: '2025-10-01', endDate: '2027-08-31',
    reportingManager: 'RES-002', manager: 'Fatima Al-Otaibi', status: 'Active', gender: 'Female',
    skill: 'Full Stack Web Architecture, React 19, Node.js & Microservices',
    certification: 'AWS Certified Developer - Associate', phone: '+91-98XXX-1014', email: 'sunita.r@kaartech.com',
    entity: 'ENT-001', role: 'Full Stack Developer', roleCode: 'FS-DEV',
    towerId: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    experience: 11, relevantExperience: 9, employmentRelationship: 'Permanent',
    education: 'MTech Computer Science, JNTU Hyderabad',
    professionalSummary: 'Principal software engineer leading development of custom enterprise web portals, resilient microservices, responsive portals, and seamless client portals.',
    certifications: ['AWS Certified Developer Associate', 'Meta Front-End Developer Professional'],
    technologies: ['React 18/19', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Redis', 'Tailwind CSS'],
    comparableClientExperience: 'Lead Full-Stack Architect for SAUDIA (Saudi Arabian Airlines) & Enterprise Digital Services.',
    keyAssignments: ['KaarTech ITMS Portal Modernization', 'Executive Flash Report Automated PDF Engine', 'Vendor Self-Service Portal'],
    languages: ['English', 'Hindi', 'Telugu'], availability: 95, slaHealth: 97, currentAssignment: 'Digital Solutions & Enterprise Portals Lead'
  },
  {
    id: 'RES-026', resourceId: 'RES-026', positionId: 'POS-026', name: 'Nisha Varma',
    track: 'ENH-OF-RUN', serviceDomain: 'Applications, Digital, and Integration', processGroup: 'Integration Middleware',
    nationality: 'Indian', resourceType: 'Expatriate', level: 'L2', roleType: 'Specialist',
    location: 'Offshore', onboardingDate: '2025-11-01', startDate: '2025-11-01', endDate: '2027-08-31',
    reportingManager: 'RES-014', manager: 'Sunita Reddy', status: 'Active', gender: 'Female',
    skill: 'Enterprise Integration Middleware, Azure API Management & REST/SOAP Hubs',
    certification: 'MuleSoft Certified Developer - Level 1', phone: '+91-98XXX-1026', email: 'nisha.v@kaartech.com',
    entity: 'ENT-001', role: 'Integration Engineer', roleCode: 'INT-ENG',
    towerId: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    experience: 8, relevantExperience: 6, employmentRelationship: 'Permanent',
    education: 'BTech Information Technology, VIT University',
    professionalSummary: 'Middleware integration specialist designing high-throughput API gateways, Azure Logic Apps, and enterprise event messaging connecting ERP to custom systems.',
    certifications: ['MuleSoft Certified Developer', 'Azure Developer Associate (AZ-204)'],
    technologies: ['Azure API Management', 'MuleSoft AnyPoint', 'Kafka', 'REST/JSON', 'SOAP/XML', 'Azure Service Bus'],
    comparableClientExperience: 'Middleware Developer at Saudi Ports Authority (Mawani) & Enterprise Logistics.',
    keyAssignments: ['Core ERP Integration Broker', 'Real-Time Financial Settlement API Gateway'],
    languages: ['English', 'Hindi', 'Malayalam'], availability: 94, slaHealth: 95, currentAssignment: 'Enterprise Middleware & Hybrid Integrations'
  },
  {
    id: 'RES-011', resourceId: 'RES-011', positionId: 'POS-011', name: 'Mohammed Al Kindi',
    track: 'AMS-OF-RUN', serviceDomain: 'Applications, Digital, and Integration', processGroup: 'Frontend Engineering',
    nationality: 'Omani', resourceType: 'Expatriate', level: 'L2', roleType: 'Common',
    location: 'Offshore', onboardingDate: '2025-10-15', startDate: '2025-10-15', endDate: '2027-08-31',
    reportingManager: 'RES-014', manager: 'Sunita Reddy', status: 'Active', gender: 'Male',
    skill: 'Modern React Architecture, WCAG Accessibility & Arabic RTL Localization',
    certification: 'Certified Web Accessibility Specialist (WAS)', phone: '+968-9XXX-1011', email: 'mohammed.k@kaartech.com',
    entity: 'ENT-003', role: 'React Developer', roleCode: 'REACT-DEV',
    towerId: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    experience: 7, relevantExperience: 5, employmentRelationship: 'Permanent',
    education: 'BSc Computer Science, Sultan Qaboos University',
    professionalSummary: 'Frontend UI/UX engineer specializing in building high-speed responsive web applications with flawless Arabic RTL support, data visualization, and accessibility.',
    certifications: ['Certified Web Accessibility Specialist', 'React Developer Certification'],
    technologies: ['React', 'JavaScript (ESNext)', 'HTML5/CSS3', 'Recharts', 'Vite', 'Lucide React'],
    comparableClientExperience: 'UI Developer for Oman Air & Bank Muscat digital channels.',
    keyAssignments: ['RTL Arabic Dashboard Harmonization', 'Interactive SLA Charting Suite'],
    languages: ['Arabic', 'English'], availability: 96, slaHealth: 96, currentAssignment: 'Frontend Engineering & Portal User Experience'
  },
  {
    id: 'RES-009', resourceId: 'RES-009', positionId: 'POS-009', name: 'Ankit Patel',
    track: 'AMS-OF-Flex', serviceDomain: 'Applications, Digital, and Integration', processGroup: 'ServiceNow Engineering',
    nationality: 'Indian', resourceType: 'Expatriate', level: 'L2', roleType: 'Specialist',
    location: 'Offshore', onboardingDate: '2025-11-01', startDate: '2025-11-01', endDate: '2027-08-31',
    reportingManager: 'RES-014', manager: 'Sunita Reddy', status: 'Active', gender: 'Male',
    skill: 'ServiceNow Platform Development, Workflows, Client Scripts & Service Catalog',
    certification: 'ServiceNow Certified Application Developer (CAD)', phone: '+91-98XXX-1009', email: 'ankit.p@kaartech.com',
    entity: 'ENT-028', role: 'ServiceNow Developer', roleCode: 'SN-DEV',
    towerId: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    experience: 8, relevantExperience: 6, employmentRelationship: 'Permanent',
    education: 'BTech Computer Engineering, Gujarat University',
    professionalSummary: 'Certified ServiceNow developer building automated business rules, custom scope applications, ITIL workflows, and REST integration endpoints.',
    certifications: ['ServiceNow CAD', 'ServiceNow CSA', 'ITIL v4 Foundation'],
    technologies: ['ServiceNow Washington/Xanadu', 'Flow Designer', 'Widget Development', 'Script Includes', 'REST APIs'],
    comparableClientExperience: 'ServiceNow Developer for Tata Consultancy Services & ADNOC.',
    keyAssignments: ['Self-Service Catalog Overhaul', 'Automated Change Approval Routing Workflow'],
    languages: ['English', 'Hindi', 'Gujarati'], availability: 93, slaHealth: 94, currentAssignment: 'ServiceNow Platform Development'
  },
  {
    id: 'RES-018', resourceId: 'RES-018', positionId: 'POS-018', name: 'Vikram Singh',
    track: 'AMS-OF-RUN', serviceDomain: 'Applications, Digital, and Integration', processGroup: 'Backend Engineering',
    nationality: 'Indian', resourceType: 'Expatriate', level: 'L2', roleType: 'Common',
    location: 'Offshore', onboardingDate: '2025-11-01', startDate: '2025-11-01', endDate: '2027-08-31',
    reportingManager: 'RES-014', manager: 'Sunita Reddy', status: 'Active', gender: 'Male',
    skill: 'Java Spring Boot, RESTful Microservices & Distributed Caching',
    certification: 'Oracle Certified Professional: Java SE Developer', phone: '+91-98XXX-1018', email: 'vikram.s@kaartech.com',
    entity: 'ENT-001', role: 'Java Developer', roleCode: 'JAVA-DEV',
    towerId: 'TWR-03', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration',
    experience: 9, relevantExperience: 7, employmentRelationship: 'Permanent',
    education: 'BTech Computer Science, IIT Delhi',
    professionalSummary: 'Senior backend engineer constructing resilient API backbones, database connection pools, batch workers, and authentication gateways.',
    certifications: ['Oracle Certified Java Developer', 'Spring Certified Professional'],
    technologies: ['Java 21', 'Spring Boot 3', 'Hibernate', 'Redis', 'Kafka', 'Maven', 'JUnit 5'],
    comparableClientExperience: 'Backend Developer at Bharti Airtel & HCL Technologies.',
    keyAssignments: ['Real-Time Ticket Event Stream Consumer', 'Enterprise Authentication Microservice'],
    languages: ['English', 'Hindi'], availability: 95, slaHealth: 95, currentAssignment: 'Backend Microservices Engineering'
  },

  // ── 4. Data, Analytics, AI, and Automation (TWR-04) ──
  {
    id: 'RES-012', resourceId: 'RES-012', positionId: 'POS-012', name: 'Lakshmi Devi',
    track: 'AMS-OF-Flex', serviceDomain: 'Data, Analytics, AI, and Automation', processGroup: 'Data Architecture & Governance',
    nationality: 'Indian', resourceType: 'Expatriate', level: 'L3', roleType: 'Specialist',
    location: 'Offshore', onboardingDate: '2025-11-15', startDate: '2025-11-15', endDate: '2027-08-31',
    reportingManager: 'RES-002', manager: 'Fatima Al-Otaibi', status: 'Active', gender: 'Female',
    skill: 'Enterprise Data Warehousing, Data Mesh Architecture & Governance',
    certification: 'CDMP (Certified Data Management Professional)', phone: '+91-98XXX-1012', email: 'lakshmi.d@kaartech.com',
    entity: 'ENT-001', role: 'Data Architect', roleCode: 'DATA-ARCH',
    towerId: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    experience: 12, relevantExperience: 10, employmentRelationship: 'Permanent',
    education: 'MCom & MSc Data Systems, University of Delhi',
    professionalSummary: 'Senior data architect directing corporate data pipelines, Kimball dimensional modeling, master data management (MDM), and regulatory data compliance.',
    certifications: ['CDMP Practitioner', 'Microsoft Certified: Azure Data Engineer Associate'],
    technologies: ['Snowflake', 'Azure Synapse', 'SAP BW/4HANA', 'dbt', 'Power BI', 'Apache Airflow'],
    comparableClientExperience: 'Data Architecture Lead at ICICI Bank & Standard Chartered.',
    keyAssignments: ['Corporate Data Lakehouse Consolidation', 'Executive Financial Metrics Canonical Model'],
    languages: ['English', 'Hindi', 'Telugu'], availability: 94, slaHealth: 96, currentAssignment: 'Enterprise Data Architecture & Analytics'
  },
  {
    id: 'RES-013', resourceId: 'RES-013', positionId: 'POS-013', name: 'Hassan Al Nuaimi',
    track: 'AMS-ON-RUN', serviceDomain: 'Data, Analytics, AI, and Automation', processGroup: 'Business Intelligence',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L2', roleType: 'Common',
    location: 'Onsite', onboardingDate: '2025-09-15', startDate: '2025-09-15', endDate: '2027-08-31',
    reportingManager: 'RES-012', manager: 'Lakshmi Devi', status: 'Active', gender: 'Male',
    skill: 'Power BI Development, DAX Formula Optimization & Executive Visualizations',
    certification: 'Microsoft Certified: Power BI Data Analyst Associate (PL-300)', phone: '+966-55-XXX-1013', email: 'hassan.n@kaartech.com',
    entity: 'ENT-033', role: 'Power BI Developer', roleCode: 'PBI-DEV',
    towerId: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    experience: 8, relevantExperience: 6, employmentRelationship: 'Permanent',
    education: 'BSc Industrial Engineering, King Fahd University of Petroleum & Minerals (KFUPM)',
    professionalSummary: 'Senior BI consultant crafting interactive executive operational dashboards, row-level security models, and automated paginated financial reports.',
    certifications: ['Microsoft Certified: Power BI Data Analyst Associate (PL-300)'],
    technologies: ['Power BI Desktop & Service', 'DAX Studio', 'Power Query (M)', 'SQL Server', 'Excel PowerPivot'],
    comparableClientExperience: 'Lead BI Specialist at Maaden Mining & Saudi Telecom Company (stc).',
    keyAssignments: ['Executive Board SLA Performance Dashboard', 'Operational Ticket Reduction Metrics Scorecard'],
    languages: ['Arabic', 'English'], availability: 97, slaHealth: 98, currentAssignment: 'Power BI Dashboard & Analytics Development'
  },
  {
    id: 'RES-022', resourceId: 'RES-022', positionId: 'POS-022', name: 'Meera Nambiar',
    track: 'AMS-OF-Flex', serviceDomain: 'Data, Analytics, AI, and Automation', processGroup: 'Data Engineering & ETL',
    nationality: 'Indian', resourceType: 'Expatriate', level: 'L2', roleType: 'Specialist',
    location: 'Offshore', onboardingDate: '2025-11-15', startDate: '2025-11-15', endDate: '2027-08-31',
    reportingManager: 'RES-012', manager: 'Lakshmi Devi', status: 'Active', gender: 'Female',
    skill: 'PySpark, Automated ETL Pipelines & Databricks Lakehouse',
    certification: 'Databricks Certified Data Engineer Associate', phone: '+91-98XXX-1022', email: 'meera.n@kaartech.com',
    entity: 'ENT-001', role: 'Data Engineer', roleCode: 'DATA-ENG',
    towerId: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    experience: 7, relevantExperience: 5, employmentRelationship: 'Permanent',
    education: 'BTech Computer Engineering, Symbiosis International University',
    professionalSummary: 'Data engineer constructing automated data ingestion pipelines, delta lake tables, and data cleansing routines across enterprise sources.',
    certifications: ['Databricks Certified Data Engineer Associate', 'Azure Data Fundamentals'],
    technologies: ['Apache Spark', 'Python', 'Delta Lake', 'Azure Data Factory', 'PostgreSQL', 'Airflow'],
    comparableClientExperience: 'Data Pipeline Specialist at Cognizant & Tech Mahindra.',
    keyAssignments: ['Automated Incident & SLA Telemetry Pipeline', 'Hourly Master Data Synchronization Pipeline'],
    languages: ['English', 'Hindi', 'Malayalam'], availability: 93, slaHealth: 94, currentAssignment: 'Data Pipeline Engineering & Analytics Staging'
  },
  {
    id: 'RES-028', resourceId: 'RES-028', positionId: 'POS-028', name: 'Amira Hassan',
    track: 'AMS-OF-RUN', serviceDomain: 'Data, Analytics, AI, and Automation', processGroup: 'Intelligent Automation & RPA',
    nationality: 'Egyptian', resourceType: 'Expatriate', level: 'L2', roleType: 'Specialist',
    location: 'Offshore', onboardingDate: '2025-10-15', startDate: '2025-10-15', endDate: '2027-08-31',
    reportingManager: 'RES-012', manager: 'Lakshmi Devi', status: 'Active', gender: 'Female',
    skill: 'Robotic Process Automation (RPA), Power Automate & OCR Workflows',
    certification: 'UiPath Certified Advanced RPA Developer', phone: '+20-10XXX-1028', email: 'amira.h@kaartech.com',
    entity: 'ENT-001', role: 'RPA Developer', roleCode: 'RPA-DEV',
    towerId: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    experience: 8, relevantExperience: 6, employmentRelationship: 'Permanent',
    education: 'BSc Computer Science, Cairo University',
    professionalSummary: 'Automation developer deploying attended and unattended bots to eliminate manual data entry across procurement, finance, and logistics operations.',
    certifications: ['UiPath Certified Advanced RPA Developer', 'Microsoft Power Automate Certified'],
    technologies: ['UiPath Studio', 'Microsoft Power Automate', 'Python Scripting', 'Abbyy OCR', 'REST APIs'],
    comparableClientExperience: 'RPA Developer for Vodafone Egypt & Raya Holding.',
    keyAssignments: ['Automated Vendor Invoice Reconciliation Bot', 'Monthly SLA Data Extraction Bot'],
    languages: ['Arabic', 'English', 'French'], availability: 94, slaHealth: 95, currentAssignment: 'RPA & Workflow Automation Operations'
  },
  {
    id: 'RES-029', resourceId: 'RES-029', positionId: 'POS-029', name: 'Arjun Menon',
    track: 'AMS-OF-Flex', serviceDomain: 'Data, Analytics, AI, and Automation', processGroup: 'Artificial Intelligence & Machine Learning',
    nationality: 'Indian', resourceType: 'Expatriate', level: 'L2', roleType: 'Specialist',
    location: 'Offshore', onboardingDate: '2025-11-15', startDate: '2025-11-15', endDate: '2027-08-31',
    reportingManager: 'RES-012', manager: 'Lakshmi Devi', status: 'Active', gender: 'Male',
    skill: 'AI / LLM Integration, Semantic Vector Search & Machine Learning Models',
    certification: 'Microsoft Certified: Azure AI Engineer Associate', phone: '+91-98XXX-1029', email: 'arjun.m@kaartech.com',
    entity: 'ENT-001', role: 'AI Engineer', roleCode: 'AI-ENG',
    towerId: 'TWR-04', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation',
    experience: 6, relevantExperience: 4, employmentRelationship: 'Permanent',
    education: 'BTech Computer Science, National Institute of Technology Calicut',
    professionalSummary: 'Applied AI engineer designing retrieval-augmented generation (RAG) agents, semantic knowledge search, and predictive ticket categorization models.',
    certifications: ['Microsoft Certified: Azure AI Engineer Associate', 'TensorFlow Developer Certificate'],
    technologies: ['Python', 'OpenAI APIs', 'Azure AI Search', 'LangChain', 'Pinecone', 'FastAPI', 'PyTorch'],
    comparableClientExperience: 'Machine Learning Engineer at Mindtree & Mu Sigma Analytics.',
    keyAssignments: ['ITMS Knowledge Base Semantic RAG Search', 'Automated Predictive Ticket Categorization Model'],
    languages: ['English', 'Hindi', 'Malayalam'], availability: 93, slaHealth: 94, currentAssignment: 'AI Innovation & Applied Automation'
  },

  // ── 5. Architecture, Quality, and Testing (TWR-05) ──
  {
    id: 'RES-017', resourceId: 'RES-017', positionId: 'POS-017', name: 'Mariam Al Suwaidi',
    track: 'AMS-ON-RUN', serviceDomain: 'Architecture, Quality, and Testing', processGroup: 'Enterprise & Security Architecture',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L3', roleType: 'Specialist',
    location: 'Onsite', onboardingDate: '2025-09-01', startDate: '2025-09-01', endDate: '2027-08-31',
    reportingManager: 'RES-002', manager: 'Fatima Al-Otaibi', status: 'Active', gender: 'Female',
    skill: 'Enterprise Architecture, NCA ECC Compliance & Zero-Trust Security',
    certification: 'TOGAF 9.2 Certified & CISSP', phone: '+966-55-XXX-1017', email: 'mariam.s@kaartech.com',
    entity: 'ENT-001', role: 'Security Architect', roleCode: 'SEC-ARCH',
    towerId: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    experience: 14, relevantExperience: 12, employmentRelationship: 'Permanent',
    education: 'MSc Cybersecurity, King Abdulaziz University',
    professionalSummary: 'Chief security and architecture governance authority assuring all IT platforms comply with Saudi National Cybersecurity Authority (NCA ECC) standards.',
    certifications: ['CISSP', 'TOGAF 9.2 Certified', 'CISM', 'ISO 27001 Lead Implementer'],
    technologies: ['Threat Modeling', 'NCA Essential Cybersecurity Controls', 'Zero-Trust Architecture', 'SIEM / SOAR', 'Cloud Security'],
    comparableClientExperience: 'Cybersecurity Architect at National Cyber Security Center (NCSC) & Riyad Bank.',
    keyAssignments: ['NCA ECC Regulatory Compliance Verification', 'Multi-Tower Security Architecture Blueprint'],
    languages: ['Arabic', 'English'], availability: 98, slaHealth: 99, currentAssignment: 'Architecture Review & Security Compliance'
  },
  {
    id: 'RES-015', resourceId: 'RES-015', positionId: 'POS-015', name: 'Tariq Al Dhaheri',
    track: 'AMS-ON-RUN', serviceDomain: 'Architecture, Quality, and Testing', processGroup: 'Solution Architecture',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L3', roleType: 'Specialist',
    location: 'Onsite', onboardingDate: '2025-08-01', startDate: '2025-08-01', endDate: '2027-08-31',
    reportingManager: 'RES-017', manager: 'Mariam Al Suwaidi', status: 'Active', gender: 'Male',
    skill: 'High-Level Solution Architecture, Cross-Tower Governance & Technical Viability',
    certification: 'AWS Certified Solutions Architect - Professional', phone: '+966-55-XXX-1015', email: 'tariq.d@kaartech.com',
    entity: 'ENT-001', role: 'Solution Architect', roleCode: 'SOL-ARCH',
    towerId: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    experience: 12, relevantExperience: 10, employmentRelationship: 'Permanent',
    education: 'BSc Mechanical & Systems Engineering, KFUPM',
    professionalSummary: 'Solution architect conducting cross-domain technical reviews, evaluating change request feasibility, and ensuring system landscape integrity.',
    certifications: ['AWS Solutions Architect Professional', 'TOGAF 9.2 Foundation', 'ITIL v4 Specialist'],
    technologies: ['Microservices Patterns', 'Enterprise Systems Topology', 'API Architecture', 'Event-Driven Systems'],
    comparableClientExperience: 'Enterprise Solution Architect for Saudi Aramco Joint Ventures & SABIC.',
    keyAssignments: ['Cross-Tower Change Impact Analysis', 'Enterprise System Rationalization Strategy'],
    languages: ['Arabic', 'English'], availability: 96, slaHealth: 97, currentAssignment: 'Solution Architecture & Technical Review'
  },
  {
    id: 'RES-024', resourceId: 'RES-024', positionId: 'POS-024', name: 'Pooja Sharma',
    track: 'AMS-OF-RUN', serviceDomain: 'Architecture, Quality, and Testing', processGroup: 'Quality Assurance & Automated Testing',
    nationality: 'Indian', resourceType: 'Expatriate', level: 'L2', roleType: 'Specialist',
    location: 'Offshore', onboardingDate: '2025-10-15', startDate: '2025-10-15', endDate: '2027-08-31',
    reportingManager: 'RES-017', manager: 'Mariam Al Suwaidi', status: 'Active', gender: 'Female',
    skill: 'Automated Regression Testing, Playwright, Selenium & CI/CD Pipeline Gates',
    certification: 'ISTQB Advanced Test Automation Engineer', phone: '+91-98XXX-1024', email: 'pooja.s@kaartech.com',
    entity: 'ENT-003', role: 'Automation Test Engineer', roleCode: 'AUTO-TEST',
    towerId: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    experience: 8, relevantExperience: 6, employmentRelationship: 'Permanent',
    education: 'BTech Computer Engineering, Mumbai University',
    professionalSummary: 'Quality engineer engineering automated end-to-end regression suites, test coverage analytics, and continuous quality gates.',
    certifications: ['ISTQB Advanced Level Test Automation', 'Playwright Certified Professional'],
    technologies: ['Playwright', 'Selenium WebDriver', 'Cypress', 'Postman Automated Tests', 'Azure DevOps Test Plans'],
    comparableClientExperience: 'Automation QA Lead at Capgemini & Standard Chartered Global Business Services.',
    keyAssignments: ['Automated End-to-End Regression Test Suite (850 test cases)', 'API Performance Baseline Harness'],
    languages: ['English', 'Hindi', 'Marathi'], availability: 95, slaHealth: 96, currentAssignment: 'Automated Quality Assurance Engineering'
  },
  {
    id: 'RES-025', resourceId: 'RES-025', positionId: 'POS-025', name: 'Mansour Al Hosani',
    track: 'AMS-OF-RUN', serviceDomain: 'Architecture, Quality, and Testing', processGroup: 'Performance & Non-Functional Testing',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L2', roleType: 'Specialist',
    location: 'Offshore', onboardingDate: '2025-10-01', startDate: '2025-10-01', endDate: '2027-08-31',
    reportingManager: 'RES-017', manager: 'Mariam Al Suwaidi', status: 'Active', gender: 'Male',
    skill: 'LoadRunner / JMeter Stress Testing, APM Profiling & System Bottleneck Analysis',
    certification: 'LoadRunner Certified Professional', phone: '+966-55-XXX-1025', email: 'mansour.h@kaartech.com',
    entity: 'ENT-001', role: 'Performance Test Engineer', roleCode: 'PERF-TEST',
    towerId: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    experience: 10, relevantExperience: 8, employmentRelationship: 'Permanent',
    education: 'MSc Computer Science, King Fahd University of Petroleum & Minerals (KFUPM)',
    professionalSummary: 'Performance engineer validating application responsiveness under volumetric stress, concurrency spikes, and database transaction throughput.',
    certifications: ['LoadRunner Certified Professional', 'Dynatrace Certified Associate'],
    technologies: ['Apache JMeter', 'Micro Focus LoadRunner', 'Dynatrace', 'New Relic', 'SQL Profiler'],
    comparableClientExperience: 'Performance Test Lead for Saudi Ministry of Finance & Alinma Bank.',
    keyAssignments: ['Year-End Financial Closing Load Simulation', 'ERP High-Concurrency User Stress Benchmark'],
    languages: ['Arabic', 'English'], availability: 96, slaHealth: 97, currentAssignment: 'Performance Engineering & Load Testing'
  },
  {
    id: 'RES-030', resourceId: 'RES-030', positionId: 'POS-030', name: 'Layla Al Qassimi',
    track: 'AMS-ON-RUN', serviceDomain: 'Architecture, Quality, and Testing', processGroup: 'User Acceptance Testing & Change Enablement',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L1', roleType: 'Common',
    location: 'Onsite', onboardingDate: '2025-09-01', startDate: '2025-09-01', endDate: '2027-08-31',
    reportingManager: 'RES-017', manager: 'Mariam Al Suwaidi', status: 'Active', gender: 'Female',
    skill: 'UAT Script Authoring, Business Acceptance Sign-offs & Defect Traceability',
    certification: 'ISTQB Certified Tester Foundation Level (CTFL)', phone: '+966-55-XXX-1030', email: 'layla.q@kaartech.com',
    entity: 'ENT-001', role: 'UAT Analyst', roleCode: 'UAT-ANL',
    towerId: 'TWR-05', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing',
    experience: 5, relevantExperience: 4, employmentRelationship: 'Permanent',
    education: 'BSc Information Systems, Taibah University',
    professionalSummary: 'User acceptance testing specialist facilitating business superuser test cycles, test data preparation, and change release readiness.',
    certifications: ['ISTQB Foundation (CTFL)', 'Certified Scrum Master (CSM)'],
    technologies: ['Jira Software', 'Azure DevOps', 'Confluence', 'Excel Test Matrices', 'SharePoint'],
    comparableClientExperience: 'UAT Coordinator at Saudi Arabian Airlines (Saudia) & MedNet.',
    keyAssignments: ['Business Superuser UAT Coordination for Release R2026.3', 'Defect Triage & Verification'],
    languages: ['Arabic', 'English'], availability: 98, slaHealth: 98, currentAssignment: 'UAT Coordination & Release Readiness'
  },

  // ── 6. SAP ERP and SuccessFactors (TWR-06) ──
  {
    id: 'RES-001', resourceId: 'RES-001', positionId: 'POS-001', name: 'Khalid Al Hashimi',
    track: 'AMS-ON-RUN', serviceDomain: 'SAP ERP and SuccessFactors', processGroup: 'Sales & Distribution',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L3', roleType: 'Common',
    location: 'Onsite', onboardingDate: '2025-09-15', startDate: '2025-09-15', endDate: '2027-08-31',
    reportingManager: 'RES-002', manager: 'Fatima Al-Otaibi', status: 'Active', gender: 'Male',
    skill: 'SAP SD, S/4HANA Sales Order Processing, Pricing & Output Management',
    certification: 'SAP Certified Application Associate - SAP S/4HANA Sales', phone: '+966-55-XXX-1001', email: 'khalid.h@kaartech.com',
    entity: 'ENT-001', role: 'Functional Consultant', roleCode: 'FC-SD',
    towerId: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    experience: 10, relevantExperience: 8, employmentRelationship: 'Permanent',
    education: 'BSc Computer Science, King Saud University',
    professionalSummary: 'Principal SAP SD functional consultant with deep expertise in Lead-to-Cash processes, complex pricing conditions, billing routines, and Fiori apps.',
    certifications: ['SAP S/4HANA Sales', 'SAP Certified Application Associate'],
    technologies: ['SAP SD', 'S/4HANA 2025', 'SAP Fiori', 'SAP CPI', 'SAP BRF+'],
    comparableClientExperience: 'Lead SAP SD Consultant for Saudi Basic Industries Corporation (SABIC) & Tasnee.',
    keyAssignments: ['Sales & Order Management Process Streamlining', 'Automated Pricing Procedure Reconfiguration'],
    languages: ['Arabic', 'English'], availability: 96, slaHealth: 98, currentAssignment: 'SAP SD AMS Functional Operations'
  },
  {
    id: 'RES-003', resourceId: 'RES-003', positionId: 'POS-003', name: 'Ravi Shankar',
    track: 'AMS-OF-RUN', serviceDomain: 'SAP ERP and SuccessFactors', processGroup: 'Procurement & Sourcing',
    nationality: 'Indian', resourceType: 'Expatriate', level: 'L2', roleType: 'Common',
    location: 'Offshore', onboardingDate: '2025-10-01', startDate: '2025-10-01', endDate: '2027-08-31',
    reportingManager: 'RES-002', manager: 'Fatima Al-Otaibi', status: 'Active', gender: 'Male',
    skill: 'SAP MM, S/4HANA Sourcing & Procurement, Inventory & Account Determination',
    certification: 'SAP Certified Application Associate - SAP S/4HANA Sourcing & Procurement', phone: '+91-98XXX-1003', email: 'ravi.s@kaartech.com',
    entity: 'ENT-001', role: 'Functional Consultant', roleCode: 'FC-MM',
    towerId: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    experience: 11, relevantExperience: 9, employmentRelationship: 'Permanent',
    education: 'BTech IT, IIT Madras',
    professionalSummary: 'Senior SAP MM consultant specializing in source-to-pay procurement workflows, material valuation, inventory management, and integration with Ariba.',
    certifications: ['SAP S/4HANA Sourcing & Procurement', 'SAP Certified Associate MM'],
    technologies: ['SAP MM', 'S/4HANA', 'SAP Ariba', 'SAP SRM', 'LSMW / Migration Cockpit'],
    comparableClientExperience: 'SAP MM Lead at Larsen & Toubro & Bapco Bahrain.',
    keyAssignments: ['Procurement & Purchase Order Release Workflow', 'Material Master Governance & Data Cleansing'],
    languages: ['English', 'Hindi', 'Tamil'], availability: 95, slaHealth: 96, currentAssignment: 'SAP MM AMS Functional Operations'
  },
  {
    id: 'RES-004', resourceId: 'RES-004', positionId: 'POS-004', name: 'Sara Al Marzouqi',
    track: 'AMS-ON-RUN', serviceDomain: 'SAP ERP and SuccessFactors', processGroup: 'Core HR & Talent Management',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L2', roleType: 'Specialist',
    location: 'Onsite', onboardingDate: '2025-09-01', startDate: '2025-09-01', endDate: '2027-08-31',
    reportingManager: 'RES-002', manager: 'Fatima Al-Otaibi', status: 'Active', gender: 'Female',
    skill: 'SAP SuccessFactors Employee Central, Compensation, Recruiting & Onboarding',
    certification: 'SAP Certified Application Associate - SAP SuccessFactors Employee Central', phone: '+966-55-XXX-1004', email: 'sara.m@kaartech.com',
    entity: 'ENT-001', role: 'SuccessFactors Consultant', roleCode: 'FC-SF',
    towerId: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    experience: 8, relevantExperience: 6, employmentRelationship: 'Permanent',
    education: 'BSc Information Systems, King Abdulaziz University',
    professionalSummary: 'SuccessFactors consultant configuring core human capital models, role-based permissions, business rules engine, and Saudi labor law compliance.',
    certifications: ['SF Employee Central Certified', 'SF Recruiting Certified', 'ITIL v4 Foundation'],
    technologies: ['SAP SuccessFactors HXM', 'SAP BTP', 'SAP CPI', 'Qualtrics Employee Experience'],
    comparableClientExperience: 'SuccessFactors Lead at Almarai & Saudi Arabian Mining Company.',
    keyAssignments: ['Enterprise Succession & Appraisal Cycle Configuration', 'Saudi Labor Law EC Rulebook Update'],
    languages: ['Arabic', 'English'], availability: 97, slaHealth: 97, currentAssignment: 'SuccessFactors AMS Operations'
  },
  {
    id: 'RES-005', resourceId: 'RES-005', positionId: 'POS-005', name: 'Priya Nair',
    track: 'AMS-OF-RUN', serviceDomain: 'SAP ERP and SuccessFactors', processGroup: 'Manufacturing & Quality',
    nationality: 'Indian', resourceType: 'Expatriate', level: 'L2', roleType: 'Common',
    location: 'Offshore', onboardingDate: '2025-10-15', startDate: '2025-10-15', endDate: '2027-08-31',
    reportingManager: 'RES-002', manager: 'Fatima Al-Otaibi', status: 'Active', gender: 'Female',
    skill: 'SAP PP, S/4HANA Manufacturing, Quality Management (QM) & MES Integration',
    certification: 'SAP Certified Application Associate - SAP S/4HANA Manufacturing', phone: '+91-98XXX-1005', email: 'priya.n@kaartech.com',
    entity: 'ENT-031', role: 'Functional Consultant', roleCode: 'FC-PP',
    towerId: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    experience: 10, relevantExperience: 8, employmentRelationship: 'Permanent',
    education: 'MTech Industrial Engineering, NIT Calicut',
    professionalSummary: 'Industrial SAP consultant specializing in production planning, bill of materials management, capacity leveling, and shop-floor MES integration.',
    certifications: ['SAP S/4HANA Manufacturing', 'SAP QM Certified', 'Six Sigma Green Belt'],
    technologies: ['SAP PP', 'SAP QM', 'SAP MES/MII', 'S/4HANA', 'MRP Live'],
    comparableClientExperience: 'Senior SAP PP/QM Consultant for Tata Motors & Jindal Steel.',
    keyAssignments: ['Discrete Manufacturing Plant Integration', 'Quality Inspection Lot Automation'],
    languages: ['English', 'Hindi', 'Malayalam'], availability: 94, slaHealth: 95, currentAssignment: 'SAP PP/QM Manufacturing AMS Operations'
  },
  {
    id: 'RES-006', resourceId: 'RES-006', positionId: 'POS-006', name: 'Omar Bashar',
    track: 'AMS-ON-RUN', serviceDomain: 'SAP ERP and SuccessFactors', processGroup: 'Warehouse & Logistics',
    nationality: 'Jordanian', resourceType: 'Expatriate', level: 'L2', roleType: 'Specialist',
    location: 'Onsite', onboardingDate: '2025-09-15', startDate: '2025-09-15', endDate: '2027-08-31',
    reportingManager: 'RES-002', manager: 'Fatima Al-Otaibi', status: 'Active', gender: 'Male',
    skill: 'SAP Extended Warehouse Management (EWM), Transportation Management (TM) & RF Framework',
    certification: 'SAP Certified Application Associate - Extended Warehouse Management', phone: '+966-55-XXX-1006', email: 'omar.b@kaartech.com',
    entity: 'ENT-001', role: 'Functional Consultant', roleCode: 'FC-EWM',
    towerId: 'TWR-06', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors',
    experience: 12, relevantExperience: 10, employmentRelationship: 'Permanent',
    education: 'BSc Logistics & Supply Chain, University of Jordan',
    professionalSummary: 'Logistics and warehouse consultant with deep expertise in automated multi-tier distribution centers, RF gun scanner integration, and freight forwarding.',
    certifications: ['SAP EWM Certified', 'SAP TM Certified', 'APICS CSCP'],
    technologies: ['SAP EWM', 'SAP TM', 'S/4HANA Logistics', 'SAP Fiori Warehouse', 'Barcoding Systems'],
    comparableClientExperience: 'Lead EWM Consultant for Agility Logistics & Savola Group.',
    keyAssignments: ['Central Logistics Distribution Center Go-Live', 'RF Gun Automated Putaway & Picking'],
    languages: ['Arabic', 'English'], availability: 96, slaHealth: 97, currentAssignment: 'D2S Warehouse AMS Operations'
  },

  // ── 7. Service Management, Governance, and Delivery (TWR-07) ──
  {
    id: 'RES-002', resourceId: 'RES-002', positionId: 'POS-002', name: 'Fatima Al-Otaibi',
    track: 'AMS-ON-RUN', serviceDomain: 'Service Management, Governance, and Delivery', processGroup: 'Service Delivery Leadership',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L3', roleType: 'Specialist',
    location: 'Onsite', onboardingDate: '2025-08-01', startDate: '2025-08-01', endDate: '2027-08-31',
    reportingManager: null, manager: 'Dr. Tariq Al Nuaimi', status: 'Active', gender: 'Female',
    skill: 'Contractual SLA Governance, ITIL Service Delivery & Cross-Domain Operations',
    certification: 'PMP & ITIL v4 Strategic Leader', phone: '+966-55-XXX-1002', email: 'fatima.z@kaartech.com',
    entity: 'ENT-001', role: 'Service Delivery Manager', roleCode: 'SDM',
    towerId: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    experience: 15, relevantExperience: 13, employmentRelationship: 'Permanent',
    education: 'MBA Technology Management, Princess Nourah University',
    professionalSummary: 'Principal delivery authority directing contractual SLA adherence across all 7 Service Domains, chairing SteerCom reviews, and managing 35 operational resources.',
    certifications: ['PMP', 'ITIL v4 Strategic Leader', 'SAP S/4HANA Finance Certified'],
    technologies: ['ITIL 4 Framework', 'Contractual SLA Governance', 'ServiceNow Performance Analytics', 'Executive SteerCom Reporting'],
    comparableClientExperience: 'Service Delivery Lead at Saudi Telecom (stc) Enterprise & Ministry of Communications.',
    keyAssignments: ['Overall AMS Delivery Program Leadership', 'SLA Governance Framework Implementation', 'SteerCom Executive Reporting'],
    languages: ['Arabic', 'English', 'French'], availability: 98, slaHealth: 99, currentAssignment: 'AMS Program Delivery Lead'
  },
  {
    id: 'RES-007', resourceId: 'RES-007', positionId: 'POS-007', name: 'Deepak Kumar',
    track: 'AMS-OF-RUN', serviceDomain: 'Service Management, Governance, and Delivery', processGroup: 'Incident & Problem Management',
    nationality: 'Indian', resourceType: 'Expatriate', level: 'L2', roleType: 'Common',
    location: 'Offshore', onboardingDate: '2025-10-01', startDate: '2025-10-01', endDate: '2027-08-31',
    reportingManager: 'RES-002', manager: 'Fatima Al-Otaibi', status: 'Active', gender: 'Male',
    skill: 'Major Incident Management (MIM), Root Cause Analysis & KEDB Governance',
    certification: 'ITIL v4 Specialist: Incident Management', phone: '+91-98XXX-1007', email: 'deepak.k@kaartech.com',
    entity: 'ENT-001', role: 'Incident Manager', roleCode: 'INC-MGR',
    towerId: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    experience: 9, relevantExperience: 7, employmentRelationship: 'Permanent',
    education: 'BCom & Diploma in IT Service Management, Mumbai University',
    professionalSummary: 'Operational incident manager leading critical Priority 1 bridges, coordinating cross-tower resolution squads, and ensuring post-incident reviews.',
    certifications: ['ITIL v4 Specialist', 'Six Sigma Green Belt'],
    technologies: ['ServiceNow Incident & Problem Modules', 'MIM Conference Bridges', 'Post-Incident Review (PIR)', 'KEDB'],
    comparableClientExperience: 'Incident Manager for Infosys Global Delivery & British Telecom.',
    keyAssignments: ['Priority 1 Escalation Protocol Implementation', 'Zero-Recurrence Problem Management Campaign'],
    languages: ['English', 'Hindi', 'Marathi'], availability: 95, slaHealth: 96, currentAssignment: 'Incident & Problem Governance'
  },
  {
    id: 'RES-008', resourceId: 'RES-008', positionId: 'POS-008', name: 'Noura Al Shamsi',
    track: 'AMS-ON-RUN', serviceDomain: 'Service Management, Governance, and Delivery', processGroup: 'Risk, Audit & Compliance',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L2', roleType: 'Specialist',
    location: 'Onsite', onboardingDate: '2025-08-15', startDate: '2025-08-15', endDate: '2027-08-31',
    reportingManager: 'RES-002', manager: 'Fatima Al-Otaibi', status: 'Active', gender: 'Female',
    skill: 'IT Risk Management, ISO 20000 / ISO 27001 Auditing & CAPA Execution',
    certification: 'CRISC & ISO 27001 Lead Auditor', phone: '+966-55-XXX-1008', email: 'noura.s@kaartech.com',
    entity: 'ENT-001', role: 'Risk & Compliance Analyst', roleCode: 'RC-ANL',
    towerId: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    experience: 7, relevantExperience: 5, employmentRelationship: 'Permanent',
    education: 'BSc Business Administration & Compliance, Alfaisal University',
    professionalSummary: 'Governance analyst maintaining operational risk registers, tracking corrective and preventive actions (CAPA), and executing internal service audits.',
    certifications: ['CRISC', 'ISO 27001 Lead Auditor', 'ITIL v4 Foundation'],
    technologies: ['Enterprise Risk Register', 'Audit Management Tools', 'Compliance Scorecards', 'Excel Advanced Modeling'],
    comparableClientExperience: 'IT Compliance Analyst at Riyadh Bank & BAE Systems Saudi Arabia.',
    keyAssignments: ['Quarterly ITMS Compliance Audits', 'Disaster Recovery Readiness Audit Defense'],
    languages: ['Arabic', 'English'], availability: 97, slaHealth: 98, currentAssignment: 'Risk, Audit & Governance Operations'
  },
  {
    id: 'RES-010', resourceId: 'RES-010', positionId: 'POS-010', name: 'Aisha Khalfan',
    track: 'AMS-ON-RUN', serviceDomain: 'Service Management, Governance, and Delivery', processGroup: 'PMO & Performance Reporting',
    nationality: 'Saudi Arabia', resourceType: 'Saudi', level: 'L2', roleType: 'Common',
    location: 'Onsite', onboardingDate: '2025-09-01', startDate: '2025-09-01', endDate: '2027-08-31',
    reportingManager: 'RES-002', manager: 'Fatima Al-Otaibi', status: 'Active', gender: 'Female',
    skill: 'Project Tracking, Resource Capacity Planning & Monthly SLA Pack Generation',
    certification: 'CAPM (Certified Associate in Project Management)', phone: '+966-55-XXX-1010', email: 'aisha.k@kaartech.com',
    entity: 'ENT-001', role: 'PMO Analyst', roleCode: 'PMO-ANL',
    towerId: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    experience: 6, relevantExperience: 4, employmentRelationship: 'Permanent',
    education: 'BSc Information Technology, Princess Nourah University',
    professionalSummary: 'PMO analyst tracking enhancement sprint deliveries, resource allocation levels, milestone completion rates, and monthly client reporting packs.',
    certifications: ['CAPM', 'ITIL v4 Foundation'],
    technologies: ['Microsoft Project', 'Jira Align', 'Power BI Reporting Packs', 'SharePoint Document Control'],
    comparableClientExperience: 'PMO Coordinator for Elm Information Security & Riyadh Development Authority.',
    keyAssignments: ['Monthly SLA Performance Reporting Pack Automation', 'Enhancement CR Delivery Tracking'],
    languages: ['Arabic', 'English'], availability: 98, slaHealth: 98, currentAssignment: 'PMO & Capacity Planning Operations'
  },
  {
    id: 'RES-016', resourceId: 'RES-016', positionId: 'POS-016', name: 'Raj Malhotra',
    track: 'AMS-OF-RUN', serviceDomain: 'Service Management, Governance, and Delivery', processGroup: 'Vendor & Contract Governance',
    nationality: 'Indian', resourceType: 'Expatriate', level: 'L3', roleType: 'Specialist',
    location: 'Offshore', onboardingDate: '2025-10-15', startDate: '2025-10-15', endDate: '2027-08-31',
    reportingManager: 'RES-002', manager: 'Fatima Al-Otaibi', status: 'Active', gender: 'Male',
    skill: 'Third-Party Underpinning Contracts, OEM SLA Benchmarking & Vendor Audits',
    certification: 'Certified Outsourcing Professional (COP)', phone: '+91-98XXX-1016', email: 'raj.m@kaartech.com',
    entity: 'ENT-001', role: 'Vendor Manager', roleCode: 'VND-MGR',
    towerId: 'TWR-07', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery',
    experience: 11, relevantExperience: 9, employmentRelationship: 'Permanent',
    education: 'MBA Operations, IIM Lucknow',
    professionalSummary: 'Vendor governance manager ensuring OEM commitments from SAP, Microsoft, and hardware providers align with prime contract SLAs.',
    certifications: ['Certified Outsourcing Professional', 'ITIL v4 Managing Professional'],
    technologies: ['Vendor Performance Scorecards', 'Contract Compliance Matrices', 'ServiceNow Vendor Manager Workspace'],
    comparableClientExperience: 'Vendor Relationship Lead for HCL Technologies & STC Saudi Arabia.',
    keyAssignments: ['OEM Escalation Governance Framework', 'Annual Third-Party License & Support Audit'],
    languages: ['English', 'Hindi', 'Punjabi'], availability: 95, slaHealth: 96, currentAssignment: 'Vendor & Underpinning Contract Governance'
  }
];
// ═══════════════════════════════════════════════════
// INCIDENTS — DEMO
// ═══════════════════════════════════════════════════
const incidentStatuses = ['New', 'In Progress', 'Awaiting Info', 'Resolved', 'Closed'];
const priorities = ['P1', 'P2', 'P3', 'P4'];

function generateIncidents() {
  const incidents = [];

  for (let i = 1; i <= 90; i++) {
    const priority = (i % 18 === 1) ? 'P1' : (i % 8 === 2 || i % 8 === 5) ? 'P2' : (i % 2 === 0) ? 'P3' : 'P4';
    const statusIdx = i <= 15 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 5);
    const status = incidentStatuses[statusIdx];
    const resource = RESOURCES[i % RESOURCES.length];
    const resolver = RESOURCES[(i + 5) % RESOURCES.length];
    const entity = ENTITIES[i % ENTITIES.length];
    const app = APPLICATIONS[i % 26];
    const domain = SERVICE_DOMAINS[i % SERVICE_DOMAINS.length];
    
    // Spread evenly across months 0 (Jan) through 8 (Sep) of 2026
    const monthIdx = (i - 1) % 9;
    const day = 1 + ((i * 3) % 27);
    const created = new Date(2026, monthIdx, day, 8 + (i % 9), (i * 7) % 60);

    const responseSlaStatus = Math.random() > 0.08 ? 'Met' : 'Breached';
    const resolutionSlaStatus = status === 'Closed' || status === 'Resolved'
      ? ((priority === 'P1' && i === 19) ? 'Breached' : Math.random() > 0.06 ? 'Met' : 'Breached')
      : (Math.random() > 0.15 ? 'On Track' : 'At Risk');

    incidents.push({
      id: `INC-${String(i).padStart(5, '0')}`,
      priority,
      shortDescription: getIncidentDescription(i, domain.code || domain.shortCode || 'ERP'),
      serviceDomainId: resolver.serviceDomainId || app.serviceDomainId || 'TWR-01',
      serviceDomain: resolver.serviceDomain || app.serviceDomain || 'IT Helpdesk & End User Services',
      serviceDomain: domain.name,
      processGroup: resource.processGroup,
      status,
      raisedBy: resource.name,
      assignedTo: resolver.name,
      assignedToId: resolver.id,
      resolverTier: i <= 10 ? 'L2' : i <= 25 ? 'L1.5' : 'L1',
      resolverGroup: RESOLVER_GROUPS[i % 3].label,
      problemTicket: i <= 5 ? `PRB-${String(i).padStart(5, '0')}` : null,
      crNo: i <= 3 ? `CR-${String(i).padStart(4, '0')}` : null,
      responseSla: responseSlaStatus,
      resolutionSla: resolutionSlaStatus,
      slaStatus: resolutionSlaStatus === 'Breached' || responseSlaStatus === 'Breached' ? 'Breached' : resolutionSlaStatus,
      timeRemaining: status === 'Closed' ? null : `${Math.floor(Math.random() * 48)}h ${Math.floor(Math.random() * 60)}m`,
      createdDate: created.toISOString().split('T')[0],
      entity: entity.name,
      entityId: entity.id,
      application: app.name,
      applicationId: app.id,
      // IRT/MPT/APT fields (Section 26)
      irtTimestamp: created.toISOString(),
      mptTimestamp: new Date(created.getTime() + Math.floor(Math.random() * 3600000)).toISOString(),
      aptTimestamp: new Date(created.getTime() + Math.floor(Math.random() * 7200000)).toISOString(),
      classification: 'DEMO',
    });
  }
  return incidents;
}

function getIncidentDescription(i, domainCode) {
  const descriptions = {
    EUS: ['VIP user workstation boot failure', 'Outlook modern authentication failure', 'VPN multi-factor authentication token expired', 'Endpoint security agent synchronization error', 'Local print queue spooler service crashed'],
    ICP: ['Azure VM CPU throttle threshold exceeded', 'Core switch SD-WAN link flap detected', 'Storage volume IOPS degradation alert', 'Datacenter backup replication job timeout', 'Linux kernel memory panic on host node'],
    ADI: ['ServiceNow API gateway connection timeout', 'Customer portal SSO handshake failure', 'Enterprise webhook payload delivery failed', 'Mobile app session termination issue', 'Custom integration middleware broker blocked'],
    DAA: ['PowerBI gateway refresh timeout', 'SAP Analytics Cloud model data load error', 'ETL pipeline schema validation failure', 'RPA bot worker node unresponsive', 'Data warehouse partition lock collision'],
    AQT: ['Automated regression test suite failed', 'SonarQube quality gate threshold breach', 'UAT environment test data provisioning error', 'Performance test latency regression detected', 'Security vulnerability scan report failed gate'],
    ERP: ['SAP S/4HANA sales order pricing error', 'Production order scheduling calculation failure', 'Purchase requisition release workflow stuck', 'SuccessFactors employee replication mismatch', 'General ledger intercompany settlement variance'],
    SMG: ['SLA escalation threshold reached on P2 ticket', 'Change Advisory Board emergency request review', 'Service desk shift handover log unassigned', 'Configuration item CMDB relationship orphaned', 'Major incident communication broadcast delay'],
  };
  const domainDescs = descriptions[domainCode] || descriptions.ERP;
  return domainDescs[i % domainDescs.length];
}

// ═══════════════════════════════════════════════════
// SERVICE REQUESTS — DEMO
// ═══════════════════════════════════════════════════
function generateServiceRequests() {
  const srs = [];
  const categories = ['Configuration', 'Access Management', 'Report Customization', 'Data Correction', 'Training Support', 'Documentation', 'Enhancement Query'];
  const srStatuses = ['New', 'In Progress', 'Awaiting Info', 'Resolved', 'Closed', 'Rejected'];

  for (let i = 1; i <= 40; i++) {
    const hours = Math.floor(Math.random() * 30) + 1;
    // CONFIGURABLE — SR effort classification (Section 21)
    // Default: >=16 = Major (more conservative reading). See config.js for threshold.
    const srType = hours >= 16 ? 'Major' : 'Standard';
    const resource = RESOURCES[i % RESOURCES.length];
    const resolver = RESOURCES[(i + 3) % RESOURCES.length];
    const domain = SERVICE_DOMAINS[i % SERVICE_DOMAINS.length];
    const monthIdx = (i - 1) % 9;
    const day = 1 + ((i * 4) % 27);
    const created = new Date(2026, monthIdx, day, 9 + (i % 8), (i * 11) % 60);

    srs.push({
      id: `SR-${String(i).padStart(5, '0')}`,
      priority: srType === 'Major' ? 'High' : 'Standard',
      shortDescription: getSRDescription(i, domain.key),
      serviceDomainId: resolver.serviceDomainId || app.serviceDomainId || 'TWR-01',
      serviceDomain: resolver.serviceDomain || app.serviceDomain || 'IT Helpdesk & End User Services',
      serviceDomain: domain.name,
      processGroup: resource.processGroup,
      status: srStatuses[i % srStatuses.length],
      raisedBy: resource.name,
      assignedTo: resolver.name,
      assignedToId: resolver.id,
      category: categories[i % categories.length],
      timeCountHrs: hours,
      resolverTier: 'L1.5',
      resolverGroup: RESOLVER_GROUPS[0].label,
      responseSla: Math.random() > 0.1 ? 'Met' : 'Breached',
      resolutionSla: Math.random() > 0.1 ? 'Met' : 'Breached',
      slaStatus: Math.random() > 0.15 ? 'Met' : 'Breached',
      srType,
      createdDate: created.toISOString().split('T')[0],
      entity: ENTITIES[i % ENTITIES.length].name,
      application: APPLICATIONS[i % 26].name,
      classification: 'DEMO',
    });
  }
  return srs;
}

function getSRDescription(i, domain) {
  const descriptions = [
    'Configure new approval workflow', 'Grant SAP role access for new user',
    'Create custom ALV report', 'Correct master data entry error',
    'Provide end-user training session', 'Update process documentation',
    'New output format configuration', 'Authorization profile adjustment',
    'Custom Fiori app tile configuration', 'Transport request review and release',
  ];
  return descriptions[i % descriptions.length];
}

// ═══════════════════════════════════════════════════
// ENHANCEMENTS — DEMO
// ═══════════════════════════════════════════════════
function generateEnhancements() {
  const enhancements = [];
  const enhStatuses = ['Draft', 'Under Review', 'Approved', 'In Development', 'Testing', 'Deployed', 'Closed'];

  for (let i = 1; i <= 25; i++) {
    const assigned = RESOURCES[(i + 7) % RESOURCES.length];
    const app = APPLICATIONS[(i + 4) % 26];
    const hours = 32 + Math.floor(Math.random() * 120);
    /**
     * CONFIGURABLE / DEMO — Minor vs Major Enhancement category.
     * Source does NOT define classification rule (Section 22).
     * Demo default: <=80h = Minor, >80h = Major.
     */
    const category = hours <= 80 ? 'Minor' : 'Major';
    const resource = RESOURCES[i % RESOURCES.length];
    const domain = SERVICE_DOMAINS[i % SERVICE_DOMAINS.length];
    const monthIdx = (i - 1) % 9;
    const day = 1 + ((i * 5) % 27);
    const created = new Date(2026, monthIdx, day, 11 + (i % 6), (i * 13) % 60);

    const sDomain = SERVICE_DOMAINS[(i - 1) % SERVICE_DOMAINS.length];

    enhancements.push({
      id: `ENH-${String(i).padStart(5, '0')}`,
      priority: category === 'Major' ? 'High' : 'Medium',
      shortDescription: getEnhDescription(i),
      serviceDomainId: sDomain.id,
      serviceDomain: sDomain.name,
      serviceDomain: domain.name,
      processGroup: resource.processGroup,
      status: enhStatuses[i % enhStatuses.length],
      raisedBy: resource.name,
      assignedTo: RESOURCES[(i + 7) % RESOURCES.length].name,
      assignedToId: RESOURCES[(i + 7) % RESOURCES.length].id,
      category,
      timeCountHrs: hours,
      resolverTier: 'L3',
      resolverGroup: RESOLVER_GROUPS[0].label,
      governanceStatus: i % 3 === 0 ? 'Approved' : i % 3 === 1 ? 'Pending' : 'Under Review',
      createdDate: created.toISOString().split('T')[0],
      entity: ENTITIES[i % ENTITIES.length].name,
      application: APPLICATIONS[i % 26].name,
      classification: 'DEMO',
    });
  }
  return enhancements;
}

function getEnhDescription(i) {
  const descriptions = [
    'Automated invoice matching workflow', 'Custom dashboard for plant managers',
    'Enhanced approval matrix with delegation', 'Fiori launchpad custom tile development',
    'Integration with third-party logistics API', 'Automated report scheduling and distribution',
    'Custom pricing condition type implementation', 'BTP workflow for capital approval',
    'MES shopfloor data collection enhancement', 'Automated intercompany reconciliation tool',
  ];
  return descriptions[i % descriptions.length];
}

// ═══════════════════════════════════════════════════
// PROBLEMS — DEMO
// ═══════════════════════════════════════════════════
function generateProblems() {
  const problems = [];
  const prbStatuses = ['Open', 'In Progress', 'Root Cause Identified', 'Corrective Action', 'Closed'];

  for (let i = 1; i <= 20; i++) {
    const resource = RESOURCES[i % RESOURCES.length];
    const domain = SERVICE_DOMAINS[i % SERVICE_DOMAINS.length];
    const app = APPLICATIONS[i % 26];
    const status = prbStatuses[(i - 1) % prbStatuses.length];
    const created = new Date('2026-05-15');
    created.setDate(created.getDate() + Math.floor(Math.random() * 100));

    // Coherent RCA and lifecycle states (Section 17, 45)
    let rcaStatus = 'Not Started';
    let rootCause = null;
    let correctiveAction = null;
    let preventiveAction = null;
    let kedbArticle = null;

    if (status === 'Closed') {
      rcaStatus = 'Delivered';
      rootCause = `Root cause analysis completed. Issue traced to ${['configuration drift in batch posting rules', 'data migration residual table lock', 'RFC integration timeout between SAP and MES', 'authorization role conflict post-patch'][i % 4]}.`;
      correctiveAction = 'Permanent ABAP code remediation deployed and verified in production.';
      preventiveAction = 'Automated health daemon probe added to monitoring suite for zero recurrence.';
      kedbArticle = `KEDB-${String(i).padStart(5, '0')}`;
    } else if (status === 'Corrective Action') {
      rcaStatus = 'Delivered';
      rootCause = `Root cause identified as ${['deadlock on transactional queue table', 'missing indexing on custom query', 'stale RFC destination credential'][i % 3]}.`;
      correctiveAction = 'Code fix undergoing CAB review and staging validation.';
      preventiveAction = 'Standard operating procedure updated in Knowledge Base.';
      kedbArticle = `KEDB-${String(i).padStart(5, '0')}`;
    } else if (status === 'Root Cause Identified') {
      rcaStatus = 'Delivered';
      rootCause = `5-Why investigation completed. Underlying issue diagnosed in ${domain.label} core schema.`;
      correctiveAction = 'Corrective action plan drafted for CAB sign-off.';
      kedbArticle = `KEDB-${String(i).padStart(5, '0')}`;
    } else if (status === 'In Progress') {
      rcaStatus = 'Pending';
      rootCause = null;
    } else {
      rcaStatus = 'Not Started';
      rootCause = null;
    }

    const linkedIncidents = [`INC-${String(i).padStart(5, '0')}`, `INC-${String(i + 1).padStart(5, '0')}`];

    const sDomain = SERVICE_DOMAINS[(i - 1) % SERVICE_DOMAINS.length];

    problems.push({
      id: `PRB-${String(i).padStart(5, '0')}`,
      shortDescription: getProblemDescription(i),
      serviceDomainId: sDomain.id,
      serviceDomain: sDomain.name,
      serviceDomain: domain.name,
      processGroup: resource.processGroup,
      status,
      createdBy: resource.name,
      assignedTo: RESOURCES[(i + 4) % RESOURCES.length].name,
      incidentIds: linkedIncidents,
      linkedIncidents,
      application: app.name,
      applicationId: app.id,
      crId: i <= 8 ? `CR-${String(i).padStart(4, '0')}` : null,
      rcaId: rcaStatus === 'Delivered' ? `RCA-${String(i).padStart(4, '0')}` : null,
      rcaStatus,
      kedbArticle,
      timeCount: Math.floor(Math.random() * 40) + 8,
      createdDate: created.toISOString().split('T')[0],
      description: `Recurring defect pattern identified across linked incidents in ${domain.label} domain.`,
      rootCause,
      correctiveAction,
      preventiveAction,
      targetDate: new Date(created.getTime() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      classification: 'DEMO',
    });
  }
  return problems;
}

function getProblemDescription(i) {
  const descriptions = [
    'Recurring period-end posting failure pattern',
    'Intermittent MES interface synchronization loss',
    'Systematic invoice matching discrepancy',
    'Recurring authorization check failures post-migration',
    'Chronic EWM confirmation timeout under load',
    'Persistent BW data load scheduling conflict',
    'Repeated workflow notification delivery failure',
    'Recurring transport import sequence errors',
  ];
  return descriptions[i % descriptions.length];
}

// ═══════════════════════════════════════════════════
// RISKS — DEMO
// ═══════════════════════════════════════════════════
function generateRisks() {
  const risks = [];
  const riskStatuses = ['Open', 'Mitigating', 'Monitoring', 'Closed', 'Escalated'];
  const riskCategories = ['Avoid', 'Mitigate', 'Transfer', 'Accept', 'Escalate'];
  const impacts = ['Critical', 'High', 'Medium', 'Low'];
  const likelihoods = ['Very Likely', 'Likely', 'Possible', 'Unlikely', 'Rare'];

  for (let i = 1; i <= 22; i++) {
    const resource = RESOURCES[i % RESOURCES.length];
    const domain = SERVICE_DOMAINS[i % SERVICE_DOMAINS.length];

    risks.push({
      id: `RSK-${String(i).padStart(4, '0')}`,
      title: getRiskTitle(i),
      description: `Risk identified in ${domain.label} domain requiring attention.`,
      serviceDomainId: resource.serviceDomainId || 'TWR-07',
      serviceDomain: resource.serviceDomain || 'Service Management, Governance, and Delivery',
      serviceDomain: domain.name,
      owner: resource.name,
      ownerId: resource.id,
      impact: impacts[i % impacts.length],
      likelihood: likelihoods[i % likelihoods.length],
      // "Risk Response Category" — exact field name per Section 35
      riskResponseCategory: riskCategories[i % riskCategories.length],
      status: riskStatuses[i % riskStatuses.length],
      raisedDate: new Date(2026, 4 + (i % 4), 1 + (i % 28)).toISOString().split('T')[0],
      dueDate: new Date(2026, 7 + (i % 3), 1 + (i % 28)).toISOString().split('T')[0],
      ctaId: i <= 10 ? `CTA-${String(i).padStart(4, '0')}` : null,
      findingId: i <= 8 ? `FND-${String(i).padStart(4, '0')}` : null,
      entity: ENTITIES[i % ENTITIES.length].name,
      classification: 'DEMO',
    });
  }
  return risks;
}

function getRiskTitle(i) {
  const titles = [
    'Key person dependency for SAP BASIS administration',
    'License expiry approaching for SAP BW/4HANA',
    'Integration middleware capacity risk during peak',
    'Data migration residual risk from go-live',
    'Single point of failure in MES connectivity',
    'Vendor support contract renewal delay risk',
    'Knowledge transfer gap for offshore team',
    'Security patch deployment backlog increasing',
  ];
  return titles[i % titles.length];
}

// ═══════════════════════════════════════════════════
// AUDITS, FINDINGS, CTAs — DEMO DATA
// ═══════════════════════════════════════════════════
function generateAudits() {
  return [
    {
      id: 'AUD-0001',
      title: 'AMS Incident & SLA Governance Review',
      auditName: 'AMS Incident & SLA Governance Review',
      type: 'Internal',
      serviceDomain: 'Service Management, Governance, and Delivery',
      processGroup: 'AMS Service Management',
      framework: 'ITIL / Internal Control',
      leadAuditor: 'Fatima Al-Otaibi',
      owner: 'Fatima Al-Otaibi',
      plannedStart: '2026-09-01',
      plannedEnd: '2026-09-05',
      conductedDate: '2026-09-05',
      auditDate: '2026-09-05',
      priority: 'High',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Requires Remediation',
      score: '91.4%',
      complianceScore: '91.4%',
      complianceScoreNum: 91.4,
      findingsCount: 5,
      openFindings: 4,
      criticalFindings: 1,
      majorFindings: 2,
      minorFindings: 2,
      overdueFindings: 1,
      remediationStatus: 'In Progress',
      remediation: 'In Progress',
      objective: 'Comprehensive governance review evaluating P1/P2 SLA escalation paths, incident responder handoffs, and operational compliance.',
      scope: 'Cross-domain ITIL incident management workflows, duty manager bridge response times, and resolver escalation matrices.',
      systemsCovered: 'ManageEngine ITSM, ServiceNow, Azure Monitor, MS Teams MIM Bridges',
      nextReview: '2026-12-05',
      evidenceStatus: 'Remediation Active',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0002',
      title: 'Finance Close & Reconciliation Control Review',
      auditName: 'Finance Close & Reconciliation Control Review',
      type: 'Internal',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Financial Close',
      framework: 'Financial Controls',
      leadAuditor: 'Omar Al Suwaidi',
      owner: 'Omar Al Suwaidi',
      plannedStart: '2026-08-10',
      plannedEnd: '2026-08-14',
      conductedDate: '2026-08-14',
      auditDate: '2026-08-14',
      priority: 'High',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Partially Compliant',
      score: '91.4%',
      complianceScore: '91.4%',
      complianceScoreNum: 91.4,
      findingsCount: 7,
      openFindings: 2,
      criticalFindings: 0,
      majorFindings: 1,
      minorFindings: 6,
      overdueFindings: 0,
      remediationStatus: 'In Progress',
      remediation: 'In Progress',
      objective: 'Assess the design and operating effectiveness of period-end financial reconciliation controls, automated journal entry approvals, and intercompany balance verification.',
      scope: 'General Ledger, Asset Accounting, Intercompany Reconciliations (BlackLine/SAP Financial Closing Cockpit).',
      systemsCovered: 'SAP S/4HANA FI-CO, BlackLine Reconciliation Engine',
      nextReview: '2026-11-15',
      evidenceStatus: 'Exceptions Logged',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0003',
      title: 'Procurement Approval & Segregation Review',
      auditName: 'Procurement Approval & Segregation Review',
      type: 'Compliance',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Procurement Governance',
      framework: 'SoD / Approval Controls',
      leadAuditor: 'Sarah Nasser',
      owner: 'Sarah Nasser',
      plannedStart: '2026-08-17',
      plannedEnd: '2026-08-21',
      conductedDate: '2026-08-21',
      auditDate: '2026-08-21',
      priority: 'Medium',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Compliant',
      score: '98.1%',
      complianceScore: '98.1%',
      complianceScoreNum: 98.1,
      findingsCount: 2,
      openFindings: 0,
      criticalFindings: 0,
      majorFindings: 0,
      minorFindings: 2,
      overdueFindings: 0,
      remediationStatus: 'Closed',
      remediation: 'Closed',
      objective: 'Validate three-way matching enforcement, delegation of authority (DOA) tiers, and separation between purchase requisitioning, purchase order approval, and goods receipt.',
      scope: 'Ariba Sourcing & Procurement, SAP MM Purchasing workflows.',
      systemsCovered: 'SAP Ariba Network, SAP S/4HANA MM, OpenText VIM',
      nextReview: '2027-02-20',
      evidenceStatus: 'Fully Attested',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0004',
      title: 'Plan-to-Produce Control Effectiveness Audit',
      auditName: 'Plan-to-Produce Control Effectiveness Audit',
      type: 'Internal',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Production Planning',
      framework: 'Operational Controls',
      leadAuditor: 'Daniel Thomas',
      owner: 'Daniel Thomas',
      plannedStart: '2026-08-24',
      plannedEnd: '2026-08-28',
      conductedDate: '2026-08-28',
      auditDate: '2026-08-28',
      priority: 'High',
      status: 'In Progress',
      auditStatus: 'In Progress',
      complianceStatus: 'Under Review',
      score: '87.6%',
      complianceScore: '87.6%',
      complianceScoreNum: 87.6,
      findingsCount: 5,
      openFindings: 4,
      criticalFindings: 0,
      majorFindings: 1,
      minorFindings: 4,
      overdueFindings: 1,
      remediationStatus: 'Open',
      remediation: 'Open',
      objective: 'Examine shop-floor order release authorizations, BOM change controls, and real-time inventory staging validation in manufacturing facilities.',
      scope: 'Production Orders, Work Centers, Routing Master Data, Shop-Floor Execution.',
      systemsCovered: 'SAP PP/QM, Manufacturing Execution System (MES)',
      nextReview: '2026-10-15',
      evidenceStatus: 'Fieldwork Active',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0005',
      title: 'Engineer-to-Manufacture Change Governance Review',
      auditName: 'Engineer-to-Manufacture Change Governance Review',
      type: 'Compliance',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Engineering Change Management',
      framework: 'Change Governance',
      leadAuditor: 'Aisha Rahman',
      owner: 'Aisha Rahman',
      plannedStart: '2026-09-01',
      plannedEnd: '2026-09-04',
      conductedDate: null,
      auditDate: null,
      priority: 'High',
      status: 'Planned',
      auditStatus: 'Planned',
      complianceStatus: 'Not Started',
      score: 'N/A',
      complianceScore: 'N/A',
      complianceScoreNum: null,
      findingsCount: 0,
      openFindings: 0,
      criticalFindings: 0,
      majorFindings: 0,
      minorFindings: 0,
      overdueFindings: 0,
      remediationStatus: 'Not Started',
      remediation: 'Not Started',
      objective: 'Inspect engineering change order (ECO) lifecycle controls, CAD/PLM interface integrity, and production revision release sign-offs.',
      scope: 'Engineering Change Masters, Product Lifecycle Management (PLM) workflows.',
      systemsCovered: 'Siemens Teamcenter, SAP PLM/ECTR',
      nextReview: '2026-09-01',
      evidenceStatus: 'Pre-Audit Scoping',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0006',
      title: 'Order-to-Cash Revenue Control Review',
      auditName: 'Order-to-Cash Revenue Control Review',
      type: 'External',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Billing & Revenue Recognition',
      framework: 'Revenue Controls',
      leadAuditor: 'External Audit Team',
      owner: 'External Audit Team',
      plannedStart: '2026-09-07',
      plannedEnd: '2026-09-11',
      conductedDate: null,
      auditDate: null,
      priority: 'Critical',
      status: 'Planned',
      auditStatus: 'Planned',
      complianceStatus: 'Scheduled',
      score: 'N/A',
      complianceScore: 'N/A',
      complianceScoreNum: null,
      findingsCount: 0,
      openFindings: 0,
      criticalFindings: 0,
      majorFindings: 0,
      minorFindings: 0,
      overdueFindings: 0,
      remediationStatus: 'Not Scheduled',
      remediation: 'Not Scheduled',
      objective: 'Statutory external review of IFRS 15 revenue recognition milestone triggers, automated billing schedule validations, and credit limit overrides.',
      scope: 'Sales Orders, Milestone Billing Plans, Revenue Accounting and Reporting (RAR).',
      systemsCovered: 'SAP S/4HANA SD/RAR, HighRadius Credit Management',
      nextReview: '2026-09-07',
      evidenceStatus: 'Document Request Issued',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0007',
      title: 'Acquire-to-Dispose Asset Lifecycle Review',
      auditName: 'Acquire-to-Dispose Asset Lifecycle Review',
      type: 'Internal',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Asset Management',
      framework: 'Asset Lifecycle Controls',
      leadAuditor: 'Faisal Karim',
      owner: 'Faisal Karim',
      plannedStart: '2026-08-12',
      plannedEnd: '2026-08-15',
      conductedDate: '2026-08-15',
      auditDate: '2026-08-15',
      priority: 'Medium',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Partially Compliant',
      score: '89.7%',
      complianceScore: '89.7%',
      complianceScoreNum: 89.7,
      findingsCount: 6,
      openFindings: 3,
      criticalFindings: 0,
      majorFindings: 2,
      minorFindings: 4,
      overdueFindings: 1,
      remediationStatus: 'In Progress',
      remediation: 'In Progress',
      objective: 'Verify capital expenditure capitalization checkpoints, physical asset verification frequency, and asset retirement disposal certificates.',
      scope: 'Fixed Assets Register, Plant Maintenance asset master data, Capex AUC.',
      systemsCovered: 'SAP FI-AA, SAP Plant Maintenance (PM)',
      nextReview: '2026-11-20',
      evidenceStatus: 'Reconciliation Outstanding',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0008',
      title: 'Service Operations SLA Governance Review',
      auditName: 'Service Operations SLA Governance Review',
      type: 'Operational',
      serviceDomain: 'Service Management, Governance, and Delivery',
      processGroup: 'AMS Service Management',
      framework: 'ITSM / SLA Governance',
      leadAuditor: 'Noura Al Hashimi',
      owner: 'Noura Al Hashimi',
      plannedStart: '2026-08-19',
      plannedEnd: '2026-08-22',
      conductedDate: '2026-08-22',
      auditDate: '2026-08-22',
      priority: 'Critical',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Requires Remediation',
      score: '84.9%',
      complianceScore: '84.9%',
      complianceScoreNum: 84.9,
      findingsCount: 9,
      openFindings: 5,
      criticalFindings: 1,
      majorFindings: 3,
      minorFindings: 5,
      overdueFindings: 2,
      remediationStatus: 'Escalated',
      remediation: 'Escalated',
      objective: 'Contractual SLA assurance review evaluating P1/P2 response times, Major Incident Management (MIM) communication cadences, and Problem Management RCA delivery compliance.',
      scope: 'ManageEngine ServiceDesk, Jira Service Management, Telemetry Pipelines.',
      systemsCovered: 'ManageEngine ITSM, ServiceNow, Azure Monitor',
      nextReview: '2026-09-22',
      evidenceStatus: 'Escalation Notice Active',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0009',
      title: 'Data-to-Systems Integration Control Review',
      auditName: 'Data-to-Systems Integration Control Review',
      type: 'Internal',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Integration Management',
      framework: 'Integration Controls',
      leadAuditor: 'Arjun Menon',
      owner: 'Arjun Menon',
      plannedStart: '2026-08-25',
      plannedEnd: '2026-08-29',
      conductedDate: '2026-08-29',
      auditDate: '2026-08-29',
      priority: 'Medium',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Compliant',
      score: '97.2%',
      complianceScore: '97.2%',
      complianceScoreNum: 97.2,
      findingsCount: 3,
      openFindings: 0,
      criticalFindings: 0,
      majorFindings: 0,
      minorFindings: 3,
      overdueFindings: 0,
      remediationStatus: 'Closed',
      remediation: 'Closed',
      objective: 'Review API gateway encryption standards, certificate rotation lifecycles, and message replay idempotency controls across cloud-to-ground integrations.',
      scope: 'SAP Integration Suite (Cloud Integration CPI), API Management, Kafka event brokers.',
      systemsCovered: 'SAP BTP CPI, Azure API Gateway, Confluent Kafka',
      nextReview: '2027-02-25',
      evidenceStatus: 'Certified',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0010',
      title: 'Supplier-to-Pay Master Data Governance',
      auditName: 'Supplier-to-Pay Master Data Governance',
      type: 'Compliance',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Supplier Master Data',
      framework: 'Master Data Governance',
      leadAuditor: 'Khalid Al Hashimi',
      owner: 'Khalid Al Hashimi',
      plannedStart: '2026-09-02',
      plannedEnd: '2026-09-05',
      conductedDate: '2026-09-05',
      auditDate: '2026-09-05',
      priority: 'High',
      status: 'In Progress',
      auditStatus: 'In Progress',
      complianceStatus: 'Under Review',
      score: '92.3%',
      complianceScore: '92.3%',
      complianceScoreNum: 92.3,
      findingsCount: 4,
      openFindings: 2,
      criticalFindings: 0,
      majorFindings: 2,
      minorFindings: 2,
      overdueFindings: 0,
      remediationStatus: 'In Progress',
      remediation: 'In Progress',
      objective: 'Examine vendor banking detail change controls, tax residency verification, and duplicate supplier record cleansing protocols.',
      scope: 'Supplier Master Business Partner (BP) records, Bank Account Dual Approval.',
      systemsCovered: 'SAP Master Data Governance (MDG-S), SAP S/4HANA',
      nextReview: '2026-10-20',
      evidenceStatus: 'Field Testing Ongoing',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0011',
      title: 'HR Joiner / Mover / Leaver Controls',
      auditName: 'HR Joiner / Mover / Leaver Controls',
      type: 'Internal',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Employee Lifecycle',
      framework: 'Identity & Access Governance',
      leadAuditor: 'Mariam Al Mansoori',
      owner: 'Mariam Al Mansoori',
      plannedStart: '2026-09-08',
      plannedEnd: '2026-09-10',
      conductedDate: null,
      auditDate: null,
      priority: 'Medium',
      status: 'Planned',
      auditStatus: 'Planned',
      complianceStatus: 'Not Started',
      score: 'N/A',
      complianceScore: 'N/A',
      complianceScoreNum: null,
      findingsCount: 0,
      openFindings: 0,
      criticalFindings: 0,
      majorFindings: 0,
      minorFindings: 0,
      overdueFindings: 0,
      remediationStatus: 'Not Started',
      remediation: 'Not Started',
      objective: 'Audit automated offboarding de-provisioning within 24 hours, department transfer role revocation, and privileged access re-attestation.',
      scope: 'SuccessFactors Employee Central to Active Directory and SAP user provisioning.',
      systemsCovered: 'SAP SuccessFactors EC, Microsoft Entra ID, SailPoint IdentityIQ',
      nextReview: '2026-09-08',
      evidenceStatus: 'Pending Kickoff',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0012',
      title: 'Application Release & Transport Governance',
      auditName: 'Application Release & Transport Governance',
      type: 'Operational',
      serviceDomain: 'Service Management, Governance, and Delivery',
      processGroup: 'Release Management',
      framework: 'Change & Release Governance',
      leadAuditor: 'Omar Bashar',
      owner: 'Omar Bashar',
      plannedStart: '2026-08-27',
      plannedEnd: '2026-08-30',
      conductedDate: '2026-08-30',
      auditDate: '2026-08-30',
      priority: 'High',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Partially Compliant',
      score: '93.6%',
      complianceScore: '93.6%',
      complianceScoreNum: 93.6,
      findingsCount: 5,
      openFindings: 1,
      criticalFindings: 0,
      majorFindings: 1,
      minorFindings: 4,
      overdueFindings: 0,
      remediationStatus: 'In Progress',
      remediation: 'In Progress',
      objective: 'Verify CTS+ transport import logs, production change advisory board (CAB) approvals, and automated code scan gate validations.',
      scope: 'ABAP Transport Management System (TMS), Solution Manager ChaRM, GitHub Enterprise.',
      systemsCovered: 'SAP ChaRM, SAP S/4HANA PRD, SonarQube',
      nextReview: '2026-11-30',
      evidenceStatus: 'Remediation Active',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0013',
      title: 'Manufacturing Business Continuity Readiness',
      auditName: 'Manufacturing Business Continuity Readiness',
      type: 'Operational',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Manufacturing Continuity',
      framework: 'Business Continuity',
      leadAuditor: 'Sarah Nasser',
      owner: 'Sarah Nasser',
      plannedStart: '2026-09-14',
      plannedEnd: '2026-09-18',
      conductedDate: null,
      auditDate: null,
      priority: 'Critical',
      status: 'Planned',
      auditStatus: 'Planned',
      complianceStatus: 'Scheduled',
      score: 'N/A',
      complianceScore: 'N/A',
      complianceScoreNum: null,
      findingsCount: 0,
      openFindings: 0,
      criticalFindings: 0,
      majorFindings: 0,
      minorFindings: 0,
      overdueFindings: 0,
      remediationStatus: 'Not Scheduled',
      remediation: 'Not Scheduled',
      objective: 'Review disaster recovery failover drill outcomes, shop-floor offline manual fallback protocols, and operational RTO/RPO adherence.',
      scope: 'Manufacturing facility plant servers, edge gateways, and core SAP replication.',
      systemsCovered: 'SAP HANA System Replication (HSR), Azure Disaster Recovery',
      nextReview: '2026-09-14',
      evidenceStatus: 'Pre-Audit Pack Ready',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0014',
      title: 'Knowledge & Operational Procedure Compliance',
      auditName: 'Knowledge & Operational Procedure Compliance',
      type: 'Internal',
      serviceDomain: 'Service Management, Governance, and Delivery',
      processGroup: 'Knowledge Management',
      framework: 'Operational Governance',
      leadAuditor: 'Daniel Thomas',
      owner: 'Daniel Thomas',
      plannedStart: '2026-08-20',
      plannedEnd: '2026-08-23',
      conductedDate: '2026-08-23',
      auditDate: '2026-08-23',
      priority: 'Low',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Compliant',
      score: '99.1%',
      complianceScore: '99.1%',
      complianceScoreNum: 99.1,
      findingsCount: 1,
      openFindings: 0,
      criticalFindings: 0,
      majorFindings: 0,
      minorFindings: 1,
      overdueFindings: 0,
      remediationStatus: 'Closed',
      remediation: 'Closed',
      objective: 'Verify standard operating procedure (SOP) annual review sign-offs, known error database (KEDB) article currency, and Tier 1 runbook validity.',
      scope: 'AMS Knowledge Base, ITSM KEDB, Technical SOP repository.',
      systemsCovered: 'KaarTech Knowledge Portal, Confluence Enterprise',
      nextReview: '2027-02-23',
      evidenceStatus: 'Certified',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0015',
      title: 'Customer Service Governance & Escalation Review',
      auditName: 'Customer Service Governance & Escalation Review',
      type: 'Operational',
      serviceDomain: 'Service Management, Governance, and Delivery',
      processGroup: 'Customer Service Management',
      framework: 'Service Governance',
      leadAuditor: 'Noura Al Hashimi',
      owner: 'Noura Al Hashimi',
      plannedStart: '2026-09-09',
      plannedEnd: '2026-09-12',
      conductedDate: '2026-09-12',
      auditDate: '2026-09-12',
      priority: 'High',
      status: 'In Progress',
      auditStatus: 'In Progress',
      complianceStatus: 'Under Review',
      score: '94.2%',
      complianceScore: '94.2%',
      complianceScoreNum: 94.2,
      findingsCount: 3,
      openFindings: 1,
      criticalFindings: 0,
      majorFindings: 1,
      minorFindings: 2,
      overdueFindings: 0,
      remediationStatus: 'In Progress',
      remediation: 'In Progress',
      objective: 'Evaluate Customer Corner communication responsiveness, Call to Action (CTA) turnaround intervals, and customer satisfaction (CSAT) complaint resolution.',
      scope: 'Customer Corner channels, SteerCom escalations, CSAT feedback registers.',
      systemsCovered: 'KaarTech ITMS Control Tower, Jira Service Management',
      nextReview: '2026-10-30',
      evidenceStatus: 'Preliminary Findings Logged',
      classification: 'DEMO',
    },
  ];
}

function generateFindings() {
  return [
    // Connected to AUD-0002 (Finance Close & Reconciliation Control Review) - 2 Open (1 Major, 1 Minor)
    {
      id: 'FND-0001',
      title: 'Segregation of duties exception in journal approval workflow',
      shortDescription: 'Segregation of duties exception in journal approval workflow',
      severity: 'Major',
      impactCategory: 'Major',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Financial Close',
      leadAuditor: 'Omar Al Suwaidi',
      owner: 'Omar Al Suwaidi',
      assignedTo: 'Omar Al Suwaidi',
      targetDate: '2026-09-15',
      dueDate: '2026-09-15',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0002',
      ctaId: 'CTA-0002',
      action: 'Enforce SAP GRC approval rule requiring dual independent sign-off on manual adjustments > SAR 500k.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0002',
      title: 'Month-end intercompany variance automated ledger sync gap',
      shortDescription: 'Month-end intercompany variance automated ledger sync gap',
      severity: 'Minor',
      impactCategory: 'Minor',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Financial Close',
      leadAuditor: 'Omar Al Suwaidi',
      owner: 'Tariq Al Dhaheri',
      assignedTo: 'Tariq Al Dhaheri',
      targetDate: '2026-09-30',
      dueDate: '2026-09-30',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0002',
      ctaId: 'CTA-0003',
      action: 'Deploy BlackLine automated matching rule for foreign currency intercompany trade accounts.',
      classification: 'DEMO',
    },
    // Connected to AUD-0004 (Plan-to-Produce Control Effectiveness Audit) - 4 Open (1 Major, 3 Minor)
    {
      id: 'FND-0003',
      title: 'Production approval workflow bypass in urgent plant work orders',
      shortDescription: 'Production approval workflow bypass in urgent plant work orders',
      severity: 'Major',
      impactCategory: 'Major',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Production Planning',
      leadAuditor: 'Daniel Thomas',
      owner: 'Daniel Thomas',
      assignedTo: 'Daniel Thomas',
      targetDate: '2026-10-10',
      dueDate: '2026-10-10',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0004',
      ctaId: 'CTA-0004',
      action: 'Re-enable mandatory plant manager digital sign-off on expedited work orders.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0004',
      title: 'Batch tracking sign-off documentation gap on assembly line 3',
      shortDescription: 'Batch tracking sign-off documentation gap on assembly line 3',
      severity: 'Minor',
      impactCategory: 'Minor',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Production Planning',
      leadAuditor: 'Daniel Thomas',
      owner: 'Sarah Nasser',
      assignedTo: 'Sarah Nasser',
      targetDate: '2026-10-15',
      dueDate: '2026-10-15',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0004',
      ctaId: 'CTA-0005',
      action: 'Institute handheld barcode scanner mandatory confirmation step at station 3.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0005',
      title: 'Preventive maintenance interval logging discrepancy in plant asset records',
      shortDescription: 'Preventive maintenance interval logging discrepancy in plant asset records',
      severity: 'Minor',
      impactCategory: 'Minor',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Production Planning',
      leadAuditor: 'Daniel Thomas',
      owner: 'Faisal Karim',
      assignedTo: 'Faisal Karim',
      targetDate: '2026-10-20',
      dueDate: '2026-10-20',
      status: 'In Progress',
      complianceStatus: 'In Progress',
      auditId: 'AUD-0004',
      ctaId: 'CTA-0006',
      action: 'Automate SAP PM calibration trigger based on machine operating runtime hours.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0006',
      title: 'QA calibration verification record lag on pneumatic testing units',
      shortDescription: 'QA calibration verification record lag on pneumatic testing units',
      severity: 'Minor',
      impactCategory: 'Minor',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Production Planning',
      leadAuditor: 'Daniel Thomas',
      owner: 'Aisha Rahman',
      assignedTo: 'Aisha Rahman',
      targetDate: '2026-10-25',
      dueDate: '2026-10-25',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0004',
      ctaId: 'CTA-0007',
      action: 'Configure automated notification when calibration certificate expiration is within 14 days.',
      classification: 'DEMO',
    },
    // Connected to AUD-0007 (Acquire-to-Dispose Asset Lifecycle Review) - 3 Open (2 Major, 1 Minor)
    {
      id: 'FND-0007',
      title: 'Physical inventory tag reconciliation timing delay across warehouse bays',
      shortDescription: 'Physical inventory tag reconciliation timing delay across warehouse bays',
      severity: 'Major',
      impactCategory: 'Major',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Asset Management',
      leadAuditor: 'Faisal Karim',
      owner: 'Faisal Karim',
      assignedTo: 'Faisal Karim',
      targetDate: '2026-09-25',
      dueDate: '2026-09-25',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0007',
      ctaId: 'CTA-0008',
      action: 'Enforce RFID-based weekly cycle counting with automatic discrepancy alerts in SAP EWM.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0008',
      title: 'Asset disposal authorization dual-control sign-off record delay',
      shortDescription: 'Asset disposal authorization dual-control sign-off record delay',
      severity: 'Major',
      impactCategory: 'Major',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Asset Management',
      leadAuditor: 'Faisal Karim',
      owner: 'Khalid Al Hashimi',
      assignedTo: 'Khalid Al Hashimi',
      targetDate: '2026-10-05',
      dueDate: '2026-10-05',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0007',
      ctaId: 'CTA-0009',
      action: 'Implement digital workflow approval for fixed asset scrap forms requiring Finance and Operations sign-off.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0009',
      title: 'Equipment serial number ledger synchronization gap',
      shortDescription: 'Equipment serial number ledger synchronization gap',
      severity: 'Minor',
      impactCategory: 'Minor',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Asset Management',
      leadAuditor: 'Faisal Karim',
      owner: 'Mariam Al Mansoori',
      assignedTo: 'Mariam Al Mansoori',
      targetDate: '2026-10-15',
      dueDate: '2026-10-15',
      status: 'In Progress',
      complianceStatus: 'In Progress',
      auditId: 'AUD-0007',
      ctaId: 'CTA-0010',
      action: 'Synchronize Plant Maintenance functional location identifiers with Fixed Asset master records.',
      classification: 'DEMO',
    },
    // Connected to AUD-0001 (AMS Incident & SLA Governance Review)
    {
      id: 'FND-0024',
      title: 'SLA escalation evidence gap for critical incidents',
      shortDescription: 'SLA escalation evidence gap for critical incidents',
      severity: 'Critical',
      impactCategory: 'Critical',
      serviceDomain: 'Service Management, Governance, and Delivery',
      processGroup: 'AMS Service Management',
      leadAuditor: 'Fatima Al-Otaibi',
      owner: 'AMS Service Manager',
      assignedTo: 'AMS Service Manager',
      targetDate: '2026-09-16',
      dueDate: '2026-09-16',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0001',
      ctaId: 'CTA-0011',
      action: 'Re-engineer incident bridge escalation protocol to mandate AMS duty manager check-in within 15 minutes.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0011',
      title: 'Change advisory board emergency approval backlog over 48 hours',
      shortDescription: 'Change advisory board emergency approval backlog over 48 hours',
      severity: 'Major',
      impactCategory: 'Major',
      serviceDomain: 'Service Management, Governance, and Delivery',
      processGroup: 'AMS Service Management',
      leadAuditor: 'Noura Al Hashimi',
      owner: 'Omar Bashar',
      assignedTo: 'Omar Bashar',
      targetDate: '2026-09-20',
      dueDate: '2026-09-20',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0008',
      ctaId: 'CTA-0012',
      action: 'Implement automated quorum voting via Teams/Email for critical out-of-cycle emergency RFCs.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0012',
      title: 'Incident communication cadence milestone adherence gap during outages',
      shortDescription: 'Incident communication cadence milestone adherence gap during outages',
      severity: 'Major',
      impactCategory: 'Major',
      serviceDomain: 'Service Management, Governance, and Delivery',
      processGroup: 'AMS Service Management',
      leadAuditor: 'Noura Al Hashimi',
      owner: 'Sara Al Marzouqi',
      assignedTo: 'Sara Al Marzouqi',
      targetDate: '2026-09-28',
      dueDate: '2026-09-28',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0008',
      ctaId: 'CTA-0013',
      action: 'Deploy automated 30-minute status broadcast broadcast template to SteerCom distribution group.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0013',
      title: 'Problem record RCA delivery SLA breach beyond contractual 5 business days',
      shortDescription: 'Problem record RCA delivery SLA breach beyond contractual 5 business days',
      severity: 'Major',
      impactCategory: 'Major',
      serviceDomain: 'Service Management, Governance, and Delivery',
      processGroup: 'AMS Service Management',
      leadAuditor: 'Noura Al Hashimi',
      owner: 'Rakesh Kumar',
      assignedTo: 'Rakesh Kumar',
      targetDate: '2026-10-02',
      dueDate: '2026-10-02',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0008',
      ctaId: 'CTA-0014',
      action: 'Institute RCA triage review session every Tuesday with functional lead sign-offs.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0014',
      title: 'Service desk first-call resolution categorization inconsistency',
      shortDescription: 'Service desk first-call resolution categorization inconsistency',
      severity: 'Minor',
      impactCategory: 'Minor',
      serviceDomain: 'Service Management, Governance, and Delivery',
      processGroup: 'AMS Service Management',
      leadAuditor: 'Noura Al Hashimi',
      owner: 'Deepak Kumar',
      assignedTo: 'Deepak Kumar',
      targetDate: '2026-10-08',
      dueDate: '2026-10-08',
      status: 'In Progress',
      complianceStatus: 'In Progress',
      auditId: 'AUD-0008',
      ctaId: 'CTA-0015',
      action: 'Publish standardized multi-tier ticket taxonomy and provide refresher session to Level 1 agents.',
      classification: 'DEMO',
    },
    // Connected to AUD-0010 (Supplier-to-Pay Master Data Governance) - 2 Open (2 Major)
    {
      id: 'FND-0015',
      title: 'Supplier master tax identification verification lag for overseas vendors',
      shortDescription: 'Supplier master tax identification verification lag for overseas vendors',
      severity: 'Major',
      impactCategory: 'Major',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Supplier Master Data',
      leadAuditor: 'Khalid Al Hashimi',
      owner: 'Khalid Al Hashimi',
      assignedTo: 'Khalid Al Hashimi',
      targetDate: '2026-10-12',
      dueDate: '2026-10-12',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0010',
      ctaId: 'CTA-0016',
      action: 'Integrate automated TRN/VAT validation API with ZATCA portal in SAP MDG.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0016',
      title: 'Vendor bank detail dual-control verification procedure gap',
      shortDescription: 'Vendor bank detail dual-control verification procedure gap',
      severity: 'Major',
      impactCategory: 'Major',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Supplier Master Data',
      leadAuditor: 'Khalid Al Hashimi',
      owner: 'Sarah Nasser',
      assignedTo: 'Sarah Nasser',
      targetDate: '2026-10-18',
      dueDate: '2026-10-18',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0010',
      ctaId: 'CTA-0017',
      action: 'Implement mandatory callback verification protocol prior to updating bank IBAN accounts.',
      classification: 'DEMO',
    },
    // Connected to AUD-0012 (Application Release & Transport Governance) - 1 Open (1 Major)
    {
      id: 'FND-0017',
      title: 'Production transport release without verified automated rollback script',
      shortDescription: 'Production transport release without verified automated rollback script',
      severity: 'Major',
      impactCategory: 'Major',
      serviceDomain: 'Service Management, Governance, and Delivery',
      processGroup: 'Release Management',
      leadAuditor: 'Omar Bashar',
      owner: 'Omar Bashar',
      assignedTo: 'Omar Bashar',
      targetDate: '2026-10-05',
      dueDate: '2026-10-05',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0012',
      ctaId: 'CTA-0018',
      action: 'Mandate ChaRM automated validation check for reverse transport packages in pre-prod.',
      classification: 'DEMO',
    },
    // Connected to AUD-0015 (Customer Service Governance & Escalation Review) - 1 Open (1 Major)
    {
      id: 'FND-0018',
      title: 'Customer escalation matrix SLA notification failure on unresolved tickets',
      shortDescription: 'Customer escalation matrix SLA notification failure on unresolved tickets',
      severity: 'Major',
      impactCategory: 'Major',
      serviceDomain: 'Service Management, Governance, and Delivery',
      processGroup: 'Customer Service Management',
      leadAuditor: 'Noura Al Hashimi',
      owner: 'Noura Al Hashimi',
      assignedTo: 'Noura Al Hashimi',
      targetDate: '2026-10-15',
      dueDate: '2026-10-15',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0015',
      ctaId: 'CTA-0019',
      action: 'Fix webhook trigger linking Customer Corner pending thread status to Service Delivery Manager inbox.',
      classification: 'DEMO',
    },
    // Remediated / Closed Findings for Compliant Audits
    {
      id: 'FND-0019',
      title: 'Inactive employee SAP accounts pending de-provisioning beyond 48 hours',
      shortDescription: 'Inactive employee SAP accounts pending de-provisioning beyond 48 hours',
      severity: 'Minor',
      impactCategory: 'Minor',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'User Access Management',
      leadAuditor: 'Mariam Al Mansoori',
      owner: 'Mariam Al Mansoori',
      assignedTo: 'Mariam Al Mansoori',
      targetDate: '2026-08-10',
      dueDate: '2026-08-10',
      status: 'Remediated',
      complianceStatus: 'Remediated',
      auditId: 'AUD-0001',
      ctaId: 'CTA-0020',
      action: 'Automated SuccessFactors leaver webhook integrated with SAP user locking script.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0020',
      title: 'Emergency firecall dialog user password rotation cycle irregularity',
      shortDescription: 'Emergency firecall dialog user password rotation cycle irregularity',
      severity: 'Minor',
      impactCategory: 'Minor',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'User Access Management',
      leadAuditor: 'Mariam Al Mansoori',
      owner: 'Mariam Al Mansoori',
      assignedTo: 'Mariam Al Mansoori',
      targetDate: '2026-08-12',
      dueDate: '2026-08-12',
      status: 'Remediated',
      complianceStatus: 'Remediated',
      auditId: 'AUD-0001',
      ctaId: 'CTA-0021',
      action: 'SAP GRC Emergency Access Management configured with 24-hour auto-reset policy.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0021',
      title: 'Procurement contract renewal alert threshold configured below 30 days',
      shortDescription: 'Procurement contract renewal alert threshold configured below 30 days',
      severity: 'Minor',
      impactCategory: 'Minor',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Procurement Governance',
      leadAuditor: 'Sarah Nasser',
      owner: 'Sarah Nasser',
      assignedTo: 'Sarah Nasser',
      targetDate: '2026-08-25',
      dueDate: '2026-08-25',
      status: 'Remediated',
      complianceStatus: 'Remediated',
      auditId: 'AUD-0003',
      ctaId: 'CTA-0022',
      action: 'Ariba contract workspace expiry threshold updated to 60 days standard.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0022',
      title: 'Cloud integration TLS certificate renewal alert interval insufficient',
      shortDescription: 'Cloud integration TLS certificate renewal alert interval insufficient',
      severity: 'Minor',
      impactCategory: 'Minor',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Integration Management',
      leadAuditor: 'Arjun Menon',
      owner: 'Arjun Menon',
      assignedTo: 'Arjun Menon',
      targetDate: '2026-08-30',
      dueDate: '2026-08-30',
      status: 'Remediated',
      complianceStatus: 'Remediated',
      auditId: 'AUD-0009',
      ctaId: 'CTA-0023',
      action: 'Azure Key Vault automated certificate renewal telemetry connected to AMS alert channel.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0023',
      title: 'KEDB article annual review timestamp overdue for 2 runbooks',
      shortDescription: 'KEDB article annual review timestamp overdue for 2 runbooks',
      severity: 'Observation',
      impactCategory: 'Observation',
      serviceDomain: 'Service Management, Governance, and Delivery',
      processGroup: 'Knowledge Management',
      leadAuditor: 'Daniel Thomas',
      owner: 'Daniel Thomas',
      assignedTo: 'Daniel Thomas',
      targetDate: '2026-08-25',
      dueDate: '2026-08-25',
      status: 'Remediated',
      complianceStatus: 'Remediated',
      auditId: 'AUD-0014',
      ctaId: 'CTA-0024',
      action: 'Completed review and recertification of SAP BASIS and CPI restoration runbooks.',
      classification: 'DEMO',
    },
  ];
}

function generateRemediationTasks() {
  return [
    {
      id: 'TSK-0041',
      taskDescription: 'Review P1/P2 SLA escalation workflow',
      description: 'Review P1/P2 SLA escalation workflow',
      raisedOn: '2026-09-02',
      raisedBy: 'Governance Manager',
      assignedTo: 'AMS Service Manager',
      targetDate: '2026-09-10',
      status: 'In Progress',
      auditId: 'AUD-0001',
      findingId: 'FND-0024',
      ctaId: 'CTA-0011',
    },
    {
      id: 'TSK-0042',
      taskDescription: 'Configure SLA breach notification rules',
      description: 'Configure SLA breach notification rules',
      raisedOn: '2026-09-03',
      raisedBy: 'Governance Manager',
      assignedTo: 'AMS Technical Lead',
      targetDate: '2026-09-14',
      status: 'Not Started',
      auditId: 'AUD-0001',
      findingId: 'FND-0024',
      ctaId: 'CTA-0011',
    },
    {
      id: 'TSK-0043',
      taskDescription: 'Validate resolver escalation matrix',
      description: 'Validate resolver escalation matrix',
      raisedOn: '2026-09-03',
      raisedBy: 'Governance Manager',
      assignedTo: 'Operations Lead',
      targetDate: '2026-09-15',
      status: 'In Progress',
      auditId: 'AUD-0001',
      findingId: 'FND-0024',
      ctaId: 'CTA-0011',
    },
    {
      id: 'TSK-0044',
      taskDescription: 'Complete evidence pack and retest',
      description: 'Complete evidence pack and retest',
      raisedOn: '2026-09-04',
      raisedBy: 'Governance Manager',
      assignedTo: 'Compliance Specialist',
      targetDate: '2026-09-20',
      status: 'Not Started',
      auditId: 'AUD-0001',
      findingId: 'FND-0024',
      ctaId: 'CTA-0011',
    },
    {
      id: 'TSK-0045',
      taskDescription: 'Enforce SAP GRC approval rule requiring dual independent sign-off > SAR 500k',
      description: 'Enforce SAP GRC approval rule requiring dual independent sign-off > SAR 500k',
      raisedOn: '2026-08-20',
      raisedBy: 'Internal Auditor',
      assignedTo: 'Omar Al Suwaidi',
      targetDate: '2026-09-15',
      status: 'In Progress',
      auditId: 'AUD-0002',
      findingId: 'FND-0001',
      ctaId: 'CTA-0002',
    },
    {
      id: 'TSK-0046',
      taskDescription: 'Deploy BlackLine automated matching rule for intercompany foreign currencies',
      description: 'Deploy BlackLine automated matching rule for intercompany foreign currencies',
      raisedOn: '2026-08-25',
      raisedBy: 'Financial Systems Lead',
      assignedTo: 'Tariq Al Dhaheri',
      targetDate: '2026-09-30',
      status: 'Not Started',
      auditId: 'AUD-0002',
      findingId: 'FND-0002',
      ctaId: 'CTA-0003',
    },
    {
      id: 'TSK-0047',
      taskDescription: 'Re-enable mandatory plant manager digital sign-off on expedited work orders',
      description: 'Re-enable mandatory plant manager digital sign-off on expedited work orders',
      raisedOn: '2026-08-28',
      raisedBy: 'Quality Assurance Lead',
      assignedTo: 'Daniel Thomas',
      targetDate: '2026-09-04',
      status: 'In Progress',
      auditId: 'AUD-0004',
      findingId: 'FND-0003',
      ctaId: 'CTA-0004',
    },
    {
      id: 'TSK-0048',
      taskDescription: 'Institute handheld barcode scanner mandatory confirmation step at station 3',
      description: 'Institute handheld barcode scanner mandatory confirmation step at station 3',
      raisedOn: '2026-08-30',
      raisedBy: 'Plant Operations Manager',
      assignedTo: 'Sarah Nasser',
      targetDate: '2026-09-18',
      status: 'Not Started',
      auditId: 'AUD-0004',
      findingId: 'FND-0004',
      ctaId: 'CTA-0005',
    },
    {
      id: 'TSK-0049',
      taskDescription: 'Enforce RFID-based weekly cycle counting with automatic discrepancy alerts in SAP EWM',
      description: 'Enforce RFID-based weekly cycle counting with automatic discrepancy alerts in SAP EWM',
      raisedOn: '2026-08-29',
      raisedBy: 'Asset Assurance Lead',
      assignedTo: 'Faisal Karim',
      targetDate: '2026-09-22',
      status: 'In Progress',
      auditId: 'AUD-0007',
      findingId: 'FND-0007',
      ctaId: 'CTA-0008',
    },
    {
      id: 'TSK-0050',
      taskDescription: 'Integrate automated TRN/VAT validation API with ZATCA portal in SAP MDG',
      description: 'Integrate automated TRN/VAT validation API with ZATCA portal in SAP MDG',
      raisedOn: '2026-09-01',
      raisedBy: 'Data Governance Lead',
      assignedTo: 'Khalid Al Hashimi',
      targetDate: '2026-09-25',
      status: 'In Progress',
      auditId: 'AUD-0010',
      findingId: 'FND-0015',
      ctaId: 'CTA-0016',
    },
    {
      id: 'TSK-0051',
      taskDescription: 'Publish standardized multi-tier ticket taxonomy and deliver Level 1 refresher training',
      description: 'Publish standardized multi-tier ticket taxonomy and deliver Level 1 refresher training',
      raisedOn: '2026-08-25',
      raisedBy: 'Governance Manager',
      assignedTo: 'Deepak Kumar',
      targetDate: '2026-08-31',
      status: 'Completed',
      auditId: 'AUD-0008',
      findingId: 'FND-0014',
      ctaId: 'CTA-0015',
    },
    {
      id: 'TSK-0052',
      taskDescription: 'Completed review and recertification of SAP BASIS and CPI restoration runbooks',
      description: 'Completed review and recertification of SAP BASIS and CPI restoration runbooks',
      raisedOn: '2026-08-15',
      raisedBy: 'Audit Lead',
      assignedTo: 'Daniel Thomas',
      targetDate: '2026-08-25',
      status: 'Completed',
      auditId: 'AUD-0014',
      findingId: 'FND-0023',
      ctaId: 'CTA-0024',
    },
  ];
}

function generateCTAs() {
  const ctas = [];
  const ctaCategories = ['Audit Action', 'Risk Action', 'Customer Action', 'Program Action', 'Transition Action', 'Service Improvement Action', 'General CTA'];
  const ctaStatuses = ['Open', 'In Progress', 'Completed', 'Overdue', 'Cancelled'];
  const sourceTypes = ['Audit', 'Risk', 'Customer', 'Program', 'Transition', 'Problem', 'Service Improvement'];

  for (let i = 1; i <= 35; i++) {
    const resource = RESOURCES[i % RESOURCES.length];
    const assignee = RESOURCES[(i + 3) % RESOURCES.length];
    const domain = SERVICE_DOMAINS[i % SERVICE_DOMAINS.length];
    const dueDate = new Date(2026, 6 + (i % 5), 1 + (i % 28));

    ctas.push({
      id: `CTA-${String(i).padStart(4, '0')}`,
      action: getCTAAction(i),
      sourceType: sourceTypes[i % sourceTypes.length],
      sourceId: getSourceId(i, sourceTypes[i % sourceTypes.length]),
      owner: resource.name,
      ownerId: resource.id,
      assignedTo: assignee.name,
      assignedToId: assignee.id,
      priority: i <= 10 ? 'High' : i <= 25 ? 'Medium' : 'Low',
      raisedDate: new Date(2026, 5 + (i % 3), 1 + (i % 28)).toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: ctaStatuses[i % ctaStatuses.length],
      progress: Math.floor(Math.random() * 100),
      serviceDomain: domain.name,
      application: APPLICATIONS[i % 26].name,
      entity: ENTITIES[i % ENTITIES.length].name,
      category: ctaCategories[i % ctaCategories.length],
      classification: 'DEMO',
    });
  }
  return ctas;
}

function getCTAAction(i) {
  const actions = [
    'Implement remediation for SoD violation',
    'Update disaster recovery runbook',
    'Complete vendor assessment documentation',
    'Resolve customer escalation on reporting',
    'Complete knowledge transfer for offshore team',
    'Deploy security patch for critical vulnerability',
    'Investigate root cause of recurring incidents',
    'Update SOP for period-end closing process',
  ];
  return actions[i % actions.length];
}

function getSourceId(i, sourceType) {
  const prefixes = { Audit: 'AUD', Risk: 'RSK', Customer: 'CST', Program: 'PRG', Transition: 'TRN', Problem: 'PRB', 'Service Improvement': 'SVI' };
  return `${prefixes[sourceType] || 'GEN'}-${String(((i - 1) % 12) + 1).padStart(4, '0')}`;
}

// ═══════════════════════════════════════════════════
// LICENSES — DEMO
// ═══════════════════════════════════════════════════
function generateLicenses() {
  const licenses = [];
  const renewalStatuses = ['Active', 'Renewal Pending', 'Expired', 'Under Negotiation'];
  const criticalities = ['Critical', 'High', 'Medium', 'Low'];

  for (let i = 1; i <= 22; i++) {
    const app = APPLICATIONS[i % 26];
    const quantity = Math.floor(Math.random() * 500) + 50;
    const consumed = Math.floor(quantity * (0.5 + Math.random() * 0.5));

    licenses.push({
      id: `LIC-${String(i).padStart(4, '0')}`,
      license: `${app.name} License`,
      application: app.name,
      applicationId: app.id,
      vendor: app.vendor,
      entitlementType: i % 3 === 0 ? 'Named User' : i % 3 === 1 ? 'Concurrent' : 'Enterprise',
      quantity,
      consumed,
      available: quantity - consumed,
      utilization: Math.round((consumed / quantity) * 100),
      expiryDate: new Date(2026, 8 + (i % 8), 1 + (i % 28)).toISOString().split('T')[0],
      renewalStatus: renewalStatuses[i % renewalStatuses.length],
      owner: RESOURCES[i % RESOURCES.length].name,
      serviceDomainId: SERVICE_DOMAINS[i % SERVICE_DOMAINS.length].id,
      serviceDomain: SERVICE_DOMAINS[i % SERVICE_DOMAINS.length].name,
      criticality: criticalities[i % criticalities.length],
      risk: consumed / quantity > 0.9 ? 'High' : consumed / quantity > 0.75 ? 'Medium' : 'Low',
      classification: 'DEMO',
    });
  }
  return licenses;
}

// ═══════════════════════════════════════════════════
// KNOWLEDGE ARTICLES — DEMO
// ═══════════════════════════════════════════════════
function generateKnowledgeArticles() {
  const articles = [];
  const categories = ['How-To', 'Troubleshooting', 'Best Practice', 'Process Guide', 'FAQ', 'Configuration'];
  const articleStatuses = ['Published', 'Draft', 'Under Review', 'Archived'];

  for (let i = 1; i <= 25; i++) {
    const domain = SERVICE_DOMAINS[i % SERVICE_DOMAINS.length];

    articles.push({
      id: `KBA-${String(i).padStart(4, '0')}`,
      title: getKBArticleTitle(i, domain.label),
      category: categories[i % categories.length],
      serviceDomain: domain.name,
      owner: RESOURCES[i % RESOURCES.length].name,
      status: articleStatuses[i % articleStatuses.length],
      lastUpdated: new Date(2026, 5 + (i % 4), 1 + (i % 28)).toISOString().split('T')[0],
      linkedIncidents: i <= 15 ? [`INC-${String(i).padStart(5, '0')}`] : [],
      linkedProblems: i <= 8 ? [`PRB-${String(i).padStart(5, '0')}`] : [],
      viewCount: Math.floor(Math.random() * 200) + 10,
      reviewStatus: i % 3 === 0 ? 'Review Due' : 'Current',
      classification: 'DEMO',
    });
  }
  return articles;
}

function getKBArticleTitle(i, domainLabel) {
  const titles = [
    `How to resolve period-end closing errors in ${domainLabel}`,
    `Troubleshooting guide for integration failures`,
    `Best practices for master data maintenance`,
    `Step-by-step guide for user access management`,
    `FAQ: Common questions about approval workflows`,
    `Configuration guide for output management`,
  ];
  return titles[i % titles.length];
}

// ═══════════════════════════════════════════════════
// CUSTOMER FEEDBACK — DEMO
// ═══════════════════════════════════════════════════
// ═══════════════════════════════════════════════════
// CUSTOMER FEEDBACK — DEMO (Section 62)
// ═══════════════════════════════════════════════════
function generateCustomerFeedback() {
  const feedback = [];
  const ratingsConfig = [
    { rating: 'Excellent', comment: 'Exceptional response speed and technical depth from AMS lead. Zero business impact on operations.' },
    { rating: 'Very Good', comment: 'Issue resolved effectively within standard target. Proactive communication throughout.' },
    { rating: 'Good',      comment: 'Service restored within SLA. Prompt acknowledgement appreciated during peak transaction hours.' },
    { rating: 'Average',   comment: 'Resolution completed within SLA, but required multiple cross-team handoffs.' },
    { rating: 'Poor',      comment: 'Resolution delayed past standard target. Root cause review requested for SteerCom.' },
  ];

  // 50 verified surveys reflecting agreed CSAT distribution: 41 Excellent (82%), 5 Very Good (10%), 2 Good (4%), 1 Average (2%), 1 Poor (2%)
  for (let i = 1; i <= 50; i++) {
    let selected;
    if (i <= 41) selected = ratingsConfig[0];       // 82% Excellent
    else if (i <= 46) selected = ratingsConfig[1];  // 10% Very Good
    else if (i <= 48) selected = ratingsConfig[2];  // 4% Good
    else if (i === 49) selected = ratingsConfig[3]; // 2% Average
    else selected = ratingsConfig[4];               // 2% Poor (<5%)

    feedback.push({
      id: `CSAT-${String(i).padStart(4, '0')}`,
      ticketId: i % 2 === 0 ? `INC-${String(1000 + i).padStart(5, '0')}` : `SR-${String(2000 + i).padStart(5, '0')}`,
      rating: selected.rating,
      comment: selected.comment,
      respondent: RESOURCES[(i * 3) % RESOURCES.length].name,
      date: new Date(2026, (i - 1) % 9, 1 + ((i * 3) % 27)).toISOString().split('T')[0],
      entity: ENTITIES[i % ENTITIES.length].name,
      classification: 'DEMO',
    });
  }
  return feedback;
}

// ═══════════════════════════════════════════════════
// NOTIFICATIONS — DEMO (Section 64)
// Derived from application state, not randomly generated.
// ═══════════════════════════════════════════════════
export function generateNotifications(incidents, risks, ctas) {
  const notifications = [];
  const now = new Date();

  // P1 approaching SLA breach
  incidents.filter(inc => inc.priority === 'P1' && inc.slaStatus === 'At Risk').forEach((inc, idx) => {
    notifications.push({
      id: `NTF-${String(idx + 1).padStart(4, '0')}`,
      type: 'critical',
      title: 'P1 Approaching SLA Breach',
      message: `${inc.id}: ${inc.shortDescription}`,
      timestamp: new Date(now.getTime() - idx * 3600000).toISOString(),
      read: false,
      link: '/command-center/incidents',
      sourceId: inc.id,
    });
  });

  // Risk actions overdue
  risks.filter(r => r.status === 'Open' && new Date(r.dueDate) < now).forEach((risk, idx) => {
    notifications.push({
      id: `NTF-${String(20 + idx).padStart(4, '0')}`,
      type: 'warning',
      title: 'Risk Action Overdue',
      message: `${risk.id}: ${risk.title}`,
      timestamp: new Date(now.getTime() - (idx + 5) * 3600000).toISOString(),
      read: false,
      link: '/governance/risks',
      sourceId: risk.id,
    });
  });

  // Overdue CTAs
  ctas.filter(c => c.status === 'Overdue').slice(0, 5).forEach((cta, idx) => {
    notifications.push({
      id: `NTF-${String(40 + idx).padStart(4, '0')}`,
      type: 'warning',
      title: 'CTA Overdue',
      message: `${cta.id}: ${cta.action}`,
      timestamp: new Date(now.getTime() - (idx + 10) * 3600000).toISOString(),
      read: idx > 1,
      link: '/governance/actions',
      sourceId: cta.id,
    });
  });

  return notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// ═══════════════════════════════════════════════════
// LEAVE RECORDS — CANONICAL DEMO (Section 26)
// ═══════════════════════════════════════════════════
function generateLeaveRecords() {
  return [
    { id: 'LV-001', employeeId: 'RES-001', employeeName: 'Khalid Al Hashimi', leaveType: 'Annual Leave', startDate: '2026-06-18', endDate: '2026-06-25', status: 'Approved', backupResourceId: 'RES-002', backupResourceName: 'Fatima Al-Otaibi', coverageNotes: 'Primary queue coverage assigned to Fatima Al-Otaibi. On-call escalation routed to General Shift lead.' },
    { id: 'LV-002', employeeId: 'RES-003', employeeName: 'Ravi Shankar', leaveType: 'Technical Training', startDate: '2026-07-06', endDate: '2026-07-10', status: 'Approved', backupResourceId: 'RES-021', backupResourceName: 'Abdulrahman Darwish', coverageNotes: 'Attending SAP S/4HANA Sourcing certification boot-camp.' },
    { id: 'LV-003', employeeId: 'RES-005', employeeName: 'Priya Nair', leaveType: 'Annual Leave', startDate: '2026-07-15', endDate: '2026-07-24', status: 'Approved', backupResourceId: 'RES-013', backupResourceName: 'Hassan Al Nuaimi', coverageNotes: 'Manufacturing plant tickets delegated to Hassan Al Nuaimi.' },
    { id: 'LV-004', employeeId: 'RES-008', employeeName: 'Noura Al Shamsi', leaveType: 'Certification Exam', startDate: '2026-08-03', endDate: '2026-08-05', status: 'Approved', backupResourceId: 'RES-010', backupResourceName: 'Aisha Khalfan', coverageNotes: 'Ariba Guided Sourcing specialist exam leave.' },
    { id: 'LV-005', employeeId: 'RES-004', employeeName: 'Sara Al Marzouqi', leaveType: 'Annual Leave', startDate: '2026-08-16', endDate: '2026-08-27', status: 'Approved', backupResourceId: 'RES-016', backupResourceName: 'Raj Malhotra', coverageNotes: 'SuccessFactors HXM queue monitored by Raj Malhotra and Layla Al Qassimi.' },
    { id: 'LV-006', employeeId: 'RES-007', employeeName: 'Deepak Kumar', leaveType: 'Annual Leave', startDate: '2026-09-01', endDate: '2026-09-10', status: 'Approved', backupResourceId: 'RES-025', backupResourceName: 'Mansour Al Hosani', coverageNotes: 'R2R financial controlling escalation delegated to Mansour Al Hosani.' },
    { id: 'LV-007', employeeId: 'RES-015', employeeName: 'Tariq Al Dhaheri', leaveType: 'Technical Training', startDate: '2026-09-15', endDate: '2026-09-18', status: 'Approved', backupResourceId: 'RES-023', backupResourceName: 'Yousuf Al Kaabi', coverageNotes: 'Plant maintenance mobile inspection training.' },
    { id: 'LV-008', employeeId: 'RES-002', employeeName: 'Fatima Al-Otaibi', leaveType: 'Annual Leave', startDate: '2026-10-12', endDate: '2026-10-20', status: 'Approved', backupResourceId: 'RES-017', backupResourceName: 'Mariam Al Suwaidi', coverageNotes: 'Acting AMS Team Lead designated to Mariam Al Suwaidi.' },
    { id: 'LV-009', employeeId: 'RES-014', employeeName: 'Sunita Reddy', leaveType: 'Exam / Certification', startDate: '2026-10-26', endDate: '2026-10-28', status: 'Approved', backupResourceId: 'RES-026', backupResourceName: 'Nisha Varma', coverageNotes: 'ABAP Cloud certification.' },
    { id: 'LV-010', employeeId: 'RES-018', employeeName: 'Vikram Singh', leaveType: 'Annual Leave', startDate: '2026-11-09', endDate: '2026-11-18', status: 'Approved', backupResourceId: 'RES-006', backupResourceName: 'Omar Bashar', coverageNotes: 'Supply chain IBP queue covered by Omar Bashar.' },
    { id: 'LV-011', employeeId: 'RES-011', employeeName: 'Mohammed Al Kindi', leaveType: 'Annual Leave', startDate: '2026-11-23', endDate: '2026-11-30', status: 'Approved', backupResourceId: 'RES-024', backupResourceName: 'Pooja Sharma', coverageNotes: 'Billing & Invoicing handled by Pooja Sharma.' },
    { id: 'LV-012', employeeId: 'RES-020', employeeName: 'Suresh Krishnan', leaveType: 'Annual Leave', startDate: '2026-12-07', endDate: '2026-12-16', status: 'Approved', backupResourceId: 'RES-009', backupResourceName: 'Ankit Patel', coverageNotes: 'BASIS on-call support secondary rotation active.' },
  ];
}

// ═══════════════════════════════════════════════════
// MINUTES OF MEETING (MOM) — FIRST-CLASS (Section MOM)
// ═══════════════════════════════════════════════════
function generateMOMRecords() {
  return [
    {
      id: 'MOM-001',
      meetingId: 'CAL-MTG-003',
      meetingTitle: 'Weekly Service Review (WSR) with KaarTech Advanced Manufacturing',
      meetingDate: '2026-06-18',
      meetingTime: '10:00 – 11:30 AST',
      meetingType: 'Service Review',
      customerOrEntity: 'KaarTech Advanced Manufacturing',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Production Planning',
      application: 'SAP S/4HANA Manufacturing',
      owner: 'Priya Nair',
      participants: ['Priya Nair (AMS Lead)', 'Ahmad Al-Otaibi (Manufacturing IT Director)', 'Rashid Al Dhaheri (Plant Operations)', 'Suresh Krishnan (BASIS Lead)'],
      momStatus: 'Action Items Open',
      momIssuedDate: '2026-06-19',
      momDueDate: '2026-06-20',
      summary: 'Reviewed recurring P2 batch job table locks impacting plant floor work orders. Assessed manufacturing shopfloor interface health and upcoming S/4HANA FP02 pre-checks.',
      keyDecisions: [
        'Approved scheduled plant floor maintenance window for Sunday, June 28 at 22:00 AST.',
        'Convert custom lock clearance ABAP report into an automated self-healing KEDB runbook.',
        'Weekly batch job locking telemetry to be reported in Monday shift handover briefs.'
      ],
      actionItems: [
        { actionId: 'ACT-001', actionDescription: 'Deploy hotfix patch for sales order pricing lockups on plant terminal', owner: 'Khalid Al Hashimi', targetDate: '2026-06-25', status: 'Completed', priority: 'High', ctaId: 'CTA-001', isOverdue: false },
        { actionId: 'ACT-002', actionDescription: 'Configure automated scrap yield confirmation email trigger for plant supervisors', owner: 'Priya Nair', targetDate: '2026-07-02', status: 'Completed', priority: 'Medium', ctaId: 'CTA-002', isOverdue: false },
        { actionId: 'ACT-003', actionDescription: 'Implement table indexing on AFPO production order table in HANA DB', owner: 'Suresh Krishnan', targetDate: '2026-07-10', status: 'Completed', priority: 'High', ctaId: 'CTA-003', isOverdue: false },
      ],
      openActionCount: 0,
      overdueActionCount: 0,
      relatedCTA: 'CTA-001',
      relatedProgram: 'PRG-001',
      relatedAudit: 'AUD-002',
    },
    {
      id: 'MOM-002',
      meetingId: 'CAL-MTG-002',
      meetingTitle: 'Weekly Service Review (WSR) with KaarTech Heavy Mobility',
      meetingDate: '2026-06-04',
      meetingTime: '10:00 – 11:30 AST',
      meetingType: 'Service Review',
      customerOrEntity: 'KaarTech Heavy Mobility',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Manufacturing Assembly',
      application: 'SAP S/4HANA Manufacturing',
      owner: 'Ravi Shankar',
      participants: ['Ravi Shankar (AMS Lead)', 'Mansoor Al Nuaimi (Mobility IT Head)', 'Tariq Al Dhaheri (Maintenance Lead)'],
      momStatus: 'Closed',
      momIssuedDate: '2026-06-05',
      momDueDate: '2026-06-06',
      summary: 'Reviewed heavy mobility vehicle assembly line serial barcode scanner latency and BOM synchronization with Teamcenter PLM.',
      keyDecisions: [
        'Teamcenter to S/4HANA interface queue retry mechanism increased to 5 attempts.',
        'Shopfloor handheld scanner firmware updated to TLS 1.3.'
      ],
      actionItems: [
        { actionId: 'ACT-004', actionDescription: 'Validate PLM BOM synchronization delta filters', owner: 'Ravi Shankar', targetDate: '2026-06-12', status: 'Completed', priority: 'Medium', ctaId: 'CTA-004', isOverdue: false },
      ],
      openActionCount: 0,
      overdueActionCount: 0,
      relatedCTA: 'CTA-004',
      relatedProgram: 'PRG-001',
    },
    {
      id: 'MOM-003',
      meetingId: 'CAL-MTG-006',
      meetingTitle: 'Monthly Executive SteerCom Review (MSR) - June Contractual Sign-Off',
      meetingDate: '2026-07-06',
      meetingTime: '14:00 – 16:00 AST',
      meetingType: 'SteerCom',
      customerOrEntity: 'KaarTech Corp.',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Executive Governance',
      application: 'Enterprise AMS Landscape',
      owner: 'Dr. Tariq Al Nuaimi',
      participants: ['Dr. Tariq Al Nuaimi (SteerCom Chair)', 'Fatima Al-Otaibi (AMS Lead)', 'KPMG Lead Partner', 'Group CFO Delegate'],
      momStatus: 'Action Items Open',
      momIssuedDate: '2026-07-07',
      momDueDate: '2026-07-08',
      summary: 'Executive sign-off on June SLA score attainment (95.4% resolution compliance). Approved penalty bonus credits and reviewed H2 resource capacity allocations.',
      keyDecisions: [
        'Approved full June performance certificate with 0 contractual penalties.',
        'Allocated 160 hours of AMS-OF-Flex pool to ZATCA e-invoicing schema upgrade.',
        'Scheduled DC1 to DC2 failover drill for July 24 weekend.'
      ],
      actionItems: [
        { actionId: 'ACT-005', actionDescription: 'Finalize DR failover call tree and communication plan with Jeddah DR facility', owner: 'Rashid Al Dhaheri', targetDate: '2026-07-16', status: 'Completed', priority: 'High', ctaId: 'CTA-005', isOverdue: false },
        { actionId: 'ACT-006', actionDescription: 'Submit June SLA signed attestation to Group Internal Audit', owner: 'Fatima Al-Otaibi', targetDate: '2026-07-12', status: 'Completed', priority: 'Medium', ctaId: 'CTA-006', isOverdue: false },
      ],
      openActionCount: 0,
      overdueActionCount: 0,
      relatedCTA: 'CTA-005',
    },
    {
      id: 'MOM-004',
      meetingId: 'CAL-MTG-005',
      meetingTitle: 'Weekly Service Review (WSR) with KaarTech Autonomous Systems',
      meetingDate: '2026-07-02',
      meetingTime: '10:00 – 11:30 AST',
      meetingType: 'Service Review',
      customerOrEntity: 'KaarTech Autonomous Systems',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Strategic Sourcing',
      application: 'SAP Ariba Guided Sourcing',
      owner: 'Noura Al Shamsi',
      participants: ['Noura Al Shamsi (AMS Lead)', 'Salim Al Ketbi (Autonomous Supply Chain)', 'Deepak Kumar (Integration)'],
      momStatus: 'Action Items Open',
      momIssuedDate: '2026-07-03',
      momDueDate: '2026-07-04',
      summary: 'Reviewed autonomous vehicle spare parts procurement catalog integration and Tier-1 industrial supplier punchout punchlist.',
      keyDecisions: [
        'Onboard 15 specialized avionics suppliers onto Ariba Network with automated PO acknowledgment.',
        'Add serial number attribute to Ariba ASN payload.'
      ],
      actionItems: [
        { actionId: 'ACT-007', actionDescription: 'Complete CPI mapping test for avionics supplier punchout cart', owner: 'Noura Al Shamsi', targetDate: '2026-07-18', status: 'Completed', priority: 'Medium', ctaId: 'CTA-007', isOverdue: false },
      ],
      openActionCount: 0,
      overdueActionCount: 0,
      relatedCTA: 'CTA-007',
      relatedProgram: 'PRG-003',
    },
    {
      id: 'MOM-005',
      meetingId: 'CAL-MTG-021',
      meetingTitle: 'Monthly Executive SteerCom Review (MSR) - July Contractual Sign-Off',
      meetingDate: '2026-08-03',
      meetingTime: '14:00 – 16:00 AST',
      meetingType: 'SteerCom',
      customerOrEntity: 'KaarTech Corp.',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Executive Governance',
      application: 'Enterprise AMS Landscape',
      owner: 'Dr. Tariq Al Nuaimi',
      participants: ['Dr. Tariq Al Nuaimi (SteerCom Chair)', 'Fatima Al-Otaibi (AMS Lead)', 'Executive Directors'],
      momStatus: 'Closed',
      momIssuedDate: '2026-08-04',
      momDueDate: '2026-08-05',
      summary: 'Signed off July availability and review of DR simulation success. Confirmed zero uncontained P1 incidents across all 34 entities.',
      keyDecisions: [
        'DR test certified successful: RTO achieved in 1h 48m (target 4h), RPO 0 minutes.',
        'Approved August maintenance bundle deployment schedule for August 28.'
      ],
      actionItems: [
        { actionId: 'ACT-008', actionDescription: 'Archive DR evidence bundle for ISO 22301 auditor review', owner: 'Rashid Al Dhaheri', targetDate: '2026-08-14', status: 'Completed', priority: 'Medium', ctaId: 'CTA-008', isOverdue: false },
      ],
      openActionCount: 0,
      overdueActionCount: 0,
      relatedCTA: 'CTA-008',
    },
    {
      id: 'MOM-006',
      meetingId: 'CAL-MTG-031',
      meetingTitle: 'Monthly Executive SteerCom Review (MSR) - August Contractual Sign-Off',
      meetingDate: '2026-09-02',
      meetingTime: '14:00 – 16:00 AST',
      meetingType: 'SteerCom',
      customerOrEntity: 'KaarTech Corp.',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Executive Governance',
      application: 'Enterprise AMS Landscape',
      owner: 'Dr. Tariq Al Nuaimi',
      participants: ['Dr. Tariq Al Nuaimi', 'Fatima Al-Otaibi', 'Entity Stakeholders'],
      momStatus: 'Action Items Open',
      momIssuedDate: '2026-09-03',
      momDueDate: '2026-09-04',
      summary: 'August operations sign-off. Reviewed capacity forecast for Q3 closeout and S/4HANA 2025 upgrade pre-validation checklist.',
      keyDecisions: [
        'Approved freeze window for Q3 financial closing (Sep 29–30).',
        'Authorized launch of AI Incident Co-Pilot pilot with General Shift engineers.'
      ],
      actionItems: [
        { actionId: 'ACT-009', actionDescription: 'Finalize ABAP test cockpit scans for S/4HANA upgrade pre-validation', owner: 'Sunita Reddy', targetDate: '2026-09-07', status: 'In Progress', priority: 'High', ctaId: 'CTA-009', isOverdue: false },
        { actionId: 'ACT-010', actionDescription: 'Publish Q3 change freeze reminder notice to all 34 entity CIOs', owner: 'Fatima Al-Otaibi', targetDate: '2026-09-12', status: 'Open', priority: 'High', ctaId: 'CTA-010', isOverdue: false },
      ],
      openActionCount: 2,
      overdueActionCount: 0,
      relatedCTA: 'CTA-009',
    },
    {
      id: 'MOM-007',
      meetingId: 'CAL-MTG-032',
      meetingTitle: 'Weekly Service Review (WSR) with KaarTech Heavy Mobility',
      meetingDate: '2026-09-03',
      meetingTime: '10:00 – 11:30 AST',
      meetingType: 'Service Review',
      customerOrEntity: 'KaarTech Heavy Mobility',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Manufacturing Assembly',
      application: 'SAP S/4HANA Manufacturing',
      owner: 'Ravi Shankar',
      participants: ['Ravi Shankar', 'Mansoor Al Nuaimi', 'Plant Floor Supervisor'],
      momStatus: 'Action Items Open',
      momIssuedDate: '2026-09-04',
      momDueDate: '2026-09-05',
      summary: 'Reviewed plant floor work order confirmation status and inventory batch traceability for industrial vehicle export batch.',
      keyDecisions: [
        'Deploy dedicated handheld scanner station in Bay 4.',
        'Schedule weekend mock inventory count on September 19.'
      ],
      actionItems: [
        { actionId: 'ACT-011', actionDescription: 'Configure Bay 4 scanner RF terminal IP reservation', owner: 'Yousuf Al Kaabi', targetDate: '2026-09-09', status: 'Open', priority: 'Medium', ctaId: 'CTA-011', isOverdue: false },
        { actionId: 'ACT-012', actionDescription: 'Resolve serial number duplication bug on chassis assembly', owner: 'Ankit Patel', targetDate: '2026-09-04', status: 'Overdue', priority: 'Critical', ctaId: 'CTA-012', isOverdue: true },
      ],
      openActionCount: 2,
      overdueActionCount: 1,
      relatedCTA: 'CTA-012',
    },
    {
      id: 'MOM-008',
      meetingId: 'CAL-MTG-034',
      meetingTitle: 'Weekly Service Review (WSR) with KaarTech Advanced Manufacturing',
      meetingDate: '2026-09-10',
      meetingTime: '10:00 – 11:30 AST',
      meetingType: 'Service Review',
      customerOrEntity: 'KaarTech Advanced Manufacturing',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Production Planning',
      application: 'SAP S/4HANA Manufacturing',
      owner: 'Priya Nair',
      participants: ['Priya Nair', 'Ahmad Al-Otaibi', 'Plant Quality Manager'],
      momStatus: 'MOM Pending',
      momIssuedDate: '2026-09-11',
      momDueDate: '2026-09-12',
      summary: 'Triaged scrap logging tickets and batch master modifications for industrial sensor production line.',
      keyDecisions: [
        'Add scrap reason code 412 (optical alignment variance) to S/4HANA.',
        'Quality inspection lot skip-lot logic approved for certified raw aluminum billets.'
      ],
      actionItems: [
        { actionId: 'ACT-013', actionDescription: 'Transport scrap reason code 412 configuration to production', owner: 'Priya Nair', targetDate: '2026-09-16', status: 'Open', priority: 'Medium', ctaId: 'CTA-013', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
      relatedCTA: 'CTA-013',
    },
    {
      id: 'MOM-009',
      meetingId: 'CAL-MTG-036',
      meetingTitle: 'Weekly Service Review (WSR) with KaarTech Autonomous Systems',
      meetingDate: '2026-09-17',
      meetingTime: '10:00 – 11:30 AST',
      meetingType: 'Service Review',
      customerOrEntity: 'KaarTech Autonomous Systems',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Fleet Asset Maintenance',
      application: 'SAP PM/EAM',
      owner: 'Noura Al Shamsi',
      participants: ['Noura Al Shamsi', 'Autonomous Systems Fleet Director', 'Tariq Al Dhaheri'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-09-18',
      momDueDate: '2026-09-19',
      summary: 'Scheduled review of autonomous vehicle telemetry log sync and maintenance order automated generation based on operating hours.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-014', actionDescription: 'Deliver telemetry IoT to SAP PM interface proof-of-concept', owner: 'Tariq Al Dhaheri', targetDate: '2026-09-24', status: 'Open', priority: 'High', ctaId: 'CTA-014', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
    {
      id: 'MOM-010',
      meetingId: 'CAL-MTG-038',
      meetingTitle: 'Weekly Service Review (WSR) with KaarTech HQ Executive',
      meetingDate: '2026-09-24',
      meetingTime: '14:00 – 15:30 AST',
      meetingType: 'Governance',
      customerOrEntity: 'KaarTech Corp.',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Executive Reporting',
      application: 'SAC Executive Boardrooms',
      owner: 'Fatima Al-Otaibi',
      participants: ['Fatima Al-Otaibi', 'Group IT Director', 'Procurement VP'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-09-25',
      momDueDate: '2026-09-26',
      summary: 'Quarterly review of customer satisfaction metrics, SLA attainment across all entities, and upcoming October feature rollout.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-015', actionDescription: 'Prepare Q3 executive governance slide deck for Board presentation', owner: 'Fatima Al-Otaibi', targetDate: '2026-09-28', status: 'Open', priority: 'High', ctaId: 'CTA-015', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
    {
      id: 'MOM-011',
      meetingId: 'CAL-MTG-040',
      meetingTitle: 'Weekly Service Review (WSR) with KaarTech Precision Works',
      meetingDate: '2026-10-01',
      meetingTime: '10:00 – 11:30 AST',
      meetingType: 'Service Review',
      customerOrEntity: 'KaarTech Precision Works',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Manufacturing Quality',
      application: 'SAP S/4HANA Manufacturing',
      owner: 'Ravi Shankar',
      participants: ['Ravi Shankar', 'Plant Operations Lead'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-10-02',
      momDueDate: '2026-10-03',
      summary: 'Review of precision component serialization barcode scanning and sensor calibration records integration into S/4HANA.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-016', actionDescription: 'Test proof-house automated pressure sensor calibration interface', owner: 'Ankit Patel', targetDate: '2026-10-08', status: 'Open', priority: 'Medium', ctaId: 'CTA-016', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
    {
      id: 'MOM-012',
      meetingId: 'CAL-MTG-041',
      meetingTitle: 'Monthly Executive SteerCom Review (MSR) - September Contractual Sign-Off',
      meetingDate: '2026-10-05',
      meetingTime: '14:00 – 16:00 AST',
      meetingType: 'SteerCom',
      customerOrEntity: 'KaarTech Corp.',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Executive Governance',
      application: 'Enterprise AMS Landscape',
      owner: 'Dr. Tariq Al Nuaimi',
      participants: ['Dr. Tariq Al Nuaimi', 'SteerCom Board Members'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-10-06',
      momDueDate: '2026-10-07',
      summary: 'Q3 formal contractual sign-off, penalty performance credits, and budget approval for Q4 enhancement packages.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-017', actionDescription: 'Execute contractual Q3 penalty credit true-up memorandum', owner: 'Fatima Al-Otaibi', targetDate: '2026-10-14', status: 'Open', priority: 'High', ctaId: 'CTA-017', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
    {
      id: 'MOM-013',
      meetingId: 'CAL-MTG-047',
      meetingTitle: 'Weekly Service Review (WSR) with KaarTech Secure Comms',
      meetingDate: '2026-10-22',
      meetingTime: '10:00 – 11:30 AST',
      meetingType: 'Service Review',
      customerOrEntity: 'KaarTech Secure Comms',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Product Lifecycle',
      application: 'Microsoft Dynamics 365 CRM',
      owner: 'Noura Al Shamsi',
      participants: ['Noura Al Shamsi', 'Secure Comms Product Director'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-10-23',
      momDueDate: '2026-10-24',
      summary: 'Cryptographic phone hardware RMA warranty claims and automated spare parts dispatch workflow.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-018', actionDescription: 'Implement HSM token validation step in customer portal warranty return', owner: 'Noura Al Shamsi', targetDate: '2026-10-29', status: 'Open', priority: 'High', ctaId: 'CTA-018', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
    {
      id: 'MOM-014',
      meetingId: 'CAL-MTG-050',
      meetingTitle: 'Monthly Executive SteerCom Review (MSR) - October Contractual Sign-Off',
      meetingDate: '2026-11-02',
      meetingTime: '14:00 – 16:00 AST',
      meetingType: 'SteerCom',
      customerOrEntity: 'KaarTech Corp.',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Executive Governance',
      application: 'Enterprise AMS Landscape',
      owner: 'Dr. Tariq Al Nuaimi',
      participants: ['Dr. Tariq Al Nuaimi', 'Executive Board'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-11-03',
      momDueDate: '2026-11-04',
      summary: 'October operations review, IDEX exhibition defense freeze compliance post-mortem, and year-end audit readiness.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-019', actionDescription: 'Confirm PwC audit evidence room access credentials for external team', owner: 'Fatima Al Mansoori', targetDate: '2026-11-10', status: 'Open', priority: 'High', ctaId: 'CTA-019', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
    {
      id: 'MOM-015',
      meetingId: 'CAL-MTG-056',
      meetingTitle: 'Weekly Service Review (WSR) with ADSB Naval Shipyards',
      meetingDate: '2026-11-19',
      meetingTime: '10:00 – 11:30 AST',
      meetingType: 'Service Review',
      customerOrEntity: 'ADSB',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Project Systems',
      application: 'SAP S/4HANA Project Systems',
      owner: 'Ravi Shankar',
      participants: ['Ravi Shankar', 'ADSB Commercial Director'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-11-20',
      momDueDate: '2026-11-21',
      summary: 'Naval vessel overhaul milestone billing and subcontractor percentage of completion (POC) revenue recognition.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-020', actionDescription: 'Configure milestone billing rule for Falaj naval patrol vessel retrofit', owner: 'Ravi Shankar', targetDate: '2026-11-25', status: 'Open', priority: 'Medium', ctaId: 'CTA-020', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
    {
      id: 'MOM-016',
      meetingId: 'CAL-MTG-060',
      meetingTitle: 'Monthly Executive SteerCom Review (MSR) - November Contractual Sign-Off',
      meetingDate: '2026-12-02',
      meetingTime: '14:00 – 16:00 AST',
      meetingType: 'SteerCom',
      customerOrEntity: 'KaarTech Corp.',
      serviceDomain: 'SAP ERP and SuccessFactors',
      processGroup: 'Executive Governance',
      application: 'Enterprise AMS Landscape',
      owner: 'Dr. Tariq Al Nuaimi',
      participants: ['Dr. Tariq Al Nuaimi', 'Executive Committee'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-12-03',
      momDueDate: '2026-12-04',
      summary: 'November SLA review, approval of annual change moratorium dates, and 2027 AMS capacity planning horizon sign-off.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-021', actionDescription: 'Publish 2027 AMS holiday and tri-shift operational roster', owner: 'Khalid Al Hashimi', targetDate: '2026-12-10', status: 'Open', priority: 'High', ctaId: 'CTA-021', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
  ];
}

// ═══════════════════════════════════════════════════
// CHANGE MANAGEMENT / CAB RECORDS (Section 29)
// ═══════════════════════════════════════════════════
function generateChangeRecords() {
  return [
    { id: 'CR-001', title: 'S/4HANA Sales Pricing Condition Routine Patch', changeType: 'Emergency', implementationDate: '2026-06-08', timeWindow: '23:00 – 02:00 AST', owner: 'Fatima Al-Otaibi', risk: 'Medium', status: 'Implemented', application: 'SAP S/4HANA Core', cabReviewDate: '2026-06-02' },
    { id: 'CR-002', title: 'SuccessFactors Delta Integration Mapping Pack v4.2', changeType: 'Normal', implementationDate: '2026-06-17', timeWindow: '22:00 – 01:30 AST', owner: 'Sara Al Marzouqi', risk: 'Low', status: 'Implemented', application: 'SAP SuccessFactors', cabReviewDate: '2026-06-09' },
    { id: 'CR-003', title: 'KaarTech B2B Supplier Portal MFA Session Hardening', changeType: 'Normal', implementationDate: '2026-06-24', timeWindow: '23:00 – 01:00 AST', owner: 'Ahmad Al-Otaibi', risk: 'Low', status: 'Implemented', application: 'Supplier Portal', cabReviewDate: '2026-06-16' },
    { id: 'CR-004', title: 'KaarTech June Major Sprint Release Cutover', changeType: 'Normal', implementationDate: '2026-06-30', timeWindow: '21:00 – 05:00 AST', owner: 'Release Management', risk: 'High', status: 'Implemented', application: 'Enterprise AMS Landscape', cabReviewDate: '2026-06-23' },
    { id: 'CR-005', title: 'SAP CPI Integration Suite Flow Re-certification', changeType: 'Normal', implementationDate: '2026-07-10', timeWindow: '23:00 – 02:00 AST', owner: 'Deepak Kumar', risk: 'Medium', status: 'Implemented', application: 'SAP BTP CPI', cabReviewDate: '2026-07-07' },
    { id: 'CR-006', title: 'Mid-Year Tax Engine & ZATCA E-Invoicing Regulatory Update', changeType: 'Normal', implementationDate: '2026-07-15', timeWindow: '22:00 – 03:00 AST', owner: 'Fatima Al-Otaibi', risk: 'High', status: 'Implemented', application: 'SAP S/4HANA Finance', cabReviewDate: '2026-07-07' },
    { id: 'CR-007', title: 'July KaarTech Production Maintenance Bundle', changeType: 'Normal', implementationDate: '2026-07-31', timeWindow: '22:00 – 04:00 AST', owner: 'Release Management', risk: 'High', status: 'Implemented', application: 'Enterprise AMS Landscape', cabReviewDate: '2026-07-28' },
    { id: 'CR-008', title: 'Microsoft Dynamics 365 CRM Service Sprint 4', changeType: 'Normal', implementationDate: '2026-08-07', timeWindow: '23:00 – 02:00 AST', owner: 'Hind Al Mazrouei', risk: 'Medium', status: 'Implemented', application: 'Microsoft Dynamics 365', cabReviewDate: '2026-08-04' },
    { id: 'CR-009', title: 'KaarTech August Maintenance Bundle Deployment', changeType: 'Normal', implementationDate: '2026-08-28', timeWindow: '22:00 – 04:00 AST', owner: 'Release Management', risk: 'High', status: 'Implemented', application: 'Enterprise AMS Landscape', cabReviewDate: '2026-08-25' },
    { id: 'CR-010', title: 'SAC Executive Boardroom Telemetry Optimization Patch', changeType: 'Standard', implementationDate: '2026-09-10', timeWindow: '22:00 – 01:00 AST', owner: 'Analytics Lead', risk: 'Low', status: 'Approved', application: 'SAP Analytics Cloud', cabReviewDate: '2026-09-08' },
    { id: 'CR-011', title: 'KaarTech September Production Sprint Release', changeType: 'Normal', implementationDate: '2026-09-28', timeWindow: '21:00 – 04:00 AST', owner: 'Release Management', risk: 'High', status: 'Approved', application: 'Enterprise AMS Landscape', cabReviewDate: '2026-09-22' },
    { id: 'CR-012', title: 'S/4HANA Feature Pack 02 Application Rollout', changeType: 'Normal', implementationDate: '2026-10-09', timeWindow: '21:00 – 05:00 AST', owner: 'Core Architecture', risk: 'High', status: 'Approved', application: 'SAP S/4HANA Core', cabReviewDate: '2026-10-06' },
    { id: 'CR-013', title: 'SuccessFactors Year-End Performance Module Patch', changeType: 'Normal', implementationDate: '2026-11-06', timeWindow: '22:00 – 01:00 AST', owner: 'Sara Al Marzouqi', risk: 'Medium', status: 'Scheduled', application: 'SAP SuccessFactors', cabReviewDate: '2026-11-03' },
    { id: 'CR-014', title: 'KaarTech Q4 Pre-Freeze Stabilization Release', changeType: 'Normal', implementationDate: '2026-12-18', timeWindow: '21:00 – 04:00 AST', owner: 'Release Management', risk: 'High', status: 'Scheduled', application: 'Enterprise AMS Landscape', cabReviewDate: '2026-12-15' },
  ];
}

// ═══════════════════════════════════════════════════
// GENERATE ALL DEMO DATA
// ═══════════════════════════════════════════════════
export const incidents = generateIncidents();
export const serviceRequests = generateServiceRequests();
export const enhancements = generateEnhancements();
export const problems = generateProblems();
export const risks = generateRisks();
export const audits = generateAudits();
export const findings = generateFindings();
export const remediationTasks = generateRemediationTasks();
export const ctas = generateCTAs();
export const licenses = generateLicenses();
export const knowledgeArticles = generateKnowledgeArticles();
export const customerFeedback = generateCustomerFeedback();
export const leaveRecords = generateLeaveRecords();
export const momRecords = generateMOMRecords();
export const changeRecords = generateChangeRecords();
export const notifications = generateNotifications(incidents, risks, ctas);

// ═══════════════════════════════════════════════════
// AGGREGATE STATS (for Executive Board / KPIs)
// ═══════════════════════════════════════════════════
export function getIncidentStats() {
  const total = incidents.length;
  const p1 = incidents.filter(i => i.priority === 'P1');
  const p2 = incidents.filter(i => i.priority === 'P2');
  const p3 = incidents.filter(i => i.priority === 'P3');
  const p4 = incidents.filter(i => i.priority === 'P4');
  const open = incidents.filter(i => !['Closed', 'Resolved'].includes(i.status));
  const breached = incidents.filter(i => i.slaStatus === 'Breached');

  return {
    total, open: open.length, p1: p1.length, p2: p2.length, p3: p3.length, p4: p4.length,
    breached: breached.length,
    responseSlaPercent: Math.round((incidents.filter(i => i.responseSla === 'Met').length / total) * 100),
    resolutionSlaPercent: Math.round((incidents.filter(i => ['Met', 'On Track'].includes(i.resolutionSla)).length / total) * 100),
    p1ResponseSla: p1.length ? Math.round((p1.filter(i => i.responseSla === 'Met').length / p1.length) * 100) : 100,
    p1ResolutionSla: p1.length ? Math.round((p1.filter(i => ['Met', 'On Track'].includes(i.resolutionSla)).length / p1.length) * 100) : 100,
    p2ResponseSla: p2.length ? Math.round((p2.filter(i => i.responseSla === 'Met').length / p2.length) * 100) : 100,
    p2ResolutionSla: p2.length ? Math.round((p2.filter(i => ['Met', 'On Track'].includes(i.resolutionSla)).length / p2.length) * 100) : 100,
  };
}

export function getSRStats() {
  const total = serviceRequests.length;
  const standard = serviceRequests.filter(sr => sr.srType === 'Standard');
  const major = serviceRequests.filter(sr => sr.srType === 'Major');
  const open = serviceRequests.filter(sr => !['Closed', 'Resolved', 'Rejected'].includes(sr.status));
  return { total, standard: standard.length, major: major.length, open: open.length, created: total, closed: serviceRequests.filter(sr => sr.status === 'Closed').length, slaPercent: Math.round((serviceRequests.filter(sr => sr.slaStatus === 'Met').length / total) * 100) };
}

export function getResourceStats() {
  const total = RESOURCES.length;
  const onsite = RESOURCES.filter(r => r.location === 'Onsite');
  const offshore = RESOURCES.filter(r => r.location === 'Offshore');
  const female = RESOURCES.filter(r => r.gender === 'Female');
  const saudi = RESOURCES.filter(r => r.resourceType === 'Saudi' || r.nationality === 'Saudi Arabia');
  return {
    total,
    onsite: onsite.length,
    offshore: offshore.length,
    female: female.length,
    femalePercent: Math.round((female.length / total) * 100),
    localNational: saudi.length,
    localNationalPercent: Math.round((saudi.length / total) * 100),
    saudiNationals: saudi.length,
    saudizationRate: Math.round((saudi.length / total) * 100)
  };
}



// ═══════════════════════════════════════════════════
// CHANGE MANAGEMENT MASTER — DEMO (Section 8)
// ═══════════════════════════════════════════════════
export const changes = [
  {
    "changeId": "CHG-001",
    "id": "CHG-001",
    "title": "SAP S/4HANA 2025 Feature Pack 02 Kernel Upgrade",
    "changeType": "Normal",
    "risk": "Medium",
    "serviceDomainId": "TWR-06",
    "serviceDomain": "SAP ERP and SuccessFactors",
    "processGroup": "Financial Accounting",
    "affectedService": "Core ERP",
    "affectedApplication": "SAP S/4HANA 2025",
    "owner": "Tariq Al-Mansoor",
    "plannedStart": "2026-09-20T22:00:00Z",
    "plannedEnd": "2026-09-21T04:00:00Z",
    "status": "Approved"
  },
  {
    "changeId": "CHG-002",
    "id": "CHG-002",
    "title": "Azure ExpressRoute Bandwidth Expansion to 10 Gbps",
    "changeType": "Normal",
    "risk": "Low",
    "serviceDomainId": "TWR-02",
    "serviceDomain": "Infrastructure, Cloud, and Platform Services",
    "processGroup": "Cloud Operations",
    "affectedService": "Hybrid Network",
    "affectedApplication": "Microsoft Dynamics 365 Field Service Enterprise",
    "owner": "Zaid Al-Harbi",
    "plannedStart": "2026-09-22T20:00:00Z",
    "plannedEnd": "2026-09-22T23:00:00Z",
    "status": "Scheduled"
  },
  {
    "changeId": "CHG-003",
    "id": "CHG-003",
    "title": "ServiceNow ITSM Vancouver Patch 4 Hotfix Deployment",
    "changeType": "Standard",
    "risk": "Low",
    "serviceDomainId": "TWR-03",
    "serviceDomain": "Applications, Digital, and Integration",
    "processGroup": "Service Desk Operations",
    "affectedService": "ITSM Platform",
    "affectedApplication": "eVendor Portal",
    "owner": "Bandar Al-Khamis",
    "plannedStart": "2026-09-18T18:00:00Z",
    "plannedEnd": "2026-09-18T20:00:00Z",
    "status": "Implemented"
  },
  {
    "changeId": "CHG-004",
    "id": "CHG-004",
    "title": "Power BI Premium Capacity Refresh & Pipeline Optimization",
    "changeType": "Minor",
    "risk": "Low",
    "serviceDomainId": "TWR-04",
    "serviceDomain": "Data, Analytics, AI, and Automation",
    "processGroup": "Management Accounting",
    "affectedService": "BI Analytics",
    "affectedApplication": "Microsoft Power BI",
    "owner": "Laila Al-Ghamdi",
    "plannedStart": "2026-09-19T01:00:00Z",
    "plannedEnd": "2026-09-19T03:00:00Z",
    "status": "Approved"
  },
  {
    "changeId": "CHG-005",
    "id": "CHG-005",
    "title": "Enterprise Automated Regression Suite Integration into CI/CD",
    "changeType": "Normal",
    "risk": "Low",
    "serviceDomainId": "TWR-05",
    "serviceDomain": "Architecture, Quality, and Testing",
    "processGroup": "Quality Management",
    "affectedService": "Quality Gateways",
    "affectedApplication": "SAP LeanIX",
    "owner": "Sultan Al-Shahrani",
    "plannedStart": "2026-09-23T14:00:00Z",
    "plannedEnd": "2026-09-23T16:00:00Z",
    "status": "Draft"
  },
  {
    "changeId": "CHG-006",
    "id": "CHG-006",
    "title": "Windows 11 Enterprise 24H2 Ring 1 Pilot Deployment",
    "changeType": "Normal",
    "risk": "Medium",
    "serviceDomainId": "TWR-01",
    "serviceDomain": "IT Helpdesk & End User Services",
    "processGroup": "Service Desk Operations",
    "affectedService": "Modern Desktop",
    "affectedApplication": "Microsoft Dynamics Marketing Tenant",
    "owner": "Mona Al-Zahrani",
    "plannedStart": "2026-09-25T08:00:00Z",
    "plannedEnd": "2026-09-25T17:00:00Z",
    "status": "Under Review"
  },
  {
    "changeId": "CHG-007",
    "id": "CHG-007",
    "title": "ITIL 4 Incident & Major Incident Escalation Matrix Recalibration",
    "changeType": "Standard",
    "risk": "Low",
    "serviceDomainId": "TWR-07",
    "serviceDomain": "Service Management, Governance, and Delivery",
    "processGroup": "Service Management",
    "affectedService": "ITSM Governance",
    "affectedApplication": "SAP S/4HANA 2025",
    "owner": "Saad Al-Dossari",
    "plannedStart": "2026-09-17T09:00:00Z",
    "plannedEnd": "2026-09-17T11:00:00Z",
    "status": "Approved"
  }
];
