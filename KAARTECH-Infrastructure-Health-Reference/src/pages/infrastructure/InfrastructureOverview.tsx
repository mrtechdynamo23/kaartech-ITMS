import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

interface ServerRecord {
  id: string;
  name: string;
  environment: 'Production' | 'DR' | 'Staging' | 'Development';
  cpuUtil: number;
  memUtil: number;
  storageUtil: number;
  availability: string;
  patchStatus: string;
  health: 'Healthy' | 'Warning' | 'Critical';
  issue: string;
}

const serversList: ServerRecord[] = [
  { id: 'INF-001', name: 'NCGR Production Compute Cluster Node 01', environment: 'Production', cpuUtil: 62, memUtil: 71, storageUtil: 68, availability: '99.99%', patchStatus: 'Compliant', health: 'Healthy', issue: 'None' },
  { id: 'INF-002', name: 'NCGR Production Compute Cluster Node 02', environment: 'Production', cpuUtil: 65, memUtil: 74, storageUtil: 68, availability: '99.99%', patchStatus: 'Compliant', health: 'Healthy', issue: 'None' },
  { id: 'INF-003', name: 'Monitoring Infrastructure Host ESX-02', environment: 'Production', cpuUtil: 79, memUtil: 83, storageUtil: 75, availability: '99.95%', patchStatus: 'Compliant', health: 'Warning', issue: 'Memory utilization above 80% threshold' },
  { id: 'INF-004', name: 'NCGR DR Compute Cluster Node 01', environment: 'DR', cpuUtil: 48, memUtil: 61, storageUtil: 72, availability: '99.99%', patchStatus: 'Compliant', health: 'Healthy', issue: 'None' },
  { id: 'INF-005', name: 'NCGR DR Compute Cluster Node 02', environment: 'DR', cpuUtil: 50, memUtil: 63, storageUtil: 72, availability: '99.99%', patchStatus: 'Compliant', health: 'Healthy', issue: 'None' },
  { id: 'INF-006', name: 'SAP Application Server Host WebLogic-01', environment: 'Production', cpuUtil: 71, memUtil: 78, storageUtil: 64, availability: '99.96%', patchStatus: 'Compliant', health: 'Healthy', issue: 'None' },
  { id: 'INF-007', name: 'SAP Application Server Host WebLogic-02', environment: 'Production', cpuUtil: 73, memUtil: 81, storageUtil: 64, availability: '99.96%', patchStatus: 'Compliant', health: 'Warning', issue: 'Memory utilization elevated' },
  { id: 'INF-008', name: 'Oracle RAC DB Primary Compute Host 01', environment: 'Production', cpuUtil: 58, memUtil: 69, storageUtil: 82, availability: '99.98%', patchStatus: 'Compliant', health: 'Healthy', issue: 'None' },
  { id: 'INF-009', name: 'Oracle RAC DB Primary Compute Host 02', environment: 'Production', cpuUtil: 60, memUtil: 71, storageUtil: 82, availability: '99.98%', patchStatus: 'Compliant', health: 'Healthy', issue: 'None' },
  { id: 'INF-010', name: 'ServiceNow MID Server Relay Host', environment: 'Production', cpuUtil: 42, memUtil: 55, storageUtil: 40, availability: '99.98%', patchStatus: 'Compliant', health: 'Healthy', issue: 'None' },
  { id: 'INF-011', name: 'OpenShift Master Node K8S-M01', environment: 'Production', cpuUtil: 54, memUtil: 66, storageUtil: 58, availability: '99.99%', patchStatus: 'Compliant', health: 'Healthy', issue: 'None' },
  { id: 'INF-012', name: 'OpenShift Worker Node Pool K8S-W04', environment: 'Production', cpuUtil: 88, memUtil: 91, storageUtil: 85, availability: '99.90%', patchStatus: 'Pending Patch', health: 'Critical', issue: 'High CPU & Memory pod saturation' },
  { id: 'INF-013', name: 'Splunk ITSI Indexer Cluster Host 01', environment: 'Production', cpuUtil: 64, memUtil: 72, storageUtil: 79, availability: '99.97%', patchStatus: 'Compliant', health: 'Healthy', issue: 'None' },
  { id: 'INF-014', name: 'Active Directory Core Domain Controller DC01', environment: 'Production', cpuUtil: 25, memUtil: 41, storageUtil: 35, availability: '100.0%', patchStatus: 'Compliant', health: 'Healthy', issue: 'None' },
  { id: 'INF-015', name: 'Jeddah Secondary Staging Host 01', environment: 'Staging', cpuUtil: 30, memUtil: 45, storageUtil: 50, availability: '99.90%', patchStatus: 'Compliant', health: 'Healthy', issue: 'None' },
];

const InfrastructureOverview: React.FC = () => {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServers = serversList.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.environment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">Infrastructure Compute Overview</h1>
            <p className="page-subtitle">Server Fleet Health, CPU & Memory Utilization, Backup Success & VMware ESXi Clusters</p>
          </div>
          <span className="simulated-badge">{t('app.demoData')}</span>
        </div>
      </div>

      {/* Reconciled Summary Dashboard (Section 9) */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#074A76' }} />
          <div className="kpi-card-label">Total Servers</div>
          <div className="kpi-card-value">286</div>
          <div className="kpi-card-trend neutral">Riyadh Primary, DR & Jeddah</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#40904F' }} />
          <div className="kpi-card-label">Healthy Servers</div>
          <div className="kpi-card-value" style={{ color: '#40904F' }}>271</div>
          <div className="kpi-card-trend up">Normal Operating Parameters</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#E97F0A' }} />
          <div className="kpi-card-label">Warning Servers</div>
          <div className="kpi-card-value" style={{ color: '#E97F0A' }}>11</div>
          <div className="kpi-card-trend down">Memory / CPU &gt; 80%</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#DE350B' }} />
          <div className="kpi-card-label">Critical Servers</div>
          <div className="kpi-card-value" style={{ color: '#DE350B' }}>4</div>
          <div className="kpi-card-trend down">Requires Workload Rebalance</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#4AA6DC' }} />
          <div className="kpi-card-label">Overall Availability</div>
          <div className="kpi-card-value">99.94%</div>
          <div className="kpi-card-trend up">Patch Compliance 94.6%</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#1FBBB0' }} />
          <div className="kpi-card-label">Backup Success</div>
          <div className="kpi-card-value" style={{ color: '#1FBBB0' }}>98.3%</div>
          <div className="kpi-card-trend up">Daily Veeam / Commvault</div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">Server Fleet Inventory (15 Master Cluster Records)</h2>
          <div className="header-search" style={{ width: 280 }}>
            <Search size={16} className="header-search-icon" />
            <input
              type="text"
              placeholder="Search servers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Server ID</th>
                <th style={{ minWidth: 240 }}>Server / Cluster Name</th>
                <th>Environment</th>
                <th>CPU Utilization</th>
                <th>Memory Utilization</th>
                <th>Storage Utilization</th>
                <th>Availability</th>
                <th>Patch Compliance</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredServers.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ncgr-deep-sky)' }}>{s.id}</td>
                  <td style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{s.name}<br /><span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>{s.issue}</span></td>
                  <td><span className="health-badge healthy" style={{ fontSize: '0.625rem' }}>{s.environment}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{s.cpuUtil}%</span>
                      <div style={{ flex: 1, height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${s.cpuUtil}%`, height: '100%', background: s.cpuUtil > 80 ? '#DE350B' : s.cpuUtil > 70 ? '#E97F0A' : '#40904F' }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{s.memUtil}%</span>
                      <div style={{ flex: 1, height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${s.memUtil}%`, height: '100%', background: s.memUtil > 80 ? '#DE350B' : s.memUtil > 70 ? '#E97F0A' : '#40904F' }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.75rem', fontWeight: 600 }}>{s.storageUtil}%</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--status-healthy)', fontWeight: 600 }}>{s.availability}</td>
                  <td style={{ fontSize: '0.75rem' }}>{s.patchStatus}</td>
                  <td>
                    <span className={`health-badge ${s.health === 'Healthy' ? 'healthy' : s.health === 'Warning' ? 'at-risk' : 'critical'}`}>
                      {s.health}
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

export default InfrastructureOverview;
