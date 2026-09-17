import React from 'react';
import { useDataStore } from '../../data/mockDataStore';
import { getInfraStats } from '../../data/infrastructure';
import DataTable, { type ColumnDef, type FilterDef } from '../../components/common/DataTable';
import type { InfraNode } from '../../data/infrastructure';
import SubPageHeader from '../../components/navigation/SubPageHeader';
import { INFRASTRUCTURE_SIBLINGS } from './InfrastructureLandingPage';

const InfrastructureHealthPage: React.FC = () => {
  const { infraNodes } = useDataStore();
  const stats = getInfraStats();

  const columns: ColumnDef<InfraNode>[] = [
    {
      header: 'Node ID',
      accessorKey: 'id',
      width: '110px',
      cell: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--ncgr-deep-blue, #074A76)', fontFamily: 'monospace' }}>
          {row.id}
        </span>
      ),
    },
    {
      header: 'Node Name & Model',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text, #101828)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)' }}>
            {row.modelOrFamily} • {row.osVersion}
          </div>
        </div>
      ),
    },
    {
      header: 'Type & Tower',
      accessorKey: 'type',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.type}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475467)' }}>{row.tower}</div>
        </div>
      ),
    },
    {
      header: 'Assigned Service',
      accessorKey: 'assignedService',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.assignedService}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)' }}>Location: {row.location}</div>
        </div>
      ),
    },
    {
      header: 'CPU / Memory',
      accessorKey: 'cpuUtilization',
      cell: (row) => (
        <div style={{ minWidth: 100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 2 }}>
            <span>CPU: <strong>{row.cpuUtilization}%</strong></span>
            <span>RAM: <strong>{row.memoryUtilization}%</strong></span>
          </div>
          <div style={{ height: 5, width: '100%', background: 'var(--bg-secondary, #F7F8FA)', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${row.cpuUtilization}%`,
                background: row.cpuUtilization > 80 ? '#DE350B' : row.cpuUtilization > 65 ? '#E97F0A' : '#40904F',
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Uptime & IP',
      accessorKey: 'uptime',
      cell: (row) => (
        <div>
          <div style={{ fontSize: '0.8125rem', fontFamily: 'monospace' }}>{row.ipAddress}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)' }}>Uptime: {row.uptime}</div>
        </div>
      ),
    },
    {
      header: 'Owner',
      accessorKey: 'owner',
      cell: (row) => <span style={{ fontWeight: 600 }}>{row.owner}</span>,
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

  const uniqueTypes = Array.from(new Set(infraNodes.map(n => n.type))).map(t => ({ label: t, value: t }));
  const uniqueTowers = Array.from(new Set(infraNodes.map(n => n.tower))).map(t => ({ label: t, value: t }));

  const filters: FilterDef<InfraNode>[] = [
    { key: 'type', label: 'Asset Types', options: uniqueTypes },
    { key: 'tower', label: 'Towers', options: uniqueTowers },
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
        pageTitle="Infrastructure Health"
        siblingPages={INFRASTRUCTURE_SIBLINGS}
      />

      {/* KPI Cards Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary, #475467)', textTransform: 'uppercase' }}>Monitored Nodes</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ncgr-deep-blue, #074A76)', marginTop: 4 }}>{stats.total}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>Physical & Virtual</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#22A06B', textTransform: 'uppercase' }}>Healthy Nodes</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22A06B', marginTop: 4 }}>{stats.healthy}</div>
          <div style={{ fontSize: '0.75rem', color: '#22A06B', marginTop: 2, fontWeight: 600 }}>Normal telemetry</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E97F0A', textTransform: 'uppercase' }}>Warning / High Load</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#E97F0A', marginTop: 4 }}>{stats.warning}</div>
          <div style={{ fontSize: '0.75rem', color: '#E97F0A', marginTop: 2, fontWeight: 600 }}>RAM/Disk &gt; 80%</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#DE350B', textTransform: 'uppercase' }}>Critical Outages</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#DE350B', marginTop: 4 }}>{stats.critical}</div>
          <div style={{ fontSize: '0.75rem', color: '#DE350B', marginTop: 2, fontWeight: 600 }}>Action bridge open</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ncgr-deep-blue, #074A76)', textTransform: 'uppercase' }}>Estate Avg CPU / RAM</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ncgr-deep-blue, #074A76)', marginTop: 4 }}>
            {stats.avgCpu}% / {stats.avgMem}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>Balanced cluster load</div>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        data={infraNodes}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search nodes by name, ID, service, IP, owner..."
        searchKeys={['name', 'id', 'modelOrFamily', 'assignedService', 'ipAddress', 'owner', 'location']}
        pageSize={15}
        title="Enterprise Infrastructure Nodes"
        subtitle="Physical Dell PowerEdge hosts, SAN storage arrays, and network cores"
        exportFilename="ncgr_infrastructure_nodes"
      />
    </div>
  );
};

export default InfrastructureHealthPage;
