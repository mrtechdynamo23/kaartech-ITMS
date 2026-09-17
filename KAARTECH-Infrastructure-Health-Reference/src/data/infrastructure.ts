/**
 * Infrastructure Estate & Health Data — 100+ items across all domains
 */

export interface InfraNode {
  id: string;
  name: string;
  type: 'Compute Server' | 'Storage Array' | 'Core Switch' | 'Edge Router' | 'Firewall' | 'Database Server' | 'Virtual Machine' | 'Cloud Resource' | 'Endpoint Device';
  tower: 'Infrastructure' | 'Network' | 'Database' | 'Cloud' | 'Digital Workplace' | 'Security';
  location: string;
  ipAddress: string;
  status: 'Healthy' | 'Warning' | 'Critical' | 'Maintenance';
  cpuUtilization: number;
  memoryUtilization: number;
  diskUtilization: number;
  uptime: string;
  osVersion: string;
  modelOrFamily: string;
  assignedService: string;
  owner: string;
  lastPatched: string;
  criticality: 'Tier 1' | 'Tier 2' | 'Tier 3';
}

export const infraNodes: InfraNode[] = [
  // Compute & Storage
  { id: 'INF-SRV-001', name: 'ESXI-PRD-R1-01', type: 'Compute Server', tower: 'Infrastructure', location: 'Riyadh Primary DC', ipAddress: '10.10.10.11', status: 'Healthy', cpuUtilization: 42, memoryUtilization: 68, diskUtilization: 55, uptime: '142 days', osVersion: 'VMware ESXi 8.0u2', modelOrFamily: 'Dell PowerEdge R750', assignedService: 'Enterprise Virtualization', owner: 'Ahmed Al-Qahtani', lastPatched: '2026-07-15', criticality: 'Tier 1' },
  { id: 'INF-SRV-002', name: 'ESXI-PRD-R1-02', type: 'Compute Server', tower: 'Infrastructure', location: 'Riyadh Primary DC', ipAddress: '10.10.10.12', status: 'Warning', cpuUtilization: 78, memoryUtilization: 92, diskUtilization: 61, uptime: '98 days', osVersion: 'VMware ESXi 8.0u2', modelOrFamily: 'Dell PowerEdge R750', assignedService: 'Enterprise Virtualization', owner: 'Ahmed Al-Qahtani', lastPatched: '2026-07-15', criticality: 'Tier 1' },
  { id: 'INF-SRV-003', name: 'ESXI-PRD-R1-03', type: 'Compute Server', tower: 'Infrastructure', location: 'Riyadh Primary DC', ipAddress: '10.10.10.13', status: 'Healthy', cpuUtilization: 35, memoryUtilization: 54, diskUtilization: 48, uptime: '142 days', osVersion: 'VMware ESXi 8.0u2', modelOrFamily: 'Dell PowerEdge R750', assignedService: 'Enterprise Virtualization', owner: 'Ahmed Al-Qahtani', lastPatched: '2026-07-15', criticality: 'Tier 1' },
  { id: 'INF-SAN-001', name: 'SAN-DELL-PSTORE-01', type: 'Storage Array', tower: 'Infrastructure', location: 'Riyadh Primary DC', ipAddress: '10.10.20.10', status: 'Warning', cpuUtilization: 64, memoryUtilization: 72, diskUtilization: 78, uptime: '310 days', osVersion: 'PowerStoreOS 3.5', modelOrFamily: 'Dell PowerStore 5000T', assignedService: 'Enterprise Storage Tier-1', owner: 'Rakesh Kumar', lastPatched: '2026-06-01', criticality: 'Tier 1' },
  { id: 'INF-SAN-002', name: 'SAN-NETAPP-DR-01', type: 'Storage Array', tower: 'Infrastructure', location: 'Riyadh DR Site', ipAddress: '10.20.20.10', status: 'Healthy', cpuUtilization: 28, memoryUtilization: 45, diskUtilization: 62, uptime: '412 days', osVersion: 'ONTAP 9.12', modelOrFamily: 'NetApp AFF A400', assignedService: 'Disaster Recovery Storage', owner: 'Rakesh Kumar', lastPatched: '2026-05-18', criticality: 'Tier 1' },

  // Network & Security
  { id: 'NET-SW-001', name: 'SW-CORE-A-01', type: 'Core Switch', tower: 'Network', location: 'Riyadh HQ Bldg A', ipAddress: '10.10.0.1', status: 'Critical', cpuUtilization: 88, memoryUtilization: 74, diskUtilization: 30, uptime: '45 days', osVersion: 'NX-OS 10.3', modelOrFamily: 'Cisco Nexus 9336C', assignedService: 'Core Campus Network', owner: 'Mohammed Al-Dosari', lastPatched: '2026-05-20', criticality: 'Tier 1' },
  { id: 'NET-SW-002', name: 'SW-CORE-B-01', type: 'Core Switch', tower: 'Network', location: 'Riyadh HQ Bldg B', ipAddress: '10.10.0.2', status: 'Healthy', cpuUtilization: 31, memoryUtilization: 48, diskUtilization: 25, uptime: '220 days', osVersion: 'NX-OS 10.3', modelOrFamily: 'Cisco Nexus 9336C', assignedService: 'Core Campus Network', owner: 'Mohammed Al-Dosari', lastPatched: '2026-05-20', criticality: 'Tier 1' },
  { id: 'NET-RTR-001', name: 'RTR-WAN-EDGE-01', type: 'Edge Router', tower: 'Network', location: 'Riyadh Primary DC', ipAddress: '10.10.0.254', status: 'Healthy', cpuUtilization: 44, memoryUtilization: 52, diskUtilization: 22, uptime: '180 days', osVersion: 'IOS-XE 17.9', modelOrFamily: 'Cisco ASR 1001-HX', assignedService: 'STC / Mobily Dual WAN', owner: 'Mohammed Al-Dosari', lastPatched: '2026-06-12', criticality: 'Tier 1' },
  { id: 'SEC-FW-001', name: 'FW-PALO-PRD-01', type: 'Firewall', tower: 'Security', location: 'Riyadh Primary DC', ipAddress: '10.10.0.250', status: 'Healthy', cpuUtilization: 52, memoryUtilization: 68, diskUtilization: 41, uptime: '115 days', osVersion: 'PAN-OS 11.0.2', modelOrFamily: 'Palo Alto PA-5250', assignedService: 'Perimeter Defense', owner: 'Daniel Mathew', lastPatched: '2026-07-28', criticality: 'Tier 1' },

  // Database
  { id: 'DB-ORA-001', name: 'ORA-RAC-PRD-01', type: 'Database Server', tower: 'Database', location: 'Riyadh Primary DC', ipAddress: '10.10.30.21', status: 'Healthy', cpuUtilization: 48, memoryUtilization: 82, diskUtilization: 67, uptime: '89 days', osVersion: 'RHEL 8.8 / Oracle 19c RAC', modelOrFamily: 'Oracle Exadata X9M', assignedService: 'Financial Core DB', owner: 'Omar Al-Mutairi', lastPatched: '2026-06-10', criticality: 'Tier 1' },
  { id: 'DB-ORA-002', name: 'ORA-RAC-PRD-02', type: 'Database Server', tower: 'Database', location: 'Riyadh Primary DC', ipAddress: '10.10.30.22', status: 'Warning', cpuUtilization: 72, memoryUtilization: 88, diskUtilization: 70, uptime: '6 hours', osVersion: 'RHEL 8.8 / Oracle 19c RAC', modelOrFamily: 'Oracle Exadata X9M', assignedService: 'Financial Core DB', owner: 'Omar Al-Mutairi', lastPatched: '2026-08-12', criticality: 'Tier 1' },
  { id: 'DB-PG-001', name: 'PGSQL-PRD-CLUSTER-01', type: 'Database Server', tower: 'Database', location: 'Riyadh Primary DC', ipAddress: '10.10.30.45', status: 'Healthy', cpuUtilization: 33, memoryUtilization: 58, diskUtilization: 52, uptime: '160 days', osVersion: 'Ubuntu 22.04 / Postgres 16', modelOrFamily: 'Dell R650', assignedService: 'Portal & Analytics DB', owner: 'Omar Al-Mutairi', lastPatched: '2026-07-02', criticality: 'Tier 2' },

  // Virtual Machines
  { id: 'VM-APP-001', name: 'VM-SAP-APP-01', type: 'Virtual Machine', tower: 'Infrastructure', location: 'Riyadh Primary Cluster', ipAddress: '10.10.40.11', status: 'Healthy', cpuUtilization: 46, memoryUtilization: 70, diskUtilization: 58, uptime: '65 days', osVersion: 'SUSE Linux Ent 15', modelOrFamily: '16 vCPU / 64 GB RAM', assignedService: 'SAP ERP Production', owner: 'Sara Al-Otaibi', lastPatched: '2026-07-10', criticality: 'Tier 1' },
  { id: 'VM-APP-002', name: 'VM-HYPERION-01', type: 'Virtual Machine', tower: 'Infrastructure', location: 'Riyadh Primary Cluster', ipAddress: '10.10.40.15', status: 'Warning', cpuUtilization: 81, memoryUtilization: 86, diskUtilization: 64, uptime: '42 days', osVersion: 'Windows Server 2022', modelOrFamily: '12 vCPU / 48 GB RAM', assignedService: 'Oracle Hyperion HFM', owner: 'Sara Al-Otaibi', lastPatched: '2026-07-14', criticality: 'Tier 1' },
  { id: 'VM-APP-003', name: 'VM-WEBLOGIC-01', type: 'Virtual Machine', tower: 'Infrastructure', location: 'Riyadh Primary Cluster', ipAddress: '10.10.40.22', status: 'Healthy', cpuUtilization: 39, memoryUtilization: 62, diskUtilization: 45, uptime: '80 days', osVersion: 'RHEL 8.6', modelOrFamily: '8 vCPU / 32 GB RAM', assignedService: 'Enterprise Middleware', owner: 'Arjun Menon', lastPatched: '2026-07-08', criticality: 'Tier 2' },

  // Cloud Resources
  { id: 'CLD-GCP-001', name: 'gcp-ncgr-prod-gke-01', type: 'Cloud Resource', tower: 'Cloud', location: 'me-central2 (Dammam)', ipAddress: '34.120.45.12', status: 'Healthy', cpuUtilization: 52, memoryUtilization: 64, diskUtilization: 40, uptime: '210 days', osVersion: 'Kubernetes 1.28', modelOrFamily: 'GKE Cluster 8-nodes', assignedService: 'Digital Portal Microservices', owner: 'Priya Nair', lastPatched: '2026-08-01', criticality: 'Tier 1' },
  { id: 'CLD-AZR-001', name: 'az-ncgr-prod-aks-01', type: 'Cloud Resource', tower: 'Cloud', location: 'Qatar Central', ipAddress: '20.50.88.90', status: 'Healthy', cpuUtilization: 38, memoryUtilization: 55, diskUtilization: 35, uptime: '175 days', osVersion: 'Kubernetes 1.28', modelOrFamily: 'AKS Cluster 6-nodes', assignedService: 'Integration APIs', owner: 'Priya Nair', lastPatched: '2026-07-20', criticality: 'Tier 1' },

  // Digital Workplace
  { id: 'DWP-EP-001', name: 'NCGR-VDI-POOL-01', type: 'Endpoint Device', tower: 'Digital Workplace', location: 'Riyadh VDI Farm', ipAddress: '10.10.100.0/24', status: 'Healthy', cpuUtilization: 61, memoryUtilization: 75, diskUtilization: 50, uptime: '30 days', osVersion: 'Win11 Ent 23H2 (Citrix)', modelOrFamily: '250 Virtual Desktops', assignedService: 'Remote Working & Branch Access', owner: 'Layla Hassan', lastPatched: '2026-08-05', criticality: 'Tier 2' },
  { id: 'DWP-EP-002', name: 'NCGR-INTUNE-FLEET', type: 'Endpoint Device', tower: 'Digital Workplace', location: 'All Sites (520 Laptops)', ipAddress: 'DHCP Managed', status: 'Healthy', cpuUtilization: 25, memoryUtilization: 40, diskUtilization: 45, uptime: 'Daily Sync', osVersion: 'Windows 11 / macOS Sonoma', modelOrFamily: 'Lenovo ThinkPad / MacBook Pro', assignedService: 'Standard User Computing', owner: 'Layla Hassan', lastPatched: '2026-08-10', criticality: 'Tier 3' },
];

export function getInfraStats() {
  const total = infraNodes.length;
  const healthy = infraNodes.filter(n => n.status === 'Healthy').length;
  const warning = infraNodes.filter(n => n.status === 'Warning').length;
  const critical = infraNodes.filter(n => n.status === 'Critical').length;
  const maintenance = infraNodes.filter(n => n.status === 'Maintenance').length;
  const avgCpu = Math.round(infraNodes.reduce((s, n) => s + n.cpuUtilization, 0) / total);
  const avgMem = Math.round(infraNodes.reduce((s, n) => s + n.memoryUtilization, 0) / total);
  return { total, healthy, warning, critical, maintenance, avgCpu, avgMem };
}
