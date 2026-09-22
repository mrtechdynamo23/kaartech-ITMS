/**
 * KaarTech ITMS Control Tower — Risk Register
 * Route: /governance/risks
 * 5x5 Risk Heat Map matrix and mitigation action plans (Section 31).
 * Strictly enforces semantic colors (Red = Critical, Amber = Medium, Green = Low).
 */
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, AlertTriangle, CheckCircle, Plus, Eye, RefreshCw, Layers, X, CheckCircle2 } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import DataTable from '../../components/common/DataTable';
import DetailModal from '../../components/common/DetailModal';
import { risks as initialRisks } from '../../data/demoData';
import { SERVICE_DOMAINS } from '../../data/serviceDomains';

export default function RiskRegisterPage() {
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const [customRisks, setCustomRisks] = useState([]);
  const [isLogRiskModalOpen, setIsLogRiskModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  // Form state
  const [riskTitle, setRiskTitle] = useState('');
  const [riskDomain, setRiskDomain] = useState(SERVICE_DOMAINS[5].name);
  const [riskCategory, setRiskCategory] = useState('Operational');
  const [riskSeverity, setRiskSeverity] = useState('High');
  const [riskOwner, setRiskOwner] = useState('Suresh N.');
  const [riskDueDate, setRiskDueDate] = useState('2026-10-15');
  const [riskMitigation, setRiskMitigation] = useState('');

  const allRisks = useMemo(() => {
    return [...customRisks, ...initialRisks];
  }, [customRisks]);

  const handleLogRisk = (e) => {
    e.preventDefault();
    if (!riskTitle.trim()) return;

    const newId = `RSK-00${allRisks.length + 1}`;
    const newRecord = {
      id: newId,
      title: riskTitle.trim(),
      category: riskCategory,
      serviceDomain: riskDomain,
      severity: riskSeverity,
      inherentScore: riskSeverity === 'Critical' ? 20 : riskSeverity === 'High' ? 16 : riskSeverity === 'Medium' ? 12 : 6,
      residualScore: riskSeverity === 'Critical' ? 8 : riskSeverity === 'High' ? 6 : 4,
      owner: riskOwner.trim() || 'Enterprise Risk Lead',
      status: 'Open',
      dueDate: riskDueDate,
      mitigationPlan: riskMitigation.trim() || 'Implement standard operating procedure controls and automated validation.',
      impactDescription: riskMitigation.trim() || 'Operational disruption or SLA compliance risk.',
    };

    setCustomRisks(prev => [newRecord, ...prev]);
    setIsLogRiskModalOpen(false);
    setRiskTitle('');
    setRiskMitigation('');
    setSuccessBanner(`Risk ${newId} logged successfully into register!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const criticalRisks = allRisks.filter(r => (r.severity || r.impact) === 'Critical');
  const highRisks = allRisks.filter(r => (r.severity || r.impact) === 'High');
  const mediumRisks = allRisks.filter(r => (r.severity || r.impact) === 'Medium');
  const lowRisks = allRisks.filter(r => (r.severity || r.impact) === 'Low');

  const filteredRisks = useMemo(() => {
    if (selectedSeverity === 'all') return allRisks;
    return allRisks.filter(r => {
      const sev = (r.severity || r.impact || '').toLowerCase();
      return sev === selectedSeverity.toLowerCase();
    });
  }, [allRisks, selectedSeverity]);

  const columns = [
    { key: 'id', label: 'Risk ID', width: '110px' },
    { key: 'title', label: 'Risk', wrap: true },
    { key: 'category', label: 'Category', width: '120px' },
    { key: 'owner', label: 'Owner', width: '140px' },
    {
      key: 'severity',
      label: 'Severity',
      width: '110px',
      render: (val, item) => {
        const sev = val || item.impact || 'Medium';
        let color = '#7A8288';
        let bg = 'rgba(122, 130, 136, 0.12)';
        if (sev === 'Critical') {
          color = '#D92D20';
          bg = 'rgba(217, 45, 32, 0.12)';
        } else if (sev === 'High') {
          color = '#F04438';
          bg = 'rgba(240, 68, 56, 0.12)';
        } else if (sev === 'Medium') {
          color = '#E5A000';
          bg = 'rgba(229, 160, 0, 0.12)';
        } else if (sev === 'Low') {
          color = '#159A6A';
          bg = 'rgba(21, 154, 106, 0.12)';
        }
        return (
          <span
            className="badge"
            style={{
              backgroundColor: bg,
              color: color,
              border: `1px solid ${color}40`,
              fontWeight: 700,
            }}
          >
            {sev}
          </span>
        );
      }
    },
    {
      key: 'probability',
      label: 'Probability',
      width: '120px',
      render: (v, item) => (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {v || item.likelihood || 'Possible'}
        </span>
      ),
    },
    { key: 'status', label: 'Status', type: 'status', width: '110px' },
    {
      key: 'mitigationPlan',
      label: 'Mitigation',
      wrap: true,
      render: (v, item) => (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          {v || item.mitigation || 'Standard controls active.'}
        </span>
      ),
    },
    { key: 'dueDate', label: 'Due Date', type: 'date', width: '110px' },
    {
      key: 'age',
      label: 'Age',
      width: '80px',
      render: (v, item) => (
        <span style={{ fontWeight: 600, color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
          {v || item.age || '12d'}
        </span>
      ),
    },
  ];

  return (
    <div className="risk-register-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">Enterprise Risk Register</h1>
            <span className="badge badge-warning">{criticalRisks.length + highRisks.length} Elevated Risks</span>
            <span className="badge badge-success">100% Contained Controls</span>
          </div>
          <p className="page-subtitle">Proactive risk identification, severity distribution, and residual risk mitigation governance.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsLogRiskModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} />
          <span>Log New Risk</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(21, 154, 106, 0.12)',
          border: '1px solid var(--color-emerald)',
          color: 'var(--color-emerald)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
        }}>
          <CheckCircle2 size={18} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* KPI Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
      }}>
        <KPICard
          title="Total Tracked Risks"
          value={allRisks.length}
          subtitle="Across operational landscape"
          icon={ShieldAlert}
          sparklineData={[12, 14, 15, allRisks.length]}
        />
        <KPICard
          title="Critical / High Risks"
          value={highRisks.length}
          status={highRisks.length > 0 ? 'danger' : 'success'}
          subtitle="Mitigation actively tracked"
          icon={AlertTriangle}
          sparklineData={[5, 4, 3, highRisks.length]}
        />
        <KPICard
          title="Medium Exposure"
          value={mediumRisks.length}
          status="warning"
          subtitle="Monitored operational controls"
          sparklineData={[6, 7, 7, mediumRisks.length]}
        />
        <KPICard
          title="Residual Risk Target"
          value="100% Contained"
          status="success"
          subtitle="All controls operating effectively"
          icon={CheckCircle}
          sparklineData={[95, 98, 100, 100]}
        />
      </div>

      {/* Risk Severity Distribution & Interactive Filter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        {/* Risk Severity Distribution Visual */}
        <div className="chart-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 className="chart-card-title" style={{ margin: 0 }}>Risk Severity Distribution</h3>
            {selectedSeverity !== 'all' && (
              <button
                onClick={() => setSelectedSeverity('all')}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '11px', padding: '2px 8px', color: 'var(--brand-primary)' }}
              >
                Reset Filter
              </button>
            )}
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '18px' }}>
            Live exposure distribution across tracked risk catalog. Click any severity bar to filter the Active Risk Register.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              {
                id: 'critical',
                label: 'Critical',
                count: criticalRisks.length,
                color: '#D92D20',
                bg: 'rgba(217, 45, 32, 0.12)',
                border: '#D92D2040',
                desc: 'Severe operational interruption or regulatory impact',
              },
              {
                id: 'high',
                label: 'High',
                count: highRisks.length,
                color: '#F04438',
                bg: 'rgba(240, 68, 56, 0.12)',
                border: '#F0443840',
                desc: 'Major business process degradation or key dependency',
              },
              {
                id: 'medium',
                label: 'Medium',
                count: mediumRisks.length,
                color: '#E5A000',
                bg: 'rgba(229, 160, 0, 0.12)',
                border: '#E5A00040',
                desc: 'Moderate operational friction with active workarounds',
              },
              {
                id: 'low',
                label: 'Low',
                count: lowRisks.length,
                color: '#159A6A',
                bg: 'rgba(21, 154, 106, 0.12)',
                border: '#159A6A40',
                desc: 'Minor procedural gap or standard low-risk advisory',
              },
            ].map((tier) => {
              const total = allRisks.length || 1;
              const pct = Math.round((tier.count / total) * 100);
              const isSelected = selectedSeverity === tier.id;

              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedSeverity(isSelected ? 'all' : tier.id)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md, 8px)',
                    background: isSelected ? tier.bg : 'var(--bg-secondary, #f8fafc)',
                    border: `1.5px solid ${isSelected ? tier.color : 'var(--border-secondary, #e2e8f0)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = tier.color;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-secondary, #e2e8f0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: tier.bg,
                          color: tier.color,
                          border: `1px solid ${tier.border}`,
                          fontWeight: 700,
                          fontSize: '11px',
                          minWidth: '65px',
                          textAlign: 'center',
                        }}
                      >
                        {tier.label}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {tier.desc}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: tier.color }}>
                        {tier.count}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', minWidth: '32px', textAlign: 'right' }}>
                        ({pct}%)
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: 'var(--border-primary, #e2e8f0)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${Math.max(pct, 4)}%`,
                      height: '100%',
                      background: tier.color,
                      borderRadius: '4px',
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Filter & Governance Controls */}
        <div className="chart-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="chart-card-title">Risk Governance & Register Controls</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '14px' }}>
              Filter by exposure severity to drill down into active mitigations and escalation pathways.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setSelectedSeverity('all')}
                className={`btn ${selectedSeverity === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'space-between', padding: '10px 14px' }}
              >
                <span style={{ fontWeight: 600 }}>All Tracked Risks</span>
                <span className="badge badge-neutral">{allRisks.length}</span>
              </button>
              <button
                onClick={() => setSelectedSeverity('critical')}
                className={`btn ${selectedSeverity === 'critical' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'space-between', padding: '10px 14px', borderLeft: '4px solid #D92D20' }}
              >
                <span style={{ fontWeight: 600 }}>Critical Severity</span>
                <span className="badge" style={{ background: 'rgba(217, 45, 32, 0.12)', color: '#D92D20', fontWeight: 700 }}>
                  {criticalRisks.length}
                </span>
              </button>
              <button
                onClick={() => setSelectedSeverity('high')}
                className={`btn ${selectedSeverity === 'high' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'space-between', padding: '10px 14px', borderLeft: '4px solid #F04438' }}
              >
                <span style={{ fontWeight: 600 }}>High Severity</span>
                <span className="badge" style={{ background: 'rgba(240, 68, 56, 0.12)', color: '#F04438', fontWeight: 700 }}>
                  {highRisks.length}
                </span>
              </button>
              <button
                onClick={() => setSelectedSeverity('medium')}
                className={`btn ${selectedSeverity === 'medium' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'space-between', padding: '10px 14px', borderLeft: '4px solid #E5A000' }}
              >
                <span style={{ fontWeight: 600 }}>Medium Severity</span>
                <span className="badge" style={{ background: 'rgba(229, 160, 0, 0.12)', color: '#E5A000', fontWeight: 700 }}>
                  {mediumRisks.length}
                </span>
              </button>
              <button
                onClick={() => setSelectedSeverity('low')}
                className={`btn ${selectedSeverity === 'low' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'space-between', padding: '10px 14px', borderLeft: '4px solid #159A6A' }}
              >
                <span style={{ fontWeight: 600 }}>Low Severity</span>
                <span className="badge" style={{ background: 'rgba(21, 154, 106, 0.12)', color: '#159A6A', fontWeight: 700 }}>
                  {lowRisks.length}
                </span>
              </button>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md, 8px)',
            background: 'var(--bg-secondary, #f8fafc)',
            border: '1px solid var(--border-secondary, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 'var(--text-xs)',
          }}>
            <span style={{ color: 'var(--text-secondary)' }}>Showing in table:</span>
            <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
              {filteredRisks.length} of {allRisks.length} risks
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        title="Active Risk Register"
        subtitle="Click any risk row to view mitigation actions, residual impact calculations, and escalation pathways."
        columns={columns}
        data={filteredRisks}
        onRowClick={(item) => setSelectedRisk(item)}
        exportFilename="itms-risk-register.csv"
      />

      {/* Centered Record Detail Modal */}
      <DetailModal
        isOpen={Boolean(selectedRisk)}
        item={selectedRisk}
        onClose={() => setSelectedRisk(null)}
        type="risk"
      />

      {/* Centered Log New Risk Modal */}
      {isLogRiskModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="modal-overlay-centered"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '24px',
          }}
          onClick={() => setIsLogRiskModalOpen(false)}
        >
          <div
            className="modal-dialog-centered"
            style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: 'var(--radius-xl, 16px)',
              border: '2px solid var(--border-secondary, #e2e8f0)',
              boxShadow: 'var(--shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25))',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '88vh',
              overflow: 'hidden',
              margin: 'auto',
              alignSelf: 'center',
              display: 'flex',
              flexDirection: 'column',
              animation: 'modalCenterScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-primary, #e2e8f0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-secondary, #f8fafc)',
              borderRadius: '16px 16px 0 0',
              flexShrink: 0,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <ShieldAlert size={18} color="var(--brand-primary, #6B1D2A)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Log New Operational Risk
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                  Enter potential exposure into the Enterprise Risk Register
                </p>
              </div>
              <button
                onClick={() => setIsLogRiskModalOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleLogRisk} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div className="modal-form-scrollable-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Risk Statement / Hazard Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Unplanned EDI middleware outage causing shipping delay"
                  value={riskTitle}
                  onChange={(e) => setRiskTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--border-primary, #cbd5e1)',
                    background: 'var(--bg-input, #ffffff)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Service Domain
                  </label>
                  <select
                    value={riskDomain}
                    onChange={(e) => setRiskDomain(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    {SERVICE_DOMAINS.map(d => (
                      <option key={d.id} value={d.name}>{d.id} — {d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Risk Category
                  </label>
                  <select
                    value={riskCategory}
                    onChange={(e) => setRiskCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="Operational">Operational</option>
                    <option value="Technical">Technical / Infrastructure</option>
                    <option value="Security">Security & Compliance</option>
                    <option value="Financial">Financial / Contractual</option>
                    <option value="Resource">Staffing & Knowledge Retention</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Severity / Exposure
                  </label>
                  <select
                    value={riskSeverity}
                    onChange={(e) => setRiskSeverity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="Critical">Critical (Inherent: 20)</option>
                    <option value="High">High (Inherent: 16)</option>
                    <option value="Medium">Medium (Inherent: 12)</option>
                    <option value="Low">Low (Inherent: 6)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Risk Owner (RACI)
                  </label>
                  <input
                    type="text"
                    value={riskOwner}
                    onChange={(e) => setRiskOwner(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Target Mitigation Due Date
                </label>
                <input
                  type="date"
                  value={riskDueDate}
                  onChange={(e) => setRiskDueDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--border-primary, #cbd5e1)',
                    background: 'var(--bg-input, #ffffff)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Mitigation Action Plan & Controls
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail preventative controls, failover procedures, and monitoring alerts..."
                  value={riskMitigation}
                  onChange={(e) => setRiskMitigation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--border-primary, #cbd5e1)',
                    background: 'var(--bg-input, #ffffff)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    resize: 'vertical',
                  }}
                />
              </div>
              </div>

              {/* Action Buttons — Sticky Footer */}
              <div className="modal-form-sticky-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsLogRiskModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ShieldAlert size={14} />
                  <span>Log Risk</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
