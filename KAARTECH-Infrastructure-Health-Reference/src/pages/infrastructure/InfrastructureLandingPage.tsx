import React from 'react';
import {
  Server, Network, Database, HardDrive, Cloud, Monitor
} from 'lucide-react';
import ModuleLandingHub, { type SubTileItem } from '../../components/navigation/ModuleLandingHub';

export const INFRASTRUCTURE_SIBLINGS = [
  { id: 'overview', title: 'Infrastructure Health', path: '/infrastructure/overview', icon: <Server size={14} /> },
  { id: 'network', title: 'Network Health', path: '/infrastructure/network', icon: <Network size={14} /> },
  { id: 'database', title: 'Database Health', path: '/infrastructure/database', icon: <Database size={14} /> },
  { id: 'vm', title: 'VM Health', path: '/infrastructure/vm', icon: <HardDrive size={14} /> },
  { id: 'cloud', title: 'Cloud Health', path: '/infrastructure/cloud', icon: <Cloud size={14} /> },
  { id: 'workplace', title: 'Digital Workplace', path: '/infrastructure/digital-workplace', icon: <Monitor size={14} /> },
];

const InfrastructureLandingPage: React.FC = () => {
  const subTiles: SubTileItem[] = [
    {
      id: 'infra-overview',
      title: 'Infrastructure Health',
      description: 'Datacenter host blades, Dell PowerEdge chassis, enterprise SAN arrays, and hyper-converged clusters.',
      icon: <Server size={22} />,
      path: '/infrastructure/overview',
      kpiValue: '24 Host Blades',
      kpiLabel: '99.98% Compute Uptime',
      badge: 'Operational',
      badgeType: 'healthy',
    },
    {
      id: 'infra-network',
      title: 'Network Health',
      description: 'Core spine-leaf switches, FortiGate NGFW firewall clusters, SD-WAN branch uplinks, and BGP routes.',
      icon: <Network size={22} />,
      path: '/infrastructure/network',
      kpiValue: '68 Core Devices',
      kpiLabel: 'Zero Uplink Interruptions',
      badge: 'Full Mesh',
      badgeType: 'healthy',
    },
    {
      id: 'infra-db',
      title: 'Database Health',
      description: 'Oracle 19c RAC / Exadata cells, Microsoft SQL AlwaysOn, PostgreSQL, IOPS latency, and automated backups.',
      icon: <Database size={22} />,
      path: '/infrastructure/database',
      kpiValue: '32 DB Instances',
      kpiLabel: '100% Backup Verification',
      badge: 'HA Cluster',
      badgeType: 'healthy',
    },
    {
      id: 'infra-vm',
      title: 'VM Health',
      description: 'VMware vSphere 8 virtual machines, CPU/RAM utilization profiles, DRS cluster balancing, and storage IOPS.',
      icon: <HardDrive size={22} />,
      path: '/infrastructure/vm',
      kpiValue: '340 Virtual Machines',
      kpiLabel: 'Optimal Workload Density',
      badge: 'Balanced',
      badgeType: 'info',
    },
    {
      id: 'infra-cloud',
      title: 'Cloud Health',
      description: 'Google Cloud Platform (GCP) and Azure landing zones, Kubernetes clusters, Cloud Storage, and VPC peering.',
      icon: <Cloud size={22} />,
      path: '/infrastructure/cloud',
      kpiValue: '120 Cloud Compute Nodes',
      kpiLabel: 'Multi-Zone Availability',
      badge: 'Multi-Cloud',
      badgeType: 'info',
    },
    {
      id: 'infra-workplace',
      title: 'Digital Workplace',
      description: 'Corporate laptop fleet, VDI sessions, Microsoft Intune compliance, meeting rooms, and print infrastructure.',
      icon: <Monitor size={22} />,
      path: '/infrastructure/digital-workplace',
      kpiValue: '850 Managed Endpoints',
      kpiLabel: '98.6% Compliance Rate',
      badge: 'Secured Fleet',
      badgeType: 'healthy',
    },
  ];

  return (
    <ModuleLandingHub
      moduleTitle="Infrastructure Health"
      moduleSubtitle="Comprehensive telemetry across datacenter compute, enterprise networking, databases, virtualisation, cloud, and digital workplace."
      categoryLabel="SERVICE & TECHNOLOGY"
      subTiles={subTiles}
    />
  );
};

export default InfrastructureLandingPage;
