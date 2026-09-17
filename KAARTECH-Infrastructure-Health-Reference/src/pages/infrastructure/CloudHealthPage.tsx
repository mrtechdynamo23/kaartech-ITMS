import React from 'react';
import DataTable, { type ColumnDef, type FilterDef } from '../../components/common/DataTable';
import SubPageHeader from '../../components/navigation/SubPageHeader';
import { INFRASTRUCTURE_SIBLINGS } from './InfrastructureLandingPage';

interface CloudResource {
  id: string;
  name: string;
  provider: 'Google Cloud (GCP)' | 'Microsoft Azure';
  resourceType: 'Kubernetes Cluster (GKE/AKS)' | 'Cloud SQL' | 'Compute Engine' | 'Virtual Network' | 'Cloud Storage';
  region: string;
  workloadScope: string;
  monthlyCostSAR: number;
  cpuUtilPct: number;
  complianceScore: number;
  status: 'Healthy' | 'Warning' | 'Critical';
  cloudLead: string;
}

const cloudResources: CloudResource[] = [
  { id: 'CLD-001', name: 'gcp-ncgr-prod-gke-01', provider: 'Google Cloud (GCP)', resourceType: 'Kubernetes Cluster (GKE/AKS)', region: 'me-central2 (Dammam)', workloadScope: 'Digital Citizen Portal Microservices', monthlyCostSAR: 38000, cpuUtilPct: 52, complianceScore: 98, status: 'Healthy', cloudLead: 'Priya Nair' },
  { id: 'CLD-002', name: 'az-ncgr-prod-aks-01', provider: 'Microsoft Azure', resourceType: 'Kubernetes Cluster (GKE/AKS)', region: 'Qatar Central', workloadScope: 'Enterprise Integration APIs', monthlyCostSAR: 29000, cpuUtilPct: 38, complianceScore: 94, status: 'Healthy', cloudLead: 'Priya Nair' },
  { id: 'CLD-003', name: 'gcp-cloudsql-portal-prd', provider: 'Google Cloud (GCP)', resourceType: 'Cloud SQL', region: 'me-central2 (Dammam)', workloadScope: 'Portal Database HA Cluster', monthlyCostSAR: 14500, cpuUtilPct: 48, complianceScore: 96, status: 'Healthy', cloudLead: 'Omar Al-Mutairi' },
  { id: 'CLD-004', name: 'az-sql-managed-instance', provider: 'Microsoft Azure', resourceType: 'Cloud SQL', region: 'Qatar Central', workloadScope: 'BI & Analytics Cloud DB', monthlyCostSAR: 22000, cpuUtilPct: 62, complianceScore: 92, status: 'Healthy', cloudLead: 'Omar Al-Mutairi' },
  { id: 'CLD-005', name: 'gcp-storage-audit-logs', provider: 'Google Cloud (GCP)', resourceType: 'Cloud Storage', region: 'me-central2 (Dammam)', workloadScope: 'Immutable Security Audit Logs', monthlyCostSAR: 8400, cpuUtilPct: 20, complianceScore: 100, status: 'Healthy', cloudLead: 'Daniel Mathew' },
  { id: 'CLD-006', name: 'az-vnet-hub-interconnect', provider: 'Microsoft Azure', resourceType: 'Virtual Network', region: 'ExpressRoute Direct', workloadScope: 'Hybrid Cloud Interconnect WAN', monthlyCostSAR: 16000, cpuUtilPct: 55, complianceScore: 95, status: 'Healthy', cloudLead: 'Mohammed Al-Dosari' },
  { id: 'CLD-007', name: 'gcp-ncgr-dev-cluster', provider: 'Google Cloud (GCP)', resourceType: 'Kubernetes Cluster (GKE/AKS)', region: 'me-central2 (Dammam)', workloadScope: 'Dev / Testing Sandbox', monthlyCostSAR: 12000, cpuUtilPct: 75, complianceScore: 90, status: 'Warning', cloudLead: 'Priya Nair' },
];

const CloudHealthPage: React.FC = () => {
  const totalCostSAR = cloudResources.reduce((s, c) => s + c.monthlyCostSAR, 0);
  const healthyCount = cloudResources.filter(c => c.status === 'Healthy').length;

  const columns: ColumnDef<CloudResource>[] = [
    {
      header: 'Resource ID',
      accessorKey: 'id',
      width: '100px',
      cell: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--ncgr-deep-blue, #074A76)', fontFamily: 'monospace' }}>
          {row.id}
        </span>
      ),
    },
    {
      header: 'Resource Name & Provider',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text, #101828)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)' }}>
            Provider: {row.provider} • Region: {row.region}
          </div>
        </div>
      ),
    },
    {
      header: 'Resource Type & Scope',
      accessorKey: 'resourceType',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.resourceType}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475467)' }}>{row.workloadScope}</div>
        </div>
      ),
    },
    {
      header: 'Monthly Spend (SAR)',
      accessorKey: 'monthlyCostSAR',
      cell: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--ncgr-deep-blue, #074A76)' }}>
          {row.monthlyCostSAR.toLocaleString()} SAR/mo
        </span>
      ),
    },
    {
      header: 'Utilization & Compliance',
      accessorKey: 'cpuUtilPct',
      cell: (row) => (
        <div style={{ minWidth: 100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 2 }}>
            <span>CPU: <strong>{row.cpuUtilPct}%</strong></span>
            <span>Security: <strong>{row.complianceScore}%</strong></span>
          </div>
          <div style={{ height: 5, width: '100%', background: 'var(--bg-secondary, #F7F8FA)', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${row.complianceScore}%`,
                background: '#40904F',
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Cloud Lead',
      accessorKey: 'cloudLead',
      cell: (row) => <span style={{ fontWeight: 600 }}>{row.cloudLead}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => {
        const bg = row.status === 'Healthy' ? '#E3FCEF' : '#FFF7E6';
        const color = row.status === 'Healthy' ? '#22A06B' : '#E97F0A';
        return (
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 12,
              background: bg,
              color: color,
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  const uniqueProviders = Array.from(new Set(cloudResources.map(c => c.provider))).map(p => ({ label: p, value: p }));
  const uniqueTypes = Array.from(new Set(cloudResources.map(c => c.resourceType))).map(t => ({ label: t, value: t }));

  const filters: FilterDef<CloudResource>[] = [
    { key: 'provider', label: 'Cloud Providers', options: uniqueProviders },
    { key: 'resourceType', label: 'Resource Types', options: uniqueTypes },
  ];

  return (
    <div className="page-container" style={{ paddingBottom: 40 }}>
      {/* Sub-Page Header with Breadcrumb and Sibling Navigation */}
      <SubPageHeader
        moduleTitle="Infrastructure Health"
        modulePath="/infrastructure"
        pageTitle="Cloud Health"
        siblingPages={INFRASTRUCTURE_SIBLINGS}
      />

      {/* KPI Cards Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary, #475467)', textTransform: 'uppercase' }}>Cloud Workloads</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ncgr-deep-blue, #074A76)', marginTop: 4 }}>{cloudResources.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>GCP & Azure Subscriptions</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#22A06B', textTransform: 'uppercase' }}>Cluster Health</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22A06B', marginTop: 4 }}>{healthyCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#22A06B', marginTop: 2, fontWeight: 600 }}>GKE / AKS 100% online</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ncgr-deep-blue, #074A76)', textTransform: 'uppercase' }}>Total Monthly Spend</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ncgr-deep-blue, #074A76)', marginTop: 4 }}>
            {totalCostSAR.toLocaleString()} SAR
          </div>
          <div style={{ fontSize: '0.75rem', color: '#40904F', marginTop: 2, fontWeight: 600 }}>-3.2% under monthly budget</div>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        data={cloudResources}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search cloud resources by name, provider, region, lead..."
        searchKeys={['name', 'provider', 'resourceType', 'region', 'cloudLead', 'workloadScope']}
        pageSize={10}
        title="Enterprise Cloud Infrastructure Estate"
        subtitle="Managed container clusters, cloud SQL instances, and secure interconnects"
        exportFilename="ncgr_cloud_health"
      />
    </div>
  );
};

export default CloudHealthPage;
