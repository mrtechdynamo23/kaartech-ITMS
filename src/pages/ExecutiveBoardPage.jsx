/**
 * KaarTech ITMS Control Tower — Executive Board
 * Aligned with RFP Master Specification Section 30
 * 
 * Features:
 * - Direct SteerCom Executive Dashboard
 * - 12 Centralized Dashboard KPIs:
 *   Total Resources, Active Resources, Available Resources, On Leave,
 *   Open Requests, Active Assignments, Open SLA Breaches, Overall SLA Compliance,
 *   Resource Availability, First Pass Quality, Timesheet Compliance, Pending Approvals
 * - Service Domain Operational Distribution across the 7 RFP Service Domains with drill-down
 * - SLA compliance trend & operational distribution charts
 * - Active SteerCom priority exception watchlist
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Activity, Clock, CheckCircle2, AlertTriangle, Users,
  Layers, ArrowUpRight, TrendingUp, Monitor, Zap, ArrowRight, Filter,
  FileCheck, CalendarClock, Briefcase, Award, CheckCircle, ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import KPICard from '../components/common/KPICard';
import ChartCard from '../components/common/ChartCard';
import { getExecutiveBoardData } from '../data/analyticsSelectors';
import {  ENTITIES } from '../data/masterData';
import { SERVICE_DOMAINS } from '../data/serviceDomains';
import { useResourceManagement } from '../data/resourceManagementStore';
import { RESOURCES } from '../data/demoData';

export default function ExecutiveBoardPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('q2_2026');
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [selectedDomain, setSelectedDomain] = useState('all');

  const { getSLAKPIs, getAssignmentKPIs, requests, assignments, measurements } = useResourceManagement();
  const slaKpis = useMemo(() => getSLAKPIs(), [getSLAKPIs]);
  const asgnKpis = useMemo(() => getAssignmentKPIs(), [getAssignmentKPIs]);

  const boardData = useMemo(() => {
    return getExecutiveBoardData({
      period,
      entity: selectedEntity,
      domain: selectedDomain,
    });
  }, [period, selectedEntity, selectedDomain]);

  // 12 Centralized KPIs per Section 30
  const totalResourcesCount = RESOURCES.length;
  const activeResourcesCount = RESOURCES.filter(r => r.status === 'Active').length;
  const availableResourcesCount = RESOURCES.filter(r => r.status !== 'On Leave' && (!r.availability || r.availability.available !== false)).length;
  const onLeaveCount = RESOURCES.filter(r => r.status === 'On Leave' || r.availability?.status === 'On Leave').length;
  const openRequestsCount = requests.filter(r => !['Closed', 'Rejected'].includes(r.status)).length;
  const activeAssignmentsCount = assignments.filter(a => a.status === 'Active').length;
  const openBreachesCount = measurements.filter(m => m.status === 'BREACH').length;
  const overallComplianceRate = `${slaKpis.complianceRate}%`;
  const resourceAvailabilityPct = '96.8%';
  const firstPassQualityPct = '92.4%';
  const timesheetCompliancePct = '98.6%';
  const pendingApprovalsCount = requests.filter(r => r.status === 'Pending Approval' || r.status === 'Requested').length;

  // 7 RFP Service Domains distribution with drill-down (Section 30)
  const serviceDomainDistribution = useMemo(() => {
    return SERVICE_DOMAINS.map(sd => {
      const dResources = RESOURCES.filter(r => r.serviceDomainId === sd.id);
      const dActive = dResources.filter(r => r.status === 'Active').length;
      return {
        id: sd.id,
        name: sd.name,
        code: sd.code,
        count: dResources.length,
        active: dActive,
        sharePct: Math.round((dResources.length / totalResourcesCount) * 100),
      };
    });
  }, [totalResourcesCount]);

  return (
    <div className="executive-board-page animate-fade-in" style={{ paddingBottom: '30px' }}>
      {/* ── Page Header & Context Filter Bar ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Executive Board</h1>
            <span className="badge badge-success" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              SteerCom Ready
            </span>
            <span className="badge badge-primary">
              KAARTECH ITMS
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            Operational telemetry & governance control across 7 Service Domains, 34 operating entities, and 26 enterprise systems.
          </p>
        </div>

        {/* Scope Filters */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-card)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-secondary)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
            <Filter size={12} style={{ color: 'var(--brand-primary)' }} />
            <span>Scope:</span>
          </div>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              borderRadius: '4px',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
            }}
          >
            <optgroup label="Month">
              <option value="m_sep">September 2026</option>
              <option value="m_aug">August 2026</option>
              <option value="m_jul">July 2026</option>
            </optgroup>
            <optgroup label="Quarter">
              <option value="q3_2026">Q3 2026 (Jul – Sep)</option>
              <option value="q2_2026">Q2 2026 (Apr – Jun)</option>
              <option value="q1_2026">Q1 2026 (Jan – Mar)</option>
            </optgroup>
            <optgroup label="YTD">
              <option value="ytd_2026">YTD 2026 (Jan – Sep)</option>
            </optgroup>
          </select>

          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              borderRadius: '4px',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              maxWidth: '140px',
            }}
          >
            <option value="all">All Entities (34)</option>
            {ENTITIES.slice(0, 10).map(ent => (
              <option key={ent.id} value={ent.name}>{ent.name}</option>
            ))}
          </select>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              borderRadius: '4px',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              maxWidth: '140px',
            }}
          >
            <option value="all">All Domains (7)</option>
            {SERVICE_DOMAINS.map(d => (
              <option key={d.id} value={d.id}>{d.id} — {d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── 1. The 12 Mandatory Dashboard KPIs (Section 30) ── */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.04em', marginBottom: '10px' }}>
          Executive Health & Delivery Indicators (Centralized Telemetry)
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '10px',
          }}
        >
          <KPICard
            title="Total Resources"
            value={totalResourcesCount}
            subtitle="Central Personnel Pool"
            accentColor="var(--brand-primary)"
            sparklineData={[30, 32, 34, totalResourcesCount]}
            onClick={() => navigate('/resources/directory')}
          />
          <KPICard
            title="Active Resources"
            value={activeResourcesCount}
            subtitle={`${Math.round((activeResourcesCount / totalResourcesCount) * 100)}% Deployed`}
            status="success"
            sparklineData={[28, 30, 31, activeResourcesCount]}
            onClick={() => navigate('/resources/directory')}
          />
          <KPICard
            title="Available Resources"
            value={availableResourcesCount}
            subtitle="Ready for Allocation"
            status="normal"
            sparklineData={[3, 4, 3, availableResourcesCount]}
            onClick={() => navigate('/resources/directory')}
          />
          <KPICard
            title="On Leave"
            value={onLeaveCount}
            subtitle="Scheduled Absences"
            status={onLeaveCount > 4 ? 'warning' : 'normal'}
            sparklineData={[1, 2, 1, onLeaveCount]}
            onClick={() => navigate('/resources/timesheet-approval')}
          />
          <KPICard
            title="Open Requests"
            value={openRequestsCount}
            subtitle="Active Staffing Pipeline"
            status="normal"
            accentColor="var(--color-blue)"
            sparklineData={[6, 8, 9, openRequestsCount]}
            onClick={() => navigate('/resources/requests')}
          />
          <KPICard
            title="Active Assignments"
            value={activeAssignmentsCount}
            subtitle="Operational Pods"
            status="success"
            sparklineData={[12, 13, 13, activeAssignmentsCount]}
            onClick={() => navigate('/resources/assignments')}
          />
          <KPICard
            title="Open SLA Breaches"
            value={openBreachesCount}
            subtitle={openBreachesCount === 0 ? 'Zero Breaches' : 'Action In Progress'}
            status={openBreachesCount === 0 ? 'success' : 'danger'}
            sparklineData={[3, 2, 1, openBreachesCount]}
            onClick={() => navigate('/sla/breaches')}
          />
          <KPICard
            title="Overall SLA Compliance"
            value={overallComplianceRate}
            target="95.0%"
            status={slaKpis.complianceRate >= 95 ? 'success' : 'warning'}
            trend={+(slaKpis.complianceRate - 95).toFixed(1)}
            subtitle={`${slaKpis.met} Met • ${slaKpis.breached} Breached`}
            sparklineData={[92, 94, 95.5, slaKpis.complianceRate]}
            onClick={() => navigate('/governance/sla-governance')}
          />
          <KPICard
            title="Resource Availability"
            value={resourceAvailabilityPct}
            target=">= 95.0%"
            status="success"
            subtitle="Contractual Commitment"
            sparklineData={[95.2, 95.8, 96.4, 96.8]}
            onClick={() => navigate('/governance/sla-governance')}
          />
          <KPICard
            title="First Pass Quality"
            value={firstPassQualityPct}
            target=">= 90.0%"
            status="success"
            subtitle="Candidate Shortlist QA"
            sparklineData={[89, 90.5, 91.8, 92.4]}
            onClick={() => navigate('/resources/requests')}
          />
          <KPICard
            title="Timesheet Compliance"
            value={timesheetCompliancePct}
            target=">= 98.0%"
            status="success"
            subtitle="3rd Business Day Pack"
            sparklineData={[97.2, 98.0, 98.4, 98.6]}
            onClick={() => navigate('/resources/timesheet-approval')}
          />
          <KPICard
            title="Pending Approvals"
            value={pendingApprovalsCount}
            subtitle="Requisition Queue"
            status={pendingApprovalsCount > 4 ? 'warning' : 'normal'}
            sparklineData={[2, 4, 3, pendingApprovalsCount]}
            onClick={() => navigate('/resources/requests')}
          />
        </div>
      </div>

      {/* ── 2. Primary Service Domain Operational Distribution (Section 30) ── */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} style={{ color: 'var(--brand-primary)' }} />
              Primary Service Domain Distribution (7 RFP Service Domains)
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '4px 0 0' }}>
              Contractual personnel allocation, operational delivery pods, and live drill-down into Resource Directory
            </p>
          </div>
          <span className="badge badge-primary">
            Click any domain to filter Resource Directory
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          {serviceDomainDistribution.map(sd => (
            <div
              key={sd.id}
              onClick={() => navigate(`/resources/directory?domain=${sd.id}`)}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--brand-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 14px rgba(107, 29, 42, 0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-secondary)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)' }}>
                    {sd.id}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                    {sd.sharePct}%
                  </span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {sd.name}
                </div>
              </div>

              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--border-primary)', paddingTop: '8px' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {sd.count} <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 500 }}>FTEs</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', color: 'var(--brand-primary)', fontWeight: 600 }}>
                  Inspect <ChevronRight size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Primary Visual Analytics (SLA Performance + Ticket Mix) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        {/* SLA Performance Trend */}
        <ChartCard
          title="Contractual SLA Performance Trend"
          subtitle="Monthly Response vs Resolution compliance vs Contractual 88% Threshold"
          badge="RFP §5.1 Benchmark"
          badgeVariant="badge-success"
          height={260}
          actions={
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/reporting/sla')} style={{ fontSize: '11px' }}>
              View SLA Matrix <ArrowRight size={11} />
            </button>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={boardData.slaTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="slaResGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9F6E" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#0D9F6E" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="slaRespGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <YAxis domain={[80, 100]} stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '11px', boxShadow: 'var(--shadow-lg)' }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              <Area type="monotone" dataKey="Resolution" stroke="#0D9F6E" fillOpacity={1} fill="url(#slaResGrad)" strokeWidth={2} name="Resolution SLA %" />
              <Area type="monotone" dataKey="Response" stroke="#2563EB" fillOpacity={1} fill="url(#slaRespGrad)" strokeWidth={1.5} name="Response SLA %" />
              <Area type="monotone" dataKey="Target" stroke="#6B1D2A" strokeDasharray="3 3" fill="none" strokeWidth={1.5} name="Contract Target (88%)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Operational Ticket Mix */}
        <ChartCard
          title="Operational Ticket Volume Distribution"
          subtitle="Current operational mix across service streams"
          height={260}
          actions={
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/command-center')} style={{ fontSize: '11px' }}>
              Command Center <ArrowRight size={11} />
            </button>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={boardData.ticketMix}
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {boardData.ticketMix.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '11px', boxShadow: 'var(--shadow-lg)' }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── 4. Critical Exceptions & Governance Action Strip ── */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-secondary)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 22px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={15} style={{ color: 'var(--color-amber)' }} />
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Active SteerCom Priority Exceptions & Watch Items
            </h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/governance/actions')} style={{ fontSize: '11px' }}>
            Open Action Hub <ArrowRight size={11} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
          {[
            { tag: 'TRANSITION', title: 'Wave 3 S/4HANA Go-Live Gate Check', target: 'Nov 2026', badge: 'On Track', link: '/governance/transition' },
            { tag: 'SECURITY AUDIT', title: 'Surveillance Audit Remediation (2 OFIs)', target: 'Due in 14 Days', badge: 'In Remediation', link: '/governance/audits' },
            { tag: 'INNOVATION', title: '320 Unused Ticket Hours converted to ENH-OF-RUN', target: 'Contractual Q2', badge: 'Approved', link: '/service-innovation/ticket-reduction' },
          ].map((exc, idx) => (
            <div
              key={idx}
              onClick={() => navigate(exc.link)}
              style={{
                background: 'var(--bg-secondary)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-secondary)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--brand-primary)', letterSpacing: '0.04em' }}>
                  {exc.tag}
                </span>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {exc.title}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Target: {exc.target}</div>
              </div>
              <span className="badge badge-neutral" style={{ fontSize: '10px' }}>{exc.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
