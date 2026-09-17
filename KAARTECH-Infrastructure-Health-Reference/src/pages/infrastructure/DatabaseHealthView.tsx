import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

interface DatabaseRecord {
  id: string;
  name: string;
  platform: string;
  environment: string;
  cpuUtil: number;
  memUtil: number;
  storageUtil: number;
  connections: number;
  replicationLag: string;
  backupStatus: string;
  availability: string;
  health: 'Healthy' | 'Warning' | 'Critical';
}

const databasesList: DatabaseRecord[] = [
  { id: 'DB-001', name: 'Oracle RAC Primary Core ERP DB', platform: 'Oracle 19c RAC', environment: 'Production', cpuUtil: 68, memUtil: 79, storageUtil: 82, connections: 450, replicationLag: '0 sec', backupStatus: 'Successful', availability: '99.99%', health: 'Healthy' },
  { id: 'DB-002', name: 'Oracle RAC Secondary DR DB', platform: 'Oracle 19c RAC', environment: 'DR', cpuUtil: 52, memUtil: 64, storageUtil: 82, connections: 120, replicationLag: '45 sec', backupStatus: 'Successful', availability: '99.95%', health: 'Warning' },
  { id: 'DB-003', name: 'Microsoft SQL Server Finance Cluster', platform: 'MS SQL Server 2022', environment: 'Production', cpuUtil: 45, memUtil: 62, storageUtil: 58, connections: 210, replicationLag: '0 sec', backupStatus: 'Successful', availability: '99.98%', health: 'Healthy' },
  { id: 'DB-004', name: 'PostgreSQL Identity & Access DB', platform: 'PostgreSQL 15', environment: 'Production', cpuUtil: 38, memUtil: 51, storageUtil: 44, connections: 340, replicationLag: '0 sec', backupStatus: 'Successful', availability: '100.0%', health: 'Healthy' },
  { id: 'DB-005', name: 'ServiceNow CMDB Discovery DB', platform: 'PostgreSQL 14', environment: 'Production', cpuUtil: 72, memUtil: 84, storageUtil: 75, connections: 180, replicationLag: '0 sec', backupStatus: 'Successful', availability: '99.96%', health: 'Warning' },
  { id: 'DB-006', name: 'Splunk Data Index Store DB', platform: 'Splunk SmartStore', environment: 'Production', cpuUtil: 88, memUtil: 92, storageUtil: 89, connections: 600, replicationLag: '0 sec', backupStatus: 'Successful', availability: '99.88%', health: 'Critical' },
  { id: 'DB-007', name: 'MySQL OpenShift App Cache DB', platform: 'MySQL 8.0 Cluster', environment: 'Production', cpuUtil: 42, memUtil: 58, storageUtil: 49, connections: 290, replicationLag: '0 sec', backupStatus: 'Successful', availability: '99.97%', health: 'Healthy' },
  { id: 'DB-008', name: 'Oracle Business Analytics Warehouse', platform: 'Oracle 19c', environment: 'Production', cpuUtil: 61, memUtil: 73, storageUtil: 67, connections: 95, replicationLag: '0 sec', backupStatus: 'Successful', availability: '99.96%', health: 'Healthy' },
  { id: 'DB-009', name: 'MS SQL Server HR Portal DB', platform: 'MS SQL Server 2019', environment: 'Production', cpuUtil: 30, memUtil: 46, storageUtil: 39, connections: 140, replicationLag: '0 sec', backupStatus: 'Successful', availability: '99.99%', health: 'Healthy' },
  { id: 'DB-010', name: 'PostgreSQL Document Management DB', platform: 'PostgreSQL 15', environment: 'Production', cpuUtil: 55, memUtil: 68, storageUtil: 71, connections: 260, replicationLag: '0 sec', backupStatus: 'Successful', availability: '99.98%', health: 'Healthy' },
  { id: 'DB-011', name: 'Oracle RAC DR Staging Test DB', platform: 'Oracle 19c RAC', environment: 'Staging', cpuUtil: 25, memUtil: 40, storageUtil: 50, connections: 30, replicationLag: '0 sec', backupStatus: 'Successful', availability: '99.90%', health: 'Healthy' },
  { id: 'DB-012', name: 'MongoDB Unstructured Logs Store', platform: 'MongoDB Enterprise', environment: 'Production', cpuUtil: 64, memUtil: 77, storageUtil: 80, connections: 410, replicationLag: '0 sec', backupStatus: 'Successful', availability: '99.95%', health: 'Healthy' },
  { id: 'DB-013', name: 'Redis Microservices Session Cache', platform: 'Redis Enterprise', environment: 'Production', cpuUtil: 20, memUtil: 35, storageUtil: 25, connections: 1200, replicationLag: '0 sec', backupStatus: 'In-Memory Sync', availability: '100.0%', health: 'Healthy' },
  { id: 'DB-014', name: 'MS SQL Server Audit Trail Log DB', platform: 'MS SQL Server 2022', environment: 'Production', cpuUtil: 50, memUtil: 66, storageUtil: 63, connections: 110, replicationLag: '0 sec', backupStatus: 'Successful', availability: '99.99%', health: 'Healthy' },
  { id: 'DB-015', name: 'PostgreSQL Development Sandbox DB', platform: 'PostgreSQL 14', environment: 'Development', cpuUtil: 15, memUtil: 28, storageUtil: 30, connections: 25, replicationLag: '0 sec', backupStatus: 'Daily Snapshot', availability: '99.80%', health: 'Healthy' },
];

const DatabaseHealthView: React.FC = () => {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDBs = databasesList.filter(db =>
    db.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    db.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    db.environment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">Enterprise Database Health</h1>
            <p className="page-subtitle">Oracle RAC, SQL Server, PostgreSQL, MySQL & Redis Cluster Performance Monitoring</p>
          </div>
          <span className="simulated-badge">{t('app.demoData')}</span>
        </div>
      </div>

      {/* Summary KPI Cards (Section 9) */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#074A76' }} />
          <div className="kpi-card-label">Managed Databases</div>
          <div className="kpi-card-value">34</div>
          <div className="kpi-card-trend neutral">Oracle RAC, SQL Server & Postgres</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#40904F' }} />
          <div className="kpi-card-label">Healthy Databases</div>
          <div className="kpi-card-value" style={{ color: '#40904F' }}>31</div>
          <div className="kpi-card-trend up">Normal Replication & Performance</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#E97F0A' }} />
          <div className="kpi-card-label">Warning Databases</div>
          <div className="kpi-card-value" style={{ color: '#E97F0A' }}>2</div>
          <div className="kpi-card-trend down">Replication Lag & Memory</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#DE350B' }} />
          <div className="kpi-card-label">Critical Databases</div>
          <div className="kpi-card-value" style={{ color: '#DE350B' }}>1</div>
          <div className="kpi-card-trend down">Splunk Indexer High Storage</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#1FBBB0' }} />
          <div className="kpi-card-label">Backup Success</div>
          <div className="kpi-card-value" style={{ color: '#1FBBB0' }}>98.8%</div>
          <div className="kpi-card-trend up">RPO &lt; 15 Minutes</div>
        </div>
      </div>

      {/* Database Table */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">Database Instances (15 Major Records)</h2>
          <div className="header-search" style={{ width: 280 }}>
            <Search size={16} className="header-search-icon" />
            <input
              type="text"
              placeholder="Search databases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>DB ID</th>
                <th>Database Name</th>
                <th>Platform</th>
                <th>Environment</th>
                <th>CPU / Mem</th>
                <th>Storage</th>
                <th>Active Connections</th>
                <th>Replication Lag</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDBs.map((db) => (
                <tr key={db.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ncgr-deep-sky)' }}>{db.id}</td>
                  <td style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{db.name}</td>
                  <td><span className="health-badge healthy" style={{ fontSize: '0.625rem' }}>{db.platform}</span></td>
                  <td style={{ fontSize: '0.75rem' }}>{db.environment}</td>
                  <td style={{ fontSize: '0.75rem' }}>{db.cpuUtil}% / {db.memUtil}%</td>
                  <td style={{ fontSize: '0.75rem', fontWeight: 600 }}>{db.storageUtil}%</td>
                  <td style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{db.connections}</td>
                  <td style={{ fontSize: '0.75rem', color: db.replicationLag !== '0 sec' ? 'var(--status-at-risk)' : 'var(--text-tertiary)' }}>{db.replicationLag}</td>
                  <td>
                    <span className={`health-badge ${db.health === 'Healthy' ? 'healthy' : db.health === 'Warning' ? 'at-risk' : 'critical'}`}>
                      {db.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DatabaseHealthView;
