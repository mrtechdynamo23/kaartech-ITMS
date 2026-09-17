import React from 'react';
import DataTable, { type ColumnDef, type FilterDef } from '../../components/common/DataTable';
import SubPageHeader from '../../components/navigation/SubPageHeader';
import { INFRASTRUCTURE_SIBLINGS } from './InfrastructureLandingPage';

interface VMInstance {
  id: string;
  name: string;
  hypervisorHost: string;
  vCpuCount: number;
  ramGb: number;
  diskGb: number;
  cpuUtilPct: number;
  ramUtilPct: number;
  os: string;
  assignedApplication: string;
  status: 'Healthy' | 'Warning' | 'Critical';
  owner: string;
}

const vmsList: VMInstance[] = [
  { id: 'VM-001', name: 'VM-SAP-APP-01', hypervisorHost: 'ESXI-PRD-R1-01', vCpuCount: 16, ramGb: 64, diskGb: 500, cpuUtilPct: 46, ramUtilPct: 70, os: 'SUSE Linux Enterprise 15', assignedApplication: 'SAP ERP Production', status: 'Healthy', owner: 'Sara Al-Otaibi' },
  { id: 'VM-002', name: 'VM-SAP-APP-02', hypervisorHost: 'ESXI-PRD-R1-02', vCpuCount: 16, ramGb: 64, diskGb: 500, cpuUtilPct: 78, ramUtilPct: 88, os: 'SUSE Linux Enterprise 15', assignedApplication: 'SAP ERP Production', status: 'Warning', owner: 'Sara Al-Otaibi' },
  { id: 'VM-003', name: 'VM-HYPERION-01', hypervisorHost: 'ESXI-PRD-R1-02', vCpuCount: 12, ramGb: 48, diskGb: 400, cpuUtilPct: 81, ramUtilPct: 86, os: 'Windows Server 2022', assignedApplication: 'Oracle Hyperion HFM', status: 'Warning', owner: 'Sara Al-Otaibi' },
  { id: 'VM-004', name: 'VM-WEBLOGIC-01', hypervisorHost: 'ESXI-PRD-R1-03', vCpuCount: 8, ramGb: 32, diskGb: 250, cpuUtilPct: 39, ramUtilPct: 62, os: 'RHEL 8.6', assignedApplication: 'Enterprise Middleware', status: 'Healthy', owner: 'Arjun Menon' },
  { id: 'VM-005', name: 'VM-WEBLOGIC-02', hypervisorHost: 'ESXI-PRD-R1-01', vCpuCount: 8, ramGb: 32, diskGb: 250, cpuUtilPct: 42, ramUtilPct: 58, os: 'RHEL 8.6', assignedApplication: 'Enterprise Middleware', status: 'Healthy', owner: 'Arjun Menon' },
  { id: 'VM-006', name: 'VM-CITRIX-VDA-01', hypervisorHost: 'ESXI-PRD-R1-03', vCpuCount: 24, ramGb: 128, diskGb: 800, cpuUtilPct: 61, ramUtilPct: 75, os: 'Windows Server 2022', assignedApplication: 'Virtual Desktop Infrastructure', status: 'Healthy', owner: 'Layla Hassan' },
  { id: 'VM-007', name: 'VM-SPLUNK-IDX-01', hypervisorHost: 'ESXI-PRD-R1-02', vCpuCount: 16, ramGb: 64, diskGb: 1200, cpuUtilPct: 72, ramUtilPct: 84, os: 'RHEL 8.8', assignedApplication: 'Splunk Log Indexer', status: 'Healthy', owner: 'Khalid Al-Shammari' },
  { id: 'VM-008', name: 'VM-SOLARWINDS-01', hypervisorHost: 'ESXI-PRD-R1-01', vCpuCount: 8, ramGb: 32, diskGb: 300, cpuUtilPct: 35, ramUtilPct: 52, os: 'Windows Server 2022', assignedApplication: 'Network Management Server', status: 'Healthy', owner: 'Mohammed Al-Dosari' },
];

const VMHealthPage: React.FC = () => {
  const healthyCount = vmsList.filter(v => v.status === 'Healthy').length;
  const warningCount = vmsList.filter(v => v.status === 'Warning').length;

  const columns: ColumnDef<VMInstance>[] = [
    {
      header: 'VM ID',
      accessorKey: 'id',
      width: '100px',
      cell: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--ncgr-deep-blue, #074A76)', fontFamily: 'monospace' }}>
          {row.id}
        </span>
      ),
    },
    {
      header: 'VM Name & Host',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text, #101828)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)' }}>
            Host: {row.hypervisorHost} • {row.os}
          </div>
        </div>
      ),
    },
    {
      header: 'Application Scope',
      accessorKey: 'assignedApplication',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.assignedApplication}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475467)' }}>Owner: {row.owner}</div>
        </div>
      ),
    },
    {
      header: 'Sizing (vCPU / RAM / Disk)',
      accessorKey: 'vCpuCount',
      cell: (row) => (
        <span style={{ fontSize: '0.8125rem', fontFamily: 'monospace', fontWeight: 600 }}>
          {row.vCpuCount} vCPU • {row.ramGb} GB • {row.diskGb} GB
        </span>
      ),
    },
    {
      header: 'CPU & RAM Telemetry',
      accessorKey: 'cpuUtilPct',
      cell: (row) => (
        <div style={{ minWidth: 100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 2 }}>
            <span>CPU: <strong>{row.cpuUtilPct}%</strong></span>
            <span>RAM: <strong>{row.ramUtilPct}%</strong></span>
          </div>
          <div style={{ height: 5, width: '100%', background: 'var(--bg-secondary, #F7F8FA)', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${row.ramUtilPct}%`,
                background: row.ramUtilPct > 85 ? '#DE350B' : row.ramUtilPct > 75 ? '#E97F0A' : '#40904F',
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => {
        const bg = row.status === 'Healthy' ? '#E3FCEF' : row.status === 'Warning' ? '#FFF7E6' : '#FFEBE6';
        const color = row.status === 'Healthy' ? '#22A06B' : row.status === 'Warning' ? '#E97F0A' : '#DE350B';
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

  const uniqueHosts = Array.from(new Set(vmsList.map(v => v.hypervisorHost))).map(h => ({ label: h, value: h }));

  const filters: FilterDef<VMInstance>[] = [
    { key: 'hypervisorHost', label: 'Hypervisor Hosts', options: uniqueHosts },
    {
      key: 'status',
      label: 'Statuses',
      options: [
        { label: 'Healthy', value: 'Healthy' },
        { label: 'Warning', value: 'Warning' },
      ],
    },
  ];

  return (
    <div className="page-container" style={{ paddingBottom: 40 }}>
      {/* Sub-Page Header with Breadcrumb and Sibling Navigation */}
      <SubPageHeader
        moduleTitle="Infrastructure Health"
        modulePath="/infrastructure"
        pageTitle="VM Health"
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
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary, #475467)', textTransform: 'uppercase' }}>Virtual Machines</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ncgr-deep-blue, #074A76)', marginTop: 4 }}>{vmsList.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>ESXi 8.0 Cluster</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#22A06B', textTransform: 'uppercase' }}>Healthy VMs</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22A06B', marginTop: 4 }}>{healthyCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#22A06B', marginTop: 2, fontWeight: 600 }}>Normal CPU/RAM</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E97F0A', textTransform: 'uppercase' }}>High Resource Warning</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#E97F0A', marginTop: 4 }}>{warningCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#E97F0A', marginTop: 2, fontWeight: 600 }}>RAM &gt; 85% Load</div>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        data={vmsList}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search virtual machines by name, host, app, owner..."
        searchKeys={['name', 'hypervisorHost', 'assignedApplication', 'os', 'owner']}
        pageSize={10}
        title="Enterprise Virtual Machine Estate"
        subtitle="Live vSphere cluster resource allocations and guest monitoring"
        exportFilename="ncgr_vm_health"
      />
    </div>
  );
};

export default VMHealthPage;
