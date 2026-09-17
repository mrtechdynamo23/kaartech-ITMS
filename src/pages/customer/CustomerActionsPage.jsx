/**
 * KaarTech ITMS Control Tower — Customer Actions & Open CTAs
 * Route: /customer/actions
 * 
 * Single Source of Truth implementation:
 * - Directly consumes `cornerThreads` from CustomerCornerContext
 * - Derives action items, ownership, deadlines, and lineage to originating threads
 * - Interactive action detail modal / drawer with direct Customer Corner thread drill-down
 * - Dynamic KPI calculations derived from actual thread data
 */
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  Search,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Eye,
  CheckCircle,
  X,
  Building2,
  UserCheck,
  Flame,
} from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import { useCustomerCorner } from '../../contexts/CustomerCornerContext';
import {
  getCustomerActionsFromThreads,
  cornerStakeholders,
  stakeholderById,
} from '../../data/customerCornerData';

export default function CustomerActionsPage() {
  const navigate = useNavigate();
  const { cornerThreads, activeStakeholderId, updateCTA } = useCustomerCorner();

  // Filters & State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [stakeholderFilter, setStakeholderFilter] = useState('all');
  const [selectedAction, setSelectedAction] = useState(null);

  // ESC key listener & body scroll lock
  useEffect(() => {
    if (!selectedAction) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedAction(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedAction]);

  // Derive actions from single source of truth (cornerThreads)
  const allDerivedActions = useMemo(() => {
    return getCustomerActionsFromThreads(cornerThreads, stakeholderFilter);
  }, [cornerThreads, stakeholderFilter]);

  // Dynamic KPIs derived strictly from actual thread data
  const kpis = useMemo(() => {
    const openActions = allDerivedActions.filter(a => a.status !== 'Completed');
    const overdueActions = allDerivedActions.filter(a => a.status === 'Overdue');
    const inProgressActions = allDerivedActions.filter(a => a.status === 'In Progress');
    const highPriorityActions = allDerivedActions.filter(a => a.priority === 'Critical' || a.priority === 'High');
    const completedActions = allDerivedActions.filter(a => a.status === 'Completed');

    return {
      openCount: openActions.length,
      overdueCount: overdueActions.length,
      inProgressCount: inProgressActions.length,
      highPriorityCount: highPriorityActions.length,
      completedCount: completedActions.length,
      totalCount: allDerivedActions.length,
    };
  }, [allDerivedActions]);

  // Filtered action records for table view
  const filteredActions = useMemo(() => {
    return allDerivedActions.filter(act => {
      if (statusFilter !== 'All') {
        if (statusFilter === 'Open' && act.status === 'Completed') return false;
        if (statusFilter !== 'Open' && act.status !== statusFilter) return false;
      }
      if (priorityFilter !== 'All' && act.priority !== priorityFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchId = act.actionId.toLowerCase().includes(q);
        const matchThread = act.relatedThreadTitle.toLowerCase().includes(q) || act.relatedThreadId.toLowerCase().includes(q);
        const matchCustomer = act.customer.toLowerCase().includes(q);
        const matchOwner = act.owner.toLowerCase().includes(q);
        const matchAction = act.actionRequired.toLowerCase().includes(q);
        if (!matchId && !matchThread && !matchCustomer && !matchOwner && !matchAction) {
          return false;
        }
      }
      return true;
    });
  }, [allDerivedActions, statusFilter, priorityFilter, search]);

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Critical': return 'badge-danger';
      case 'High': return 'badge-warning';
      case 'Medium': return 'badge-primary';
      case 'Low': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Overdue': return 'badge-danger';
      case 'In Progress': return 'badge-primary';
      case 'Open': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="customer-actions-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Customer Actions & Open CTAs</h1>
            <span className="badge badge-success">Single Source of Truth</span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            Actionable commitments and deliverables dynamically derived from Customer Corner collaborative threads.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Customer / Stakeholder Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 600 }}>Stakeholder Persona:</span>
            <select
              value={stakeholderFilter}
              onChange={(e) => setStakeholderFilter(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
              }}
            >
              <option value="all">All Stakeholders (Global View)</option>
              {cornerStakeholders.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.org} • {s.side})</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => navigate('/customer/corner')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--brand-primary)',
              color: 'white',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(107, 29, 42, 0.25)',
            }}
          >
            <MessageSquare size={16} /> Open Customer Corner
          </button>
        </div>
      </div>

      {/* ── KPI Strip (Section 11 & 14: Dynamic CTA Count) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
        <KPICard
          title="Open CTAs"
          value={kpis.openCount}
          subtitle="Actionable customer threads"
          status={kpis.openCount > 10 ? 'warning' : 'normal'}
          sparklineData={[5, 6, 6, kpis.openCount]}
          accentColor="var(--brand-primary)"
        />
        <KPICard
          title="In Progress Actions"
          value={kpis.inProgressCount}
          subtitle="Active delivery commitments"
          status="normal"
          sparklineData={[3, 4, 4, kpis.inProgressCount]}
          accentColor="var(--color-blue)"
        />
        <KPICard
          title="Overdue CTAs"
          value={kpis.overdueCount}
          subtitle={kpis.overdueCount === 0 ? 'Zero overdue items' : 'Requires immediate resolution'}
          status={kpis.overdueCount === 0 ? 'success' : 'danger'}
          sparklineData={[2, 2, 1, kpis.overdueCount]}
        />
        <KPICard
          title="Critical / High Priority"
          value={kpis.highPriorityCount}
          subtitle="SteerCom priority escalations"
          status={kpis.highPriorityCount > 4 ? 'warning' : 'normal'}
          sparklineData={[3, 3, 4, kpis.highPriorityCount]}
          accentColor="var(--color-amber)"
        />
        <KPICard
          title="Completed CTAs"
          value={kpis.completedCount}
          subtitle="Resolved & verified threads"
          status="success"
          sparklineData={[0, 1, 1, kpis.completedCount]}
        />
      </div>

      {/* ── Search & Filter Controls ── */}
      <div
        className="card"
        style={{
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search Action, Thread, Customer, Owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Open', 'In Progress', 'Overdue', 'Completed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: statusFilter === st ? '1px solid var(--brand-primary)' : '1px solid var(--border-primary)',
                  background: statusFilter === st ? 'rgba(107, 29, 42, 0.1)' : 'transparent',
                  color: statusFilter === st ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: statusFilter === st ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 600 }}>Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
            }}
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* ── Actions Table (Section 13: Action, Related Thread, Customer, Owner, Priority, Due Date, Status) ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Actionable Customer Thread Registry
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Showing <strong>{filteredActions.length}</strong> actionable customer commitments
            </p>
          </div>
        </div>

        {filteredActions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircle2 size={36} color="var(--color-green)" style={{ margin: '0 auto 10px' }} />
            <h4 style={{ margin: 0, fontWeight: 700 }}>No Action Items Match Filters</h4>
            <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>All filtered customer threads are compliant and up to date.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-primary)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Action ID</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Related Thread</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Customer / Entity</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Owner</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Priority</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Due Date</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Action Required</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredActions.map(act => (
                  <tr
                    key={act.actionId}
                    style={{ borderBottom: '1px solid var(--border-secondary)', transition: 'background 0.15s ease', cursor: 'pointer' }}
                    onClick={() => setSelectedAction(act)}
                    className="hover-row"
                  >
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-primary)', whiteSpace: 'nowrap' }}>
                      {act.actionId}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: '280px', lineHeight: 1.3 }}>
                        {act.relatedThreadTitle}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>{act.relatedThreadId}</span>
                        {act.ticketId && (
                          <span className="badge badge-neutral" style={{ fontSize: '10px', padding: '1px 5px' }}>
                            {act.ticketId}
                          </span>
                        )}
                        <span>• {act.forum}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{act.customer}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{act.customerLead}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{act.owner}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{act.ownerTitle}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${getPriorityBadgeClass(act.priority)}`}>
                        {act.priority}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 600, color: act.status === 'Overdue' ? 'var(--color-red)' : 'var(--text-primary)' }}>
                        {act.dueDate}
                      </div>
                      {act.status === 'Overdue' && (
                        <div style={{ fontSize: '10px', color: 'var(--color-red)', fontWeight: 700 }}>Past SLA Due</div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${getStatusBadgeClass(act.status)}`}>
                        {act.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '240px', lineHeight: 1.3 }}>
                        {act.actionRequired}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => setSelectedAction(act)}
                          title="View Action Detail"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '5px 10px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-primary)',
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <Eye size={12} /> Detail
                        </button>
                        <button
                          onClick={() => navigate('/customer/corner')}
                          title="Open in Customer Corner"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '5px 10px',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            background: 'rgba(107, 29, 42, 0.1)',
                            color: 'var(--brand-primary)',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <ArrowUpRight size={12} /> Corner
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Section 16: Interactive Action Detail Modal ── */}
      {selectedAction && createPortal(
        <div
          className="modal-backdrop"
          onClick={() => setSelectedAction(null)}
        >
          <div
            className="modal-dialog-centered"
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 0,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--brand-primary)', fontSize: '1rem' }}>
                    {selectedAction.actionId}
                  </span>
                  <span className={`badge ${getStatusBadgeClass(selectedAction.status)}`}>
                    {selectedAction.status}
                  </span>
                  <span className={`badge ${getPriorityBadgeClass(selectedAction.priority)}`}>
                    {selectedAction.priority} Priority
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedAction.actionRequired}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAction(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Originating Thread Lineage */}
              <div style={{ padding: '14px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '6px' }}>
                  Originating Customer Thread Lineage
                </div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {selectedAction.relatedThreadTitle}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                  <span>Thread ID: <strong style={{ fontFamily: 'var(--font-mono)' }}>{selectedAction.relatedThreadId}</strong></span>
                  {selectedAction.ticketId && <span>Ticket: <strong>{selectedAction.ticketId}</strong></span>}
                  <span>Governance Forum: <strong>{selectedAction.forum}</strong></span>
                  <span>Topic: <strong>{selectedAction.topic}</strong></span>
                </div>
              </div>

              {/* Action Attributes Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Client / Entity</div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginTop: '2px' }}>{selectedAction.customer}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Lead: {selectedAction.customerLead}</div>
                </div>

                <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Action Owner</div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--brand-primary)', marginTop: '2px' }}>{selectedAction.owner}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{selectedAction.ownerTitle}</div>
                </div>

                <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Target Due Date</div>
                  <div style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: selectedAction.status === 'Overdue' ? 'var(--color-red)' : 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedAction.dueDate}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Contractual Delivery SLA</div>
                </div>

                <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Completion Progress</div>
                  <div style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--color-green)', marginTop: '2px' }}>
                    {selectedAction.progress}%
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'var(--border-primary)', borderRadius: '2px', marginTop: '6px' }}>
                    <div style={{ width: `${selectedAction.progress}%`, height: '100%', background: 'var(--brand-primary)', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>

              {/* Thread Discussion Preview */}
              <div>
                <h4 style={{ margin: '0 0 8px', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                  Latest Discussion Excerpt ({selectedAction.messageCount} Messages)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {(selectedAction.thread.messages || []).slice(-3).map((m, idx) => (
                    <div key={idx} style={{ padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: '2px' }}>
                        <span>{stakeholderById(m.authorId)?.name || m.authorId}</span>
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
                          {new Date(m.postedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)' }}>{m.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Changes made here sync reactively to Customer Corner threads.
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelectedAction(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigate('/customer/corner');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: 'var(--brand-primary)',
                    color: 'white',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <MessageSquare size={14} /> View in Customer Corner
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
