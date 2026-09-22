/**
 * KaarTech ITMS Control Tower — Resource SLA Governance & Compliance Engine
 * Route: /governance/sla-governance, /sla-governance, /sla/overview, /sla/measurements, /sla/history, /sla/breaches
 *
 * Requirements:
 * - Removed: SLA Management & Versions (completely removed per Item 19).
 * - SLA Measurements: Current reporting period performance (target, actual, met, missed, breaches, domain breakdown).
 * - SLA History & Trends: Longitudinal performance over time (monthly, quarterly, breach trend, resolution trend).
 * - Overall Contractual Breaches: Actual contractual non-compliance with threshold governance.
 * - Current SLA / Historic SLA visibility with Period filtering.
 */
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Plus, Target, AlertTriangle, TrendingUp, CheckCircle,
  XCircle, X, BarChart3, FileText, Activity, Clock, Filter, Search,
  RefreshCw, ChevronRight, Eye, Check, History, AlertOctagon,
  Layers, ExternalLink, Calendar, User, Database, ArrowRight, ShieldAlert
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  useResourceManagement,
  SLA_CATEGORIES
} from '../../data/resourceManagementStore';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';
import PeriodFilter from '../../components/common/PeriodFilter';
import { OVERALL_MONTHLY_RESOLUTION_TARGET } from '../../data/config';
import { checkMatchesPeriod, normalizePeriodKey, formatPeriodLabel, MONTH_SHORT_NAMES } from '../../utils/periodUtils';
import { SERVICE_DOMAINS } from '../../data/serviceDomains';

const categoryColors = {
  response_mobilization: '#2563EB',
  replacement_continuity: '#7C3AED',
  resource_performance: '#0D9F6E',
  reporting: '#D97706',
};

// ── Record Measurement Modal with Live Auto-Evaluation ──
function RecordMeasurementModal({ isOpen, onClose, onSubmit, slas, evaluateCompliance, getConditionalTarget }) {
  const [selectedSlaId, setSelectedSlaId] = useState('');
  const [actualValue, setActualValue] = useState('');
  const [roleType, setRoleType] = useState('Common');
  const [period, setPeriod] = useState('2026-09');
  const [notes, setNotes] = useState('');
  const [evidence, setEvidence] = useState('');
  const [evaluator, setEvaluator] = useState('Resource Management Lead');

  const activeSlas = useMemo(() => slas.filter(s => s.status === 'Active'), [slas]);

  useEffect(() => {
    if (activeSlas.length > 0 && !selectedSlaId) {
      setSelectedSlaId(activeSlas[0].id);
    }
  }, [activeSlas, selectedSlaId]);

  const selectedSLA = useMemo(() => activeSlas.find(s => s.id === selectedSlaId), [activeSlas, selectedSlaId]);

  const effectiveTarget = useMemo(() => {
    if (!selectedSLA) return null;
    return getConditionalTarget(selectedSLA, { roleType });
  }, [selectedSLA, roleType, getConditionalTarget]);

  const liveStatus = useMemo(() => {
    if (!effectiveTarget || actualValue === '') return 'PENDING';
    return evaluateCompliance(actualValue, effectiveTarget.targetValue, effectiveTarget.operator);
  }, [effectiveTarget, actualValue, evaluateCompliance]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedSlaId || actualValue === '') return;
    onSubmit({
      slaId: selectedSlaId,
      actualValue: parseFloat(actualValue),
      period,
      notes,
      evidence: evidence || selectedSLA?.evidenceRequirement || 'System telemetry capture',
      evaluator,
      context: { roleType },
    });
    onClose();
    setActualValue('');
    setNotes('');
    setEvidence('');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', width: '560px', maxWidth: '94vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-primary)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-secondary)', flexShrink: 0 }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>Record SLA Measurement</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '4px 0 0' }}>Live compliance evaluation engine</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Select SLA *</label>
              <select
                value={selectedSlaId}
                onChange={e => setSelectedSlaId(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}
              >
                {activeSlas.map(s => (
                  <option key={s.id} value={s.id}>{s.id} — {s.name} ({s.originalSourceTarget})</option>
                ))}
              </select>
            </div>

            {selectedSLA && selectedSLA.conditionalRules && selectedSLA.conditionalRules.length > 0 && (
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Role Type Context (Conditional SLA Rule)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setRoleType('Common')}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-md)', border: `1px solid ${roleType === 'Common' ? 'var(--brand-primary)' : 'var(--border-primary)'}`, background: roleType === 'Common' ? 'var(--brand-primary-light)' : 'var(--bg-secondary)', color: roleType === 'Common' ? 'var(--brand-primary)' : 'var(--text-primary)', fontWeight: 700, fontSize: 'var(--text-xs)', cursor: 'pointer' }}
                  >
                    Common Role
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleType('Specialist')}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-md)', border: `1px solid ${roleType === 'Specialist' ? 'var(--brand-primary)' : 'var(--border-primary)'}`, background: roleType === 'Specialist' ? 'var(--brand-primary-light)' : 'var(--bg-secondary)', color: roleType === 'Specialist' ? 'var(--brand-primary)' : 'var(--text-primary)', fontWeight: 700, fontSize: 'var(--text-xs)', cursor: 'pointer' }}
                  >
                    Specialist Role
                  </button>
                </div>
              </div>
            )}

            {effectiveTarget && (
              <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Active Target Rule</div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {effectiveTarget.label ? `${effectiveTarget.label}: ` : ''}{effectiveTarget.operator} {effectiveTarget.targetValue} {effectiveTarget.unit}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Live Status</div>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '2px',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: liveStatus === 'MET' ? 'rgba(13, 159, 110, 0.15)' : liveStatus === 'BREACH' ? 'rgba(220, 38, 38, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                      color: liveStatus === 'MET' ? 'var(--color-green)' : liveStatus === 'BREACH' ? 'var(--color-red)' : 'var(--text-tertiary)',
                    }}
                  >
                    {liveStatus}
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Actual Measured Value *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Enter value"
                  value={actualValue}
                  onChange={e => setActualValue(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Measurement Period</label>
                <input
                  type="text"
                  value={period}
                  onChange={e => setPeriod(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Evidence / Verification Record</label>
              <input
                type="text"
                placeholder={selectedSLA?.evidenceRequirement || 'e.g. Audit log ID, portal timestamp'}
                value={evidence}
                onChange={e => setEvidence(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Auditor / Evaluator</label>
              <input
                type="text"
                value={evaluator}
                onChange={e => setEvaluator(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Additional compliance observations or root cause if breached..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}
              />
            </div>
          </div>
        </div>

        <div className="modal-form-sticky-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 20px', borderTop: '1px solid var(--border-secondary)', flexShrink: 0, background: 'var(--bg-card)' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'transparent', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>Cancel</button>
          <button onClick={handleSubmit} style={{ padding: '8px 20px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--brand-primary)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
            Record & Recalculate
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SLA Detail Drawer Component ──
function SLADetailDrawer({ sla, isOpen, onClose, measurements }) {
  if (!isOpen || !sla) return null;

  const slaMeasurements = measurements.filter(m => m.slaId === sla.id);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 750, display: 'flex', justifyContent: 'flex-end' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-overlay)', backdropFilter: 'blur(3px)' }} />
      <div
        style={{
          position: 'relative',
          background: 'var(--bg-card)',
          width: '100%',
          maxWidth: '680px',
          height: '100vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          borderLeft: '1px solid var(--border-primary)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-primary)', fontSize: 'var(--text-sm)' }}>{sla.id}</span>
              <span className="badge badge-primary">{SLA_CATEGORIES.find(c => c.key === sla.category)?.label || sla.category}</span>
              <span className="badge" style={{ background: 'rgba(107, 29, 42, 0.1)', color: 'var(--brand-primary)', border: '1px solid rgba(107, 29, 42, 0.2)' }}>
                {sla.serviceDomain || 'Service Management, Governance, and Delivery'}
              </span>
            </div>
            <h2 style={{ margin: '8px 0 2px', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{sla.name}</h2>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{sla.description}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '4px' }}><X size={20} /></button>
        </div>

        {/* Drawer Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          {/* Target Specification Card */}
          <div className="card" style={{ padding: '18px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
              Contractual Target Specification
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Contract Baseline Target</div>
                <div style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginTop: '2px' }}>{sla.originalSourceTarget}</div>
              </div>
              <div style={{ padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Working Threshold</div>
                <div style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--brand-primary)', marginTop: '2px' }}>
                  {sla.currentTargetOperator} {sla.currentTargetValue} {sla.currentTargetUnit}
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Rules if any */}
          {sla.conditionalRules && sla.conditionalRules.length > 0 && (
            <div className="card" style={{ padding: '18px' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                Conditional Rule Matrix
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sla.conditionalRules.map((rule, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                    <span><strong>{rule.label}:</strong> {rule.condition} = {rule.value}</span>
                    <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>{rule.operator} {rule.targetValue} {rule.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operational Meta */}
          <div className="card" style={{ padding: '18px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
              Operational Protocol
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: 'var(--text-xs)' }}>
              <div><span style={{ color: 'var(--text-tertiary)' }}>Trigger:</span> <strong>{sla.trigger}</strong></div>
              <div><span style={{ color: 'var(--text-tertiary)' }}>Frequency:</span> <strong>{sla.frequency}</strong></div>
              <div><span style={{ color: 'var(--text-tertiary)' }}>Owner:</span> <strong>{sla.owner}</strong></div>
              <div><span style={{ color: 'var(--text-tertiary)' }}>Source:</span> <strong>{sla.measurementSource} ({sla.sourceType})</strong></div>
              <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'var(--text-tertiary)' }}>Evidence:</span> <strong>{sla.evidenceRequirement}</strong></div>
            </div>
          </div>

          {/* Measurements History */}
          <div className="card" style={{ padding: '18px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
              Measurement Audit Log ({slaMeasurements.length})
            </h4>
            {slaMeasurements.length === 0 ? (
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>No measurements recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {slaMeasurements.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                    <div>
                      <span style={{ fontWeight: 700 }}>{m.period}</span> — Actual: <strong>{m.actualValue} {m.unit}</strong> (Target: {m.targetValue} {m.unit})
                    </div>
                    <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 800, fontSize: '10px', background: m.status === 'MET' ? 'rgba(13, 159, 110, 0.15)' : 'rgba(220, 38, 38, 0.15)', color: m.status === 'MET' ? 'var(--color-green)' : 'var(--color-red)' }}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Longitudinal Historical Trends (Item 20: monthly, quarterly, breach trend, resolution trend)
const historicalMonthlyData = [
  { period: 'Jan 2026', compliance: 96.0, resolution: 96.2, target: 95.0, resolutionTarget: OVERALL_MONTHLY_RESOLUTION_TARGET, breaches: 1 },
  { period: 'Feb 2026', compliance: 97.0, resolution: 97.0, target: 95.0, resolutionTarget: OVERALL_MONTHLY_RESOLUTION_TARGET, breaches: 1 },
  { period: 'Mar 2026', compliance: 95.0, resolution: 95.4, target: 95.0, resolutionTarget: OVERALL_MONTHLY_RESOLUTION_TARGET, breaches: 2 },
  { period: 'Apr 2026', compliance: 98.0, resolution: 98.0, target: 95.0, resolutionTarget: OVERALL_MONTHLY_RESOLUTION_TARGET, breaches: 0 },
  { period: 'May 2026', compliance: 97.0, resolution: 97.2, target: 95.0, resolutionTarget: OVERALL_MONTHLY_RESOLUTION_TARGET, breaches: 1 },
  { period: 'Jun 2026', compliance: 98.0, resolution: 98.1, target: 95.0, resolutionTarget: OVERALL_MONTHLY_RESOLUTION_TARGET, breaches: 0 },
  { period: 'Jul 2026', compliance: 96.0, resolution: 96.5, target: 95.0, resolutionTarget: OVERALL_MONTHLY_RESOLUTION_TARGET, breaches: 1 },
  { period: 'Aug 2026', compliance: 97.0, resolution: 97.4, target: 95.0, resolutionTarget: OVERALL_MONTHLY_RESOLUTION_TARGET, breaches: 1 },
  { period: 'Sep 2026', compliance: 98.0, resolution: 98.0, target: 95.0, resolutionTarget: OVERALL_MONTHLY_RESOLUTION_TARGET, breaches: 0 },
];

const historicalQuarterlyData = [
  { quarter: 'Q1 2026', compliance: 96.0, resolution: 96.2, target: 95.0, breaches: 4 },
  { quarter: 'Q2 2026', compliance: 97.7, resolution: 97.8, target: 95.0, breaches: 1 },
  { quarter: 'Q3 2026', compliance: 97.0, resolution: 97.3, target: 95.0, breaches: 2 },
];

// ── Main Page Component ──
export default function ResourceSLAGovernancePage({ initialTab = 'overview' }) {
  const { slaId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab === 'management' ? 'measurements' : initialTab);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [detailSla, setDetailSla] = useState(null);

  const {
    slas,
    measurements,
    addMeasurement,
    getSLAKPIs,
    getBreaches,
    evaluateCompliance,
    getConditionalTarget,
  } = useResourceManagement();

  const kpis = useMemo(() => getSLAKPIs(), [slas, measurements]);

  // Handle initial tab change
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab === 'management' ? 'measurements' : initialTab);
    }
  }, [initialTab]);

  // Handle route param slaId to open drawer
  useEffect(() => {
    if (slaId) {
      const found = slas.find(s => s.id.toUpperCase() === slaId.toUpperCase());
      if (found) setDetailSla(found);
    }
  }, [slaId, slas]);

  // Period-filtered measurements for Current SLA view
  const periodMeasurements = useMemo(() => {
    // When "all" or "ytd_2026", default to the current reporting period (Sep 2026) for the Current SLA telemetry register
    const activePeriod = (selectedPeriod === 'all' || selectedPeriod === 'ytd_2026') ? '2026-09' : selectedPeriod;
    const norm = normalizePeriodKey(activePeriod);
    const filtered = measurements.filter(m => {
      if (!m.period) return false;
      const mNorm = normalizePeriodKey(m.period);
      if (norm === mNorm) return true;
      if (norm.startsWith('2026-') && (m.period.startsWith(norm) || mNorm === norm)) return true;
      if (norm.startsWith('q') && (m.period.toLowerCase().includes(norm.slice(0, 2)) || mNorm.startsWith(norm.slice(0, 2)))) return true;
      return false;
    });
    return filtered.length > 0 ? filtered : measurements;
  }, [measurements, selectedPeriod]);

  // Current SLA Period KPIs — reflects actual reporting period (September 2026 ~98%)
  const currentPeriodKPIs = useMemo(() => {
    // The current reporting period is September 2026
    const activePeriodKey = (selectedPeriod === 'all' || selectedPeriod === 'ytd_2026') ? '2026-09' : selectedPeriod;
    const norm = normalizePeriodKey(activePeriodKey);

    // Consistency anchor with Monthly Resolution & SLA Attainment Trend
    const trendMonth = historicalMonthlyData.find(d => normalizePeriodKey(d.period) === norm);

    const list = measurements.filter(m => {
      if (!m.period) return false;
      const mNorm = normalizePeriodKey(m.period);
      if (norm === mNorm) return true;
      if (norm.startsWith('2026-') && (m.period.startsWith(norm) || mNorm === norm)) return true;
      if (norm.startsWith('q') && (m.period.toLowerCase().includes(norm.slice(0, 2)) || mNorm.startsWith(norm.slice(0, 2)))) return true;
      return false;
    });

    const met = list.filter(m => m.status === 'MET').length;
    const breached = list.filter(m => m.status === 'BREACH').length;
    const total = list.length;

    // Use monthly trend compliance (e.g. 98.0% for Sep 2026) or calculated measurement rate
    let complianceRate = trendMonth ? Math.round(trendMonth.compliance) : 98;
    if (!trendMonth && total > 0) {
      complianceRate = Math.round((met / total) * 100);
    } else if (norm.startsWith('q')) {
      const qNum = norm.slice(1, 2);
      const qData = historicalQuarterlyData.find(q => q.quarter.toLowerCase().includes(`q${qNum}`));
      if (qData) complianceRate = Math.round(qData.compliance);
    }

    // Actual resolution rate from trend data
    let resolutionRate = 98.0;
    if (trendMonth) {
      resolutionRate = trendMonth.resolution;
    } else if (norm.startsWith('q')) {
      const qNum = norm.slice(1, 2);
      const qData = historicalQuarterlyData.find(q => q.quarter.toLowerCase().includes(`q${qNum}`));
      if (qData) resolutionRate = qData.resolution;
    } else if (selectedPeriod === 'all' || selectedPeriod === 'ytd_2026') {
      const avg = historicalMonthlyData.reduce((sum, d) => sum + d.resolution, 0) / historicalMonthlyData.length;
      resolutionRate = +avg.toFixed(1);
    }

    return {
      total: total || (trendMonth ? 17 : measurements.length),
      met: total > 0 ? met : Math.round((total || 17) * (complianceRate / 100)),
      breached: total > 0 ? breached : 0,
      complianceRate,
      targetRate: 95.0,
      resolutionRate,
    };
  }, [selectedPeriod, measurements, historicalMonthlyData, historicalQuarterlyData]);

  // Overall Contractual Breaches (Item 21: represent actual contractual non-compliance)
  const contractualBreaches = useMemo(() => {
    const rawBreaches = getBreaches();
    return rawBreaches.map((b, idx) => ({
      ...b,
      contractClause: b.contractClause || `MSA §5.${idx + 1}(b) Service Level Guarantee`,
      contractualThreshold: b.contractualThreshold || 'Resolution < 95% threshold across reporting period',
      severity: b.severity || (b.actual < 85 ? 'Critical Contractual Breach' : 'Major Contractual Deviation'),
      commercialRisk: b.commercialRisk || (b.actual < 85 ? 'Service Credit Applicable (2.5% invoice rebate)' : 'Formal Cure Notice Required'),
      curePeriod: b.curePeriod || '14 business days from notification',
    }));
  }, [getBreaches]);



  // Category Compliance
  const categoryComplianceData = useMemo(() => {
    return kpis.byCategory.map(c => ({
      name: c.label,
      met: c.met,
      breached: c.breached,
      compliance: c.compliance,
    }));
  }, [kpis]);

  // Service Domain Breakdown for Current Period
  const domainBreakdown = useMemo(() => {
    return SERVICE_DOMAINS.map(sd => {
      const dMeas = periodMeasurements.filter(m => m.serviceDomainId === sd.id || m.serviceDomain === sd.name);
      const met = dMeas.filter(m => m.status === 'MET').length;
      const total = dMeas.length || 1;
      return {
        id: sd.id,
        code: sd.code,
        name: sd.shortName || sd.name,
        compliance: dMeas.length > 0 ? Math.round((met / total) * 100) : 98,
        total: dMeas.length,
      };
    });
  }, [periodMeasurements]);

  return (
    <div className="page-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>SLA Governance</h1>
            <span className="badge badge-primary">{kpis.totalSLAs} Defined SLAs</span>
            <span className={`badge ${contractualBreaches.length === 0 ? 'badge-success' : 'badge-danger'}`}>
              {contractualBreaches.length} Contractual Breaches
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            Enterprise SLA governance, current period attainment, longitudinal historical trends, and contractual compliance control.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <PeriodFilter
            value={selectedPeriod}
            onChange={setSelectedPeriod}
          />
          <button
            onClick={() => setIsRecordOpen(true)}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Activity size={16} /> Record Measurement
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        <KPICard
          title="Overall SLA Compliance"
          value={`${kpis.complianceRate}%`}
          target="95.0%"
          status={kpis.complianceRate >= 95 ? 'success' : kpis.complianceRate >= 90 ? 'warning' : 'danger'}
          subtitle={`${kpis.met} Met / ${kpis.totalMeasurements} Recorded`}
          icon={ShieldCheck}
        />
        <KPICard
          title="Actual Resolution"
          value={`${currentPeriodKPIs.resolutionRate}%`}
          target={`${OVERALL_MONTHLY_RESOLUTION_TARGET}.0%`}
          status={currentPeriodKPIs.resolutionRate >= OVERALL_MONTHLY_RESOLUTION_TARGET ? 'success' : 'warning'}
          subtitle={`Target: ${OVERALL_MONTHLY_RESOLUTION_TARGET}.0% contractual baseline`}
          icon={Target}
        />
        <KPICard
          title="Contractual Breaches"
          value={contractualBreaches.length}
          unit="Breaches"
          status={contractualBreaches.length === 0 ? 'success' : 'danger'}
          subtitle={contractualBreaches.length === 0 ? 'Zero breaches' : 'Cure action required'}
          icon={AlertTriangle}
        />
        <KPICard
          title="Current Period SLA"
          value={`${currentPeriodKPIs.complianceRate}%`}
          target="95.0%"
          status={currentPeriodKPIs.complianceRate >= 95 ? 'success' : 'warning'}
          subtitle={selectedPeriod === 'all' ? 'Sep 2026 (Current)' : formatPeriodLabel(selectedPeriod)}
          icon={Clock}
        />
      </div>

      {/* Sub-Tabs Navigation (Item 19: SLA Management & Versions REMOVED; Item 21: SLA Breaches RENAMED) */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '2px solid var(--border-primary)', flexWrap: 'wrap' }}>
        {[
          { key: 'overview', label: 'SLA Overview', icon: BarChart3 },
          { key: 'measurements', label: 'SLA Measurements (Current SLA)', icon: Activity },
          { key: 'history', label: 'SLA History & Trends (Historic SLA)', icon: History },
          { key: 'resource_kpis', label: 'Resource Performance (8 KPIs)', icon: ShieldCheck },
          { key: 'breaches', label: `Overall Contractual Breaches (${contractualBreaches.length})`, icon: AlertOctagon },
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

      {/* ─── SUB-VIEW 1: SLA OVERVIEW ─── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '16px' }}>
            {/* Visual 1: Compliance by Category */}
            <ChartCard
              title="Compliance by SLA Category"
              subtitle="Performance across core contractual dimensions"
              height={260}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryComplianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}
                  />
                  <Bar dataKey="compliance" name="Compliance %" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Visual 2: Monthly Trend */}
            <ChartCard
              title="SLA Compliance Longitudinal Trend"
              subtitle="Performance trajectory against 95% contractual floor"
              height={260}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalMonthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
                  <XAxis dataKey="period" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} domain={[85, 100]} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}
                  />
                  <Legend verticalAlign="top" align="right" height={28} />
                  <Line type="monotone" dataKey="compliance" name="Actual Compliance %" stroke="var(--brand-primary)" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="target" name="Contract Target (95%)" stroke="var(--color-green)" strokeDasharray="4 4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* 4 Category Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {kpis.byCategory.map(cat => (
              <div
                key={cat.category}
                className="card"
                style={{
                  padding: '18px',
                  borderTop: `4px solid ${categoryColors[cat.category] || 'var(--brand-primary)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 800 }}>{cat.label}</h4>
                  <span style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: cat.compliance >= 95 ? 'var(--color-green)' : 'var(--color-amber)' }}>
                    {cat.compliance}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  <span>Total SLAs: <strong>{cat.total}</strong></span>
                  <span>Met: <strong style={{ color: 'var(--color-green)' }}>{cat.met}</strong></span>
                  <span>Breached: <strong style={{ color: cat.breached > 0 ? 'var(--color-red)' : 'var(--text-tertiary)' }}>{cat.breached}</strong></span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--border-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.compliance}%`, height: '100%', background: categoryColors[cat.category] || 'var(--brand-primary)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SUB-VIEW 2: SLA MEASUREMENTS (CURRENT SLA — Item 20 & 22) ─── */}
      {activeTab === 'measurements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Current Period Performance Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Current Period Compliance</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: currentPeriodKPIs.complianceRate >= 95 ? 'var(--color-green)' : 'var(--color-amber)', marginTop: '4px' }}>
                {currentPeriodKPIs.complianceRate}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Target: {currentPeriodKPIs.targetRate}% | Scope: {selectedPeriod === 'all' ? 'All Cycles' : selectedPeriod.toUpperCase()}
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Commitments Met</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-green)', marginTop: '4px' }}>
                {currentPeriodKPIs.met}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Out of {currentPeriodKPIs.total} evaluated targets
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Deviations / Breaches</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: currentPeriodKPIs.breached === 0 ? 'var(--color-green)' : 'var(--color-red)', marginTop: '4px' }}>
                {currentPeriodKPIs.breached}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Under root cause investigation
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Resolution Performance</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-blue)', marginTop: '4px' }}>
                {currentPeriodKPIs.resolutionRate}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Contract Target: {OVERALL_MONTHLY_RESOLUTION_TARGET}.0%
              </div>
            </div>
          </div>

          {/* Service Domain Attainment Breakdown for Current Period */}
          <ChartCard
            title="Service Domain Attainment in Current Period"
            subtitle="Live compliance rate across Primary Service Domains"
            height={220}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
                <XAxis dataKey="code" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} domain={[80, 100]} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}
                  formatter={(val, name, item) => [`${val}%`, `${item.payload.name} (${item.payload.code})`]}
                />
                <Bar dataKey="compliance" name="Attainment %" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Current Measurements Table */}
          <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                Current Period Telemetry Register ({periodMeasurements.length} records)
              </h3>
              <button
                onClick={() => setIsRecordOpen(true)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
              >
                <Plus size={13} /> Add Measurement
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-primary)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>ID</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>SLA Specification</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Period</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Target</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Actual Value</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Status</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Evaluator</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Evidence</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {periodMeasurements.map(m => {
                  const matchingSla = slas.find(s => s.id === m.slaId);
                  return (
                    <tr key={m.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--brand-primary)' }}>{m.id}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.slaName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{m.slaId}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>{m.period}</td>
                      <td style={{ padding: '12px 14px' }}>{m.operator} {m.targetValue} {m.unit}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800 }}>{m.actualValue} {m.unit}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '11px',
                            fontWeight: 800,
                            background: m.status === 'MET' ? 'rgba(13, 159, 110, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                            color: m.status === 'MET' ? 'var(--color-green)' : 'var(--color-red)',
                          }}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{m.evaluator}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-tertiary)', fontSize: '11px' }}>{m.evidence}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <button
                          onClick={() => matchingSla && setDetailSla(matchingSla)}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye size={12} /> Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── SUB-VIEW 3: SLA HISTORY & TRENDS (HISTORIC SLA — Item 20 & 22) ─── */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Longitudinal Trend Visuals (Monthly & Quarterly) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '16px' }}>
            {/* Monthly Trend Chart */}
            <ChartCard
              title="Monthly Resolution & SLA Attainment Trend"
              subtitle="Historical performance month-by-month vs Contract Target"
              height={270}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalMonthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="histResGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9F6E" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#0D9F6E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
                  <XAxis dataKey="period" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                  <YAxis domain={[90, 100]} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}
                    formatter={(val, name) => [`${val}%`, name]}
                  />
                  <Legend verticalAlign="top" align="right" height={28} />
                  <Area type="monotone" dataKey="resolution" name="Actual Resolution %" stroke="#0D9F6E" strokeWidth={2} fillOpacity={1} fill="url(#histResGrad)" />
                  <Area type="monotone" dataKey="resolutionTarget" name={`Target (${OVERALL_MONTHLY_RESOLUTION_TARGET}%)`} stroke="#6B1D2A" strokeDasharray="4 4" fill="none" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Quarterly Trend & Breach Trend */}
            <ChartCard
              title="Quarterly Comparison & Breach Trend"
              subtitle="Quarterly SLA compliance and incident breach frequency"
              height={270}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalQuarterlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
                  <XAxis dataKey="quarter" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                  <YAxis yAxisId="left" domain={[90, 100]} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} unit="%" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}
                  />
                  <Legend verticalAlign="top" align="right" height={28} />
                  <Bar yAxisId="left" dataKey="compliance" name="Quarterly SLA %" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar yAxisId="right" dataKey="breaches" name="Breaches" fill="var(--color-red)" radius={[4, 4, 0, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Historical Longitudinal Performance Table */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 'var(--text-md)', fontWeight: 700 }}>
              Longitudinal Monthly Performance Matrix
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Historical performance audits across reporting cycles with verifiable measurement sources.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-primary)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Reporting Month</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Actual Resolution %</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Contract Target</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Overall SLA Compliance</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Breach Count</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalMonthlyData.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>{row.period}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-green)' }}>{row.resolution}%</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{row.resolutionTarget}%</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>{row.compliance}%</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: row.breaches === 0 ? 'var(--color-green)' : 'var(--color-amber)' }}>
                        {row.breaches}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className="badge badge-success">COMPLIANT</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── SUB-VIEW 4: RESOURCE PERFORMANCE (8 KPIs) ─── */}
      {activeTab === 'resource_kpis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Banner */}
          <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--brand-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Resource Performance KPI Governance (8 Canonical SOW Commitments)
                  </h3>
                  <span className="badge badge-primary">RFP Source of Truth</span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', maxWidth: '850px' }}>
                  Canonical governance ledger measuring attendance, milestone adherence, first-pass quality, documentation rigor, timesheet timeliness, policy & security compliance, stakeholder satisfaction, and knowledge transfer across all Primary Service Domains.
                </p>
              </div>

              <button
                onClick={() => setIsRecordOpen(true)}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: 'var(--text-xs)' }}
              >
                <Plus size={14} /> Record Audit Telemetry
              </button>
            </div>
          </div>

          {/* 8-KPI Canonical Scorecard Table */}
          <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-primary)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-tertiary)', width: '220px' }}>KPI & Identifier</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-tertiary)', minWidth: '240px' }}>Measurement Specification</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-tertiary)', width: '130px' }}>Contract Target</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-tertiary)', width: '120px' }}>Current Actual</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-tertiary)', width: '100px' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-tertiary)', width: '190px' }}>Service Domain</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-tertiary)', width: '140px' }}>Owner</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-tertiary)', width: '100px' }}>Last Audit</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-tertiary)', width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(kpis.resourcePerformanceKPIs || []).map((kpi, idx) => {
                  const matchingSla = slas.find(s => s.id === kpi.id);
                  const isMet = kpi.status === 'MET';
                  const isBreach = kpi.status === 'BREACH';
                  return (
                    <tr key={kpi.id || idx} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{kpi.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginTop: '2px' }}>
                          {kpi.id} • KPI {idx + 1}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', lineHeight: '1.4' }}>
                        {kpi.measurementDescription}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', background: 'rgba(107, 29, 42, 0.08)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(107, 29, 42, 0.2)' }}>
                          {kpi.target}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: isMet ? 'var(--color-green)' : isBreach ? 'var(--color-red)' : 'var(--text-tertiary)' }}>
                          {kpi.actual}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '11px',
                            fontWeight: 800,
                            background: isMet ? 'rgba(13, 159, 110, 0.15)' : isBreach ? 'rgba(220, 38, 38, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                            color: isMet ? 'var(--color-green)' : isBreach ? 'var(--color-red)' : 'var(--text-tertiary)',
                          }}
                        >
                          {kpi.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {kpi.serviceDomain}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                        {kpi.owner}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-tertiary)', fontSize: '11px', fontWeight: 600 }}>
                        {kpi.lastMeasured}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => matchingSla && setDetailSla(matchingSla)}
                          title="View SLA Detail Drawer"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye size={12} /> Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── SUB-VIEW 5: OVERALL CONTRACTUAL BREACHES (Item 21) ─── */}
      {activeTab === 'breaches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Conceptual Hierarchy Banner */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>
              Contractual Breach Governance Hierarchy:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                <span style={{ color: 'var(--brand-primary)' }}>1. SLA Measurement</span>
              </div>
              <ArrowRight size={14} color="var(--text-tertiary)" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                <span style={{ color: '#D97706' }}>2. SLA Miss / Deviation</span>
              </div>
              <ArrowRight size={14} color="var(--text-tertiary)" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                <span style={{ color: '#7C3AED' }}>3. Contractual Rule & Threshold</span>
              </div>
              <ArrowRight size={14} color="var(--text-tertiary)" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                <span style={{ color: 'var(--color-red)' }}>4. Overall Contractual Breach</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={18} style={{ color: 'var(--color-red)' }} />
                  Active Overall Contractual Breaches
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  Confirmed legal and operational contractual breaches with commercial exposure and mandatory remediation plans.
                </p>
              </div>
              <span className={`badge ${contractualBreaches.length === 0 ? 'badge-success' : 'badge-danger'}`}>
                {contractualBreaches.length} Breaches
              </span>
            </div>

            {contractualBreaches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle size={36} color="var(--color-green)" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ margin: 0, fontWeight: 700 }}>Zero Overall Contractual Breaches</h4>
                <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>All measured service level commitments comply with contractual thresholds.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-primary)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Breach ID</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Contract Clause & SLA</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Service Domain</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Period</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Target</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Actual</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Contractual Threshold</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Commercial Exposure</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Status</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Remediation Action</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractualBreaches.map(b => {
                      const matchedSla = slas.find(s => s.id === b.slaId);
                      return (
                        <tr key={b.measurementId} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                          <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-red)' }}>{b.measurementId}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 700 }}>{b.slaName}</div>
                            <div style={{ fontSize: '11px', color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)' }}>{b.contractClause}</div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--brand-primary)' }}>
                              {b.serviceDomain || matchedSla?.serviceDomain || 'Service Management, Governance, and Delivery'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 600 }}>{b.period}</td>
                          <td style={{ padding: '12px 14px' }}>{b.target}</td>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-red)' }}>{b.actual}</td>
                          <td style={{ padding: '12px 14px', fontSize: '11px', color: 'var(--text-secondary)' }}>{b.contractualThreshold}</td>
                          <td style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 600, color: 'var(--color-red)' }}>{b.commercialRisk}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span className="badge badge-danger">CONTRACTUAL BREACH</span>
                          </td>
                          <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: '11px' }}>{b.notes || 'Formal remediation plan active.'}</td>
                          <td style={{ padding: '12px 14px' }}>
                            {matchedSla && (
                              <button
                                onClick={() => setDetailSla(matchedSla)}
                                title="View SLA Specification"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '4px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Eye size={12} /> Detail
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Record Measurement Modal */}
      <RecordMeasurementModal
        isOpen={isRecordOpen}
        onClose={() => setIsRecordOpen(false)}
        onSubmit={addMeasurement}
        slas={slas}
        evaluateCompliance={evaluateCompliance}
        getConditionalTarget={getConditionalTarget}
      />

      {/* SLA Detail Drawer */}
      <SLADetailDrawer
        sla={detailSla}
        isOpen={Boolean(detailSla)}
        onClose={() => setDetailSla(null)}
        measurements={measurements}
      />
    </div>
  );
}
