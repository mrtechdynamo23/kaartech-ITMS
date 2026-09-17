import React from 'react';
import { useTranslation } from 'react-i18next';

interface ClusterRecord {
  id: string;
  name: string;
  environment: string;
  nodes: number;
  pods: number;
  cpuUtil: number;
  memUtil: number;
  restarts: number;
  availability: string;
  deploymentStatus: string;
  health: 'Healthy' | 'Warning' | 'Critical';
}

const clustersList: ClusterRecord[] = [
  { id: 'K8S-001', name: 'Production OpenShift Cluster (Riyadh Primary)', environment: 'Production', nodes: 24, pods: 420, cpuUtil: 64, memUtil: 72, restarts: 2, availability: '99.99%', deploymentStatus: 'Synced (ArgoCD)', health: 'Healthy' },
  { id: 'K8S-002', name: 'DR OpenShift Cluster (Riyadh DR)', environment: 'DR', nodes: 12, pods: 180, cpuUtil: 42, memUtil: 55, restarts: 0, availability: '99.98%', deploymentStatus: 'Synced (ArgoCD)', health: 'Healthy' },
  { id: 'K8S-003', name: 'Integration Kubernetes Cluster (Jeddah)', environment: 'Staging', nodes: 4, pods: 54, cpuUtil: 51, memUtil: 60, restarts: 1, availability: '99.92%', deploymentStatus: 'Synced', health: 'Healthy' },
  { id: 'K8S-004', name: 'Development Microservices Cluster', environment: 'Development', nodes: 2, pods: 30, cpuUtil: 35, memUtil: 48, restarts: 5, availability: '99.80%', deploymentStatus: 'Pending Sync', health: 'Warning' },
];

const ContainerHealthView: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div>
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">Container Platform & OpenShift Health</h1>
            <p className="page-subtitle">Kubernetes Clusters, Pod Lifecycle, ArgoCD Deployments & Node Resource Quotas</p>
          </div>
          <span className="simulated-badge">{t('app.demoData')}</span>
        </div>
      </div>

      {/* Summary KPI Cards (Section 9) */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#074A76' }} />
          <div className="kpi-card-label">Active Clusters</div>
          <div className="kpi-card-value">4</div>
          <div className="kpi-card-trend neutral">OpenShift 4.14 & K8s</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#4AA6DC' }} />
          <div className="kpi-card-label">Cluster Worker Nodes</div>
          <div className="kpi-card-value">42</div>
          <div className="kpi-card-trend neutral">Auto-scaling enabled</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#40904F' }} />
          <div className="kpi-card-label">Total Running Pods</div>
          <div className="kpi-card-value" style={{ color: '#40904F' }}>684</div>
          <div className="kpi-card-trend up">671 Healthy Pods (98.1%)</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#E97F0A' }} />
          <div className="kpi-card-label">Restarting / Failed Pods</div>
          <div className="kpi-card-value" style={{ color: '#E97F0A' }}>8 / 5</div>
          <div className="kpi-card-trend down">OOMKilled Triage Active</div>
        </div>
      </div>

      {/* Clusters Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">OpenShift & Kubernetes Cluster Overview</h2>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cluster ID</th>
                <th>Cluster Name</th>
                <th>Environment</th>
                <th>Nodes</th>
                <th>Pods</th>
                <th>CPU / Mem</th>
                <th>Restarts (24h)</th>
                <th>Availability</th>
                <th>GitOps Sync</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {clustersList.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ncgr-deep-sky)' }}>{c.id}</td>
                  <td style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{c.name}</td>
                  <td><span className="health-badge healthy" style={{ fontSize: '0.625rem' }}>{c.environment}</span></td>
                  <td style={{ fontSize: '0.75rem', fontWeight: 600 }}>{c.nodes} Nodes</td>
                  <td style={{ fontSize: '0.75rem', fontWeight: 600 }}>{c.pods} Pods</td>
                  <td style={{ fontSize: '0.75rem' }}>{c.cpuUtil}% / {c.memUtil}%</td>
                  <td style={{ fontSize: '0.75rem', color: c.restarts > 2 ? 'var(--status-at-risk)' : 'inherit' }}>{c.restarts}</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--status-healthy)', fontWeight: 600 }}>{c.availability}</td>
                  <td style={{ fontSize: '0.75rem' }}>{c.deploymentStatus}</td>
                  <td>
                    <span className={`health-badge ${c.health === 'Healthy' ? 'healthy' : 'at-risk'}`}>
                      {c.health}
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

export default ContainerHealthView;
