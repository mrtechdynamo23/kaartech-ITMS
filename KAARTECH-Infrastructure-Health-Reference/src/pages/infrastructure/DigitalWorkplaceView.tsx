import React from 'react';
import { useTranslation } from 'react-i18next';

interface WorkplaceService {
  id: string;
  service: string;
  managedCount: string;
  compliantCount: string;
  availability: string;
  owner: string;
  status: 'Healthy' | 'Attention Required';
  issue: string;
}

const workplaceServices: WorkplaceService[] = [
  { id: 'DWP-01', service: 'Microsoft Intune Endpoint Management', managedCount: '1,284 Endpoints', compliantCount: '1,193 Compliant (92.9%)', availability: '99.98%', owner: 'Layla Hassan', status: 'Healthy', issue: '91 endpoints pending OS update' },
  { id: 'DWP-02', service: 'Cisco AnyConnect Secure VPN', managedCount: '1,284 Licenses', compliantCount: '1,250 Active Sessions', availability: '99.60%', owner: 'Mohammed Al-Dosari', status: 'Healthy', issue: 'Peak tunnel load at 68%' },
  { id: 'DWP-03', service: 'Microsoft 365 E5 Cloud Suite', managedCount: '1,350 Licenses', compliantCount: '1,284 Assigned (95.1%)', availability: '99.99%', owner: 'Layla Hassan', status: 'Healthy', issue: '66 spare licenses available' },
  { id: 'DWP-04', service: 'CrowdStrike Falcon Endpoint Security', managedCount: '1,284 Endpoints', compliantCount: '1,268 Enrolled (98.7%)', availability: '99.95%', owner: 'Daniel Mathew', status: 'Healthy', issue: '16 offline workstations' },
  { id: 'DWP-05', service: 'BeyondTrust PAM Workstation Client', managedCount: '320 Admins', compliantCount: '306 Tokenized (95.6%)', availability: '99.90%', owner: 'Daniel Mathew', status: 'Healthy', issue: '14 token refreshes scheduled' },
  { id: 'DWP-06', service: 'Teams & Exchange Online Hybrid Mail', managedCount: '1,284 Users', compliantCount: '1,284 Synced', availability: '99.99%', owner: 'Layla Hassan', status: 'Healthy', issue: 'None' },
  { id: 'DWP-07', service: 'SafeNet MobilePASS 2FA Authenticator', managedCount: '1,284 Users', compliantCount: '1,240 Enrolled', availability: '99.95%', owner: 'Aisha Rahman', status: 'Healthy', issue: '44 pending soft token activation' },
  { id: 'DWP-08', service: 'System Center Configuration Manager (SCCM)', managedCount: '1,284 PC Nodes', compliantCount: '1,217 Patched (94.8%)', availability: '99.92%', owner: 'Layla Hassan', status: 'Healthy', issue: 'Monthly patch push active' },
  { id: 'DWP-09', service: 'Citrix Virtual Apps & Desktops (VDI)', managedCount: '250 VDI Seats', compliantCount: '240 Healthy Seats', availability: '99.85%', owner: 'Rakesh Kumar', status: 'Healthy', issue: '10 idle VDI sessions cleared' },
  { id: 'DWP-10', service: 'Zscaler Cloud Internet Access (ZIA)', managedCount: '1,284 Users', compliantCount: '1,284 Protected', availability: '99.99%', owner: 'Daniel Mathew', status: 'Healthy', issue: 'Zero URL bypass violations' },
  { id: 'DWP-11', service: 'AppViewX Desktop Certificate Auto-Enrollment', managedCount: '1,284 Certs', compliantCount: '1,270 Active', availability: '99.90%', owner: 'Daniel Mathew', status: 'Healthy', issue: '14 cert renewals scheduled' },
  { id: 'DWP-12', service: 'ServiceNow Self-Service End-User Portal', managedCount: '1,284 Users', compliantCount: '1,284 Enabled', availability: '99.98%', owner: 'Aisha Rahman', status: 'Healthy', issue: 'CSAT Rating 4.8 / 5.0' },
];

const DigitalWorkplaceView: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div>
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">Digital Workplace & Endpoint Services</h1>
            <p className="page-subtitle">Managed Workstations, Intune Compliance, Cisco VPN & Microsoft 365 Health</p>
          </div>
          <span className="simulated-badge">{t('app.demoData')}</span>
        </div>
      </div>

      {/* Summary KPI Cards (Section 9) */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#074A76' }} />
          <div className="kpi-card-label">Managed Endpoints</div>
          <div className="kpi-card-value">1,284</div>
          <div className="kpi-card-trend neutral">Laptops & Workstations</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#40904F' }} />
          <div className="kpi-card-label">Compliant Endpoints</div>
          <div className="kpi-card-value" style={{ color: '#40904F' }}>1,193</div>
          <div className="kpi-card-trend up">92.9% Intune Compliant</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#E97F0A' }} />
          <div className="kpi-card-label">Non-Compliant Endpoints</div>
          <div className="kpi-card-value" style={{ color: '#E97F0A' }}>91</div>
          <div className="kpi-card-trend down">OS Patching Pending</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#4AA6DC' }} />
          <div className="kpi-card-label">VPN Availability</div>
          <div className="kpi-card-value">99.6%</div>
          <div className="kpi-card-trend up">Cisco AnyConnect SLA</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#1FBBB0' }} />
          <div className="kpi-card-label">Microsoft 365 Health</div>
          <div className="kpi-card-value" style={{ color: '#1FBBB0' }}>99.9%</div>
          <div className="kpi-card-trend up">Endpoint Patching 94.8%</div>
        </div>
      </div>

      {/* Workplace Services Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Digital Workplace Core Services (12 Managed Services)</h2>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service ID</th>
                <th>Service Name</th>
                <th>Managed Scope</th>
                <th>Compliance Status</th>
                <th>Service Availability</th>
                <th>Lead Owner</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {workplaceServices.map((ws) => (
                <tr key={ws.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ncgr-deep-sky)' }}>{ws.id}</td>
                  <td style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{ws.service}<br /><span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>{ws.issue}</span></td>
                  <td style={{ fontSize: '0.75rem', fontWeight: 600 }}>{ws.managedCount}</td>
                  <td style={{ fontSize: '0.75rem' }}>{ws.compliantCount}</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--status-healthy)', fontWeight: 600 }}>{ws.availability}</td>
                  <td style={{ fontSize: '0.75rem' }}>{ws.owner}</td>
                  <td>
                    <span className={`health-badge ${ws.status === 'Healthy' ? 'healthy' : 'at-risk'}`}>
                      {ws.status}
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

export default DigitalWorkplaceView;
