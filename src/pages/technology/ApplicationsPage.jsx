/**
 * KaarTech ITMS Control Tower — Application Portfolio
 * Route: /technology/applications
 * In Scope (26) and Potential Extension (6) application estate per RFP §3.1.
 */
import React, { useState } from 'react';
import { Monitor, Server, Cloud, Shield, Layers, Plus, ExternalLink, Filter } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import DataTable from '../../components/common/DataTable';
import DetailDrawer from '../../components/common/DetailDrawer';
import ServiceDomainFilter from '../../components/common/ServiceDomainFilter';
import { APPLICATIONS } from '../../data/masterData';
import { SERVICE_DOMAINS } from '../../data/serviceDomains';

export default function ApplicationsPage() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [scopeFilter, setScopeFilter] = useState('all');
  const [serviceDomainFilter, setServiceDomainFilter] = useState('all');

  const inScope = APPLICATIONS.filter(a => a.scope === 'In Scope');
  const potentialExt = APPLICATIONS.filter(a => a.scope === 'Potential Extension');
  const criticalApps = APPLICATIONS.filter(a => a.criticality === 'Critical');

  const filteredApps = APPLICATIONS.filter(a => {
    if (scopeFilter !== 'all' && a.scope !== scopeFilter) return false;
    if (serviceDomainFilter !== 'all') {
      if (a.serviceDomainId !== serviceDomainFilter && a.serviceDomain !== serviceDomainFilter) return false;
    }
    return true;
  });

  const columns = [
    { key: 'id', label: 'App ID', width: '100px' },
    {
      key: 'name',
      label: 'Application / Platform',
      width: '220px',
      render: (val, item) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{val}</div>
          {item.modules && <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{item.modules}</div>}
        </div>
      )
    },
    {
      key: 'serviceDomain',
      label: 'Service Domain',
      width: '200px',
      render: (val, item) => (
        <span
          className="badge"
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-secondary)',
            fontWeight: 600,
            fontSize: '11px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '190px',
            display: 'inline-block'
          }}
          title={val || item.serviceDomainId}
        >
          {val || item.serviceDomainId || 'Applications, Digital, and Integration'}
        </span>
      )
    },
    {
      key: 'scope',
      label: 'Scope Status',
      width: '150px',
      render: (val) => (
        <span className={`badge ${val === 'In Scope' ? 'badge-primary' : 'badge-neutral'}`}>
          {val}
        </span>
      )
    },
    { key: 'vendor', label: 'Vendor', width: '120px' },
    {
      key: 'criticality',
      label: 'Tier Criticality',
      width: '130px',
      render: (val) => (
        <span className={`badge ${val === 'Critical' ? 'badge-error' : val === 'High' ? 'badge-warning' : 'badge-neutral'}`}>
          {val || 'Medium'}
        </span>
      )
    },
    {
      key: 'hosting',
      label: 'Deployment Model',
      width: '140px',
      render: (val) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)' }}>
          {val === 'Cloud' ? <Cloud size={12} style={{ color: 'var(--brand-primary)' }} /> : <Server size={12} style={{ color: 'var(--text-tertiary)' }} />}
          {val}
        </span>
      )
    },
    {
      key: 'health',
      label: 'Health',
      width: '100px',
      render: (val) => (
        <span className={`badge ${val === 'Healthy' ? 'badge-success' : 'badge-neutral'}`}>
          {val || 'Evaluation'}
        </span>
      )
    },
  ];

  return (
    <div className="applications-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Application Portfolio</h1>
            <span className="badge badge-primary">{APPLICATIONS.length} Systems Cataloged</span>
          </div>
          <p className="page-subtitle">Master repository of in-scope enterprise ERP, HXM, CRM, and cloud extensions covering the KaarTech AMS landscape.</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <KPICard
          title="Total Applications"
          value={APPLICATIONS.length}
          subtitle="Enterprise application estate"
          icon={Monitor}
        />
        <KPICard
          title="In Scope (Contractual)"
          value={inScope.length}
          status="success"
          subtitle="26 Core Systems (RFP §3.1)"
          icon={Layers}
        />
        <KPICard
          title="Potential Extensions"
          value={potentialExt.length}
          subtitle="6 Discretionary Additions"
          icon={Cloud}
        />
        <KPICard
          title="Tier-1 Mission Critical"
          value={criticalApps.length}
          status="warning"
          subtitle="S/4HANA, SF, MES, CPI"
          icon={Shield}
        />
      </div>

      {/* Scope & Service Domain Filter Bar */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '16px', background: 'var(--bg-card)', padding: '12px 16px', borderRadius: 'var(--radius-lg, 12px)', border: '1px solid var(--border-primary)' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setScopeFilter('all')}
            className={`btn ${scopeFilter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            All Applications ({APPLICATIONS.length})
          </button>
          <button
            onClick={() => setScopeFilter('In Scope')}
            className={`btn ${scopeFilter === 'In Scope' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            In Scope ({inScope.length})
          </button>
          <button
            onClick={() => setScopeFilter('Potential Extension')}
            className={`btn ${scopeFilter === 'Potential Extension' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            Potential Extensions ({potentialExt.length})
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ServiceDomainFilter
            value={serviceDomainFilter}
            onChange={(val) => setServiceDomainFilter(val)}
            allowAll={true}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        title="Application Portfolio Inventory"
        subtitle="Click any application row to review architectural dependencies, SLAs, and technical specifications."
        columns={columns}
        data={filteredApps}
        onRowClick={(item) => setSelectedApp(item)}
        exportFilename="kaartech-application-portfolio.csv"
      />

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedApp)}
        item={selectedApp}
        onClose={() => setSelectedApp(null)}
        type="application"
      />
    </div>
  );
}
