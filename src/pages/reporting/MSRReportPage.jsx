/**
 * KaarTech ITMS Control Tower — Monthly Service Report (MSR)
 * Route: /reporting/msr
 */
import React from 'react';
import { FileText, Download, Award, DollarSign, CheckCircle2, ShieldCheck } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import { ENTITIES } from '../../data/masterData';

export default function MSRReportPage() {
  const entityPerformance = ENTITIES.slice(0, 10).map((ent, idx) => ({
    name: ent.name,
    incidents: 18 + (idx * 3) % 15,
    srs: 12 + (idx * 2) % 10,
    p1p2Sla: '100%',
    overallSla: `${94 + (idx % 5)}%`,
    status: 'Met All SLAs',
  }));

  const handleExportMSR = async () => {
    try {
      const response = await fetch('/reports/MSR%20for%20CT.pdf');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'MSR for CT.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      const link = document.createElement('a');
      link.href = '/reports/MSR%20for%20CT.pdf';
      link.download = 'MSR for CT.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="msr-report-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Monthly Service Report (MSR) & SteerCom</h1>
            <span className="badge badge-success">100% Contractual SLA Pass</span>
          </div>
          <p className="page-subtitle">Executive SteerCom reporting deck, monthly financial service credits, and SLA compliance sign-offs.</p>
        </div>

        <button className="btn btn-primary" onClick={handleExportMSR} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={15} />
          <span>Export MSR</span>
        </button>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Monthly SLA Score"
          value="95.4%"
          target="88.0%"
          status="success"
          trend={+1.8}
          icon={CheckCircle2}
          sparklineData={[92, 93, 94.5, 95.4]}
        />
        <KPICard
          title="Service Penalty Deductions"
          value="SAR 0"
          status="success"
          subtitle="Zero contractual penalties"
          icon={DollarSign}
        />
        <KPICard
          title="Earned Innovation Credits"
          value="320 Hours"
          status="success"
          subtitle="Transferred to ENH-OF-RUN"
          icon={Award}
        />
        <KPICard
          title="Contract Health"
          value="100% Green"
          status="success"
          subtitle="All 34 entities signed off"
          icon={ShieldCheck}
        />
      </div>

      {/* Monthly Entity SLA Performance Table */}
      <div className="chart-card">
        <h3 className="chart-card-title">Entity-Level Monthly SLA Attainment</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Operating Entity Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Incidents</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Service Requests</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>P1/P2 SLA Met</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Overall SLA Met</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Governance Status</th>
              </tr>
            </thead>
            <tbody>
              {entityPerformance.map((ep, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{ep.name}</td>
                  <td style={{ padding: '12px 16px' }}>{ep.incidents}</td>
                  <td style={{ padding: '12px 16px' }}>{ep.srs}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-emerald)', fontWeight: 600 }}>{ep.p1p2Sla}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-emerald)', fontWeight: 700 }}>{ep.overallSla}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-success">{ep.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
