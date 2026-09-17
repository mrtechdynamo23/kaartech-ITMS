import React from 'react';
import DataTable, { type ColumnDef } from '../../components/common/DataTable';
import SubPageHeader from '../../components/navigation/SubPageHeader';
import { INFRASTRUCTURE_SIBLINGS } from './InfrastructureLandingPage';

interface WorkplaceDeviceGroup {
  id: string;
  category: 'User Laptops' | 'Virtual Desktops (VDI)' | 'Mobile Devices (MDM)' | 'Meeting Rooms (AV)' | 'Network Printers';
  totalUnits: number;
  activeCompliant: number;
  compliancePct: number;
  osFamily: string;
  managementTool: string;
  patchLevel: string;
  status: 'Healthy' | 'Warning';
  lead: string;
}

const workplaceFleet: WorkplaceDeviceGroup[] = [
  { id: 'DWP-001', category: 'User Laptops', totalUnits: 520, activeCompliant: 512, compliancePct: 98.5, osFamily: 'Windows 11 Enterprise / macOS', managementTool: 'Microsoft Intune', patchLevel: 'August 2026 Baseline', status: 'Healthy', lead: 'Layla Hassan' },
  { id: 'DWP-002', category: 'Virtual Desktops (VDI)', totalUnits: 250, activeCompliant: 245, compliancePct: 98.0, osFamily: 'Windows 11 Enterprise (VDI)', managementTool: 'Citrix Virtual Apps & Desktops', patchLevel: 'August 2026 Gold Image', status: 'Healthy', lead: 'Layla Hassan' },
  { id: 'DWP-003', category: 'Mobile Devices (MDM)', totalUnits: 380, activeCompliant: 374, compliancePct: 98.4, osFamily: 'iOS 17 / Android 14 Enterprise', managementTool: 'Microsoft Intune MAM', patchLevel: 'Latest Certified OS', status: 'Healthy', lead: 'Layla Hassan' },
  { id: 'DWP-004', category: 'Meeting Rooms (AV)', totalUnits: 28, activeCompliant: 26, compliancePct: 92.8, osFamily: 'Microsoft Teams Rooms (Android/Win)', managementTool: 'Teams Admin Center', patchLevel: 'Teams App v5.1.2', status: 'Healthy', lead: 'Layla Hassan' },
  { id: 'DWP-005', category: 'Network Printers', totalUnits: 45, activeCompliant: 41, compliancePct: 91.1, osFamily: 'HP / Xerox Secure Print', managementTool: 'Printix Cloud Print', patchLevel: 'Secure Firmware 2026', status: 'Warning', lead: 'Layla Hassan' },
];

const DigitalWorkplacePage: React.FC = () => {
  const totalFleet = workplaceFleet.reduce((s, d) => s + d.totalUnits, 0);
  const compliantCount = workplaceFleet.reduce((s, d) => s + d.activeCompliant, 0);
  const avgCompliance = ((compliantCount / totalFleet) * 100).toFixed(1);

  const columns: ColumnDef<WorkplaceDeviceGroup>[] = [
    {
      header: 'Group ID',
      accessorKey: 'id',
      width: '100px',
      cell: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--ncgr-deep-blue, #074A76)', fontFamily: 'monospace' }}>
          {row.id}
        </span>
      ),
    },
    {
      header: 'Device Category & OS',
      accessorKey: 'category',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text, #101828)' }}>{row.category}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)' }}>{row.osFamily}</div>
        </div>
      ),
    },
    {
      header: 'Fleet Size & Active',
      accessorKey: 'totalUnits',
      cell: (row) => (
        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
          {row.activeCompliant} / {row.totalUnits} Units
        </span>
      ),
    },
    {
      header: 'Patch & Security Compliance',
      accessorKey: 'compliancePct',
      cell: (row) => (
        <div style={{ minWidth: 120 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 2 }}>
            <span>Patch Baseline</span>
            <span style={{ fontWeight: 700, color: row.compliancePct > 95 ? '#22A06B' : '#E97F0A' }}>
              {row.compliancePct}%
            </span>
          </div>
          <div style={{ height: 6, width: '100%', background: 'var(--bg-secondary, #F7F8FA)', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${row.compliancePct}%`,
                background: row.compliancePct > 95 ? '#40904F' : '#E97F0A',
                borderRadius: 3,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Management Platform',
      accessorKey: 'managementTool',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.managementTool}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475467)' }}>{row.patchLevel}</div>
        </div>
      ),
    },
    {
      header: 'Workplace Lead',
      accessorKey: 'lead',
      cell: (row) => <span style={{ fontWeight: 600 }}>{row.lead}</span>,
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

  return (
    <div className="page-container" style={{ paddingBottom: 40 }}>
      {/* Sub-Page Header with Breadcrumb and Sibling Navigation */}
      <SubPageHeader
        moduleTitle="Infrastructure Health"
        modulePath="/infrastructure"
        pageTitle="Digital Workplace"
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
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary, #475467)', textTransform: 'uppercase' }}>Total Managed Fleet</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ncgr-deep-blue, #074A76)', marginTop: 4 }}>{totalFleet.toLocaleString()} Devices</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>Laptops, VDI, Mobile, AV</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#22A06B', textTransform: 'uppercase' }}>Overall Compliance</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22A06B', marginTop: 4 }}>{avgCompliance}%</div>
          <div style={{ fontSize: '0.75rem', color: '#22A06B', marginTop: 2, fontWeight: 600 }}>August patch target met</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#074A76', textTransform: 'uppercase' }}>Citrix VDI Capacity</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#074A76', marginTop: 4 }}>250 Desktops</div>
          <div style={{ fontSize: '0.75rem', color: '#074A76', marginTop: 2, fontWeight: 600 }}>98% active readiness</div>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        data={workplaceFleet}
        columns={columns}
        searchPlaceholder="Search fleet categories, OS, management platform..."
        searchKeys={['category', 'osFamily', 'managementTool', 'lead', 'patchLevel']}
        pageSize={10}
        title="Enterprise Digital Workplace Fleet"
        subtitle="Managed user computing endpoints and automated Intune compliance"
        exportFilename="ncgr_digital_workplace"
      />
    </div>
  );
};

export default DigitalWorkplacePage;
