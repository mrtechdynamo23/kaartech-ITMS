import React from 'react';
import DataTable, { type ColumnDef, type FilterDef } from '../../components/common/DataTable';
import SubPageHeader from '../../components/navigation/SubPageHeader';
import { INFRASTRUCTURE_SIBLINGS } from './InfrastructureLandingPage';

interface NetworkDevice {
  id: string;
  name: string;
  deviceType: 'Core Switch' | 'Edge Router' | 'Firewall' | 'Load Balancer' | 'Access Point';
  location: string;
  ipAddress: string;
  firmware: string;
  portUtilization: number;
  bandwidthUtilPct: number;
  latencyMs: number;
  packetLossPct: number;
  status: 'Healthy' | 'Warning' | 'Critical';
  vendor: string;
  owner: string;
}

const networkDevices: NetworkDevice[] = [
  { id: 'NET-001', name: 'SW-CORE-A-01', deviceType: 'Core Switch', location: 'Riyadh HQ Bldg A', ipAddress: '10.10.0.1', firmware: 'NX-OS 10.3', portUtilization: 88, bandwidthUtilPct: 82, latencyMs: 1.2, packetLossPct: 0.8, status: 'Critical', vendor: 'Cisco', owner: 'Mohammed Al-Dosari' },
  { id: 'NET-002', name: 'SW-CORE-B-01', deviceType: 'Core Switch', location: 'Riyadh HQ Bldg B', ipAddress: '10.10.0.2', firmware: 'NX-OS 10.3', portUtilization: 64, bandwidthUtilPct: 45, latencyMs: 0.8, packetLossPct: 0.0, status: 'Healthy', vendor: 'Cisco', owner: 'Mohammed Al-Dosari' },
  { id: 'NET-003', name: 'RTR-WAN-EDGE-01', deviceType: 'Edge Router', location: 'Riyadh Primary DC', ipAddress: '10.10.0.254', firmware: 'IOS-XE 17.9', portUtilization: 50, bandwidthUtilPct: 74, latencyMs: 3.4, packetLossPct: 0.1, status: 'Healthy', vendor: 'Cisco', owner: 'Mohammed Al-Dosari' },
  { id: 'NET-004', name: 'RTR-WAN-EDGE-02', deviceType: 'Edge Router', location: 'Riyadh DR DC', ipAddress: '10.20.0.254', firmware: 'IOS-XE 17.9', portUtilization: 45, bandwidthUtilPct: 35, latencyMs: 4.1, packetLossPct: 0.0, status: 'Healthy', vendor: 'Cisco', owner: 'Mohammed Al-Dosari' },
  { id: 'NET-005', name: 'FW-PALO-PRD-01', deviceType: 'Firewall', location: 'Riyadh Primary DC', ipAddress: '10.10.0.250', firmware: 'PAN-OS 11.0.2', portUtilization: 70, bandwidthUtilPct: 68, latencyMs: 2.1, packetLossPct: 0.0, status: 'Healthy', vendor: 'Palo Alto', owner: 'Daniel Mathew' },
  { id: 'NET-006', name: 'FW-PALO-DR-01', deviceType: 'Firewall', location: 'Riyadh DR DC', ipAddress: '10.20.0.250', firmware: 'PAN-OS 11.0.2', portUtilization: 40, bandwidthUtilPct: 30, latencyMs: 2.4, packetLossPct: 0.0, status: 'Healthy', vendor: 'Palo Alto', owner: 'Daniel Mathew' },
  { id: 'NET-007', name: 'LB-F5-BIGIP-01', deviceType: 'Load Balancer', location: 'Riyadh Primary DC', ipAddress: '10.10.0.240', firmware: 'TMOS 17.1', portUtilization: 65, bandwidthUtilPct: 58, latencyMs: 0.6, packetLossPct: 0.0, status: 'Healthy', vendor: 'F5 Networks', owner: 'Mohammed Al-Dosari' },
  { id: 'NET-008', name: 'SW-DIST-FL1-01', deviceType: 'Core Switch', location: 'HQ Floor 1', ipAddress: '10.10.1.1', firmware: 'IOS-XE 17.6', portUtilization: 92, bandwidthUtilPct: 60, latencyMs: 1.0, packetLossPct: 0.0, status: 'Warning', vendor: 'Cisco', owner: 'Mohammed Al-Dosari' },
  { id: 'NET-009', name: 'SW-DIST-FL2-01', deviceType: 'Core Switch', location: 'HQ Floor 2', ipAddress: '10.10.2.1', firmware: 'IOS-XE 17.6', portUtilization: 78, bandwidthUtilPct: 52, latencyMs: 0.9, packetLossPct: 0.0, status: 'Healthy', vendor: 'Cisco', owner: 'Mohammed Al-Dosari' },
  { id: 'NET-010', name: 'AP-WIFI-HQ-CLUSTER', deviceType: 'Access Point', location: 'HQ Campus (48 APs)', ipAddress: '10.10.50.0/24', firmware: 'ArubaOS 8.10', portUtilization: 80, bandwidthUtilPct: 65, latencyMs: 4.8, packetLossPct: 0.2, status: 'Healthy', vendor: 'Aruba', owner: 'Mohammed Al-Dosari' },
];

const NetworkHealthPage: React.FC = () => {
  const healthyCount = networkDevices.filter(d => d.status === 'Healthy').length;
  const criticalCount = networkDevices.filter(d => d.status === 'Critical' || d.status === 'Warning').length;

  const columns: ColumnDef<NetworkDevice>[] = [
    {
      header: 'Device ID',
      accessorKey: 'id',
      width: '100px',
      cell: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--ncgr-deep-blue, #074A76)', fontFamily: 'monospace' }}>
          {row.id}
        </span>
      ),
    },
    {
      header: 'Device Name & Model',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text, #101828)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)' }}>
            Vendor: {row.vendor} • OS: {row.firmware}
          </div>
        </div>
      ),
    },
    {
      header: 'Type & Location',
      accessorKey: 'deviceType',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.deviceType}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475467)' }}>{row.location}</div>
        </div>
      ),
    },
    {
      header: 'Bandwidth & Ports',
      accessorKey: 'bandwidthUtilPct',
      cell: (row) => (
        <div style={{ minWidth: 100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 2 }}>
            <span>Traffic: <strong>{row.bandwidthUtilPct}%</strong></span>
            <span>Ports: <strong>{row.portUtilization}%</strong></span>
          </div>
          <div style={{ height: 5, width: '100%', background: 'var(--bg-secondary, #F7F8FA)', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${row.bandwidthUtilPct}%`,
                background: row.bandwidthUtilPct > 80 ? '#DE350B' : row.bandwidthUtilPct > 65 ? '#E97F0A' : '#40904F',
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Latency & Loss',
      accessorKey: 'latencyMs',
      cell: (row) => (
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: row.latencyMs > 3 ? '#E97F0A' : '#22A06B' }}>
            {row.latencyMs} ms
          </div>
          <div style={{ fontSize: '0.75rem', color: row.packetLossPct > 0.5 ? '#DE350B' : 'var(--text-tertiary, #98A2B3)' }}>
            Loss: {row.packetLossPct}%
          </div>
        </div>
      ),
    },
    {
      header: 'IP Address',
      accessorKey: 'ipAddress',
      cell: (row) => <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{row.ipAddress}</span>,
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

  const uniqueTypes = Array.from(new Set(networkDevices.map(d => d.deviceType))).map(t => ({ label: t, value: t }));

  const filters: FilterDef<NetworkDevice>[] = [
    { key: 'deviceType', label: 'Device Types', options: uniqueTypes },
    {
      key: 'status',
      label: 'Statuses',
      options: [
        { label: 'Healthy', value: 'Healthy' },
        { label: 'Warning', value: 'Warning' },
        { label: 'Critical', value: 'Critical' },
      ],
    },
  ];

  return (
    <div className="page-container" style={{ paddingBottom: 40 }}>
      {/* Sub-Page Header with Breadcrumb and Sibling Navigation */}
      <SubPageHeader
        moduleTitle="Infrastructure Health"
        modulePath="/infrastructure"
        pageTitle="Network Health"
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
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary, #475467)', textTransform: 'uppercase' }}>Network Devices</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ncgr-deep-blue, #074A76)', marginTop: 4 }}>{networkDevices.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>SolarWinds NPM feed</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#22A06B', textTransform: 'uppercase' }}>Healthy Links</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22A06B', marginTop: 4 }}>{healthyCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#22A06B', marginTop: 2, fontWeight: 600 }}>0.0% packet loss</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#DE350B', textTransform: 'uppercase' }}>Degraded / Critical</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#DE350B', marginTop: 4 }}>{criticalCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#DE350B', marginTop: 2, fontWeight: 600 }}>SW-CORE-A-01 Alert</div>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        data={networkDevices}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search network devices by name, IP, location..."
        searchKeys={['name', 'ipAddress', 'location', 'deviceType', 'vendor']}
        pageSize={10}
        title="Active Network Infrastructure Topology"
        subtitle="Live interface utilization, CRC check logs, and latency monitoring"
        exportFilename="ncgr_network_health"
      />
    </div>
  );
};

export default NetworkHealthPage;
