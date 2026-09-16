/**
 * KaarTech ITMS Control Tower — Resource Requests Page
 * Aligned with RFP Master Specification Sections 11 & 10
 * 
 * Features:
 * - Unified single page with "+ New Request" and "+ Replacement Request" modal workflows
 * - Domain-aware role selection powered by centralized SERVICE_DOMAINS and ROLES
 * - Comprehensive RFP specification fields
 * - Full filter bar (Search, Status, Service Domain, Priority)
 * - Coherent KPI strip and pipeline stage distribution
 */
import React, { useState, useMemo } from 'react';
import { useResourceManagement, REQUEST_STATUSES } from '../../data/resourceManagementStore';
import { SERVICE_DOMAINS, getServiceDomainById } from '../../data/serviceDomains';
import {  ROLES } from '../../data/masterData';
import { RESOURCES } from '../../data/demoData';
import {
  UserPlus, RefreshCw, X, ChevronDown, Search, Filter, Plus,
  ArrowUpRight, Shield, CheckCircle2, Clock, AlertTriangle, Layers
} from 'lucide-react';

// Status color mapping
const statusColors = {
  'Requested': { bg: 'var(--color-grey-bg)', color: 'var(--text-secondary)', border: 'var(--border-secondary)' },
  'Acknowledged': { bg: 'rgba(37, 99, 235, 0.12)', color: 'var(--color-blue)', border: 'rgba(37, 99, 235, 0.3)' },
  'Candidate Shortlisted': { bg: 'rgba(107, 29, 42, 0.1)', color: 'var(--brand-primary)', border: 'rgba(107, 29, 42, 0.3)' },
  'Pending Approval': { bg: 'rgba(217, 119, 6, 0.12)', color: 'var(--color-amber)', border: 'rgba(217, 119, 6, 0.3)' },
  'Approved': { bg: 'rgba(13, 159, 110, 0.12)', color: 'var(--color-green)', border: 'rgba(13, 159, 110, 0.3)' },
  'Mobilization': { bg: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed', border: 'rgba(124, 58, 237, 0.3)' },
  'Onboarded': { bg: 'rgba(13, 159, 110, 0.15)', color: '#047857', border: 'rgba(13, 159, 110, 0.4)' },
  'Assigned': { bg: 'rgba(13, 159, 110, 0.2)', color: '#065f46', border: 'rgba(13, 159, 110, 0.5)' },
  'Closed': { bg: 'var(--color-grey-bg)', color: 'var(--text-tertiary)', border: 'var(--border-primary)' },
  'Rejected': { bg: 'rgba(220, 38, 38, 0.12)', color: 'var(--color-red)', border: 'rgba(220, 38, 38, 0.3)' },
};

const priorityColors = {
  'Critical': 'var(--color-red)',
  'High': 'var(--color-amber)',
  'Medium': 'var(--color-blue)',
  'Low': 'var(--color-green)',
};

// ── Modal Component (Section 11) ──
function RequestModal({ isOpen, onClose, type, onSubmit }) {
  const isReplacement = type === 'Replacement';

  const defaultDomainId = 'TWR-06'; // SAP ERP and SuccessFactors default
  const defaultDomain = SERVICE_DOMAINS.find(d => d.id === defaultDomainId) || SERVICE_DOMAINS[0];

  const [form, setForm] = useState({
    requestRef: `RRQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    serviceDomainId: defaultDomainId,
    serviceDomain: defaultDomain.name,
    processGroup: 'Sales & Distribution',
    roleId: 'ROL-065',
    roleCode: 'FC-SD',
    roleTitle: 'SAP SD Consultant',
    requiredLevel: 'L2',
    engagementType: 'Dedicated',
    objective: '',
    mandatorySkills: 'SAP SD, S/4HANA Order Management, Pricing',
    mandatoryCertifications: 'SAP S/4HANA Sales Certification',
    activities: 'Incident resolution, enhancement analysis, month-end support',
    deliverables: 'Functional design specs, test sign-offs, SLA delivery reports',
    duration: '12 months',
    startDate: '2026-11-01',
    location: 'Onsite - Riyadh HQ',
    deliveryMode: 'Onsite',
    workingHours: 'Standard (08:00-17:00 AST)',
    onCall: false,
    criticality: 'Business Critical',
    interviewMethod: 'Technical SteerCom Panel (Virtual + Onsite)',
    securityRequirements: 'Standard Enterprise Clearance (Non-Disclosure & Background Verified)',
    requiredDocumentation: 'Attested Degrees, CV, 3 Client References, Certified Credentials',
    approver: 'Dr. Tariq Al Nuaimi',
    priority: 'High',
    notes: '',
    // Replacement fields (Section 11)
    originalResourceId: '',
    originalResourceName: '',
    replacementReason: 'Resource rotation per contractual cycle',
    replacementSLA: '5 business days (Common Role) / 10 business days (Specialist Role)',
    requiredReplacementLevel: 'L2',
    targetMobilizationDate: '2026-10-15',
    continuityRequirement: '5 business days structured KT overlap prior to release',
  });

  const [errors, setErrors] = useState({});

  // Filter roles dynamically by selected Service Domain (Section 10)
  const domainRoles = useMemo(() => {
    return ROLES.filter(r => r.serviceDomainId === form.serviceDomainId);
  }, [form.serviceDomainId]);

  const handleDomainChange = (domainId) => {
    const sd = SERVICE_DOMAINS.find(d => d.id === domainId);
    const availableRoles = ROLES.filter(r => r.serviceDomainId === domainId);
    const firstRole = availableRoles[0] || { roleId: '', roleCode: '', roleName: '' };

    setForm(prev => ({
      ...prev,
      serviceDomainId: domainId,
      serviceDomain: sd ? sd.name : '',
      roleId: firstRole.roleId,
      roleCode: firstRole.roleCode,
      roleTitle: firstRole.roleName,
    }));
  };

  const handleRoleChange = (roleId) => {
    const selectedRole = ROLES.find(r => r.roleId === roleId);
    if (selectedRole) {
      setForm(prev => ({
        ...prev,
        roleId: selectedRole.roleId,
        roleCode: selectedRole.roleCode,
        roleTitle: selectedRole.roleName,
        requiredLevel: selectedRole.level || prev.requiredLevel,
        mandatorySkills: selectedRole.skills ? selectedRole.skills.join(', ') : prev.mandatorySkills,
        mandatoryCertifications: selectedRole.certifications ? selectedRole.certifications.join(', ') : prev.mandatoryCertifications,
      }));
    }
  };

  const handleOriginalResourceChange = (resId) => {
    const res = RESOURCES.find(r => r.id === resId);
    if (res) {
      setForm(prev => ({
        ...prev,
        originalResourceId: res.id,
        originalResourceName: res.name,
        serviceDomainId: res.serviceDomainId,
        serviceDomain: res.serviceDomain,
        serviceDomain: res.serviceDomain,
        processGroup: res.processGroup,
        roleCode: res.roleCode || prev.roleCode,
        roleTitle: res.role,
        requiredLevel: res.level,
        requiredReplacementLevel: res.level,
      }));
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.roleTitle) errs.roleTitle = 'Required';
    if (!form.objective) errs.objective = 'Required';
    if (!form.startDate) errs.startDate = 'Required';
    if (isReplacement && !form.originalResourceId) errs.originalResourceId = 'Required';
    if (isReplacement && !form.replacementReason) errs.replacementReason = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      ...form,
      type: isReplacement ? 'Replacement' : 'New',
      assignmentObjective: form.objective,
      expectedStartDate: form.startDate,
      workLocation: form.location,
      expectedActivities: form.activities,
      status: 'Requested',
      submittedDate: '2026-09-16',
      submittedBy: 'Fatima Al-Otaibi',
    });
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = (field) => ({
    width: '100%',
    padding: '8px 12px',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${errors[field] ? 'var(--color-red)' : 'var(--border-primary)'}`,
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: 'var(--text-sm)',
    outline: 'none',
    transition: 'border 0.2s',
  });

  const labelStyle = {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '4px',
    display: 'block',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }} />
      <div
        style={{
          position: 'relative',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          width: '740px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-secondary)',
          animation: 'modalIn 0.25s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-base)', background: 'var(--brand-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isReplacement ? <RefreshCw size={20} color="var(--brand-primary)" /> : <UserPlus size={20} color="var(--brand-primary)" />}
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {isReplacement ? 'RFP Replacement Request Workflow' : 'New Resource Request Submission'}
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '4px 0 0' }}>
                {isReplacement ? 'Governed by SLA-005 & SLA-006 continuity thresholds' : 'Initiate candidate shortlist & SLA-001 acknowledgement'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', flex: '1 1 auto', overflowY: 'auto', minHeight: 0 }}>
          {/* Request Reference */}
          <div>
            <label style={labelStyle}>Request Reference</label>
            <input style={inputStyle('')} value={form.requestRef} readOnly style={{ ...inputStyle(''), background: 'var(--bg-tertiary)', fontFamily: 'var(--font-mono)' }} />
          </div>

          {/* Primary Service Domain (Section 3 & 11) */}
          <div>
            <label style={labelStyle}>Primary Service Domain *</label>
            <select
              style={inputStyle('serviceDomainId')}
              value={form.serviceDomainId}
              onChange={e => handleDomainChange(e.target.value)}
            >
              {SERVICE_DOMAINS.map(sd => (
                <option key={sd.id} value={sd.id}>
                  {sd.id}: {sd.name}
                </option>
              ))}
            </select>
          </div>

          {/* Replacement Specific Fields (Section 11) */}
          {isReplacement && (
            <>
              <div style={{ gridColumn: '1 / -1', padding: '12px', background: 'rgba(217, 119, 6, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(217, 119, 6, 0.25)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-amber)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} /> Replacement Governance & Continuity Parameters
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Original Resource *</label>
                    <select
                      style={inputStyle('originalResourceId')}
                      value={form.originalResourceId}
                      onChange={e => handleOriginalResourceChange(e.target.value)}
                    >
                      <option value="">-- Select Outgoing Resource --</option>
                      {RESOURCES.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.id}) — {r.role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Replacement Reason *</label>
                    <input
                      style={inputStyle('replacementReason')}
                      value={form.replacementReason}
                      onChange={e => handleChange('replacementReason', e.target.value)}
                      placeholder="e.g. Performance rotation, planned departure"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Replacement SLA Threshold</label>
                    <input style={inputStyle('')} value={form.replacementSLA} readOnly style={{ ...inputStyle(''), background: 'var(--bg-tertiary)', fontSize: '11px' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Target Mobilization Date</label>
                    <input type="date" style={inputStyle('')} value={form.targetMobilizationDate} onChange={e => handleChange('targetMobilizationDate', e.target.value)} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Continuity / Knowledge Transfer Requirement</label>
                    <input style={inputStyle('')} value={form.continuityRequirement} onChange={e => handleChange('continuityRequirement', e.target.value)} />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Domain-Aware Role Selection (Section 10) */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Role Title & Catalogue Code * (Domain-Aware)</label>
            <select
              style={inputStyle('roleId')}
              value={form.roleId}
              onChange={e => handleRoleChange(e.target.value)}
            >
              {domainRoles.map(r => (
                <option key={r.roleId} value={r.roleId}>
                  [{r.roleCode}] {r.roleName} ({r.level} • {r.roleType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Service Domain</label>
            <input style={inputStyle('')} value={form.serviceDomain} onChange={e => handleChange('serviceDomain', e.target.value)} placeholder="e.g. L2C, Cloud, Workplace" />
          </div>

          <div>
            <label style={labelStyle}>Process Group</label>
            <input style={inputStyle('')} value={form.processGroup} onChange={e => handleChange('processGroup', e.target.value)} placeholder="e.g. Sales & Distribution" />
          </div>

          <div>
            <label style={labelStyle}>Required Level</label>
            <select style={inputStyle('')} value={form.requiredLevel} onChange={e => handleChange('requiredLevel', e.target.value)}>
              <option value="L1">L1 — Junior / Associate</option>
              <option value="L2">L2 — Specialist / Mid</option>
              <option value="L3">L3 — Senior / Lead Expert</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Engagement Type</label>
            <select style={inputStyle('')} value={form.engagementType} onChange={e => handleChange('engagementType', e.target.value)}>
              <option value="Dedicated">Dedicated (100% FTE)</option>
              <option value="Shared">Shared Delivery</option>
              <option value="Advisory">Advisory / SME Rotation</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Assignment Objective *</label>
            <textarea
              style={{ ...inputStyle('objective'), minHeight: '55px', resize: 'vertical' }}
              value={form.objective}
              onChange={e => handleChange('objective', e.target.value)}
              placeholder="Detail the operational or technical objective of this staffing engagement"
            />
          </div>

          <div>
            <label style={labelStyle}>Mandatory Technical Skills</label>
            <input style={inputStyle('')} value={form.mandatorySkills} onChange={e => handleChange('mandatorySkills', e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Mandatory Certifications</label>
            <input style={inputStyle('')} value={form.mandatoryCertifications} onChange={e => handleChange('mandatoryCertifications', e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Expected Start Date *</label>
            <input type="date" style={inputStyle('startDate')} value={form.startDate} onChange={e => handleChange('startDate', e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Contract Duration</label>
            <input style={inputStyle('')} value={form.duration} onChange={e => handleChange('duration', e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Delivery Mode</label>
            <select style={inputStyle('')} value={form.deliveryMode} onChange={e => handleChange('deliveryMode', e.target.value)}>
              <option value="Onsite">Onsite (Client Premises, Riyadh)</option>
              <option value="Offshore">Offshore Delivery Center</option>
              <option value="Hybrid">Hybrid Delivery</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Work Location</label>
            <input style={inputStyle('')} value={form.location} onChange={e => handleChange('location', e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Business Criticality</label>
            <select style={inputStyle('')} value={form.criticality} onChange={e => handleChange('criticality', e.target.value)}>
              <option value="Mission Critical">Mission Critical</option>
              <option value="Business Critical">Business Critical</option>
              <option value="Important">Important</option>
              <option value="Standard">Standard</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Priority</label>
            <select style={inputStyle('')} value={form.priority} onChange={e => handleChange('priority', e.target.value)}>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Designated Approver</label>
            <input style={inputStyle('')} value={form.approver} onChange={e => handleChange('approver', e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Interview Evaluation Method</label>
            <input style={inputStyle('')} value={form.interviewMethod} onChange={e => handleChange('interviewMethod', e.target.value)} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Security & Compliance Clearances</label>
            <input style={inputStyle('')} value={form.securityRequirements} onChange={e => handleChange('securityRequirements', e.target.value)} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-form-sticky-footer" style={{ padding: '14px 24px', borderTop: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0, background: 'var(--bg-card)' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '8px 22px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--brand-primary)',
              color: 'white',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(107, 29, 42, 0.3)',
            }}
          >
            {isReplacement ? 'Submit Replacement Request' : 'Submit Resource Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResourceRequestsPage() {
  const { requests, addRequest, getRequestKPIs } = useResourceManagement();
  const [modalOpen, setModalOpen] = useState(null); // 'New' | 'Replacement' | null
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [domainFilter, setDomainFilter] = useState('All');

  const kpis = getRequestKPIs();

  const filtered = requests.filter(r => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (domainFilter !== 'All' && r.serviceDomainId !== domainFilter) return false;
    if (
      searchTerm &&
      !r.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !r.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(r.requestRef || '').toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSubmit = (formData) => {
    addRequest(formData);
  };

  const kpiCards = [
    { label: 'Total Requests', value: kpis.total, color: 'var(--brand-primary)' },
    { label: 'Active / Open', value: kpis.activeOpen, color: 'var(--color-blue)' },
    { label: 'Candidate Shortlist', value: kpis.candidateSearch, color: 'var(--color-amber)' },
    { label: 'In Mobilization', value: kpis.mobilization, color: '#7c3aed' },
    { label: 'Assigned / Fulfilled', value: kpis.fulfilled, color: 'var(--color-green)' },
    { label: 'Rejected', value: kpis.rejected, color: 'var(--color-red)' },
  ];

  return (
    <div style={{ padding: 'var(--space-xl)', animation: 'fadeInUp 0.4s ease' }}>
      {/* Header + Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xl)', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Resource Requests
            </h1>
            <span className="badge badge-primary">RFP SOW Aligned</span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Unified requisition management for new staffing and performance replacement workflows
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setModalOpen('New')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--brand-primary)',
              color: 'white',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(107, 29, 42, 0.25)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <UserPlus size={16} /> + New Request
          </button>
          <button
            onClick={() => setModalOpen('Replacement')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--brand-primary)',
              background: 'var(--brand-primary-light)',
              color: 'var(--brand-primary)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-primary-medium)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--brand-primary-light)'}
          >
            <RefreshCw size={16} /> + Replacement Request
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        {kpiCards.map((kpi, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-base)',
              padding: '16px',
              border: '1px solid var(--border-secondary)',
              boxShadow: 'var(--card-shadow)',
              transition: 'all 0.2s',
            }}
          >
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: '6px' }}>{kpi.label}</p>
            <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Pipeline Status Bar */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          marginBottom: 'var(--space-xl)',
          borderRadius: 'var(--radius-base)',
          overflow: 'hidden',
          height: '8px',
          background: 'var(--bg-tertiary)',
        }}
      >
        {REQUEST_STATUSES.filter(s => !['Closed'].includes(s)).map(status => {
          const count = requests.filter(r => r.status === status).length;
          const pct = requests.length > 0 ? (count / requests.length) * 100 : 0;
          const sc = statusColors[status] || statusColors['Requested'];
          return pct > 0 ? (
            <div
              key={status}
              title={`${status}: ${count}`}
              style={{ width: `${pct}%`, background: sc.color, transition: 'width 0.5s ease' }}
            />
          ) : null;
        })}
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '320px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
            }}
          />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by role, ref or ID..."
            style={{
              width: '100%',
              padding: '8px 10px 8px 30px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              outline: 'none',
            }}
          />
        </div>

        {/* Primary Service Domain Filter */}
        <select
          value={domainFilter}
          onChange={e => setDomainFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-sm)',
            maxWidth: '280px',
          }}
        >
          <option value="All">All 7 Service Domains</option>
          {SERVICE_DOMAINS.map(sd => (
            <option key={sd.id} value={sd.id}>
              {sd.id}: {sd.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-sm)',
          }}
        >
          <option value="All">All Statuses</option>
          {REQUEST_STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Request Table */}
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-secondary)',
          overflow: 'hidden',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                {['ID / Ref', 'Type', 'Role Code & Title', 'Service Domain', 'Level', 'Priority', 'Status', 'Location', 'Start Date', 'Approver'].map(h => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-xs)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderBottom: '1px solid var(--border-secondary)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => {
                const sc = statusColors[req.status] || statusColors['Requested'];
                const sd = getServiceDomainById(req.serviceDomainId) || { name: req.serviceDomain || 'SAP ERP and SuccessFactors' };

                return (
                  <tr
                    key={req.id}
                    style={{
                      borderBottom: '1px solid var(--border-secondary)',
                      transition: 'background 0.15s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)' }}>
                      {req.id}
                      {req.requestRef && (
                        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{req.requestRef}</div>
                      )}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          background: req.type === 'Replacement' ? 'rgba(217, 119, 6, 0.12)' : 'rgba(37, 99, 235, 0.12)',
                          color: req.type === 'Replacement' ? 'var(--color-amber)' : 'var(--color-blue)',
                        }}
                      >
                        {req.type}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>
                      {req.roleTitle}
                      {req.roleCode && (
                        <span style={{ marginLeft: '6px', fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                          [{req.roleCode}]
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: 'rgba(107, 29, 42, 0.08)',
                          color: 'var(--brand-primary)',
                          fontWeight: 600,
                          display: 'inline-block',
                          maxWidth: '180px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={sd.name}
                      >
                        {sd.name}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{req.requiredLevel}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ color: priorityColors[req.priority] || 'var(--text-secondary)', fontWeight: 600, fontSize: 'var(--text-xs)' }}>
                        {req.priority}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                        }}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                      {req.deliveryMode}
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                      {req.expectedStartDate}
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
                      {req.approver || 'Pending'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-secondary)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Showing {filtered.length} of {requests.length} resource requests
        </div>
      </div>

      {/* Modals */}
      <RequestModal isOpen={modalOpen === 'New'} onClose={() => setModalOpen(null)} type="New" onSubmit={handleSubmit} />
      <RequestModal isOpen={modalOpen === 'Replacement'} onClose={() => setModalOpen(null)} type="Replacement" onSubmit={handleSubmit} />
    </div>
  );
}
