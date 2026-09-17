/**
 * KaarTech ITMS — Unified Approval Page
 * Route: /unified-approval
 *
 * Centralized approval inbox consolidating:
 * - Leave Approvals
 * - Remote Work Approvals
 * - Customer CTA Approvals
 * - Timesheet Approvals
 * - Resource-related Approvals
 */
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck, Calendar, Briefcase, Users, FileText, Clock,
  CheckCircle2, XCircle, AlertTriangle, Search, Filter,
  Check, X, MessageSquare, AlertCircle
} from 'lucide-react';
import { useResourceManagement } from '../../data/resourceManagementStore';
import { RESOURCES } from '../../data/demoData';

const APPROVAL_TYPES = ['All', 'Leave', 'Remote Work', 'Customer Action', 'Timesheet', 'Resource'];

const typeIcons = {
  Leave: Calendar,
  'Remote Work': Briefcase,
  'Customer Action': Users,
  Timesheet: FileText,
  Resource: ClipboardCheck,
};

const typeColors = {
  Leave: { bg: 'rgba(37, 99, 235, 0.10)', color: '#2563EB' },
  'Remote Work': { bg: 'rgba(124, 58, 237, 0.10)', color: '#7C3AED' },
  'Customer Action': { bg: 'rgba(217, 119, 6, 0.10)', color: '#D97706' },
  Timesheet: { bg: 'rgba(13, 159, 110, 0.10)', color: '#0D9F6E' },
  Resource: { bg: 'rgba(107, 29, 42, 0.10)', color: '#6B1D2A' },
};

// Generate demo approval items from existing data
function generateApprovalItems(requests) {
  const items = [];
  const today = new Date('2026-09-17');

  // Leave approvals
  const leaveApprovals = [
    { id: 'APR-001', type: 'Leave', request: 'Annual Leave — 5 days', requestedBy: 'Khalid Al Hashimi', date: '2026-09-15', priority: 'Medium', status: 'Pending', route: '/resources/timesheet-approval' },
    { id: 'APR-002', type: 'Leave', request: 'Sick Leave — 2 days', requestedBy: 'Sara Al Marzouqi', date: '2026-09-14', priority: 'High', status: 'Pending', route: '/resources/timesheet-approval' },
    { id: 'APR-003', type: 'Leave', request: 'Annual Leave — 3 days', requestedBy: 'Ravi Shankar', date: '2026-09-13', priority: 'Low', status: 'Pending', route: '/resources/timesheet-approval' },
  ];

  // Remote work approvals
  const remoteApprovals = [
    { id: 'APR-004', type: 'Remote Work', request: 'Remote Work — 1 week', requestedBy: 'Priya Nair', date: '2026-09-16', priority: 'Medium', status: 'Pending', route: '/resources/timesheet-approval' },
    { id: 'APR-005', type: 'Remote Work', request: 'Remote Work — 3 days', requestedBy: 'Ankit Patel', date: '2026-09-12', priority: 'Low', status: 'Pending', route: '/resources/timesheet-approval' },
  ];

  // Customer action approvals
  const ctaApprovals = [
    { id: 'APR-006', type: 'Customer Action', request: 'Approve response to manufacturing SLA query', requestedBy: 'Customer Success Lead', date: '2026-09-17', priority: 'High', status: 'Pending', route: '/customer/actions' },
    { id: 'APR-007', type: 'Customer Action', request: 'Approve escalation path for P1 incident', requestedBy: 'Service Desk Manager', date: '2026-09-16', priority: 'Critical', status: 'Pending', route: '/customer/actions' },
  ];

  // Timesheet approvals
  const timesheetApprovals = [
    { id: 'APR-008', type: 'Timesheet', request: 'Weekly Timesheet — Week 37', requestedBy: 'Team Alpha (6 members)', date: '2026-09-15', priority: 'Medium', status: 'Pending', route: '/resources/timesheet-approval' },
    { id: 'APR-009', type: 'Timesheet', request: 'Weekly Timesheet — Week 37', requestedBy: 'Team Bravo (4 members)', date: '2026-09-15', priority: 'Medium', status: 'Pending', route: '/resources/timesheet-approval' },
  ];

  // Resource approvals from actual request data
  const resourceApprovals = requests
    .filter(r => r.status === 'Pending Approval' || r.status === 'Requested')
    .slice(0, 3)
    .map((r, idx) => ({
      id: `APR-R${idx + 1}`,
      type: 'Resource',
      request: `Resource Request — ${r.roleTitle || r.role || 'Specialist'}`,
      requestedBy: r.requester || 'Resource Management',
      date: r.createdDate || '2026-09-14',
      priority: r.criticality || 'Medium',
      status: 'Pending',
      route: '/resources/requests',
    }));

  items.push(...leaveApprovals, ...remoteApprovals, ...ctaApprovals, ...timesheetApprovals, ...resourceApprovals);
  return items;
}

const priorityColors = {
  Critical: { bg: 'rgba(220, 38, 38, 0.12)', color: 'var(--color-red)' },
  High: { bg: 'rgba(217, 119, 6, 0.12)', color: 'var(--color-amber)' },
  Medium: { bg: 'rgba(37, 99, 235, 0.12)', color: 'var(--color-blue)' },
  Low: { bg: 'rgba(13, 159, 110, 0.12)', color: 'var(--color-green)' },
};

export default function UnifiedApprovalPage() {
  const navigate = useNavigate();
  const { requests } = useResourceManagement();
  const [filterType, setFilterType] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusOverrides, setStatusOverrides] = useState({});
  const [activeModal, setActiveModal] = useState(null); // { type: 'approve' | 'reject', item: approvalItem }
  const [remarks, setRemarks] = useState('');
  const [notification, setNotification] = useState(null);

  const allApprovals = useMemo(() => {
    const base = generateApprovalItems(requests);
    return base.map(item => {
      if (statusOverrides[item.id]) {
        return { ...item, ...statusOverrides[item.id] };
      }
      return item;
    });
  }, [requests, statusOverrides]);

  const filteredApprovals = useMemo(() => {
    let items = allApprovals;
    if (filterType !== 'All') {
      items = items.filter(a => a.type === filterType);
    }
    if (statusFilter !== 'All') {
      items = items.filter(a => a.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(a =>
        a.request.toLowerCase().includes(q) ||
        a.requestedBy.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      );
    }
    return items;
  }, [allApprovals, filterType, statusFilter, searchQuery]);

  // KPI counts
  const kpis = useMemo(() => {
    const pendingList = allApprovals.filter(a => a.status === 'Pending');
    const counts = {
      total: allApprovals.length,
      pending: pendingList.length,
      approved: allApprovals.filter(a => a.status === 'Approved').length,
      rejected: allApprovals.filter(a => a.status === 'Rejected').length,
    };
    APPROVAL_TYPES.filter(t => t !== 'All').forEach(t => {
      counts[t] = pendingList.filter(a => a.type === t).length;
    });
    return counts;
  }, [allApprovals]);

  const handleOpenModal = (type, item) => {
    setActiveModal({ type, item });
    setRemarks('');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setRemarks('');
  };

  const handleConfirmAction = () => {
    if (!activeModal) return;
    const { type, item } = activeModal;
    const newStatus = type === 'approve' ? 'Approved' : 'Rejected';

    setStatusOverrides(prev => ({
      ...prev,
      [item.id]: {
        status: newStatus,
        actionDate: '2026-09-17',
        actionNotes: remarks,
      },
    }));

    setNotification({
      type: type === 'approve' ? 'success' : 'error',
      message: `${item.id} (${item.request}) marked as ${newStatus}.`,
    });

    handleCloseModal();

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <ClipboardCheck size={22} style={{ color: 'var(--brand-primary)' }} />
          <h1 className="page-title" style={{ margin: 0 }}>Unified Approval</h1>
          <span className="badge badge-primary">KAARTECH ITMS</span>
        </div>
        <p className="page-subtitle" style={{ margin: 0 }}>
          Review, approve, and reject pending approvals across KaarTech ITMS modules
        </p>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            background: notification.type === 'success' ? 'rgba(13, 159, 110, 0.12)' : 'rgba(220, 38, 38, 0.12)',
            border: `1px solid ${notification.type === 'success' ? 'rgba(13, 159, 110, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`,
            color: notification.type === 'success' ? 'var(--color-green, #0D9F6E)' : 'var(--color-red, #DC2626)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: '2px', display: 'flex' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px',
        marginBottom: '20px',
      }}>
        {/* Total Pending */}
        <div
          className="card"
          style={{
            padding: '16px',
            cursor: 'pointer',
            borderLeft: `3px solid var(--brand-primary)`,
            transition: 'all 0.2s',
            background: filterType === 'All' && statusFilter === 'All' ? 'rgba(107, 29, 42, 0.06)' : undefined,
          }}
          onClick={() => { setFilterType('All'); setStatusFilter('All'); }}
        >
          <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
            Pending Action
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {kpis.pending}
          </div>
        </div>

        {APPROVAL_TYPES.filter(t => t !== 'All').map(type => {
          const tc = typeColors[type] || {};
          return (
            <div
              key={type}
              className="card"
              style={{
                padding: '16px',
                cursor: 'pointer',
                borderLeft: `3px solid ${tc.color || 'var(--border-primary)'}`,
                transition: 'all 0.2s',
                background: filterType === type ? tc.bg : undefined,
              }}
              onClick={() => setFilterType(filterType === type ? 'All' : type)}
            >
              <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                {type}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: tc.color || 'var(--text-primary)', marginTop: '4px' }}>
                {kpis[type] || 0}
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search approvals by request, requester, or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
              }}
            >
              {APPROVAL_TYPES.map(t => (
                <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
              }}
            >
              <option value="All">All Statuses ({allApprovals.length})</option>
              <option value="Pending">Pending ({kpis.pending})</option>
              <option value="Approved">Approved ({kpis.approved})</option>
              <option value="Rejected">Rejected ({kpis.rejected})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Approval Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>Request</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>Requested By</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>Priority</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase', minWidth: '170px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApprovals.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    No approvals match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredApprovals.map(item => {
                  const Icon = typeIcons[item.type] || ClipboardCheck;
                  const tc = typeColors[item.type] || {};
                  const pc = priorityColors[item.priority] || {};
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-secondary)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '6px',
                            background: tc.bg || 'var(--bg-secondary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Icon size={14} style={{ color: tc.color || 'var(--text-secondary)' }} />
                          </div>
                          <span style={{ fontWeight: 600, fontSize: '12px', color: tc.color || 'var(--text-primary)' }}>
                            {item.type}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.request}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{item.id}</div>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{item.requestedBy}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{item.date}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 8px', borderRadius: 'var(--radius-full)',
                          fontSize: '11px', fontWeight: 700,
                          background: pc.bg || 'var(--bg-secondary)',
                          color: pc.color || 'var(--text-secondary)',
                        }}>
                          {item.priority}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 8px', borderRadius: 'var(--radius-full)',
                          fontSize: '11px', fontWeight: 700,
                          background: item.status === 'Approved' ? 'rgba(13, 159, 110, 0.12)' : item.status === 'Rejected' ? 'rgba(220, 38, 38, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                          color: item.status === 'Approved' ? 'var(--color-green, #0D9F6E)' : item.status === 'Rejected' ? 'var(--color-red, #DC2626)' : 'var(--color-amber)',
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {item.status === 'Pending' ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              onClick={() => handleOpenModal('approve', item)}
                              title="Approve Request"
                              style={{
                                padding: '6px 12px',
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                background: '#0D9F6E',
                                color: 'white',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s',
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                              <Check size={13} /> Approve
                            </button>
                            <button
                              onClick={() => handleOpenModal('reject', item)}
                              title="Reject Request"
                              style={{
                                padding: '5px 11px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid rgba(220, 38, 38, 0.4)',
                                background: 'rgba(220, 38, 38, 0.08)',
                                color: 'var(--color-red, #DC2626)',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220, 38, 38, 0.08)'; e.currentTarget.style.color = 'var(--color-red, #DC2626)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                              <X size={13} /> Reject
                            </button>
                          </div>
                        ) : item.status === 'Approved' ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--color-green, #0D9F6E)',
                            fontWeight: 700,
                            fontSize: '12px',
                          }}>
                            <CheckCircle2 size={14} /> Approved
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--color-red, #DC2626)',
                            fontWeight: 700,
                            fontSize: '12px',
                          }}>
                            <XCircle size={14} /> Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Pop-up Modal (Approve or Reject) */}
      {activeModal && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="modal-backdrop"
              onClick={handleCloseModal}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="modal-dialog-centered"
                onClick={e => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  maxHeight: '88vh',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-primary)',
                  boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--border-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  margin: 'auto',
                }}
              >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-secondary)',
                background: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {activeModal.type === 'approve' ? (
                  <CheckCircle2 size={20} style={{ color: '#0D9F6E' }} />
                ) : (
                  <XCircle size={20} style={{ color: '#DC2626' }} />
                )}
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {activeModal.type === 'approve' ? 'Approve Request' : 'Reject Request'}
                  </h3>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    {activeModal.item.id} • {activeModal.item.type}
                  </div>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Item Details Card */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-secondary)',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {activeModal.item.request}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <div><strong style={{ color: 'var(--text-tertiary)' }}>Requested By:</strong> {activeModal.item.requestedBy}</div>
                  <div><strong style={{ color: 'var(--text-tertiary)' }}>Date:</strong> {activeModal.item.date}</div>
                  <div><strong style={{ color: 'var(--text-tertiary)' }}>Priority:</strong> {activeModal.item.priority}</div>
                  <div><strong style={{ color: 'var(--text-tertiary)' }}>Current Status:</strong> {activeModal.item.status}</div>
                </div>
              </div>

              {/* Status Action Description Alert */}
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: activeModal.type === 'approve' ? 'rgba(13, 159, 110, 0.08)' : 'rgba(220, 38, 38, 0.08)',
                  border: `1px solid ${activeModal.type === 'approve' ? 'rgba(13, 159, 110, 0.25)' : 'rgba(220, 38, 38, 0.25)'}`,
                  fontSize: '12px',
                  color: activeModal.type === 'approve' ? '#0D9F6E' : '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {activeModal.type === 'approve' ? (
                  <Check size={16} style={{ flexShrink: 0 }} />
                ) : (
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                )}
                <span>
                  {activeModal.type === 'approve'
                    ? 'Confirming approval will officially authorize this request and update workflow records.'
                    : 'Confirming rejection will decline this request and notify the requester with your remarks.'}
                </span>
              </div>

              {/* Remarks / Reason textarea */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {activeModal.type === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason / Remarks (Recommended)'}
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder={
                    activeModal.type === 'approve'
                      ? 'Add any comments, special instructions or notes...'
                      : 'Provide a clear reason for rejecting this request...'
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid var(--border-secondary)',
                background: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              {activeModal.type === 'approve' ? (
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  style={{
                    padding: '7px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: '#0D9F6E',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Check size={14} /> Confirm Approval
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  style={{
                    padding: '7px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: '#DC2626',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <X size={14} /> Confirm Rejection
                </button>
              )}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
