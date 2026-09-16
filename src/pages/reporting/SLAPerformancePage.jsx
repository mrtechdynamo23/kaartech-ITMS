/**
 * KaarTech ITMS Control Tower — Comprehensive Contractual SLA Performance
 * Route: /reporting/sla
 * Combines Incident & Resolution SLAs (RFP §5.1) with Resource Governance SLAs (4 Categories).
 * Coherent with SLA Governance Page and Resource Management Store.
 */
import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, CheckCircle2, Clock, AlertTriangle, Download,
  Target, BarChart3, AlertOctagon, Users, Award, ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';
import { SLA_POLICIES, OVERALL_MONTHLY_RESOLUTION_TARGET } from '../../data/config';
import { getIncidentStats, RESOURCES } from '../../data/demoData';
import { SERVICE_DOMAINS } from '../../data/serviceDomains';
import { useResourceManagement, SLA_CATEGORIES } from '../../data/resourceManagementStore';

export default function SLAPerformancePage() {
  const [activeReportTab, setActiveReportTab] = useState('governance');
  const stats = getIncidentStats();

  const {
    slas,
    measurements,
    getSLAKPIs,
    getBreaches,
  } = useResourceManagement();

  const kpis = useMemo(() => getSLAKPIs(), [slas, measurements]);
  const breaches = useMemo(() => getBreaches(), [slas, measurements]);

  // Incident SLA table
  const incidentSlaTable = [
    {
      priority: 'P1 - Critical',
      responseTarget: '30 Minutes',
      responseActual: '14 Minutes (100% Met)',
      resolutionTarget: '4 Hours (95.0% Target)',
      resolutionActual: `${stats.p1ResolutionSla}% Met`,
      status: stats.p1ResolutionSla >= 95 ? 'Passed' : 'At Risk',
      source: 'RFP §5.1',
    },
    {
      priority: 'P2 - High',
      responseTarget: '2 Hours',
      responseActual: '42 Minutes (98.5% Met)',
      resolutionTarget: '8 Hours (90.0% Target)',
      resolutionActual: `${stats.p2ResolutionSla}% Met`,
      status: stats.p2ResolutionSla >= 90 ? 'Passed' : 'At Risk',
      source: 'RFP §5.1',
    },
    {
      priority: 'P3 - Medium',
      responseTarget: '1 Business Day',
      responseActual: '4.2 Hours (96.0% Met)',
      resolutionTarget: '2 Business Days (90.0% Target)',
      resolutionActual: '95.6% Met',
      status: 'Passed',
      source: 'RFP §5.1',
    },
    {
      priority: 'P4 - Low',
      responseTarget: '2 Business Days',
      responseActual: '8.5 Hours (98.0% Met)',
      resolutionTarget: '4 Business Days (85.0% Target)',
      resolutionActual: '96.0% Met',
      status: 'Passed',
      source: 'RFP §5.1',
    },
  ];

  // Category distribution data
  const categoryChartData = useMemo(() => {
    return kpis.byCategory.map(c => ({
      name: c.label,
      compliance: c.compliance,
      met: c.met,
      breached: c.breached,
    }));
  }, [kpis]);

  // Service Domain distribution data
  const domainStats = useMemo(() => {
    return SERVICE_DOMAINS.map(sd => {
      const dResources = RESOURCES.filter(r => r.serviceDomainId === sd.id);
      return {
        name: sd.name,
        code: sd.code,
        resources: dResources.length,
        compliance: 94 + ((dResources.length * 3) % 6),
      };
    });
  }, []);

  return (
    <div className="sla-performance-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Contractual SLA Performance & Audit Report</h1>
            <span className="badge badge-success">Audit Verified</span>
          </div>
          <p className="page-subtitle">
            Consolidated SLA reporting combining incident resolution SLAs (RFP §5.1) and resource governance commitments across 4 contractual categories.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={15} />
          <span>Export SLA Certificate</span>
        </button>
      </div>

      {/* KPI Tiles (Live numbers matching SLA Governance) */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <KPICard
          title="Overall Governance SLA"
          value={`${kpis.complianceRate}%`}
          target="95.0%"
          status={kpis.complianceRate >= 95 ? 'success' : 'warning'}
          trend={+1.8}
          subtitle={`${kpis.met} Met / ${kpis.totalMeasurements} Tested`}
          icon={ShieldCheck}
        />
        <KPICard
          title="Incident Resolution SLA"
          value={`${stats.resolutionSlaPercent}%`}
          target={`${OVERALL_MONTHLY_RESOLUTION_TARGET}%`}
          status="success"
          trend={+3.4}
          subtitle="Overall Incident Attainment"
          icon={CheckCircle2}
        />
        <KPICard
          title="Total Breaches"
          value={kpis.breached}
          unit="Active"
          status={kpis.breached === 0 ? 'success' : 'danger'}
          subtitle={kpis.breached === 0 ? 'Zero compliance deductions' : 'Corrective plan submitted'}
          icon={AlertTriangle}
        />
        <KPICard
          title="Contractual Deduction"
          value="SAR 0"
          status="success"
          subtitle="Zero penalty deductions applied"
          icon={Award}
        />
      </div>

      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border-primary)' }}>
        {[
          { key: 'governance', label: 'Resource Governance SLAs (4 Categories)', icon: Target },
          { key: 'incident', label: 'Incident & Resolution SLAs (§5.1)', icon: Clock },
          { key: 'breaches', label: `SLA Breaches (${breaches.length})`, icon: AlertOctagon },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeReportTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveReportTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--brand-primary)' : '3px solid transparent',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                marginBottom: '-2px',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Resource Governance SLAs */}
      {activeReportTab === 'governance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Charts Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '16px' }}>
            <ChartCard
              title="Compliance by Sourced SLA Category"
              subtitle="4 Contractual categories from master agreement"
              height={250}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }} />
                  <Bar dataKey="compliance" name="Compliance %" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} barSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Service Domain SLA Performance Distribution"
              subtitle="7 RFP Service Domains compliance comparison"
              height={250}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
                  <XAxis dataKey="code" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                  <YAxis domain={[80, 100]} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }} />
                  <Bar dataKey="compliance" name="SLA Compliance %" fill="#0D9F6E" radius={[4, 4, 0, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Master Table of Governance SLAs */}
          <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 700 }}>Contractual Resource SLA Matrix</h3>
                <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  All 4 categories with baseline original targets, current active rules, and live measurements.
                </p>
              </div>
              <span className="badge badge-primary">{slas.length} Master SLAs</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-primary)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>ID</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>SLA Name</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>Category</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>Original Sourced Target</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>Working Target</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>Measurement Source</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {slas.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-primary)' }}>{s.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{s.name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                        {SLA_CATEGORIES.find(c => c.key === s.category)?.label || s.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.originalSourceTarget}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                      {s.currentTargetOperator} {s.currentTargetValue} {s.currentTargetUnit} (v{s.targetVersion})
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.measurementSource}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-success">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Incident & Resolution SLAs */}
      {activeReportTab === 'incident' && (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 700 }}>RFP §5.1 Incident & Resolution SLA Matrix</h3>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Operational ticket handling metrics per priority tier.
            </p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-primary)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>Priority Level</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>Contract Response SLA</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>Actual Response</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>Contract Resolution SLA</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>Actual Resolution</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>Audit Verdict</th>
              </tr>
            </thead>
            <tbody>
              {incidentSlaTable.map(row => (
                <tr key={row.priority} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>{row.priority}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{row.responseTarget}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-green)', fontWeight: 600 }}>{row.responseActual}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{row.resolutionTarget}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-green)', fontWeight: 700 }}>{row.resolutionActual}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${row.status === 'Passed' ? 'badge-success' : 'badge-warning'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: SLA Breaches */}
      {activeReportTab === 'breaches' && (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 700 }}>Audit Breach & Penalty Registry</h3>
              <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                Identified variances requiring formal root-cause analysis and SteerCom escalation.
              </p>
            </div>
            <span className={`badge ${breaches.length === 0 ? 'badge-success' : 'badge-danger'}`}>
              {breaches.length} Breaches
            </span>
          </div>

          {breaches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle2 size={36} color="var(--color-green)" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ margin: 0, fontWeight: 700 }}>All Service Commitments Fully Satisfied</h4>
              <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Zero financial or governance penalties incurred across current period.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-primary)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Breach ID</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>SLA</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Period</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Target</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Actual</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Variance</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {breaches.map(b => (
                    <tr key={b.measurementId} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-red)' }}>{b.measurementId}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>{b.slaName} ({b.slaId})</td>
                      <td style={{ padding: '12px 14px' }}>{b.period}</td>
                      <td style={{ padding: '12px 14px' }}>{b.target}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-red)' }}>{b.actual}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>{b.breachAmount}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{b.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
