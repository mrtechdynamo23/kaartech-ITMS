/**
 * KaarTech ITMS Control Tower — Command Center Overview (Section 17)
 * True operational control tower with P1/P2 visibility, SLA compliance,
 * time-series velocity trends, domain load distribution, and live exception queue.
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert, Clock, CheckCircle2, Activity, Layers, Flame,
  TrendingUp, AlertTriangle, Plus, ArrowRight, Filter
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';
import FilterBar from '../../components/common/FilterBar';
import DataTable from '../../components/common/DataTable';
import DetailDrawer from '../../components/common/DetailDrawer';
import CreateTicketModal from '../../components/common/CreateTicketModal';
import { getIncidentAnalytics, getServiceRequestAnalytics } from '../../data/analyticsSelectors';
import { SERVICE_DOMAINS } from '../../data/serviceDomains';

export default function CommandCenterOverview() {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    serviceDomain: 'all',
    entity: 'all',
    domain: 'all',
    priority: 'all',
    status: 'all',
    app: 'all',
  });

  const incAnalytics = useMemo(() => getIncidentAnalytics(filters), [filters]);
  const srAnalytics = useMemo(() => getServiceRequestAnalytics(filters), [filters]);

  // Service Domain volume data across the 7 Primary Service Domains
  const serviceDomainData = useMemo(() => {
    return SERVICE_DOMAINS.map(sd => {
      const incs = incAnalytics.filteredList.filter(i => i.serviceDomainId === sd.id || i.serviceDomain === sd.name);
      const srs = srAnalytics.filteredList.filter(s => s.serviceDomainId === sd.id || s.serviceDomain === sd.name);
      return {
        id: sd.id,
        code: sd.code,
        name: sd.shortName || sd.name,
        fullName: sd.name,
        Incidents: incs.length,
        ServiceRequests: srs.length,
        Total: incs.length + srs.length,
      };
    });
  }, [incAnalytics.filteredList, srAnalytics.filteredList]);

  const columns = [
    { key: 'id', label: 'Ticket ID', width: '110px' },
    { key: 'priority', label: 'Priority', type: 'priority', width: '120px' },
    { key: 'shortDescription', label: 'Summary', wrap: true },
    {
      key: 'serviceDomain',
      label: 'Service Domain',
      width: '180px',
      render: (val, item) => (
        <span
          className="badge"
          style={{
            fontSize: '11px',
            fontWeight: 700,
            background: 'rgba(107, 29, 42, 0.08)',
            color: 'var(--brand-primary)',
            border: '1px solid rgba(107, 29, 42, 0.2)',
          }}
          title={val || item.serviceDomainId}
        >
          {val || item.serviceDomainId || 'IT Helpdesk'}
        </span>
      ),
    },
    { key: 'application', label: 'Application', width: '150px' },
{ key: 'entity', label: 'Entity', width: '140px' },
    { key: 'assignedTo', label: 'Assigned Resolver', width: '150px' },
    { key: 'status', label: 'Status', type: 'status', width: '120px' },
    { key: 'slaStatus', label: 'SLA Status', type: 'sla', width: '130px' },
  ];

  return (
    <div className="command-center-page animate-fade-in">
      {/* ── 1. Page Header ── */}
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Command Center</h1>
            <span className="badge badge-primary" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Live Operational Dispatch
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            Real-time incident triage, service request velocity, and domain load distribution across all 34 entities.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/command-center/incidents')}>
            Incident Register ({incAnalytics.total})
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={15} />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* ── 2. Context Filters ── */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({ entity: 'all', domain: 'all', priority: 'all', status: 'all', app: 'all' })}
        showEntity={true}
        showDomain={true}
        showPriority={true}
        showStatus={true}
        showApp={true}
      />

      {/* ── 3. Critical Exception Strip (Section 17) ── */}
      {incAnalytics.exceptionQueue.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', background: 'linear-gradient(90deg, rgba(220,38,38,0.08) 0%, rgba(220,38,38,0.02) 100%)',
          border: '1px solid var(--color-red)', borderRadius: 'var(--radius-md)',
          marginBottom: '16px', gap: '12px', flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-red)' }} />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-red)', textTransform: 'uppercase' }}>
              {incAnalytics.exceptionQueue.length} Priority Operational Watch Items
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              Top Item: {incAnalytics.exceptionQueue[0]?.id} ({incAnalytics.exceptionQueue[0]?.shortDescription})
            </span>
          </div>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => setSelectedTicket(incAnalytics.exceptionQueue[0])}
            style={{ fontSize: '11px', padding: '3px 8px' }}
          >
            Open Bridge Triage
          </button>
        </div>
      )}

      {/* ── 4. Compact KPI Strip ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <KPICard
          title="Total Ticket Generated"
          value={incAnalytics.total + srAnalytics.total}
          unit="tickets"
          subtitle={`${incAnalytics.total} Inc / ${srAnalytics.total} SR`}
          icon={Layers}
          sparklineData={[
            Math.max(10, incAnalytics.total + srAnalytics.total - 15),
            Math.max(15, incAnalytics.total + srAnalytics.total - 8),
            incAnalytics.total + srAnalytics.total
          ]}
          onClick={() => navigate('/command-center/incidents')}
        />
        <KPICard
          title="Active Open Tickets"
          value={incAnalytics.open + srAnalytics.open}
          unit="tickets"
          subtitle={`${incAnalytics.open} Incidents / ${srAnalytics.open} SRs`}
          icon={Activity}
          sparklineData={[42, 48, 52, incAnalytics.open + srAnalytics.open]}
          onClick={() => navigate('/command-center/incidents')}
        />
        <KPICard
          title="P1 Critical Incidents"
          value={incAnalytics.p1}
          status={incAnalytics.p1 > 0 ? 'danger' : 'success'}
          subtitle="30m Resp / 4h Res SLA"
          icon={Flame}
          sparklineData={[2, 1, 3, incAnalytics.p1]}
          onClick={() => navigate('/command-center/incidents')}
        />
        <KPICard
          title="Resolution SLA Met"
          value="84.0%"
          target="88.0%"
          status="warning"
          trend={-4.0}
          trendPeriod="vs 88% target (-4 pp)"
          isPositiveGood={true}
          icon={CheckCircle2}
          sparklineData={[88, 86, 85, 84]}
          onClick={() => navigate('/reporting/sla')}
        />
        <KPICard
          title="SLA Breaches"
          value={incAnalytics.breached}
          status={incAnalytics.breached === 0 ? 'success' : 'danger'}
          subtitle="Requires root cause action"
          icon={AlertTriangle}
          sparklineData={[1, 2, 2, incAnalytics.breached]}
        />
        <KPICard
          title="Major SRs (≥16h)"
          value={srAnalytics.major}
          unit="SRs"
          subtitle="Complex technical requests"
          icon={Clock}
          sparklineData={[8, 10, 11, srAnalytics.major]}
          onClick={() => navigate('/command-center/service-requests')}
        />
      </div>

      {/* ── 5. Primary Visual Analytics ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Ticket Inflow vs Resolution Velocity */}
        <ChartCard
          title="Ticket Inflow vs Resolution Velocity (4 Months)"
          subtitle="Monthly volume created vs successfully closed"
          height={260}
          actions={
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Net backlog stable</span>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={incAnalytics.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6B1D2A" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#6B1D2A" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="closedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9F6E" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#0D9F6E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '11px', boxShadow: 'var(--shadow-lg)' }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
              <Area type="monotone" dataKey="Created" stroke="#6B1D2A" fillOpacity={1} fill="url(#createdGrad)" strokeWidth={2} name="Created Inflow" />
              <Area type="monotone" dataKey="Closed" stroke="#0D9F6E" fillOpacity={1} fill="url(#closedGrad)" strokeWidth={2} name="Resolved / Closed" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Operational Load by Service Domain */}
        <ChartCard
          title="Operational Volume by Service Domain (7 RFP Domains)"
          subtitle="Real-time incident & service request allocation across the 7 Primary Service Domains"
          height={260}
          actions={
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/command-center/service-requests')} style={{ fontSize: '11px' }}>
              SR Matrix <ArrowRight size={11} />
            </button>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serviceDomainData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" height={45} />
              <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '11px', boxShadow: 'var(--shadow-lg)' }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
                formatter={(val, name, entry) => [`${val} tickets`, `${entry.payload.fullName} (${name})`]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
              <Bar dataKey="Incidents" fill="#6B1D2A" radius={[4, 4, 0, 0]} name="Incidents" />
              <Bar dataKey="ServiceRequests" fill="#2563EB" radius={[4, 4, 0, 0]} name="Service Requests" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── 6. Live Dispatch Queue Table ── */}
      <DataTable
        title="Live Dispatch & Operational Queue"
        subtitle="Click any row to inspect technical root cause, SLA countdowns, and consultant assignment."
        columns={columns}
        data={incAnalytics.filteredList}
        onRowClick={(item) => setSelectedTicket(item)}
        exportFilename="command-center-live-queue.csv"
      />

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedTicket)}
        item={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(newTicket) => {
          setSelectedTicket(newTicket);
        }}
      />
    </div>
  );
}
