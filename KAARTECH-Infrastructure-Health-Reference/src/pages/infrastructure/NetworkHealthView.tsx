import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

interface NetworkDevice {
  id: string;
  name: string;
  type: string;
  location: string;
  availability: string;
  latency: string;
  packetLoss: string;
  utilization: number;
  health: 'Healthy' | 'Warning' | 'Critical';
  issue: string;
}

const networkDevices: NetworkDevice[] = [
  { id: 'NET-001', name: 'Core Router Riyadh-01', type: 'Core Router', location: 'Riyadh Primary', availability: '99.99%', latency: '12 ms', packetLoss: '0.1%', utilization: 58, health: 'Healthy', issue: 'None' },
  { id: 'NET-002', name: 'WAN Gateway Riyadh-02', type: 'WAN Gateway', location: 'Riyadh Primary', availability: '99.92%', latency: '38 ms', packetLoss: '1.2%', utilization: 84, health: 'Warning', issue: 'STC WAN link packet drop during peak hours' },
  { id: 'NET-003', name: 'Internet Edge Firewall Cluster-01', type: 'Firewall', location: 'Riyadh Primary', availability: '99.99%', latency: '14 ms', packetLoss: '0.0%', utilization: 62, health: 'Healthy', issue: 'None' },
  { id: 'NET-004', name: 'Riyadh DR WAN Router DR-01', type: 'Core Router', location: 'Riyadh DR', availability: '99.98%', latency: '15 ms', packetLoss: '0.2%', utilization: 45, health: 'Healthy', issue: 'None' },
  { id: 'NET-005', name: 'F5 BIG-IP Load Balancer Cluster', type: 'Load Balancer', location: 'Riyadh Primary', availability: '99.99%', latency: '8 ms', packetLoss: '0.0%', utilization: 51, health: 'Healthy', issue: 'None' },
  { id: 'NET-006', name: 'VPN Gateway Cisco ASA 5585', type: 'VPN Gateway', location: 'Riyadh Primary', availability: '99.95%', latency: '22 ms', packetLoss: '0.4%', utilization: 72, health: 'Healthy', issue: 'None' },
  { id: 'NET-007', name: 'Internal DNS / DHCP Appliance Cluster', type: 'Infoblox Appliance', location: 'Riyadh Primary', availability: '100.0%', latency: '4 ms', packetLoss: '0.0%', utilization: 38, health: 'Healthy', issue: 'None' },
  { id: 'NET-008', name: 'LAN Core Switch Nexus 9000-01', type: 'Core Switch', location: 'Riyadh Primary', availability: '99.99%', latency: '2 ms', packetLoss: '0.0%', utilization: 49, health: 'Healthy', issue: 'None' },
  { id: 'NET-009', name: 'LAN Core Switch Nexus 9000-02', type: 'Core Switch', location: 'Riyadh Primary', availability: '99.99%', latency: '2 ms', packetLoss: '0.0%', utilization: 50, health: 'Healthy', issue: 'None' },
  { id: 'NET-010', name: 'Jeddah Regional Edge Router-01', type: 'Edge Router', location: 'Jeddah', availability: '99.91%', latency: '42 ms', packetLoss: '0.8%', utilization: 78, health: 'Warning', issue: 'Elevated latency on backup link' },
  { id: 'NET-011', name: 'SD-WAN Gateway Orchestrator', type: 'SD-WAN Controller', location: 'Riyadh Primary', availability: '99.97%', latency: '18 ms', packetLoss: '0.1%', utilization: 55, health: 'Healthy', issue: 'None' },
  { id: 'NET-012', name: 'DMZ Security Switch Cluster', type: 'Distribution Switch', location: 'Riyadh Primary', availability: '99.99%', latency: '5 ms', packetLoss: '0.0%', utilization: 42, health: 'Healthy', issue: 'None' },
  { id: 'NET-013', name: 'Out-of-Band Management Network', type: 'Management Switch', location: 'Riyadh Primary', availability: '99.99%', latency: '3 ms', packetLoss: '0.0%', utilization: 28, health: 'Healthy', issue: 'None' },
  { id: 'NET-014', name: 'Riyadh DR Edge Firewall Cluster', type: 'Firewall', location: 'Riyadh DR', availability: '99.98%', latency: '16 ms', packetLoss: '0.1%', utilization: 48, health: 'Healthy', issue: 'None' },
  { id: 'NET-015', name: 'Wireless LAN Controller Cisco 9800', type: 'WLC', location: 'Riyadh Primary', availability: '99.96%', latency: '12 ms', packetLoss: '0.3%', utilization: 60, health: 'Healthy', issue: 'None' },
];

const NetworkHealthView: React.FC = () => {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDevices = networkDevices.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">Enterprise Network Health</h1>
            <p className="page-subtitle">WAN Link Telemetry, Core Switches, Firewalls, Load Balancers & Latency Monitoring</p>
          </div>
          <span className="simulated-badge">{t('app.demoData')}</span>
        </div>
      </div>

      {/* Summary KPI Cards (Section 9) */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#074A76' }} />
          <div className="kpi-card-label">Core Devices</div>
          <div className="kpi-card-value">48</div>
          <div className="kpi-card-trend neutral">Switches, Routers & Firewalls</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#40904F' }} />
          <div className="kpi-card-label">Healthy Devices</div>
          <div className="kpi-card-value" style={{ color: '#40904F' }}>46</div>
          <div className="kpi-card-trend up">Normal Operating Parameters</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#E97F0A' }} />
          <div className="kpi-card-label">Warning Alerts</div>
          <div className="kpi-card-value" style={{ color: '#E97F0A' }}>2</div>
          <div className="kpi-card-trend down">WAN Gateway & Jeddah Link</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#4AA6DC' }} />
          <div className="kpi-card-label">Average Latency</div>
          <div className="kpi-card-value">18 ms</div>
          <div className="kpi-card-trend up">Packet Loss 0.4%</div>
        </div>
        <div className="kpi-card" style={{ cursor: 'default' }}>
          <div className="kpi-card-accent" style={{ background: '#1FBBB0' }} />
          <div className="kpi-card-label">Network Availability</div>
          <div className="kpi-card-value" style={{ color: '#1FBBB0' }}>99.97%</div>
          <div className="kpi-card-trend up">SLA Target 99.9%</div>
        </div>
      </div>

      {/* Network Devices Table */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">Network Infrastructure Devices (15 Major Nodes)</h2>
          <div className="header-search" style={{ width: 280 }}>
            <Search size={16} className="header-search-icon" />
            <input
              type="text"
              placeholder="Search network devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Device Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Availability</th>
                <th>Latency</th>
                <th>Packet Loss</th>
                <th>Link Utilization</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ncgr-deep-sky)' }}>{d.id}</td>
                  <td style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{d.name}<br /><span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>{d.issue}</span></td>
                  <td><span className="health-badge healthy" style={{ fontSize: '0.625rem' }}>{d.type}</span></td>
                  <td style={{ fontSize: '0.75rem' }}>{d.location}</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--status-healthy)', fontWeight: 600 }}>{d.availability}</td>
                  <td style={{ fontSize: '0.75rem' }}>{d.latency}</td>
                  <td style={{ fontSize: '0.75rem' }}>{d.packetLoss}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{d.utilization}%</span>
                      <div style={{ flex: 1, height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${d.utilization}%`, height: '100%', background: d.utilization > 80 ? '#E97F0A' : '#40904F' }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`health-badge ${d.health === 'Healthy' ? 'healthy' : 'at-risk'}`}>
                      {d.health}
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

export default NetworkHealthView;
