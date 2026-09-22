/**
 * KaarTech ITMS Control Tower — Weekly Status Report (WSR)
 * Route: /reporting/wsr
 * 
 * Weekly Operational Aggregation:
 *  - Full operational depth matching Daily Flash Report (DFR) standards
 *  - 7-Day volume trends, SLA compliance, and backlog dynamics
 *  - Incident, Service Request, Problem, and Enhancement breakdown
 *  - Customer CSAT, Feedback, and Action items (CTAs)
 *  - Programme Governance, Active Delivery Risks, and Management Decisions
 */

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  ShieldCheck,
  Activity,
  TrendingUp,
  BarChart3,
  Award,
  Users,
  Layers,
  ChevronRight,
  Filter,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import KPICard from '../../components/common/KPICard';
import { OVERALL_MONTHLY_RESOLUTION_TARGET } from '../../data/config';
import { useTheme } from '../../contexts/ThemeContext';
import { jsPDF } from 'jspdf';

const AVAILABLE_WEEKS = [
  { id: '2026-W31', label: 'Week 31 (25 Jul – 31 Jul 2026)', dateRange: '25 Jul 2026 – 31 Jul 2026', month: 'Jul 2026', quarter: 'Q3 2026' },
  { id: '2026-W30', label: 'Week 30 (18 Jul – 24 Jul 2026)', dateRange: '18 Jul 2026 – 24 Jul 2026', month: 'Jul 2026', quarter: 'Q3 2026' },
  { id: '2026-W29', label: 'Week 29 (11 Jul – 17 Jul 2026)', dateRange: '11 Jul 2026 – 17 Jul 2026', month: 'Jul 2026', quarter: 'Q3 2026' },
  { id: '2026-W28', label: 'Week 28 (04 Jul – 10 Jul 2026)', dateRange: '04 Jul 2026 – 10 Jul 2026', month: 'Jul 2026', quarter: 'Q3 2026' },
];

export default function WSRReportPage() {
  const { isDark } = useTheme();
  const [selectedWeekId, setSelectedWeekId] = useState('2026-W31');
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'operations' | 'sla' | 'customer' | 'governance'
  const [toast, setToast] = useState(null);

  const [isExporting, setIsExporting] = useState(false);

  const selectedWeek = useMemo(() => {
    return AVAILABLE_WEEKS.find(w => w.id === selectedWeekId) || AVAILABLE_WEEKS[0];
  }, [selectedWeekId]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportDeck = async () => {
    if (isExporting) return;
    setIsExporting(true);
    const filename = `KaarTech_ITMS_WSR_Deck_${selectedWeek.id}.pdf`;
    showToast(`Generating and downloading WSR PDF Deck for ${selectedWeek.label}...`);
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      doc.setFontSize(18);
      doc.setTextColor(107, 29, 42); // KaarTech brand
      doc.text(`KaarTech ITMS Control Tower — Weekly Status Report`, 14, 20);
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      doc.text(`7-Day Operational Aggregation — Period: ${selectedWeek.label} (${selectedWeek.dateRange})`, 14, 28);
      doc.setDrawColor(107, 29, 42);
      doc.setLineWidth(0.5);
      doc.line(14, 32, 283, 32);

      doc.setFontSize(12);
      doc.setTextColor(20, 20, 20);
      doc.text('Weekly Operational & Service Highlights:', 14, 44);
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text('• Weekly Ticket Inflow: 142 Tickets (34 Incidents, 88 Service Requests, 20 Others)', 18, 52);
      doc.text('• Weekly Outflow / Resolved: 148 Tickets (Net backlog contraction: -6 tickets)', 18, 60);
      doc.text('• Active Open Backlog: 24 Tickets (0 Critical P1, 2 High P2)', 18, 68);
      doc.text(`• Weekly Resolution SLA: 97.8% (Contract Benchmark: ${OVERALL_MONTHLY_RESOLUTION_TARGET}.0%)`, 18, 76);
      doc.text('• Overall Contractual Breaches: 0 Breaches (100% Contractual Compliance)', 18, 84);
      doc.text('• Customer Satisfaction (CSAT): 94.2% (Target: 90.0%, Positive Sentiment: 94.2%)', 18, 92);
      doc.text('• Major Incidents (P1/P2): 0 Open / 2 Mitigated within contractual restore timeframes', 18, 100);
      doc.text('• Workforce Capacity: 30.0 FTE (23 Dedicated, 7 Cross-Functional Shared Specialists)', 18, 108);

      doc.save(filename);
      showToast(`WSR Deck downloaded successfully: ${filename}`);
    } catch (err) {
      console.error('WSR export error:', err);
      showToast('PDF generation failed. Opening print preview.', 'error');
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  // 7-Day Trend data for the selected week
  const dailyTrendData = [
    { day: 'Mon (25 Jul)', Inflow: 22, Resolved: 24, SLA: 98.2 },
    { day: 'Tue (26 Jul)', Inflow: 26, Resolved: 25, SLA: 97.6 },
    { day: 'Wed (27 Jul)', Inflow: 28, Resolved: 30, SLA: 98.5 },
    { day: 'Thu (28 Jul)', Inflow: 24, Resolved: 26, SLA: 97.4 },
    { day: 'Fri (29 Jul)', Inflow: 18, Resolved: 20, SLA: 98.0 },
    { day: 'Sat (30 Jul)', Inflow: 12, Resolved: 11, SLA: 96.8 },
    { day: 'Sun (31 Jul)', Inflow: 12, Resolved: 12, SLA: 98.0 },
  ];

  // Application distribution data
  const appDistributionData = [
    { app: 'SAP S/4HANA', Incidents: 14, SRs: 32, Total: 46, SLA: 97.8 },
    { app: 'SAP SuccessFactors', Incidents: 8, SRs: 22, Total: 30, SLA: 98.4 },
    { app: 'SAP Ariba', Incidents: 6, SRs: 18, Total: 24, SLA: 97.5 },
    { app: 'MS Dynamics 365', Incidents: 4, SRs: 12, Total: 16, SLA: 96.9 },
    { app: 'SAP MES / MII', Incidents: 2, SRs: 8, Total: 10, SLA: 98.8 },
    { app: 'BASIS / Platform', Incidents: 0, SRs: 16, Total: 16, SLA: 99.0 },
  ];

  // Major incidents log for the week
  const majorIncidents = [
    {
      id: 'INC-2026-0812',
      service: 'SAP S/4HANA Finance',
      severity: 'P2 - High',
      summary: 'Payment voucher settlement job timeout during end-of-month processing',
      rootCause: 'Deadlock on table BSEG during parallel batch execution',
      resolution: 'Database index rebuilt; batch partition size optimized',
      status: 'Resolved',
      duration: '1h 45m',
      slaMet: true
    },
    {
      id: 'INC-2026-0794',
      service: 'SAP SuccessFactors',
      severity: 'P2 - High',
      summary: 'Employee Central replication latency for entity KRPCH-02',
      rootCause: 'Middleware OAuth certificate expired on secondary gateway',
      resolution: 'Certificate renewed and proxy caches invalidated',
      status: 'Resolved',
      duration: '2h 10m',
      slaMet: true
    }
  ];

  // Customer CTAs / Issues
  const customerActions = [
    {
      id: 'CTA-2026-042',
      entity: 'Petrochemical Manufacturing (KRPCH)',
      subject: 'Warehouse barcode scanner wireless latency escalation',
      priority: 'High',
      status: 'In Progress',
      owner: 'Ramesh Sundaram (BASIS)',
      targetDate: '03 Aug 2026'
    },
    {
      id: 'CTA-2026-039',
      entity: 'Logistics & Supply Chain',
      subject: 'Ariba purchase requisition automated workflow realignment',
      priority: 'Medium',
      status: 'Completed',
      owner: 'Fatima Al-Otaibi',
      targetDate: '28 Jul 2026'
    },
    {
      id: 'CTA-2026-037',
      entity: 'Corporate HR & Shared Services',
      subject: 'Annual leave accrual calculation rule update for 2026',
      priority: 'Medium',
      status: 'Completed',
      owner: 'Suresh Menon',
      targetDate: '27 Jul 2026'
    }
  ];

  // Governance Risks
  const deliveryRisks = [
    {
      id: 'RSK-001',
      category: 'Infrastructure',
      risk: 'ERP database storage utilization approaching 82% threshold',
      severity: 'Medium',
      owner: 'Ramesh Sundaram',
      mitigation: 'Table archiving and log reorganization scheduled for weekend change window',
      dueDate: '08 Aug 2026'
    },
    {
      id: 'RSK-004',
      category: 'Resource',
      risk: 'Cross-functional training gap for specialized MES integration pod',
      severity: 'Low',
      owner: 'Priya Sharma',
      mitigation: 'Knowledge transfer sessions ongoing with Level 3 platform team',
      dueDate: '15 Aug 2026'
    }
  ];

  return (
    <div className="wsr-report-page animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Toast Notification — positioned bottom-right like DSR/DFR */}
      {toast && (
        <div className="toast-container">
          <div
            className="toast animate-slide-in"
            style={{
              borderColor: typeof toast === 'object' && toast.type === 'error' ? 'var(--color-crimson)' : 'var(--color-emerald)',
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {typeof toast === 'object' && toast.type === 'error' ? (
              <AlertTriangle size={18} style={{ color: 'var(--color-crimson)', flexShrink: 0 }} />
            ) : (
              <CheckCircle2 size={18} style={{ color: 'var(--color-emerald)', flexShrink: 0 }} />
            )}
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}>
              {typeof toast === 'object' ? toast.message : toast}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Weekly Status Report (WSR)</h1>
            <span className="badge badge-primary">7-Day Operational Aggregation</span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            Weekly ITSM operational performance, ticket dynamics, resolution SLA governance, and cross-tower delivery review.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Week Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-card)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)'
          }}>
            <Calendar size={15} style={{ color: 'var(--brand-primary)' }} />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>Period:</span>
            <select
              value={selectedWeekId}
              onChange={(e) => setSelectedWeekId(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {AVAILABLE_WEEKS.map(w => (
                <option key={w.id} value={w.id} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-secondary"
            onClick={handlePrint}
            title="Print Weekly Status Report"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={15} />
            <span>Print Report</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={handleExportDeck}
            disabled={isExporting}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, minWidth: '160px', justifyContent: 'center' }}
          >
            {isExporting ? (
              <>
                <Loader2 size={15} className="spin" />
                <span>Generating WSR...</span>
              </>
            ) : (
              <>
                <Download size={15} />
                <span>Export WSR Deck</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top 8 Executive KPI Grid */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        <KPICard
          title="Weekly Ticket Inflow"
          value="142 Tickets"
          subtitle="34 Incidents, 88 SRs, 20 Others"
          icon={Activity}
        />
        <KPICard
          title="Weekly Outflow"
          value="148 Resolved"
          status="success"
          subtitle="Net backlog reduction: -6"
          icon={TrendingUp}
        />
        <KPICard
          title="Active Open Backlog"
          value="24 Tickets"
          subtitle="0 Critical P1, 2 High P2"
          icon={Clock}
        />
        <KPICard
          title="Weekly Resolution SLA"
          value="97.8%"
          target={`${OVERALL_MONTHLY_RESOLUTION_TARGET}.0%`}
          status="success"
          icon={CheckCircle2}
        />
        <KPICard
          title="Contractual Breaches"
          value="0 Breaches"
          status="success"
          subtitle="100% Contractual Compliance"
          icon={ShieldCheck}
        />
        <KPICard
          title="Weekly Customer CSAT"
          value="94.2%"
          target="90.0%"
          status="success"
          subtitle="Positive responses: 94.2%"
          icon={Award}
        />
        <KPICard
          title="P1/P2 Major Incidents"
          value="0 Open / 2 Mitigated"
          status="success"
          subtitle="Avg triage duration: 1h 57m"
          icon={AlertOctagon}
        />
        <KPICard
          title="Workforce Allocation"
          value="30.0 FTE"
          subtitle="23 Dedicated, 7 Shared Pods"
          icon={Users}
        />
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-primary)',
        gap: '4px',
        marginBottom: '20px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'summary', label: 'Executive Summary & SLA', icon: Activity },
          { id: 'operations', label: 'ITSM Operations & Backlog', icon: Layers },
          { id: 'customer', label: 'Customer CSAT & Actions', icon: Award },
          { id: 'governance', label: 'Governance & Risks', icon: ShieldCheck },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                border: 'none',
                background: 'transparent',
                borderBottom: isActive ? '3px solid var(--brand-primary)' : '3px solid transparent',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Executive Summary & SLA */}
      {activeTab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Executive Overview Highlight Banner */}
          <div className="chart-card" style={{ padding: '18px 24px', background: 'var(--bg-card)', borderLeft: '4px solid var(--color-emerald)' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
              Weekly Leadership Summary — {selectedWeek.label}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              During the 7-day reporting cycle ending {selectedWeek.dateRange.split('–')[1].trim()}, operational stability was fully preserved across all core business towers. 
              Ticket inflow totaled <strong>142 tickets</strong> against <strong>148 resolutions</strong>, delivering a net backlog contraction of 6 tickets. 
              Contractual Resolution SLA stood at <strong>97.8%</strong> (vs contractual target {OVERALL_MONTHLY_RESOLUTION_TARGET}.0%) with <strong>zero contractual breaches</strong> recorded. 
              Zero Priority 1 (Critical) outages occurred, and two Priority 2 incidents were resolved well within contractual restore thresholds.
            </p>
          </div>

          {/* 7-Day Trend Chart */}
          <div className="chart-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="chart-card-title" style={{ margin: 0 }}>7-Day Daily Inflow vs Resolution & SLA Attainment</h3>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Daily volume throughput compared with the contractual resolution SLA benchmark ({OVERALL_MONTHLY_RESOLUTION_TARGET}%)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: 'var(--text-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: 'var(--brand-primary)', borderRadius: '2px' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Daily Inflow</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: 'var(--color-emerald)', borderRadius: '2px' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Daily Resolved</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '3px', background: '#E5A000' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>SLA Attainment %</span>
                </div>
              </div>
            </div>

            <div style={{ height: '320px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
                  <YAxis yAxisId="left" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" domain={[90, 100]} stroke="#E5A000" fontSize={12} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                  />
                  <Bar yAxisId="left" dataKey="Inflow" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} barSize={22} />
                  <Bar yAxisId="left" dataKey="Resolved" fill="var(--color-emerald)" radius={[4, 4, 0, 0]} barSize={22} />
                  <Line yAxisId="right" type="monotone" dataKey="SLA" stroke="#E5A000" strokeWidth={3} dot={{ r: 4, fill: '#E5A000' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Major Incidents Log */}
          <div className="chart-card">
            <h3 className="chart-card-title">Major Incident (P1/P2) Operations Log</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Incident ID</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Service Affected</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Priority</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Incident Summary</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Root Cause & Remediation</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Duration</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>SLA Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {majorIncidents.map(inc => (
                    <tr key={inc.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--brand-primary)' }}>{inc.id}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{inc.service}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className="badge badge-warning" style={{ fontWeight: 700 }}>{inc.severity}</span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{inc.summary}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{inc.resolution}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{inc.duration}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={12} /> Met SLA
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: ITSM Operations & Backlog */}
      {activeTab === 'operations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Workstream Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="chart-card" style={{ padding: '18px' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>INCIDENT VOLUME</span>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: '4px 0 8px', color: 'var(--text-primary)' }}>34</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                P1: <strong>0</strong> | P2: <strong>2</strong> | P3: <strong>18</strong> | P4: <strong>14</strong>
              </p>
            </div>
            <div className="chart-card" style={{ padding: '18px' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>SERVICE REQUESTS</span>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: '4px 0 8px', color: 'var(--text-primary)' }}>88</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-emerald)', margin: 0, fontWeight: 600 }}>
                86 Fulfilled | 2 In Approval (P4 Only)
              </p>
            </div>
            <div className="chart-card" style={{ padding: '18px' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>PROBLEM MANAGEMENT</span>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: '4px 0 8px', color: 'var(--text-primary)' }}>4</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                1 RCA Pending | 3 Known Errors Documented
              </p>
            </div>
            <div className="chart-card" style={{ padding: '18px' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>CHANGE / ENHANCEMENTS</span>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: '4px 0 8px', color: 'var(--text-primary)' }}>16</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-emerald)', margin: 0, fontWeight: 600 }}>
                100% Release Success Rate (0 Rollbacks)
              </p>
            </div>
          </div>

          {/* Application Driver Performance Table */}
          <div className="chart-card">
            <h3 className="chart-card-title">Application Volume & SLA Attainment Breakdown</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Core Enterprise Application</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Incidents</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Service Requests</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Total Volume</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Resolution SLA %</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Operational Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appDistributionData.map(row => (
                    <tr key={row.app} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{row.app}</td>
                      <td style={{ padding: '12px 14px' }}>{row.Incidents}</td>
                      <td style={{ padding: '12px 14px' }}>{row.SRs}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--brand-primary)' }}>{row.Total}</td>
                      <td style={{ padding: '12px 14px', color: row.SLA >= OVERALL_MONTHLY_RESOLUTION_TARGET ? 'var(--color-emerald)' : '#E5A000', fontWeight: 700 }}>
                        {row.SLA}%
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className="badge badge-success">Stable</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ageing & Backlog Distribution */}
          <div className="chart-card" style={{ padding: '20px' }}>
            <h3 className="chart-card-title" style={{ marginBottom: '14px' }}>Open Backlog Ageing Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>&lt; 3 Days (Fresh)</span>
                <h4 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, margin: '6px 0', color: 'var(--color-emerald)' }}>18 Tickets</h4>
                <div style={{ height: '6px', background: 'var(--border-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '75%', height: '100%', background: 'var(--color-emerald)' }} />
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>75% of total backlog</span>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>4 – 7 Days (Normal)</span>
                <h4 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, margin: '6px 0', color: 'var(--brand-primary)' }}>4 Tickets</h4>
                <div style={{ height: '6px', background: 'var(--border-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '17%', height: '100%', background: 'var(--brand-primary)' }} />
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>17% of total backlog</span>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>8 – 14 Days (Awaiting Info)</span>
                <h4 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, margin: '6px 0', color: '#E5A000' }}>2 Tickets</h4>
                <div style={{ height: '6px', background: 'var(--border-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '8%', height: '100%', background: '#E5A000' }} />
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>8% (User UAT pending)</span>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>&gt; 14 Days (Critical Stale)</span>
                <h4 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, margin: '6px 0', color: 'var(--color-emerald)' }}>0 Tickets</h4>
                <div style={{ height: '6px', background: 'var(--border-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '0%', height: '100%', background: '#D92D20' }} />
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>0% aged violations</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Customer CSAT & Actions */}
      {activeTab === 'customer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* CSAT Score Card & Sentiment */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div className="chart-card" style={{ padding: '24px' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Weekly Customer Satisfaction Index (CSAT)
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', margin: '10px 0' }}>
                <h2 style={{ fontSize: '3rem', fontWeight: 900, margin: 0, color: 'var(--brand-primary)' }}>94.2%</h2>
                <span className="badge badge-success" style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>+2.4% vs Target 90%</span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Calculated strictly from percentage distribution of responses: 
                <strong> CSAT = 62.0% (Very Satisfied) + 32.2% (Satisfied) = 94.2%</strong>. Total responses recorded: 48 survey returns.
              </p>
            </div>

            <div className="chart-card" style={{ padding: '24px' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                CSAT Rating Category Breakdown
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                {[
                  { label: 'Very Satisfied', pct: 62.0, count: '30 users', color: 'var(--color-emerald)' },
                  { label: 'Satisfied', pct: 32.2, count: '15 users', color: 'var(--brand-primary)' },
                  { label: 'Neutral', pct: 4.2, count: '2 users', color: '#E5A000' },
                  { label: 'Dissatisfied', pct: 1.6, count: '1 user', color: '#F04438' },
                  { label: 'Very Dissatisfied', pct: 0.0, count: '0 users', color: '#D92D20' },
                ].map(r => (
                  <div key={r.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{r.pct}% ({r.count})</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--border-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${r.pct}%`, height: '100%', background: r.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Issues & Open CTAs */}
          <div className="chart-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="chart-card-title" style={{ margin: 0 }}>Customer Action Items (Open CTAs)</h3>
              <span className="badge badge-primary">3 Active CTAs</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Action ID</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Operating Entity</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Subject / Improvement Item</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Priority</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Assigned Lead</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Target Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customerActions.map(cta => (
                    <tr key={cta.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--brand-primary)' }}>{cta.id}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-primary)' }}>{cta.entity}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{cta.subject}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge badge-${cta.priority === 'High' ? 'warning' : 'secondary'}`}>{cta.priority}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge badge-${cta.status === 'Completed' ? 'success' : 'primary'}`}>{cta.status}</span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{cta.owner}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{cta.targetDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Governance, Risks & Decisions */}
      {activeTab === 'governance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active Programme Risks */}
          <div className="chart-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="chart-card-title" style={{ margin: 0 }}>Active Delivery & Operational Risks</h3>
              <span className="badge badge-warning">2 Monitored Risks</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Risk ID</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Domain Category</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Risk Description</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Severity</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Assigned Owner</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Active Mitigation Plan</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Review Date</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryRisks.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--brand-primary)' }}>{r.id}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{r.category}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{r.risk}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge badge-${r.severity === 'High' ? 'danger' : r.severity === 'Medium' ? 'warning' : 'secondary'}`}>
                          {r.severity}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{r.owner}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{r.mitigation}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{r.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SteerCom Decisions & Next Week Planned Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div className="chart-card" style={{ padding: '22px' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Key Operational Decisions This Week
              </h4>
              <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '18px', margin: 0 }}>
                <li><strong>CR-2026-104 Approved:</strong> S/4HANA batch scheduling realignment granted for month-end reconciliation windows.</li>
                <li><strong>Shared Pod Mobilization:</strong> 2 cross-functional BASIS specialists reallocated to pre-migration stress tests for Wave 3 cutover.</li>
                <li><strong>KEDB Release:</strong> Published 4 new Standard Operating Procedures (SOPs) for SAP Ariba purchase order sync faults.</li>
              </ul>
            </div>

            <div className="chart-card" style={{ padding: '22px' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Upcoming Change Windows & Milestones
              </h4>
              <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '18px', margin: 0 }}>
                <li><strong>Weekend Patch Window (02 Aug):</strong> SAP Kernel 7.89 security rollouts on secondary application servers (01:00 – 04:00 AST).</li>
                <li><strong>SuccessFactors Release Wave:</strong> Semi-annual HR feature enablement planned for staging tenant on 05 Aug.</li>
                <li><strong>Disaster Recovery Drill:</strong> Core database standby replication failover validation scheduled for mid-August.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
