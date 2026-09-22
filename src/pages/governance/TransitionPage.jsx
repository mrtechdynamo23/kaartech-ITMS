/**
 * KaarTech ITMS Control Tower — Transition Governance
 * Route: /governance/transition
 * 4-Phase Transition Framework and Domain KT Sign-off Matrix.
 */
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { GitBranch, CheckCircle2, Clock, ShieldCheck, UserCheck, ArrowRight, Plus, X, Calendar, AlertCircle, FileText, Check } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import { SERVICE_DOMAINS } from '../../data/serviceDomains';

export default function TransitionPage() {
  const [selectedPhase, setSelectedPhase] = useState(null);

  const transitionPhases = [
    {
      phase: 'Phase 1',
      name: 'Planning & Governance',
      progress: 100,
      status: 'Completed',
      date: 'Completed (Jan 2026)',
      plannedStart: '2026-01-01',
      plannedEnd: '2026-01-31',
      actualStart: '2026-01-01',
      actualEnd: '2026-01-31',
      owners: ['Sultan Al Dhaheri (Transition Director)', 'Rajesh V. (Program Manager)'],
      objectives: [
        'Establish governance architecture, RACI matrix, and stakeholder communication cadences.',
        'Finalize SLA measurement baselines and penalty/credit governance frameworks.',
        'Provision dual-factor secure network VPN access and ITMS toolchain integrations.',
      ],
      activities: [
        { name: 'Baseline SLA contract agreements & metric thresholds', status: 'Done' },
        { name: 'Define cross-functional RACI & escalation pathways', status: 'Done' },
        { name: 'Set up ITMS Control Tower telemetry and dashboards', status: 'Done' },
        { name: 'Provision enterprise VPN, SAP GUI, and portal credentials', status: 'Done' },
      ],
      milestones: [
        { name: 'Project Charter & Scope Finalized', planned: '2026-01-10', actual: '2026-01-10', status: 'Completed' },
        { name: 'Tooling & Firewall Connectivity Verified', planned: '2026-01-24', actual: '2026-01-24', status: 'Completed' },
        { name: 'Gate 1 Governance Attestation Signed', planned: '2026-01-31', actual: '2026-01-31', status: 'Completed' },
      ],
      dependencies: ['Executive contract execution', 'Customer firewall whitelisting'],
      risks: 'Minor delay in secondary user access provisioning (resolved via fast-track escalation).',
      issues: 'None outstanding. Gate 1 closed with zero exceptions.',
      readiness: [
        'Signed Transition Charter v2.1',
        'Approved RACI & Escalation Matrix',
        'Verified ITMS Control Tower Telemetry Setup',
      ],
    },
    {
      phase: 'Phase 2',
      name: 'Knowledge Transfer (KT)',
      progress: 100,
      status: 'Completed',
      date: 'Completed (Mar 2026)',
      plannedStart: '2026-02-01',
      plannedEnd: '2026-03-05',
      actualStart: '2026-02-01',
      actualEnd: '2026-03-05',
      owners: ['Fatima Al-Otaibi (Knowledge Lead)', 'Domain Technical Leads'],
      objectives: [
        'Execute deep-dive architectural and operational knowledge transfer across 7 service domains.',
        'Document and validate 142 comprehensive Standard Operating Procedures (SOPs).',
        'Verify SME knowledge acquisition through structured technical assessments (>95% target).',
      ],
      activities: [
        { name: 'Conduct 48 interactive domain walkthrough workshops', status: 'Done' },
        { name: 'Draft and peer-review 142 Standard Operating Procedures', status: 'Done' },
        { name: 'Record video sessions and catalog architecture diagrams', status: 'Done' },
        { name: 'Administer formal KT competency exams across all towers', status: 'Done' },
      ],
      milestones: [
        { name: 'Core SAP ERP & BASIS KT Complete', planned: '2026-02-15', actual: '2026-02-14', status: 'Completed' },
        { name: 'Middleware & Custom Integration KT', planned: '2026-02-28', actual: '2026-02-27', status: 'Completed' },
        { name: 'Gate 2 KT Assessment Sign-off (>95%)', planned: '2026-03-05', actual: '2026-03-05', status: 'Completed' },
      ],
      dependencies: ['Phase 1 Gate sign-off', 'Client SME walkthrough availability'],
      risks: 'Timezone overlap for offshore leads (mitigated via dual recorded shifts).',
      issues: 'Resolved 6 delta clarification tickets on custom ABAP enhancements.',
      readiness: [
        '142 Validated & Signed SOP Documents',
        '48 High-Definition Video Walkthroughs in Knowledge Base',
        'KT Assessment Scorecard: 97.4% Average Attainment',
      ],
    },
    {
      phase: 'Phase 3',
      name: 'Primary Shadow Support',
      progress: 100,
      status: 'Completed',
      date: 'Completed (Apr 2026)',
      plannedStart: '2026-03-06',
      plannedEnd: '2026-04-15',
      actualStart: '2026-03-06',
      actualEnd: '2026-04-15',
      owners: ['Suresh N. (Delivery Lead)', 'Mohammed Al-Qahtani (Client Ops Lead)'],
      objectives: [
        'KaarTech team leads live ticket resolution with incumbent/client SMEs shadowing.',
        'Validate operational runbooks under realistic incident and change workloads.',
        'Achieve SLA compliance thresholds during production ticket handling.',
      ],
      activities: [
        { name: 'Take ownership of 100% incoming P3 and P4 tickets', status: 'Done' },
        { name: 'Co-resolve P1 and P2 incidents with incumbent lead oversight', status: 'Done' },
        { name: 'Log 740 cumulative hands-on shadowing hours', status: 'Done' },
        { name: 'Refine runbooks based on live edge cases encountered', status: 'Done' },
      ],
      milestones: [
        { name: '500h Shadow Threshold Achieved', planned: '2026-03-24', actual: '2026-03-22', status: 'Completed' },
        { name: 'P1/P2 Joint Incident Handling Gate Passed', planned: '2026-04-05', actual: '2026-04-05', status: 'Completed' },
        { name: 'Gate 3 Primary Shadow Sign-off', planned: '2026-04-15', actual: '2026-04-15', status: 'Completed' },
      ],
      dependencies: ['Phase 2 Gate sign-off', 'Production change window approvals'],
      risks: 'Month-end batch job queue surge (managed with extended on-call coverage).',
      issues: 'Zero uncontained production incidents during shadow period.',
      readiness: [
        'Shadow Support Attestation Log (740 Hours Logged)',
        'Ticket Resolution Accuracy Report: 98.6%',
        'Gate 3 Handover Certificate Signed by Client Operations Lead',
      ],
    },
    {
      phase: 'Phase 4',
      name: 'Reverse Shadow & Steady State',
      progress: 96,
      status: 'Active Go-Live',
      date: 'In Progress (Apr – Jun 2026)',
      plannedStart: '2026-04-16',
      plannedEnd: '2026-06-15',
      actualStart: '2026-04-16',
      actualEnd: 'Ongoing',
      owners: ['Sultan Al Dhaheri (Transition Director)', 'Suresh N. (Delivery Lead)'],
      objectives: [
        'Assume 100% operational autonomy across all service domains and SLA tiers.',
        'Client and incumbent team transition to passive supervisory monitoring.',
        'Formalize final steady-state contractual handover and warranty closure.',
      ],
      activities: [
        { name: 'Full independent incident, SR, enhancement, and problem resolution', status: 'Active' },
        { name: 'Execute daily operational flash and weekly governance reports', status: 'Active' },
        { name: 'Complete 1,240 hours of reverse shadow ticket resolution', status: 'Done' },
        { name: 'Finalize Security domain SOP addendum sign-off', status: 'In Progress' },
      ],
      milestones: [
        { name: 'Independent Cutover Go-Live', planned: '2026-04-16', actual: '2026-04-16', status: 'Completed' },
        { name: '1,240h Reverse Shadow Target Surpassed', planned: '2026-05-28', actual: '2026-05-28', status: 'Completed' },
        { name: 'Final Steady-State Handover Sign-off', planned: '2026-06-15', actual: 'Pending (96%)', status: 'In Progress' },
      ],
      dependencies: ['Phase 3 Gate sign-off', 'Domain KT sign-off across 7 domains'],
      risks: 'Security domain SOP addendum undergoing final review (on track for closure).',
      issues: 'SLA resolution maintaining 98.2% against 98% target.',
      readiness: [
        'Full Operational SLA Governance Active',
        'Daily Flash, WSR & MSR Reporting Fully Established',
        '6 of 7 Domain Formal Sign-Offs Completed',
      ],
    },
  ];

  const initialDomainReadiness = SERVICE_DOMAINS.map((d, idx) => ({
    domain: d.id,
    label: d.name,
    ktScore: 95 + (idx % 5),
    sopCount: 14 + (idx * 3),
    shadowHours: 120 + (idx * 15),
    signOffStatus: idx < 6 ? 'Signed Off' : 'Under Review',
  }));

  const [domainReadiness, setDomainReadiness] = useState(initialDomainReadiness);
  const [isSignOffModalOpen, setIsSignOffModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  // Form State
  const [signOffDomain, setSignOffDomain] = useState(SERVICE_DOMAINS[0].id);
  const [ktScore, setKtScore] = useState(98);
  const [sopCount, setSopCount] = useState(28);
  const [shadowHours, setShadowHours] = useState(160);
  const [signOffStatus, setSignOffStatus] = useState('Signed Off');
  const [signOffLead, setSignOffLead] = useState('Sultan Al Dhaheri');
  const [attestationNotes, setAttestationNotes] = useState('');

  const handleRecordSignOff = (e) => {
    e.preventDefault();
    setDomainReadiness(prev => prev.map(item => {
      if (item.domain === signOffDomain) {
        return {
          ...item,
          ktScore: Number(ktScore) || item.ktScore,
          sopCount: Number(sopCount) || item.sopCount,
          shadowHours: Number(shadowHours) || item.shadowHours,
          signOffStatus: signOffStatus,
          signOffLead: signOffLead,
        };
      }
      return item;
    }));

    setIsSignOffModalOpen(false);
    setSuccessBanner(`Domain KT Sign-Off for ${signOffDomain} recorded successfully!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const signedOffCount = domainReadiness.filter(d => d.signOffStatus === 'Signed Off').length;

  return (
    <div className="transition-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Transition Governance & KT Sign-Off</h1>
            <span className="badge badge-success">Phase 4 Active</span>
          </div>
          <p className="page-subtitle">Track knowledge acquisition gates, primary/reverse shadowing milestones, and SLA handover readiness.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsSignOffModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} />
          <span>Record Domain KT Sign-off</span>
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
          marginBottom: '20px',
        }}>
          <CheckCircle2 size={18} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Overall Transition Health"
          value="98.5%"
          status="success"
          subtitle="All gate criteria satisfied"
          icon={ShieldCheck}
        />
        <KPICard
          title="SOPs Validated"
          value="142 SOPs"
          status="success"
          subtitle="Documented runbooks"
          icon={CheckCircle2}
        />
        <KPICard
          title="Reverse Shadow Hours"
          value="1,240h"
          subtitle="Hands-on resolved tickets"
          icon={Clock}
        />
        <KPICard
          title="Domain Sign-Offs"
          value={`${signedOffCount} / ${domainReadiness.length}`}
          subtitle={signedOffCount === domainReadiness.length ? 'All domains signed off' : `Remaining: ${domainReadiness.filter(d => d.signOffStatus !== 'Signed Off').map(d => d.domain).join(', ')}`}
          icon={UserCheck}
        />
      </div>

      {/* 4-Phase Progress Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {transitionPhases.map((p, idx) => {
          const isCompleted = p.progress === 100;
          return (
            <div
              key={idx}
              className="chart-card"
              onClick={() => setSelectedPhase(p)}
              style={{
                padding: '18px',
                cursor: 'pointer',
                borderRadius: 'var(--radius-lg, 12px)',
                border: isCompleted
                  ? '1.5px solid rgba(21, 154, 106, 0.45)'
                  : '1.5px solid rgba(107, 29, 42, 0.35)',
                background: isCompleted
                  ? 'linear-gradient(180deg, rgba(21, 154, 106, 0.06) 0%, var(--bg-card) 100%)'
                  : 'var(--bg-card)',
                boxShadow: isCompleted ? '0 2px 8px rgba(21, 154, 106, 0.08)' : 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = isCompleted
                  ? '0 6px 16px rgba(21, 154, 106, 0.16)'
                  : '0 6px 16px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isCompleted ? '0 2px 8px rgba(21, 154, 106, 0.08)' : 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: isCompleted ? 'var(--color-emerald)' : 'var(--brand-primary)', textTransform: 'uppercase' }}>
                  {p.phase}
                </span>
                <span
                  className={`badge ${isCompleted ? 'badge-success' : 'badge-primary'}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 700,
                  }}
                >
                  {isCompleted && <CheckCircle2 size={12} />}
                  {p.status}
                </span>
              </div>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>
                {p.name}
              </h3>

              <div style={{ height: '8px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${p.progress}%`,
                    background: isCompleted ? 'var(--color-emerald)' : 'var(--brand-primary)',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                <span style={{ color: isCompleted ? 'var(--color-emerald)' : 'var(--text-secondary)', fontWeight: 600 }}>
                  {p.date}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <strong style={{ color: isCompleted ? 'var(--color-emerald)' : 'var(--text-primary)', fontSize: '12px' }}>
                    {p.progress}%
                  </strong>
                  <span style={{ fontSize: '11px', color: 'var(--brand-primary)', fontWeight: 600 }}>
                    Details &rarr;
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Domain KT Sign-Off Matrix */}
      <div className="chart-card">
        <h3 className="chart-card-title">Service Domain KT Sign-Off Matrix</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Domain Code</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Service Domain</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>KT Assessment Score</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Validated SOPs</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Shadowing Hours</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Sign-Off Gate</th>
              </tr>
            </thead>
            <tbody>
              {domainReadiness.map(d => (
                <tr key={d.domain} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--brand-primary)' }}>{d.domain}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{d.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ color: 'var(--color-emerald)', fontWeight: 700 }}>{d.ktScore}%</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{d.sopCount} SOPs</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{d.shadowHours} hrs</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${d.signOffStatus === 'Signed Off' ? 'badge-success' : 'badge-warning'}`}>
                      {d.signOffStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Centered Record Domain KT Sign-off Modal */}
      {isSignOffModalOpen && typeof document !== 'undefined' && createPortal(
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
          onClick={() => setIsSignOffModalOpen(false)}
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
                  <UserCheck size={18} color="var(--brand-primary, #6B1D2A)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Record Domain KT Sign-off
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                  Formalize knowledge transfer gate completion and steady-state handover
                </p>
              </div>
              <button
                onClick={() => setIsSignOffModalOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleRecordSignOff} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div className="modal-form-scrollable-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Service Domain
                  </label>
                  <select
                    value={signOffDomain}
                    onChange={(e) => setSignOffDomain(e.target.value)}
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
                    {domainReadiness.map(d => (
                      <option key={d.domain} value={d.domain}>{d.domain} — {d.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Gate Status
                  </label>
                  <select
                    value={signOffStatus}
                    onChange={(e) => setSignOffStatus(e.target.value)}
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
                    <option value="Signed Off">Signed Off (100% Gate Passed)</option>
                    <option value="Under Review">Under Review (Remediation Pending)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    KT Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={ktScore}
                    onChange={(e) => setKtScore(e.target.value)}
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
                    Validated SOPs
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={sopCount}
                    onChange={(e) => setSopCount(e.target.value)}
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
                    Shadow Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={shadowHours}
                    onChange={(e) => setShadowHours(e.target.value)}
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
                  Sign-Off Authority / Transition Lead
                </label>
                <input
                  type="text"
                  value={signOffLead}
                  onChange={(e) => setSignOffLead(e.target.value)}
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
                  Attestation Statement & Runbook Validation
                </label>
                <textarea
                  rows={3}
                  placeholder="Attest that secondary shadowing is complete, runbooks are accepted, and AMS steady-state support is operational..."
                  value={attestationNotes}
                  onChange={(e) => setAttestationNotes(e.target.value)}
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
                  onClick={() => setIsSignOffModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <UserCheck size={14} />
                  <span>Attest Sign-off</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Centered Phase Detail Modal */}
      {selectedPhase && typeof document !== 'undefined' && createPortal(
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
          onClick={() => setSelectedPhase(null)}
        >
          <div
            className="modal-dialog-centered"
            style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: 'var(--radius-xl, 16px)',
              border: '2px solid var(--border-secondary, #e2e8f0)',
              boxShadow: 'var(--shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25))',
              maxWidth: '740px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              margin: 'auto',
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
                  <span className="badge badge-primary" style={{ fontWeight: 700, fontSize: '12px' }}>
                    {selectedPhase.phase}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    {selectedPhase.name}
                  </h3>
                  <span
                    className={`badge ${selectedPhase.progress === 100 ? 'badge-success' : 'badge-primary'}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
                  >
                    {selectedPhase.progress === 100 && <CheckCircle2 size={12} />}
                    {selectedPhase.status} ({selectedPhase.progress}%)
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                  Planned Timeline: {selectedPhase.plannedStart} to {selectedPhase.plannedEnd} | Actual: {selectedPhase.actualStart} to {selectedPhase.actualEnd}
                </p>
              </div>
              <button
                onClick={() => setSelectedPhase(null)}
                className="btn btn-ghost btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-form-scrollable-body" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '18px', overflowY: 'auto' }}>
              {/* Progress Overview Bar */}
              <div style={{
                padding: '14px',
                borderRadius: 'var(--radius-md, 8px)',
                background: selectedPhase.progress === 100 ? 'rgba(21, 154, 106, 0.08)' : 'var(--bg-secondary, #f8fafc)',
                border: `1px solid ${selectedPhase.progress === 100 ? 'rgba(21, 154, 106, 0.3)' : 'var(--border-secondary)'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Phase Completion Gate:</span>
                  <strong style={{ color: selectedPhase.progress === 100 ? 'var(--color-emerald)' : 'var(--brand-primary)' }}>
                    {selectedPhase.progress}% Completed
                  </strong>
                </div>
                <div style={{ height: '8px', width: '100%', background: 'var(--border-primary, #e2e8f0)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${selectedPhase.progress}%`,
                    background: selectedPhase.progress === 100 ? 'var(--color-emerald)' : 'var(--brand-primary)',
                    borderRadius: '4px',
                  }} />
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="var(--brand-primary)" />
                  Key Objectives
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {selectedPhase.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Milestones Table */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="var(--brand-primary)" />
                  Gate Milestones
                </h4>
                <div style={{ border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-md, 8px)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-secondary)' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Milestone</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', width: '105px' }}>Planned</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', width: '105px' }}>Actual</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', width: '100px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPhase.milestones.map((m, i) => (
                        <tr key={i} style={{ borderBottom: i < selectedPhase.milestones.length - 1 ? '1px solid var(--border-secondary)' : 'none' }}>
                          <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</td>
                          <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{m.planned}</td>
                          <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{m.actual}</td>
                          <td style={{ padding: '8px 12px' }}>
                            <span className={`badge ${m.status === 'Completed' ? 'badge-success' : 'badge-primary'}`}>
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Activities Checklist */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={16} color="var(--brand-primary)" />
                  Key Activities & Execution Scope
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                  {selectedPhase.activities.map((act, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm, 6px)',
                        background: 'var(--bg-secondary, #f8fafc)',
                        border: '1px solid var(--border-secondary)',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                        <Check size={14} color={act.status === 'Done' ? 'var(--color-emerald)' : 'var(--brand-primary)'} />
                        <span>{act.name}</span>
                      </div>
                      <span className={`badge ${act.status === 'Done' ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                        {act.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Owners, Dependencies & Risks Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary, #f8fafc)', border: '1px solid var(--border-secondary)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
                    Phase Ownership & RACI
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {selectedPhase.owners.map((own, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-primary)' }} />
                        <span>{own}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary, #f8fafc)', border: '1px solid var(--border-secondary)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
                    Dependencies
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedPhase.dependencies.map((dep, i) => (
                      <span key={i} className="badge badge-neutral" style={{ fontSize: '11px' }}>
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Risks & Readiness Evidence */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(229, 160, 0, 0.06)', border: '1px solid rgba(229, 160, 0, 0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#B57C00', marginBottom: '4px' }}>
                    <AlertCircle size={14} />
                    <span>Risks & Remediation</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    {selectedPhase.risks}
                  </p>
                </div>

                <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(21, 154, 106, 0.06)', border: '1px solid rgba(21, 154, 106, 0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--color-emerald)', marginBottom: '6px' }}>
                    <FileText size={14} />
                    <span>Readiness Artifacts & Evidence</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {selectedPhase.readiness.map((art, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={12} color="var(--color-emerald)" />
                        <span>{art}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-form-sticky-footer" style={{ padding: '12px 24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedPhase(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
