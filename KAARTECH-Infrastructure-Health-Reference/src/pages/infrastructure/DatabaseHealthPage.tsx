import React from 'react';
import DataTable, { type ColumnDef, type FilterDef } from '../../components/common/DataTable';
import SubPageHeader from '../../components/navigation/SubPageHeader';
import { INFRASTRUCTURE_SIBLINGS } from './InfrastructureLandingPage';

interface DatabaseInstance {
  id: string;
  name: string;
  engine: 'Oracle 19c RAC' | 'PostgreSQL 16' | 'SQL Server 2022' | 'MongoDB Enterprise' | 'SAP HANA';
  environment: 'Production' | 'Staging' | 'Disaster Recovery';
  assignedService: string;
  tablespaceUtilPct: number;
  iopsRate: number;
  activeSessions: number;
  backupStatus: 'Successful' | 'Running' | 'Failed';
  replicationLag: string;
  status: 'Healthy' | 'Warning' | 'Critical';
  dbaOwner: string;
}

const dbInstances: DatabaseInstance[] = [
  { id: 'DB-001', name: 'ORA-RAC-PRD-01', engine: 'Oracle 19c RAC', environment: 'Production', assignedService: 'Government Financial Core', tablespaceUtilPct: 78, iopsRate: 4200, activeSessions: 184, backupStatus: 'Successful', replicationLag: '0 sec', status: 'Healthy', dbaOwner: 'Omar Al-Mutairi' },
  { id: 'DB-002', name: 'ORA-RAC-PRD-02', engine: 'Oracle 19c RAC', environment: 'Production', assignedService: 'Government Financial Core', tablespaceUtilPct: 82, iopsRate: 5100, activeSessions: 220, backupStatus: 'Successful', replicationLag: '45 sec', status: 'Warning', dbaOwner: 'Omar Al-Mutairi' },
  { id: 'DB-003', name: 'ORA-RAC-DR-01', engine: 'Oracle 19c RAC', environment: 'Disaster Recovery', assignedService: 'Financial Core DR Standby', tablespaceUtilPct: 65, iopsRate: 850, activeSessions: 12, backupStatus: 'Successful', replicationLag: '2 sec', status: 'Healthy', dbaOwner: 'Omar Al-Mutairi' },
  { id: 'DB-004', name: 'HANA-SAP-PRD', engine: 'SAP HANA', environment: 'Production', assignedService: 'SAP ERP Financials', tablespaceUtilPct: 72, iopsRate: 6800, activeSessions: 310, backupStatus: 'Successful', replicationLag: '0 sec', status: 'Healthy', dbaOwner: 'Sara Al-Otaibi' },
  { id: 'DB-005', name: 'PGSQL-PORTAL-01', engine: 'PostgreSQL 16', environment: 'Production', assignedService: 'NCGR Citizen Portal Backend', tablespaceUtilPct: 54, iopsRate: 1900, activeSessions: 85, backupStatus: 'Successful', replicationLag: '0 sec', status: 'Healthy', dbaOwner: 'Omar Al-Mutairi' },
  { id: 'DB-006', name: 'MSSQL-BI-01', engine: 'SQL Server 2022', environment: 'Production', assignedService: 'PowerBI Data Mart', tablespaceUtilPct: 68, iopsRate: 2400, activeSessions: 42, backupStatus: 'Successful', replicationLag: 'N/A', status: 'Healthy', dbaOwner: 'Omar Al-Mutairi' },
  { id: 'DB-007', name: 'MONGO-LOGS-01', engine: 'MongoDB Enterprise', environment: 'Production', assignedService: 'Operational Audit Log Store', tablespaceUtilPct: 70, iopsRate: 3100, activeSessions: 95, backupStatus: 'Running', replicationLag: '0 sec', status: 'Healthy', dbaOwner: 'Omar Al-Mutairi' },
  { id: 'DB-008', name: 'ORA-DEV-01', engine: 'Oracle 19c RAC', environment: 'Staging', assignedService: 'Staging Integration Database', tablespaceUtilPct: 88, iopsRate: 950, activeSessions: 24, backupStatus: 'Successful', replicationLag: 'N/A', status: 'Warning', dbaOwner: 'Omar Al-Mutairi' },
];

const DatabaseHealthPage: React.FC = () => {
  const healthyCount = dbInstances.filter(d => d.status === 'Healthy').length;
  const warningCount = dbInstances.filter(d => d.status === 'Warning').length;

  const columns: ColumnDef<DatabaseInstance>[] = [
    {
      header: 'Instance ID',
      accessorKey: 'id',
      width: '100px',
      cell: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--ncgr-deep-blue, #074A76)', fontFamily: 'monospace' }}>
          {row.id}
        </span>
      ),
    },
    {
      header: 'Database Name & Engine',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text, #101828)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)' }}>{row.engine}</div>
        </div>
      ),
    },
    {
      header: 'Assigned Service & Env',
      accessorKey: 'assignedService',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.assignedService}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475467)' }}>Env: {row.environment}</div>
        </div>
      ),
    },
    {
      header: 'Tablespace Storage',
      accessorKey: 'tablespaceUtilPct',
      cell: (row) => (
        <div style={{ minWidth: 100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 2 }}>
            <span>Used:</span>
            <span style={{ fontWeight: 700 }}>{row.tablespaceUtilPct}%</span>
          </div>
          <div style={{ height: 5, width: '100%', background: 'var(--bg-secondary, #F7F8FA)', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${row.tablespaceUtilPct}%`,
                background: row.tablespaceUtilPct > 85 ? '#DE350B' : row.tablespaceUtilPct > 75 ? '#E97F0A' : '#40904F',
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'IOPS & Sessions',
      accessorKey: 'iopsRate',
      cell: (row) => (
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{row.iopsRate} IOPS</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)' }}>{row.activeSessions} active sessions</div>
        </div>
      ),
    },
    {
      header: 'Replication Lag',
      accessorKey: 'replicationLag',
      cell: (row) => (
        <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: row.replicationLag === '45 sec' ? '#E97F0A' : '#22A06B', fontWeight: 600 }}>
          {row.replicationLag}
        </span>
      ),
    },
    {
      header: 'Lead DBA',
      accessorKey: 'dbaOwner',
      cell: (row) => <span style={{ fontWeight: 600 }}>{row.dbaOwner}</span>,
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

  const uniqueEngines = Array.from(new Set(dbInstances.map(d => d.engine))).map(e => ({ label: e, value: e }));
  const uniqueEnvs = Array.from(new Set(dbInstances.map(d => d.environment))).map(e => ({ label: e, value: e }));

  const filters: FilterDef<DatabaseInstance>[] = [
    { key: 'engine', label: 'DB Engines', options: uniqueEngines },
    { key: 'environment', label: 'Environments', options: uniqueEnvs },
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
        pageTitle="Database Health"
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
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary, #475467)', textTransform: 'uppercase' }}>Database Clusters</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ncgr-deep-blue, #074A76)', marginTop: 4 }}>{dbInstances.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>Oracle, HANA & Postgres</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#22A06B', textTransform: 'uppercase' }}>Replication Sync OK</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22A06B', marginTop: 4 }}>{healthyCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#22A06B', marginTop: 2, fontWeight: 600 }}>0 sec lag on prod</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E97F0A', textTransform: 'uppercase' }}>High IOPS / Replicating</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#E97F0A', marginTop: 4 }}>{warningCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#E97F0A', marginTop: 2, fontWeight: 600 }}>Redo log sync lag</div>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        data={dbInstances}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search databases by name, service, engine, DBA..."
        searchKeys={['name', 'assignedService', 'engine', 'dbaOwner', 'environment']}
        pageSize={10}
        title="Active Database Instances & Clusters"
        subtitle="Live tablespace capacity meters, IOPS telemetry, and backup assurance"
        exportFilename="ncgr_database_health"
      />
    </div>
  );
};

export default DatabaseHealthPage;
