/**
 * KaarTech ITMS Control Tower — Skills Matrix & Technical Capability Hub
 * Route: /resources/skills
 * Aligned with RFP Master Specification Section 15
 * 
 * Comprehensive capability governance:
 * - Multi-category skill competencies mapped across the 7 RFP Service Domains
 * - L1 / L2 / L3 tier breakdown & redundancy ratios
 * - Certifications registry with expiration monitoring & renewal tracking
 * - Primary Service Domain filter & cross-training analysis
 */
import React, { useState, useMemo } from 'react';
import {
  Award, BookOpen, CheckCircle, TrendingUp, Users, Search,
  Filter, Shield, AlertTriangle, Calendar, CheckCircle2, ChevronRight, BarChart2,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';
import { RESOURCES } from '../../data/demoData';
import { SERVICE_DOMAINS, getServiceDomainById } from '../../data/serviceDomains';

export default function SkillsMatrixPage() {
  const [activeTab, setActiveTab] = useState('matrix');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceDomainFilter, setServiceDomainFilter] = useState('all');

  // Competency Dataset across all 7 RFP Service Domains
  const skillsData = [
    // TWR-01: IT Helpdesk & End User Services
    { id: 'SK-01', serviceDomainId: 'TWR-01', serviceDomain: 'IT Helpdesk & End User Services', skill: 'VIP Executive Support & Remote Workspace Engineering', category: 'End User Services', level: 'Expert', primary: 5, secondary: 3, certified: 5, l1: 2, l2: 2, l3: 1, score: 96, status: 'Strong Redundancy' },
    { id: 'SK-02', serviceDomainId: 'TWR-01', serviceDomain: 'IT Helpdesk & End User Services', skill: 'ServiceDesk Incident Management & Omnichannel Triage', category: 'End User Services', level: 'Expert', primary: 5, secondary: 4, certified: 5, l1: 2, l2: 2, l3: 1, score: 98, status: 'Strong Redundancy' },

    // TWR-02: Infrastructure, Cloud, and Platform Services
    { id: 'SK-03', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services', skill: 'Azure Cloud Infrastructure & Hybrid AD Administration', category: 'Cloud & Infrastructure', level: 'Expert', primary: 5, secondary: 3, certified: 5, l1: 1, l2: 3, l3: 1, score: 95, status: 'Strong Redundancy' },
    { id: 'SK-04', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services', skill: 'Cisco Enterprise Networking & Zero-Trust Security Perimeter', category: 'Network & Security', level: 'Expert', primary: 4, secondary: 2, certified: 4, l1: 1, l2: 2, l3: 1, score: 94, status: 'Target Met' },

    // TWR-03: Applications, Digital, and Integration
    { id: 'SK-05', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration', skill: 'Full Stack Web & Mobile App Engineering (React/Node)', category: 'Digital Solutions', level: 'Expert', primary: 5, secondary: 3, certified: 5, l1: 2, l2: 2, l3: 1, score: 95, status: 'Strong Redundancy' },
    { id: 'SK-06', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration', skill: 'Enterprise API Gateway & Hybrid Microservices Integration', category: 'Integration', level: 'Advanced', primary: 4, secondary: 2, certified: 4, l1: 1, l2: 2, l3: 1, score: 93, status: 'Target Met' },

    // TWR-04: Data, Analytics, AI, and Automation
    { id: 'SK-07', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation', skill: 'Power BI Enterprise Semantic Modelling & Analytics Lakehouse', category: 'Data & Analytics', level: 'Expert', primary: 5, secondary: 3, certified: 5, l1: 1, l2: 3, l3: 1, score: 97, status: 'Strong Redundancy' },
    { id: 'SK-08', serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation', skill: 'RPA Process Automation & GenAI Pipeline Engineering', category: 'AI & Automation', level: 'Advanced', primary: 4, secondary: 2, certified: 4, l1: 1, l2: 2, l3: 1, score: 92, status: 'Target Met' },

    // TWR-05: Architecture, Quality, and Testing
    { id: 'SK-09', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing', skill: 'TOGAF Enterprise Solution & Cloud Target Architecture', category: 'Architecture', level: 'Expert', primary: 4, secondary: 2, certified: 4, l1: 0, l2: 2, l3: 2, score: 98, status: 'Strong Redundancy' },
    { id: 'SK-10', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing', skill: 'Automated Regression Testing & Quality Assurance Suite', category: 'QA & Testing', level: 'Expert', primary: 5, secondary: 3, certified: 5, l1: 2, l2: 2, l3: 1, score: 96, status: 'Strong Redundancy' },

    // TWR-06: SAP ERP and SuccessFactors
    { id: 'SK-11', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', skill: 'SAP S/4HANA Finance (FICO) & Central Finance', category: 'SAP Functional', level: 'Expert', primary: 6, secondary: 4, certified: 6, l1: 2, l2: 2, l3: 2, score: 98, status: 'Strong Redundancy' },
    { id: 'SK-12', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', skill: 'SAP S/4HANA Sales & Distribution (SD) & Order-to-Cash', category: 'SAP Functional', level: 'Expert', primary: 5, secondary: 3, certified: 5, l1: 2, l2: 2, l3: 1, score: 95, status: 'Strong Redundancy' },
    { id: 'SK-13', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', skill: 'SAP SuccessFactors HXM Suite & Employee Central', category: 'SAP Functional', level: 'Advanced', primary: 4, secondary: 3, certified: 4, l1: 1, l2: 2, l3: 1, score: 92, status: 'Target Met' },
    { id: 'SK-14', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', skill: 'ABAP Core Data Services, OData APIs & Fiori Launchpad', category: 'SAP Technical', level: 'Expert', primary: 5, secondary: 3, certified: 5, l1: 2, l2: 2, l3: 1, score: 98, status: 'Strong Redundancy' },

    // TWR-07: Service Management, Governance, and Delivery
    { id: 'SK-15', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', skill: 'ITIL 4 Service Management & ServiceNow Platform Administration', category: 'Service Governance', level: 'Expert', primary: 5, secondary: 3, certified: 5, l1: 1, l2: 3, l3: 1, score: 97, status: 'Strong Redundancy' },
    { id: 'SK-16', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', skill: 'Contractual SLA Performance Governance & Audit Compliance', category: 'Service Governance', level: 'Expert', primary: 4, secondary: 2, certified: 4, l1: 1, l2: 2, l3: 1, score: 96, status: 'Target Met' },
  ];

  // Certifications Dataset mapped to Service Domains
  const certificationsData = [
    { id: 'CERT-001', consultant: 'Tariq Al-Harbi', serviceDomain: 'IT Helpdesk & End User Services', domainId: 'TWR-01', title: 'Microsoft 365 Certified: Endpoint Administrator Associate', issuer: 'Microsoft', date: '2025-03-15', expiry: '2027-03-15', status: 'Active' },
    { id: 'CERT-002', consultant: 'Bandar Al-Otaibi', serviceDomain: 'Infrastructure, Cloud, and Platform Services', domainId: 'TWR-02', title: 'Microsoft Certified: Azure Solutions Architect Expert', issuer: 'Microsoft', date: '2024-11-10', expiry: '2026-11-10', status: 'Active' },
    { id: 'CERT-003', consultant: 'Fahad Al-Ghamdi', serviceDomain: 'Applications, Digital, and Integration', domainId: 'TWR-03', title: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', date: '2025-05-20', expiry: '2027-05-20', status: 'Active' },
    { id: 'CERT-004', consultant: 'Nouf Al-Dosari', serviceDomain: 'Data, Analytics, AI, and Automation', domainId: 'TWR-04', title: 'Microsoft Certified: Power BI Data Analyst Associate', issuer: 'Microsoft', date: '2025-01-14', expiry: '2027-01-14', status: 'Active' },
    { id: 'CERT-005', consultant: 'Sultan Al-Shahrani', serviceDomain: 'Architecture, Quality, and Testing', domainId: 'TWR-05', title: 'The Open Group Certified: TOGAF Enterprise Architecture', issuer: 'The Open Group', date: '2024-09-08', expiry: '2027-09-08', status: 'Active' },
    { id: 'CERT-006', consultant: 'Khalid Al Hashimi', serviceDomain: 'SAP ERP and SuccessFactors', domainId: 'TWR-06', title: 'SAP Certified Application Associate - SAP S/4HANA Sales', issuer: 'SAP SE', date: '2025-03-15', expiry: '2027-03-15', status: 'Active' },
    { id: 'CERT-007', consultant: 'Fatima Al-Otaibi', serviceDomain: 'SAP ERP and SuccessFactors', domainId: 'TWR-06', title: 'SAP Certified Professional - Financial Accounting S/4HANA', issuer: 'SAP SE', date: '2024-11-10', expiry: '2026-11-10', status: 'Active' },
    { id: 'CERT-008', consultant: 'Majed Al-Mutairi', serviceDomain: 'Service Management, Governance, and Delivery', domainId: 'TWR-07', title: 'ITIL 4 Managing Professional / Service Delivery', issuer: 'PeopleCert', date: '2025-04-11', expiry: '2028-04-11', status: 'Active' },
    { id: 'CERT-009', consultant: 'Deepak Kumar', serviceDomain: 'Applications, Digital, and Integration', domainId: 'TWR-03', title: 'Microsoft Certified: Power Platform Solution Architect', issuer: 'Microsoft', date: '2025-08-19', expiry: '2027-08-19', status: 'Active' },
    { id: 'CERT-010', consultant: 'Sara Al Marzouqi', serviceDomain: 'SAP ERP and SuccessFactors', domainId: 'TWR-06', title: 'SAP Certified Application Associate - SuccessFactors EC', issuer: 'SAP SE', date: '2025-01-14', expiry: '2027-01-14', status: 'Active' },
    { id: 'CERT-011', consultant: 'Zaid Al Otaibi', serviceDomain: 'SAP ERP and SuccessFactors', domainId: 'TWR-06', title: 'SAP Certified Development Specialist - ABAP for SAP HANA', issuer: 'SAP SE', date: '2025-06-22', expiry: '2027-06-22', status: 'Active' },
    { id: 'CERT-012', consultant: 'Hassan Al-Zahrani', serviceDomain: 'Infrastructure, Cloud, and Platform Services', domainId: 'TWR-02', title: 'Cisco Certified Network Associate (CCNA Enterprise)', issuer: 'Cisco', date: '2024-12-05', expiry: '2027-12-05', status: 'Active' },
  ];

  // Distribution chart data across the 7 RFP Service Domains
  const distributionData = [
    { domain: 'Helpdesk & EUS', l1: 2, l2: 2, l3: 1, total: 5 },
    { domain: 'Infra & Cloud', l1: 1, l2: 3, l3: 1, total: 5 },
    { domain: 'Apps & Digital', l1: 2, l2: 2, l3: 1, total: 5 },
    { domain: 'Data & AI', l1: 1, l2: 3, l3: 1, total: 5 },
    { domain: 'Arch & QA', l1: 1, l2: 2, l3: 2, total: 5 },
    { domain: 'SAP & SF', l1: 2, l2: 2, l3: 1, total: 5 },
    { domain: 'ITSM & Gov', l1: 1, l2: 3, l3: 1, total: 5 },
  ];

  const categoryDonutData = [
    { name: 'SAP Functional & Tech', value: 4, color: '#6B1D2A' },
    { name: 'Cloud & Infrastructure', value: 2, color: '#2563EB' },
    { name: 'Data, Analytics & AI', value: 2, color: '#10B981' },
    { name: 'Applications & Digital', value: 2, color: '#7C3AED' },
    { name: 'Architecture & QA', value: 2, color: '#F59E0B' },
    { name: 'End User Services', value: 2, color: '#0D9F6E' },
    { name: 'Service Governance', value: 2, color: '#4B5563' },
  ];

  const filteredSkills = useMemo(() => {
    return skillsData.filter(s => {
      const matchDomain = serviceDomainFilter === 'all' || s.serviceDomainId === serviceDomainFilter;
      const matchSearch =
        s.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.serviceDomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDomain && matchSearch;
    });
  }, [serviceDomainFilter, searchQuery]);

  return (
    <div className="skills-matrix-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Skills Matrix & Technical Capability Hub</h1>
            <span className="badge badge-success">7 Service Domains Aligned</span>
            <span className="badge badge-primary">{RESOURCES.length} Dedicated FTEs</span>
          </div>
          <p className="page-subtitle">
            Enterprise capability benchmarking, vendor professional certifications, L1/L2/L3 support tier distribution, and cross-domain redundancy governance across the 7 RFP Service Domains.
          </p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        <KPICard
          title="Certified Specialists"
          value="100%"
          subtitle={`All ${RESOURCES.length} consultants certified`}
          icon={Award}
          status="success"
        />
        <KPICard
          title="Redundancy Ratio"
          value="2.3x"
          subtitle="Min 2 consultants per module"
          icon={Users}
          status="success"
        />
        <KPICard
          title="Competency Benchmark"
          value="95.4%"
          subtitle="Audited technical benchmark"
          icon={TrendingUp}
          status="success"
        />
        <KPICard
          title="Cross-Trained Ready"
          value={`${RESOURCES.length - 3} / ${RESOURCES.length}`}
          subtitle="Secondary domain ready (91.4%)"
          icon={CheckCircle}
          status="success"
        />
      </div>

      {/* Sub-Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-secondary)',
          gap: '8px',
          alignItems: 'center',
          background: 'var(--bg-card)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-md)',
          flexWrap: 'wrap',
        }}
      >
        {[
          { key: 'matrix', label: 'Competency Matrix' },
          { key: 'distribution', label: 'Proficiency & Tier Breakdown' },
          { key: 'certifications', label: 'Certifications & Expiry Register' },
          { key: 'gap-analysis', label: 'Capability Gap Analysis' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
            style={{
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: activeTab === tab.key ? 700 : 500,
              color: activeTab === tab.key ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.key ? '3px solid var(--brand-primary)' : '3px solid transparent',
              background: activeTab === tab.key ? 'rgba(107, 29, 42, 0.05)' : 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Competency Matrix */}
      {activeTab === 'matrix' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Filter / Search Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-card)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
              <Search size={16} style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search domain, skill or module..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Service Domain:</span>
              <select
                value={serviceDomainFilter}
                onChange={e => setServiceDomainFilter(e.target.value)}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  maxWidth: '280px',
                }}
              >
                <option value="all">All 7 Service Domains</option>
                {SERVICE_DOMAINS.map(sd => (
                  <option key={sd.id} value={sd.id}>
                    {sd.id}: {sd.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="chart-card">
            <h3 className="chart-card-title">Core Technology Competency Matrix ({filteredSkills.length} Modules)</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Technology & Functional Domain</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Service Domain</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Proficiency Tier</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>L1 / L2 / L3</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Primary Leads</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Secondary Backup</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Capability Score</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Redundancy Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSkills.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.skill}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(107, 29, 42, 0.08)',
                            color: 'var(--brand-primary)',
                            fontWeight: 600,
                            display: 'inline-block',
                          }}
                        >
                          {s.serviceDomain}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge ${s.level === 'Expert' ? 'badge-primary' : 'badge-neutral'}`}>{s.level}</span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {s.l1} · {s.l2} · {s.l3}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{s.primary} Leads</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.secondary} FTEs</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', minWidth: '34px' }}>{s.score}%</span>
                          <div style={{ height: '6px', width: '70px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${s.score}%`, background: 'var(--brand-primary)', borderRadius: '3px' }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge ${s.status === 'Strong Redundancy' ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '11px' }}>
                          {s.status}
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

      {/* TAB 2: Distribution Charts */}
      {activeTab === 'distribution' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '16px' }}>
          <ChartCard
            title="L1 / L2 / L3 Specialist Tier Distribution by Service Domain"
            subtitle="Contractual support tier allocation across the 7 RFP Service Domains"
            height={280}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="domain" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                <Bar dataKey="l1" name="L1 Operational Triage" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="l2" name="L2 Functional Resolution" fill="#6B1D2A" radius={[2, 2, 0, 0]} />
                <Bar dataKey="l3" name="L3 Technical Architecture" fill="#10B981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Competency Domain Portfolio Composition"
            subtitle="Categorical breakdown of multi-skilled pod capabilities"
            height={280}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={categoryDonutData}
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* TAB 3: Certifications */}
      {activeTab === 'certifications' && (
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 className="chart-card-title" style={{ margin: 0 }}>Professional Certifications & Renewal Watchlist</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Monitored credentials from SAP SE, Microsoft, AWS, Cisco, and PeopleCert across the dedicated consultants.
              </p>
            </div>
            <span className="badge badge-success">{certificationsData.length} Verified Credentials Logged</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Consultant Specialist</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Primary Service Domain</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Certification Title</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Issuing Body</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Issue Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Expiry / Recertification</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {certificationsData.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.consultant}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '11px' }}>{c.serviceDomain}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{c.title}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{c.issuer}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{c.date}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{c.expiry}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${c.status === 'Active' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '11px' }}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Capability Gap Analysis */}
      {activeTab === 'gap-analysis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
            }}
          >
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              Redundancy & Operational Resilience Assessment (7 Service Domains)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
              KaarTech multi-skilled pod policy mandates a minimum of 2 certified consultants per core functional capability to eliminate single points of failure (SPOF).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {SERVICE_DOMAINS.map((sd, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{sd.name}</span>
                    <span className="badge badge-success" style={{ fontSize: '10px' }}>Resilient</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Coverage: <strong>5 Dedicated / 3 Cross-Trained</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-emerald)', fontWeight: 600 }}>
                    SPOF Risk: Zero (Contractually Compliant)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
