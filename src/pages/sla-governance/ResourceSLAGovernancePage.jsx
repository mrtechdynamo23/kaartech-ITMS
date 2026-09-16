/**
 * KaarTech ITMS Control Tower — Resource SLA Governance & Compliance Engine
 * Route: /sla-governance, /sla/overview, /sla/measurements, /sla/admin, /sla/history, /sla/breaches, /sla/detail/:slaId
 *
 * 6 Sub-views:
 * 1. SLA Overview (Live KPIs, compliance by 4 categories, monthly trends)
 * 2. SLA Measurements (Record measurement, live auto-evaluator, audit trail)
 * 3. SLA Management (CRUD, Activate/Deactivate, Target Versioning engine)
 * 4. SLA History (Longitudinal trends, historical compliance, target revisions)
 * 5. SLA Breaches (Dedicated breach remediation workspace)
 * 6. SLA Detail Drawer (Complete metadata, conditional/composite rules, version history)
 */
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Plus, Target, AlertTriangle, TrendingUp, CheckCircle,
  XCircle, X, BarChart3, FileText, Activity, Clock, Filter, Search,
  RefreshCw, ChevronRight, Eye, Edit3, Check, History, AlertOctagon,
  Layers, ExternalLink, Calendar, User, Database, ArrowRight
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line
} from 'recharts';
import {
  useResourceManagement,
  SLA_CATEGORIES
} from '../../data/resourceManagementStore';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';
import DataTable from '../../components/common/DataTable';

const categoryColors = {
  response_mobilization: '#2563EB',
  replacement_continuity: '#7C3AED',
  resource_performance: '#0D9F6E',
  reporting: '#D97706',
};

// ── Target Version Change Modal ──
function TargetVersionModal({ isOpen, onClose, sla, onUpdateTarget }) {
  const [newValue, setNewValue] = useState('');
  const [newOperator, setNewOperator] = useState('<=');
  const [reason, setReason] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (sla) {
      setNewValue(sla.currentTargetValue);
      setNewOperator(sla.currentTargetOperator);
      setReason('');
    }
  }, [sla]);

  if (!isOpen || !sla) return null;

  const handleSubmit = () => {
    if (!newValue || isNaN(parseFloat(newValue))) return;
    onUpdateTarget(sla.id, parseFloat(newValue), newOperator, reason || 'Target revision');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', width: '520px', maxWidth: '94vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-primary)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-secondary)', flexShrink: 0 }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>Revise SLA Working Target</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '4px 0 0' }}>Creates a new target version while preserving original source</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
          <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: 'var(--text-xs)' }}>
            <div><strong>SLA:</strong> {sla.id} — {sla.name}</div>
            <div style={{ marginTop: '4px' }}><strong>Original Sourced Target:</strong> {sla.originalSourceTarget}</div>
            <div style={{ marginTop: '4px' }}><strong>Current Target (v{sla.targetVersion}):</strong> {sla.currentTargetOperator} {sla.currentTargetValue} {sla.currentTargetUnit}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Operator</label>
                <select
                  value={newOperator}
                  onChange={e => setNewOperator(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}
                >
                  <option value="<=">&lt;= (Max)</option>
                  <option value=">=">&gt;= (Min)</option>
                  <option value="=">= (Exact)</option>
                  <option value="<">&lt; (Less)</option>
                  <option value=">">&gt; (Greater)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>New Target Value ({sla.currentTargetUnit})</label>
                <input
                  type="number"
                  step="any"
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Effective Date</label>
              <input
                type="date"
                value={effectiveDate}
                onChange={e => setEffectiveDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Revision Justification / Reason *</label>
              <textarea
                rows={3}
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Operational recalibration agreed in monthly steering committee."
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}
              />
            </div>
          </div>
        </div>

        <div className="modal-form-sticky-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 20px', borderTop: '1px solid var(--border-secondary)', flexShrink: 0, background: 'var(--bg-card)' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'transparent', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>Cancel</button>
          <button onClick={handleSubmit} style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--brand-primary)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
            Commit Target v{sla.targetVersion + 1}
          </button>
        </div>
      </div>
    </div>
  );
}

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

  // Target resolution (supports conditional rules like Common vs Specialist)
  const effectiveTarget = useMemo(() => {
    if (!selectedSLA) return null;
    return getConditionalTarget(selectedSLA, { roleType });
  }, [selectedSLA, roleType, getConditionalTarget]);

  // Live Auto-Evaluator
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
function SLADetailDrawer({ sla, isOpen, onClose, measurements, onReviseTarget }) {
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
              <span className="badge badge-neutral">v{sla.targetVersion}</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                Target Specifications
              </h4>
              <button
                onClick={() => onReviseTarget(sla)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--brand-primary)', background: 'var(--brand-primary-light)', color: 'var(--brand-primary)', fontSize: 'var(--text-xs)', fontWeight: 700, cursor: 'pointer' }}
              >
                <Edit3 size={12} /> Revise Target (v{sla.targetVersion + 1})
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Original Sourced Target</div>
                <div style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginTop: '2px' }}>{sla.originalSourceTarget}</div>
              </div>
              <div style={{ padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Current Working Target (v{sla.targetVersion})</div>
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

          {/* Target Version History */}
          <div className="card" style={{ padding: '18px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <History size={14} /> Target Revision Audit Log
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(sla.targetHistory || []).map((th, idx) => (
                <div key={idx} style={{ padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>Version {th.version}: {th.operator} {th.value} {th.unit}</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>{th.effectiveDate}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{th.reason} • by {th.changedBy}</div>
                </div>
              ))}
            </div>
          </div>

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
              Recent Measurements ({slaMeasurements.length})
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

// ── Main Page Component ──
export default function ResourceSLAGovernancePage({ initialTab = 'overview' }) {
  const { slaId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [targetModalSla, setTargetModalSla] = useState(null);
  const [detailSla, setDetailSla] = useState(null);

  const {
    slas,
    measurements,
    addSLA,
    updateSLA,
    updateSLATarget,
    toggleSLAStatus,
    addMeasurement,
    getSLAKPIs,
    getBreaches,
    evaluateCompliance,
    getConditionalTarget,
  } = useResourceManagement();

  const kpis = useMemo(() => getSLAKPIs(), [slas, measurements]);
  const breaches = useMemo(() => getBreaches(), [slas, measurements]);

  // Handle route param slaId to open drawer
  useEffect(() => {
    if (slaId) {
      const found = slas.find(s => s.id.toUpperCase() === slaId.toUpperCase());
      if (found) setDetailSla(found);
    }
  }, [slaId, slas]);

  // Filtered SLAs
  const filteredSLAs = useMemo(() => {
    return slas.filter(s => {
      if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.id.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.owner.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [slas, selectedCategory, searchQuery]);

  // Monthly trend mock data aligned to KPIs
  const trendData = [
    { period: 'May 2026', compliance: 92, target: 95 },
    { period: 'Jun 2026', compliance: 94, target: 95 },
    { period: 'Jul 2026', compliance: 91, target: 95 },
    { period: 'Aug 2026', compliance: 96, target: 95 },
    { period: 'Sep 2026', compliance: kpis.complianceRate || 95, target: 95 },
  ];

  const categoryComplianceData = useMemo(() => {
    return kpis.byCategory.map(c => ({
      name: c.label,
      met: c.met,
      breached: c.breached,
      compliance: c.compliance,
    }));
  }, [kpis]);

  return (
    <div className="page-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Resource SLA Governance</h1>
            <span className="badge badge-primary">{kpis.totalSLAs} Defined SLAs</span>
            <span className={`badge ${kpis.breached === 0 ? 'badge-success' : 'badge-danger'}`}>
              {kpis.breached} Breaches
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            Canonical governance of resource SLAs across Mobilization, Continuity, Performance, and Reporting. Sourced from contract baselines.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsRecordOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--brand-primary)',
              color: 'white',
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(107, 29, 42, 0.25)',
            }}
          >
            <Activity size={16} /> Record Measurement
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
        <KPICard
          title="Overall SLA Compliance"
          value={`${kpis.complianceRate}%`}
          target="95.0%"
          status={kpis.complianceRate >= 95 ? 'success' : kpis.complianceRate >= 90 ? 'warning' : 'danger'}
          subtitle={`${kpis.met} Met / ${kpis.totalMeasurements} Recorded`}
          icon={ShieldCheck}
        />
        <KPICard
          title="Total Active SLAs"
          value={kpis.totalSLAs}
          subtitle="Across 4 categories"
          icon={Target}
        />
        <KPICard
          title="Met Commitments"
          value={kpis.met}
          unit="SLAs"
          status="success"
          subtitle="Within contractual thresholds"
          icon={CheckCircle}
        />
        <KPICard
          title="Active Breaches"
          value={kpis.breached}
          unit="SLAs"
          status={kpis.breached === 0 ? 'success' : 'danger'}
          subtitle={kpis.breached === 0 ? 'Zero compliance deviations' : 'Requires corrective action'}
          icon={AlertTriangle}
        />
        <KPICard
          title="Pending Audits"
          value={kpis.pending}
          unit="SLAs"
          subtitle="Awaiting monthly telemetry"
          icon={Clock}
        />
        <KPICard
          title="Governance Score"
          value={`${kpis.overallScore}/100`}
          target="90"
          status="success"
          subtitle="Weighted SLA index"
          icon={BarChart3}
        />
      </div>

      {/* Sub-Tabs Navigation (6 Views) */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '2px solid var(--border-primary)', flexWrap: 'wrap' }}>
        {[
          { key: 'overview', label: 'SLA Overview', icon: BarChart3 },
          { key: 'resource_kpis', label: 'Resource Performance (8 KPIs)', icon: ShieldCheck },
          { key: 'measurements', label: 'SLA Measurements', icon: Activity },
          { key: 'management', label: 'SLA Management & Versions', icon: Target },
          { key: 'history', label: 'SLA History & Trends', icon: History },
          { key: 'breaches', label: `SLA Breaches (${breaches.length})`, icon: AlertOctagon },
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

      {/* SUB-VIEW 1: SLA OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '16px' }}>
            {/* Visual 1: Compliance by Category */}
            <ChartCard
              title="Compliance by SLA Category"
              subtitle="Performance across 4 core contractual dimensions"
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
              subtitle="5-month trajectory against 95% contractual floor"
              height={260}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

      {/* SUB-VIEW: CANONICAL RESOURCE PERFORMANCE (8 KPIs) */}
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
                  Canonical governance ledger measuring attendance, milestone adherence, first-pass quality, documentation rigor, timesheet timeliness, policy & security compliance, stakeholder satisfaction, and knowledge transfer across all 7 KaarTech Service Domains.
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
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-tertiary)', width: '130px' }}>Actions</th>
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
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => matchingSla && setDetailSla(matchingSla)}
                            title="View SLA Detail Drawer"
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={12} /> Detail
                          </button>
                          <button
                            onClick={() => matchingSla && setTargetModalSla(matchingSla)}
                            title="Revise Working Target"
                            className="btn btn-primary"
                            style={{ padding: '4px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Target size={12} /> Target
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: SLA MEASUREMENTS */}
      {activeTab === 'measurements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Showing <strong>{measurements.length}</strong> recorded audit telemetry entries.
            </div>
            <button
              onClick={() => setIsRecordOpen(true)}
              style={{ padding: '7px 14px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--brand-primary)', color: 'white', fontWeight: 600, fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} /> Add Measurement
            </button>
          </div>

          <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-primary)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Measurement ID</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>SLA</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Period</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Target</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Actual Value</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Status</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Evaluator</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Evidence</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map(m => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: SLA MANAGEMENT & VERSIONING */}
      {activeTab === 'management' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Filter Bar */}
          <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
              <Search size={15} style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Filter SLAs by name, ID, or owner..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', fontWeight: 600 }}
              >
                <option value="all">All 4 Categories</option>
                {SLA_CATEGORIES.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-primary)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>ID</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>SLA Definition</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Category</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Service Domain</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Original Sourced Target</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Working Target</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Target Version</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Status</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSLAs.map(sla => (
                  <tr key={sla.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-primary)' }}>{sla.id}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{sla.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{sla.trigger} • {sla.owner}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                        {SLA_CATEGORIES.find(c => c.key === sla.category)?.label || sla.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-primary)' }}>
                        {sla.serviceDomain || 'Service Management, Governance, and Delivery'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{sla.originalSourceTarget}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {sla.currentTargetOperator} {sla.currentTargetValue} {sla.currentTargetUnit}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-primary" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                        v{sla.targetVersion}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => toggleSLAStatus(sla.id)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: sla.status === 'Active' ? 'rgba(13, 159, 110, 0.12)' : 'rgba(100, 116, 139, 0.12)',
                          color: sla.status === 'Active' ? 'var(--color-green)' : 'var(--text-tertiary)',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {sla.status}
                      </button>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => setDetailSla(sla)}
                          title="View SLA Detail Drawer"
                          style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)', background: 'var(--bg-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                        >
                          <Eye size={12} /> Detail
                        </button>
                        <button
                          onClick={() => setTargetModalSla(sla)}
                          title="Revise Working Target"
                          style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--brand-primary)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600 }}
                        >
                          <Target size={12} /> Target
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: SLA HISTORY */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 'var(--text-md)', fontWeight: 700 }}>
              Longitudinal Performance & Target Revision Audits
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Historical performance audits across reporting cycles with verifiable measurement sources.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-primary)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)' }}>Period</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)' }}>SLA</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)' }}>Target Spec</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)' }}>Result</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)' }}>Compliance Status</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)' }}>Auditor</th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>{m.period}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--brand-primary)' }}>{m.slaId} — {m.slaName}</td>
                      <td style={{ padding: '10px 14px' }}>{m.operator} {m.targetValue} {m.unit}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>{m.actualValue} {m.unit}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 800, fontSize: '10px', background: m.status === 'MET' ? 'rgba(13, 159, 110, 0.15)' : 'rgba(220, 38, 38, 0.15)', color: m.status === 'MET' ? 'var(--color-green)' : 'var(--color-red)' }}>
                          {m.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{m.evaluator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: SLA BREACHES */}
      {activeTab === 'breaches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 700 }}>Active Contractual Breaches</h3>
                <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  Breach ledger requiring formal remediation, steering committee notification, or resource corrective plans.
                </p>
              </div>
              <span className={`badge ${breaches.length === 0 ? 'badge-success' : 'badge-danger'}`}>
                {breaches.length} Breaches
              </span>
            </div>

            {breaches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle size={36} color="var(--color-green)" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ margin: 0, fontWeight: 700 }}>Zero Active Breaches</h4>
                <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>All measured service level commitments are compliant with contractual targets.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-primary)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Breach ID</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>SLA</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Period</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Target</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Actual</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Variance</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Owner</th>
                      <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)' }}>Remediation Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breaches.map(b => (
                      <tr key={b.measurementId} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                        <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-red)' }}>{b.measurementId}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700 }}>{b.slaName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{b.slaId}</div>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>{b.period}</td>
                        <td style={{ padding: '12px 14px' }}>{b.target}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-red)' }}>{b.actual}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>{b.breachAmount}</td>
                        <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{b.owner}</td>
                        <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: '11px' }}>{b.notes || 'Under review with delivery team.'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Target Revision Modal */}
      <TargetVersionModal
        isOpen={Boolean(targetModalSla)}
        onClose={() => setTargetModalSla(null)}
        sla={targetModalSla}
        onUpdateTarget={updateSLATarget}
      />

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
        onReviseTarget={(sla) => {
          setDetailSla(null);
          setTargetModalSla(sla);
        }}
      />
    </div>
  );
}
