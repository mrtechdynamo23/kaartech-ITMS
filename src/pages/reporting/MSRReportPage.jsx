/**
 * KaarTech ITMS Control Tower — Monthly Status Report (MSR) & SteerCom Deck
 * Route: /reporting/msr
 * 
 * Monthly Management Aggregation:
 *  - High-level executive steering committee reporting
 *  - 6-Month Month-over-Month (MoM) trend analysis
 *  - Entity-level SLA attainment and governance sign-offs
 *  - Service Domain throughput and capacity allocation (Dedicated vs Shared FTE)
 *  - Continuous Improvement (CIP), Problem Management, and Incident Deflection
 *  - Strategic Programme Governance, forward-looking roadmap, and penalty assessments
 */

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Award,
  DollarSign,
  CheckCircle2,
  ShieldCheck,
  Activity,
  TrendingUp,
  BarChart3,
  Users,
  Layers,
  AlertOctagon,
  Check,
  AlertTriangle,
  Lightbulb,
  Briefcase,
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
import { ENTITIES } from '../../data/masterData';
import { OVERALL_MONTHLY_RESOLUTION_TARGET } from '../../data/config';
import { useTheme } from '../../contexts/ThemeContext';
import { jsPDF } from 'jspdf';

const AVAILABLE_MONTHS = [
  { id: '2026-07', label: 'July 2026', quarter: 'Q3 2026', year: 2026 },
  { id: '2026-06', label: 'June 2026', quarter: 'Q2 2026', year: 2026 },
  { id: '2026-05', label: 'May 2026', quarter: 'Q2 2026', year: 2026 },
  { id: '2026-04', label: 'April 2026', quarter: 'Q2 2026', year: 2026 },
  { id: '2026-03', label: 'March 2026', quarter: 'Q1 2026', year: 2026 },
];

export default function MSRReportPage() {
  const { isDark } = useTheme();
  const [selectedMonthId, setSelectedMonthId] = useState('2026-07');
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'entities' | 'domains' | 'innovation' | 'governance'
  const [toast, setToast] = useState(null);

  const [isExporting, setIsExporting] = useState(false);

  const selectedMonth = useMemo(() => {
    return AVAILABLE_MONTHS.find(m => m.id === selectedMonthId) || AVAILABLE_MONTHS[0];
  }, [selectedMonthId]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportMSR = async () => {
    if (isExporting) return;
    setIsExporting(true);
    const filename = `KaarTech_ITMS_Monthly_Service_Report_${selectedMonth.label.replace(/\s+/g, '_')}.pdf`;
    showToast(`Downloading Monthly Service Report for ${selectedMonth.label}...`);
    try {
      const response = await fetch('/reports/MSR%20for%20CT.pdf');
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 2000);
      showToast(`MSR PDF downloaded successfully: ${filename}`);
    } catch (err) {
      console.warn('Direct PDF fetch failed, falling back to dynamic jsPDF generation:', err);
      try {
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        doc.setFontSize(18);
        doc.setTextColor(107, 29, 42);
        doc.text(`KaarTech ITMS Control Tower — Monthly Service Report`, 14, 20);
        doc.setFontSize(12);
        doc.setTextColor(80, 80, 80);
        doc.text(`Executive SteerCom Reporting Deck — ${selectedMonth.label} (${selectedMonth.quarter})`, 14, 28);
        doc.setDrawColor(107, 29, 42);
        doc.setLineWidth(0.5);
        doc.line(14, 32, 283, 32);

        doc.setFontSize(12);
        doc.setTextColor(20, 20, 20);
        doc.text('Key Operational & Governance Metrics:', 14, 44);
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text(`• Monthly Resolution SLA Attainment: 97.4% (Target: ${OVERALL_MONTHLY_RESOLUTION_TARGET}.0%)`, 18, 52);
        doc.text('• Contractual Penalty Deductions: SAR 0 (Zero contractual breaches across all 34 operating entities)', 18, 60);
        doc.text('• Monthly Ticket Demand & Throughput: 580 Inflow / 604 Resolved (Net -24 Backlog Contraction)', 18, 68);
        doc.text('• Customer Satisfaction (CSAT): 93.8% (Target: 90.0%, Positive Sentiment: 94.2%)', 18, 76);
        doc.text('• Earned Continuous Improvement Credits: 320 Hours (SAR 145,000 Transferred to ENH-OF-RUN)', 18, 84);
        doc.text('• SteerCom Sign-off Attainment: 34 / 34 Entities Signed Off (100% Contract Compliance)', 18, 92);
        doc.text('• Problem Management & Deflection: 14 RCAs Closed, 32.4% Deflection via KEDB Knowledge Base', 18, 100);
        doc.text('• Total Workforce Allocation: 30 Resources / 30.0 FTE (23 Dedicated, 7 Shared Specialists)', 18, 108);

        doc.save(filename);
        showToast(`MSR PDF generated and downloaded successfully!`);
      } catch (genErr) {
        console.error('jsPDF generation failed:', genErr);
        showToast('Export failed. Please use Print Deck to save as PDF.', 'error');
      }
    } finally {
      setIsExporting(false);
    }
  };

  // 6-Month Month-over-Month historical data
  const momTrendData = [
    { month: 'Feb 2026', Inflow: 540, Resolved: 532, SLA: 96.2 },
    { month: 'Mar 2026', Inflow: 570, Resolved: 565, SLA: 95.8 },
    { month: 'Apr 2026', Inflow: 590, Resolved: 598, SLA: 97.5 },
    { month: 'May 2026', Inflow: 565, Resolved: 572, SLA: 97.2 },
    { month: 'Jun 2026', Inflow: 610, Resolved: 615, SLA: 96.8 },
    { month: 'Jul 2026', Inflow: 580, Resolved: 604, SLA: 97.4 },
  ];

  // Entity-Level Performance data
  const entityPerformance = useMemo(() => {
    return ENTITIES.slice(0, 14).map((ent, idx) => ({
      name: ent.name,
      code: ent.code || `ENT-${String(idx + 1).padStart(2, '0')}`,
      incidents: 16 + ((idx * 3) % 12),
      srs: 28 + ((idx * 5) % 20),
      total: (16 + ((idx * 3) % 12)) + (28 + ((idx * 5) % 20)),
      p1p2Sla: '100%',
      overallSla: `${97 + (idx % 3 * 0.5)}%`,
      csat: `${(92 + (idx % 6 * 1.1)).toFixed(1)}%`,
      signOff: 'Approved'
    }));
  }, []);

  // Domain Capacity and Throughput data
  const domainBreakdown = [
    { domain: 'Core ERP (S/4HANA & Logistics)', lead: 'Suresh Menon', headcount: 8, fte: 8.0, supportModel: 'Dedicated', tickets: 184, sla: 97.8 },
    { domain: 'Supply Chain Management (SAP Ariba)', lead: 'Fatima Al-Otaibi', headcount: 5, fte: 5.0, supportModel: 'Dedicated', tickets: 112, sla: 97.2 },
    { domain: 'Human Capital (SuccessFactors)', lead: 'Zaid Al-Harbi', headcount: 4, fte: 4.0, supportModel: 'Dedicated', tickets: 88, sla: 98.4 },
    { domain: 'Basis, Database & Cloud Platform', lead: 'Ramesh Sundaram', headcount: 6, fte: 6.0, supportModel: 'Dedicated', tickets: 96, sla: 98.8 },
    { domain: 'Integration, Middleware & EDI', lead: 'Ahmed Mansoor', headcount: 4, fte: 4.0, supportModel: 'Shared Support', tickets: 58, sla: 97.5 },
    { domain: 'Enterprise Analytics & Reporting', lead: 'Priya Sharma', headcount: 3, fte: 3.0, supportModel: 'Shared Support', tickets: 42, sla: 98.0 },
  ];

  // Continuous Improvement (CIP) Initiatives
  const cipInitiatives = [
    {
      id: 'CIP-2026-08',
      title: 'Automated Account Unlock & Password Reset Bot',
      domain: 'Service Desk / Security',
      hoursSaved: 85,
      financialSavings: 'SAR 38,000',
      status: 'Live in Production',
      impact: 'Deflected 140 L1 monthly support calls'
    },
    {
      id: 'CIP-2026-09',
      title: 'S/4HANA Inbound IDoc Self-Healing Trigger',
      domain: 'Integration / Logistics',
      hoursSaved: 120,
      financialSavings: 'SAR 54,000',
      status: 'Live in Production',
      impact: 'Automated replay of failed EDI purchase orders'
    },
    {
      id: 'CIP-2026-11',
      title: 'SuccessFactors Pre-payroll Data Consistency Health Check',
      domain: 'Human Capital',
      hoursSaved: 115,
      financialSavings: 'SAR 53,000',
      status: 'Live in Production',
      impact: 'Prevented end-of-month payroll re-runs'
    },
  ];

  return (
    <div className="msr-report-page animate-fade-in" style={{ paddingBottom: '40px' }}>
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
            <h1 className="page-title" style={{ margin: 0 }}>Monthly Status Report (MSR) & SteerCom</h1>
            <span className="badge badge-success">Monthly Management Aggregation</span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            Executive SteerCom reporting deck, monthly financial service credits, contract governance, and SLA sign-offs.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Month Selector */}
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
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>Reporting Month:</span>
            <select
              value={selectedMonthId}
              onChange={(e) => setSelectedMonthId(e.target.value)}
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
              {AVAILABLE_MONTHS.map(m => (
                <option key={m.id} value={m.id} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                  {m.label} ({m.quarter})
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-secondary"
            onClick={handlePrint}
            title="Print Monthly SteerCom Deck"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={15} />
            <span>Print Deck</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={handleExportMSR}
            disabled={isExporting}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, minWidth: '160px', justifyContent: 'center' }}
          >
            {isExporting ? (
              <>
                <Loader2 size={15} className="spin" />
                <span>Downloading MSR...</span>
              </>
            ) : (
              <>
                <Download size={15} />
                <span>Export MSR (PDF)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Management Executive KPI Grid */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        <KPICard
          title="Monthly Resolution SLA"
          value="97.4%"
          target={`${OVERALL_MONTHLY_RESOLUTION_TARGET}.0%`}
          status="success"
          trend={+0.6}
          icon={CheckCircle2}
        />
        <KPICard
          title="Service Penalty Deductions"
          value="SAR 0"
          status="success"
          subtitle="Zero contractual breaches"
          icon={DollarSign}
        />
        <KPICard
          title="Monthly Throughput"
          value="580 In / 604 Out"
          status="success"
          subtitle="Net backlog reduction: -24"
          icon={TrendingUp}
        />
        <KPICard
          title="Monthly Customer CSAT"
          value="93.8%"
          target="90.0%"
          status="success"
          trend={+1.2}
          icon={Award}
        />
        <KPICard
          title="Continuous Improvement"
          value="320 Hours"
          status="success"
          subtitle="SAR 145,000 value transferred"
          icon={Lightbulb}
        />
        <KPICard
          title="Contract Governance"
          value="34 / 34 Entities"
          status="success"
          subtitle="100% SteerCom sign-off"
          icon={ShieldCheck}
        />
        <KPICard
          title="Problem Deflection Rate"
          value="32.4%"
          subtitle="14 RCAs closed via KEDB"
          icon={AlertOctagon}
        />
        <KPICard
          title="Total Workforce Allocation"
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
          { id: 'summary', label: 'Executive Summary & MoM Trends', icon: Activity },
          { id: 'entities', label: 'Entity Performance & Governance', icon: ShieldCheck },
          { id: 'domains', label: 'Domain Capacity & Allocation', icon: Layers },
          { id: 'innovation', label: 'Innovation & Problem Deflection', icon: Lightbulb },
          { id: 'governance', label: 'Strategic Programme Horizons', icon: Briefcase },
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

      {/* Tab 1: Executive Summary & MoM Trends */}
      {activeTab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Executive Overview Highlight Banner */}
          <div className="chart-card" style={{ padding: '18px 24px', background: 'var(--bg-card)', borderLeft: '4px solid var(--color-emerald)' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
              SteerCom Management Overview — {selectedMonth.label}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              The ITMS Managed Services operations closed the month of {selectedMonth.label} in full contractual compliance. 
              Total ticket demand totaled <strong>580 tickets</strong> against <strong>604 successfully resolved</strong>, yielding an overall resolution rate exceeding inflow. 
              The contractual resolution SLA achieved was <strong>97.4%</strong> against the benchmark target of {OVERALL_MONTHLY_RESOLUTION_TARGET}.0%. 
              <strong>Zero contractual breaches</strong> were triggered across all 34 operating entities, resulting in <strong>SAR 0 contractual penalties</strong>. 
              Furthermore, 320 hours of earned innovation credits were mobilized into the Enhancement-of-Run pool.
            </p>
          </div>

          {/* 6-Month MoM Inflow, Outflow & SLA Trend */}
          <div className="chart-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="chart-card-title" style={{ margin: 0 }}>6-Month Volume Dynamics & SLA Resolution Attainment</h3>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Monthly ticket inflow and resolution throughput vs monthly resolution SLA benchmark ({OVERALL_MONTHLY_RESOLUTION_TARGET}%)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: 'var(--text-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: 'var(--brand-primary)', borderRadius: '2px' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Monthly Inflow</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: 'var(--color-emerald)', borderRadius: '2px' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Monthly Resolved</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '3px', background: '#E5A000' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>SLA Attainment %</span>
                </div>
              </div>
            </div>

            <div style={{ height: '320px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={momTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
                  <YAxis yAxisId="left" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" domain={[92, 100]} stroke="#E5A000" fontSize={12} tickLine={false} tickFormatter={(v) => `${v}%`} />
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
                  <Bar yAxisId="left" dataKey="Inflow" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} barSize={26} />
                  <Bar yAxisId="left" dataKey="Resolved" fill="var(--color-emerald)" radius={[4, 4, 0, 0]} barSize={26} />
                  <Line yAxisId="right" type="monotone" dataKey="SLA" stroke="#E5A000" strokeWidth={3} dot={{ r: 4, fill: '#E5A000' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SteerCom Contractual Penalty Risk Assessment */}
          <div className="chart-card" style={{ padding: '20px' }}>
            <h3 className="chart-card-title" style={{ marginBottom: '12px' }}>Contractual Penalty Risk Evaluation</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-emerald)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>
                  P1/P2 Critical Incident Restore Threshold
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Contract requires 100% of P1 restored within 4h and P2 within 8h. For {selectedMonth.label}, 100% compliance was achieved. 
                  Zero financial deductions incurred.
                </p>
              </div>

              <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-emerald)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>
                  Monthly Service Resolution Rate Threshold
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Contract penalty threshold applies only if overall monthly resolution falls below 90%. Actual achieved was 97.4%, comfortably exceeding all penalty criteria.
                </p>
              </div>

              <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-emerald)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>
                  System Availability & ERP Uptime
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Core S/4HANA production uptime measured at 99.98% against the 99.90% commitment. Zero unannounced outages or maintenance breaches.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Entity Performance & Governance */}
      {activeTab === 'entities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="chart-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="chart-card-title" style={{ margin: 0 }}>Operating Entity SLA Attainment & SteerCom Sign-offs</h3>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Performance breakdown across the 34 group subsidiaries and operating companies for {selectedMonth.label}
                </span>
              </div>
              <span className="badge badge-success">34 / 34 Signed Off</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Operating Entity Name</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Entity Code</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Incidents</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Service Requests</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Total Volume</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>P1/P2 SLA</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Resolution SLA %</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Entity CSAT</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Governance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {entityPerformance.map((ep, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{ep.name}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>{ep.code}</td>
                      <td style={{ padding: '12px 14px' }}>{ep.incidents}</td>
                      <td style={{ padding: '12px 14px' }}>{ep.srs}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--brand-primary)' }}>{ep.total}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--color-emerald)', fontWeight: 600 }}>{ep.p1p2Sla}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--color-emerald)', fontWeight: 700 }}>{ep.overallSla}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{ep.csat}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={12} /> {ep.signOff}
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

      {/* Tab 3: Domain Capacity & Allocation */}
      {activeTab === 'domains' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="chart-card">
            <h3 className="chart-card-title">Service Domain Capacity, Headcount & FTE Allocation</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
              Resource allocation model supporting 30 headcount (30.0 FTE) with dedicated pods and cross-functional shared specialists.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Service Domain</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Domain Lead</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Headcount</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Allocated FTE</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Support Model</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Monthly Tickets</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Resolution SLA %</th>
                  </tr>
                </thead>
                <tbody>
                  {domainBreakdown.map(d => (
                    <tr key={d.domain} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{d.domain}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{d.lead}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>{d.headcount} resources</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--brand-primary)' }}>{d.fte.toFixed(1)} FTE</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge badge-${d.supportModel === 'Dedicated' ? 'primary' : 'secondary'}`}>
                          {d.supportModel}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>{d.tickets}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--color-emerald)', fontWeight: 700 }}>{d.sla}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Innovation & Problem Deflection */}
      {activeTab === 'innovation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Continuous Improvement Register */}
          <div className="chart-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="chart-card-title" style={{ margin: 0 }}>Continuous Improvement (CIP) & Innovation Register</h3>
              <span className="badge badge-success">320 Hours Earned</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>CIP Initiative</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Target Domain</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Hours Saved</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Financial Value</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Implementation Status</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Business Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {cipInitiatives.map(cip => (
                    <tr key={cip.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{cip.title}</div>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--brand-primary)' }}>{cip.id}</span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{cip.domain}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-emerald)' }}>{cip.hoursSaved} hrs</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{cip.financialSavings}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className="badge badge-success">{cip.status}</span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{cip.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Strategic Programme Horizons */}
      {activeTab === 'governance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div className="chart-card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '14px' }}>
                Forward-Looking SteerCom Strategic Horizons
              </h4>
              <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '18px', margin: 0 }}>
                <li><strong>Wave 3 S/4HANA Go-Live:</strong> Manufacturing entity cutovers scheduled for Q4 2026. Migration rehearsals completed with 100% mock pass rate.</li>
                <li><strong>AI Runbook Assistant (Joule / LLM):</strong> Pilot deployment for L2 Incident deflection expanding to Finance and Supply Chain towers in August.</li>
                <li><strong>ISO 20000 Surveillance Audit:</strong> Formal audit window confirmed for October 2026; mock readiness score stands at 98.6%.</li>
              </ul>
            </div>

            <div className="chart-card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '14px' }}>
                Executive Decisions Required from SteerCom
              </h4>
              <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '18px', margin: 0 }}>
                <li><strong>Endorsement of Innovation Hours Credit:</strong> Formally sign off 320 CIP hours to be rolled into Q4 Enhancement-of-Run pool.</li>
                <li><strong>Production Freeze Approval:</strong> Ratify proposed 48-hour year-end change freeze window (22 Dec – 02 Jan).</li>
                <li><strong>Disaster Recovery Drill Sign-off:</strong> Approve scheduled cross-region database failover testing on 28 August.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
