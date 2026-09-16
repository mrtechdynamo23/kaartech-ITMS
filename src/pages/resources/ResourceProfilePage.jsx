/**
 * KaarTech ITMS Control Tower — Dedicated Resource Profile Page
 * Full-page personnel & governance profile at /resources/:resourceId
 * Aligned with RFP Master Specification Section 8
 */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Shield, Award, Briefcase, Phone, Mail, MapPin,
  Calendar, CheckCircle2, AlertTriangle, XCircle, Clock, ExternalLink,
  BookOpen, Cpu, Globe, FileText, TrendingUp, Check, Copy, RefreshCw,
  Building, ChevronRight, Layers, CheckSquare, Star
} from 'lucide-react';
import { RESOURCES } from '../../data/demoData';
import { SERVICE_DOMAINS, getServiceDomainById } from '../../data/serviceDomains';
import { useResourceManagement } from '../../data/resourceManagementStore';
import { isResourceAvailable } from '../../data/timeManagementStore';
import { getResourceUtilizationMetrics } from '../../data/analyticsSelectors';

export default function ResourceProfilePage() {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  const { slas, measurements, assignments } = useResourceManagement();

  // Find resource from RESOURCES
  const normalizedId = (resourceId || '').toUpperCase();
  const res = RESOURCES.find(r => r.id.toUpperCase() === normalizedId) || RESOURCES[0];

  const domain = getServiceDomainById(res.serviceDomainId) || {
    id: res.serviceDomainId || 'TWR-01',
    name: res.serviceDomain || 'IT Helpdesk & End User Services',
    code: 'EUS'
  };

  const utilMetrics = getResourceUtilizationMetrics(res.id);
  const availability = isResourceAvailable(res.id, '2026-09-16');

  // Tenure
  const onboarding = res.onboardingDate ? new Date(res.onboardingDate) : new Date('2025-08-01');
  const today = new Date('2026-09-16');
  const diffTime = Math.abs(today - onboarding);
  const daysSinceOnboarding = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const monthsSinceOnboarding = (daysSinceOnboarding / 30.4).toFixed(1);

  // SLA measurements from centralized store (8 Resource Performance KPIs)
  const domainMeasurements = measurements.filter(m => 
    m.serviceDomainId === res.serviceDomainId || 
    m.category === 'resource_performance' ||
    ['SLA-008', 'SLA-016', 'SLA-009', 'SLA-017', 'SLA-012', 'SLA-011', 'SLA-010', 'SLA-018'].includes(m.slaId)
  );
  const displayMeasurements = domainMeasurements.length > 0 ? domainMeasurements : measurements.slice(0, 6);
  const metCount = displayMeasurements.filter(m => m.status === 'MET').length;
  const slaHealthScore = displayMeasurements.length > 0 ? Math.round((metCount / displayMeasurements.length) * 100) : 96;

  // Assignments
  const resAssignment = assignments.find(a => a.resourceId === res.id) || {
    assignmentName: res.currentAssignment || 'Enterprise AMS Operations',
    allocation: 100,
    startDate: res.startDate || '2025-09-01',
    endDate: res.endDate || '2027-08-31',
    location: res.location || 'Onsite',
    status: 'Active'
  };

  const handleCopyEmail = () => {
    if (res.email) {
      navigator.clipboard.writeText(res.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Top Breadcrumbs / Back Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          onClick={() => navigate('/resources/directory')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            padding: '6px 0',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} /> Back to Resource Directory
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => navigate('/resources/requests')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} /> Request Replacement
          </button>
          <button
            onClick={() => navigate('/sla-governance')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--brand-primary)',
              color: 'white',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Shield size={13} /> View SLA Governance
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div
        className="card"
        style={{
          padding: '24px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, rgba(107, 29, 42, 0.08) 0%, var(--bg-card) 100%)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Avatar */}
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--brand-primary) 0%, #4A131E 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: 800,
                boxShadow: '0 8px 20px rgba(107, 29, 42, 0.3)',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                flexShrink: 0,
              }}
            >
              {res.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {res.name}
                </h1>

                {/* Saudi / Expatriate Badge */}
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    background: res.resourceType === 'Saudi' ? 'rgba(13, 159, 110, 0.15)' : 'rgba(37, 99, 235, 0.15)',
                    color: res.resourceType === 'Saudi' ? 'var(--color-green)' : 'var(--color-blue)',
                    border: `1px solid ${res.resourceType === 'Saudi' ? 'rgba(13, 159, 110, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {res.resourceType === 'Saudi' ? '🇸🇦 Saudi National' : '🌐 Expatriate Specialist'}
                </span>

                {/* Level Badge */}
                <span
                  style={{
                    padding: '3px 9px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    background: 'var(--bg-secondary)',
                    color: 'var(--brand-primary)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  {res.level || 'L2'}
                </span>

                {/* Onsite / Offshore */}
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    background: res.location === 'Onsite' ? 'rgba(13, 159, 110, 0.1)' : 'rgba(124, 58, 237, 0.1)',
                    color: res.location === 'Onsite' ? 'var(--color-green)' : 'var(--color-purple)',
                    border: '1px solid var(--border-secondary)',
                  }}
                >
                  {res.location === 'Onsite' ? 'Onsite (Riyadh HQ)' : 'Offshore Delivery Center'}
                </span>

                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                  {res.id}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--brand-primary)' }}>
                  {res.role}
                </span>
                <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(107, 29, 42, 0.1)',
                    color: 'var(--brand-primary)',
                    fontWeight: 600,
                  }}
                >
                  {domain.name}
                </span>
                <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {res.role} • {res.level}
                </span>
              </div>
            </div>
          </div>

          {/* Quick SLA Health Score */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 18px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>
                SLA Health Score
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: slaHealthScore >= 95 ? 'var(--color-green)' : 'var(--color-amber)' }}>
                {slaHealthScore}%
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: slaHealthScore >= 95 ? 'rgba(13, 159, 110, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {slaHealthScore >= 95 ? (
                <CheckCircle2 size={24} style={{ color: 'var(--color-green)' }} />
              ) : (
                <AlertTriangle size={24} style={{ color: 'var(--color-amber)' }} />
              )}
            </div>
          </div>
        </div>

        {/* Highlight KPI Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-secondary)',
          }}
        >
          <div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Role Code</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{res.roleCode || res.positionId}</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Experience</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{res.experience || 6} yrs ({res.relevantExperience || 4} yrs rel.)</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Tenure</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{daysSinceOnboarding} days ({monthsSinceOnboarding} mos)</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Availability</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: availability.available ? 'var(--color-green)' : 'var(--color-amber)' }}>
              {availability.status || 'Active On-Duty'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Utilization</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-green)' }}>
              {utilMetrics.utilizationFormatted} ({utilMetrics.utilizedHours}h / {utilMetrics.allocatedHours}h)
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Employment</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{res.employmentRelationship || 'Direct Contract'}</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid var(--border-primary)',
          marginBottom: '20px',
        }}
      >
        {[
          { key: 'overview', label: 'Overview & Profile', icon: User },
          { key: 'sla', label: 'SLA Governance & Health', icon: Shield },
          { key: 'capabilities', label: 'Capabilities & Certifications', icon: Award },
          { key: 'experience', label: 'Client Experience & Projects', icon: Briefcase },
          { key: 'assignment', label: 'Assignment & Deployment', icon: Layers },
          { key: 'contact', label: 'Contact & Reporting Line', icon: Phone },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
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

      {/* TAB CONTENT 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Professional Summary */}
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} style={{ color: 'var(--brand-primary)' }} /> Professional Summary
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                {res.professionalSummary || 'Dedicated enterprise technology consultant delivering SLA-governed operational excellence, mission-critical systems optimization, and continuous process enhancements across Saudi enterprise environments.'}
              </p>
            </div>

            {/* Education & Qualifications */}
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} style={{ color: 'var(--brand-primary)' }} /> Education & Qualifications
              </h3>
              <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {res.education || 'Bachelor of Science in Computer Science / Information Technology'}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  Attested degree credential verified in Saudi IT professional governance registry.
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} style={{ color: 'var(--brand-primary)' }} /> Language Proficiencies
              </h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {(res.languages || ['Arabic', 'English']).map((lang, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '6px 14px',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-secondary)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    ● {lang} (Professional Fluency)
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Overview Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '14px' }}>
                Professional Details & Hierarchy
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Primary Service Domain</div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--brand-primary)' }}>{domain.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Process Group & Specialization</div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{res.processGroup || 'Core ITMS Operations'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Role & Seniority Level</div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{res.role} • {res.level}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Employment Relationship</div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{res.employmentRelationship || 'Direct KaarTech Contract'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Onboarding Date</div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{res.onboardingDate || res.startDate || '2025-09-01'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Reporting Manager</div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{res.manager || 'Fatima Al-Otaibi'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: SLA Governance & Health */}
      {activeTab === 'sla' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, margin: 0 }}>
                  Centralized SLA Governance & Compliance Measurements
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '4px 0 0' }}>
                  Target commitments, empirical compliance telemetry, and evidence verification sourced from centralized SLA store.
                </p>
              </div>
              <span className="badge badge-success">Health Score: {slaHealthScore}%</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-primary)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700 }}>SLA ID</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700 }}>SLA Commitment</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700 }}>Target Threshold</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700 }}>Actual Recorded</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700 }}>Period</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700 }}>Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {displayMeasurements.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)' }}>{m.slaId}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>{m.slaName}</td>
                      <td style={{ padding: '10px 14px' }}>{m.operator} {m.target} {m.unit}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>
                        {m.actualValue} {m.unit}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{m.period}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: m.status === 'MET' ? 'rgba(13, 159, 110, 0.12)' : 'rgba(220, 38, 38, 0.12)',
                            color: m.status === 'MET' ? 'var(--color-green)' : 'var(--color-red)',
                          }}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: '12px' }}>{m.evidence || 'System recorded audit log'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Capabilities & Certifications */}
      {activeTab === 'capabilities' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Technical Skills & Domains */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} style={{ color: 'var(--brand-primary)' }} /> Technologies & Technical Proficiencies
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(res.technologies || ['SAP S/4HANA', 'Cloud Integration', 'Enterprise Automation']).map((tech, idx) => (
                <div key={idx} style={{ padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{tech}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Advanced / Production Proven</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'var(--border-primary)', borderRadius: '3px', marginTop: '6px' }}>
                    <div style={{ width: `${85 + ((idx * 4) % 15)}%`, height: '100%', background: 'var(--brand-primary)', borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                Skills & Knowledge Modules
              </h4>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(res.skills || ['Solution Architecture', 'Issue Remediation', 'Configuration', 'Integration']).map((s, idx) => (
                  <span key={idx} style={{ padding: '4px 10px', borderRadius: '4px', background: 'var(--bg-secondary)', fontSize: '12px', color: 'var(--text-primary)', border: '1px solid var(--border-secondary)' }}>
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} style={{ color: 'var(--brand-primary)' }} /> Verified Professional Certifications
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(res.certifications || ['Professional ITIL 4 Specialist', 'Certified Cloud Practitioner']).map((cert, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-secondary)',
                  }}
                >
                  <Award size={20} style={{ color: 'var(--color-amber)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{cert}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Verified Credential • Attested & Active through 2027</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: Comparable Client Experience & Key Assignments */}
      {activeTab === 'experience' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} style={{ color: 'var(--brand-primary)' }} /> Comparable Enterprise Experience
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '14px' }}>
              Demonstrated track record supporting high-scale Saudi corporate and government entities.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(res.comparableClientExperience || ['Saudi Aramco AMS Support', 'SABIC ERP Enhancement Program', 'Saudi Telecom Platform Operations']).map((exp, idx) => (
                <div key={idx} style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{exp}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Enterprise IT Professional Services delivery under strict SLA thresholds.</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={18} style={{ color: 'var(--brand-primary)' }} /> Key Assignments & Track Record
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '14px' }}>
              Critical deliverables, system enhancements, and stabilization programs executed.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(res.keyAssignments || ['Lead-to-Cash Workflow Optimization', 'BTP Integration Pipeline', 'Incident Backlog Reduction Wave 2']).map((asgn, idx) => (
                <div key={idx} style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{asgn}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Completed on-schedule with 100% first-pass quality compliance.</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: Assignment & Deployment */}
      {activeTab === 'assignment' && (
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '16px' }}>
            Operational Assignment Profile & Allocation
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Current Assignment</div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', marginTop: '4px' }}>{resAssignment.assignmentName}</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Allocation %</div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', marginTop: '4px', color: 'var(--color-green)' }}>{resAssignment.allocation}% Dedicated</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Contract Validity</div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', marginTop: '4px' }}>{resAssignment.startDate} → {resAssignment.endDate}</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Deployment Location</div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', marginTop: '4px' }}>
                {res.location === 'Onsite' ? 'Enterprise Client Premises, Riyadh HQ' : 'Offshore Delivery Center'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: Contact & Reporting Line */}
      {activeTab === 'contact' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Contact Details */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={18} style={{ color: 'var(--brand-primary)' }} /> Secure Communications
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={16} style={{ color: 'var(--text-tertiary)' }} />
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Official Email</div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{res.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-card)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {copied ? <Check size={12} color="var(--color-green)" /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <Phone size={16} style={{ color: 'var(--text-tertiary)' }} />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Direct Phone / Mobile</div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{res.phone}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <MapPin size={16} style={{ color: 'var(--text-tertiary)' }} />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Office Base</div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                    {res.location === 'Onsite' ? 'Riyadh, Kingdom of Saudi Arabia' : 'Offshore Delivery Center'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reporting Line Card */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} style={{ color: 'var(--brand-primary)' }} /> Governance & Reporting Line
            </h3>
            <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '6px' }}>
                Operational Manager
              </div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-primary)' }}>
                {res.manager || 'Fatima Al-Otaibi'}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--brand-primary)', marginTop: '2px', fontWeight: 600 }}>
                KaarTech AMS Program Delivery Lead
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '8px', lineHeight: 1.4 }}>
                Escalation point for resource assignment, performance reviews, timesheet sign-offs, and SLA governance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
