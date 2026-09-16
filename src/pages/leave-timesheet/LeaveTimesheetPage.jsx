/**
 * KaarTech ITMS Control Tower — Leave & Timesheet Page
 * Complete leave management with calendar and timesheet with functional approval.
 */
import React, { useState, useMemo } from 'react';
import { RESOURCES } from '../../data/demoData';
import { getLeaveRecords, getTimesheetRecords, approveTimesheet, rejectTimesheet, getTimesheetKPIs } from '../../data/timeManagementStore';
import { Calendar, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, Filter, AlertTriangle, Check, X } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function useForceUpdate() {
  const [, set] = useState(0);
  return () => set(v => v + 1);
}

export default function LeaveTimesheetPage() {
  const [activeTab, setActiveTab] = useState('leave'); // 'leave' | 'timesheet'
  const [selectedMonth, setSelectedMonth] = useState(8); // September = 8
  const [selectedYear, setSelectedYear] = useState(2026);
  const forceUpdate = useForceUpdate();

  const leaveRecords = getLeaveRecords();
  const timesheetRecords = getTimesheetRecords();
  const tsKPIs = getTimesheetKPIs();

  // ── Leave Data ──
  const monthLeaves = leaveRecords.filter(l => {
    const start = new Date(l.startDate);
    const end = new Date(l.endDate);
    return (start.getMonth() === selectedMonth && start.getFullYear() === selectedYear) ||
           (end.getMonth() === selectedMonth && end.getFullYear() === selectedYear);
  });

  const approvedLeaves = monthLeaves.filter(l => l.status === 'Approved');
  const pendingLeaves = monthLeaves.filter(l => l.status === 'Pending Approval' || l.status === 'Pending');
  const rejectedLeaves = monthLeaves.filter(l => l.status === 'Rejected');

  // ── Calendar ──
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();
  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getDayLeaves = (day) => {
    if (!day) return [];
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return leaveRecords.filter(l => l.startDate <= dateStr && l.endDate >= dateStr && l.status === 'Approved');
  };

  // ── Timesheet Data for selected month ──
  const monthTimesheets = timesheetRecords.filter(ts => {
    return ts.month === selectedMonth && ts.year === selectedYear;
  });

  // Generate timesheet grid if no records exist
  const timesheetGrid = useMemo(() => {
    if (monthTimesheets.length > 0) return monthTimesheets;
    // Generate from resources
    return RESOURCES.slice(0, 15).map((r, idx) => ({
      id: `TS-${selectedYear}${String(selectedMonth + 1).padStart(2, '0')}-${String(idx + 1).padStart(3, '0')}`,
      resourceId: r.id, resourceName: r.name, role: r.role,
      month: selectedMonth, year: selectedYear,
      assignment: `${r.serviceDomain} AMS Operations`,
      regularHours: 160 + Math.floor(Math.random() * 16) - 8,
      overtimeHours: idx % 4 === 0 ? Math.floor(Math.random() * 12) + 2 : 0,
      leaveDays: idx % 3 === 0 ? Math.floor(Math.random() * 3) + 1 : 0,
      totalDays: 22,
      status: idx % 5 === 0 ? 'Pending' : idx % 7 === 0 ? 'Rejected' : idx % 3 === 0 ? 'Submitted' : 'Approved',
      approver: 'Fatima Al-Otaibi', approvedDate: idx % 3 !== 0 ? '2026-09-05' : null,
      approvedBy: idx % 3 !== 0 ? 'Fatima Al-Otaibi' : null,
    }));
  }, [selectedMonth, selectedYear, monthTimesheets.length]);

  const handleApprove = (tsId) => {
    if (window.confirm('Approve this timesheet? This action will update the status to Approved.')) {
      approveTimesheet(tsId, 'Current User');
      forceUpdate();
    }
  };

  const handleReject = (tsId) => {
    if (window.confirm('Reject this timesheet? The resource will need to resubmit.')) {
      rejectTimesheet(tsId, 'Current User');
      forceUpdate();
    }
  };

  const prevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
    else setSelectedMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
    else setSelectedMonth(m => m + 1);
  };

  const tabStyle = (active) => ({
    padding: '10px 24px', borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
    border: 'none', borderBottom: active ? '3px solid var(--brand-primary)' : '3px solid transparent',
    background: active ? 'var(--bg-card)' : 'transparent', color: active ? 'var(--brand-primary)' : 'var(--text-tertiary)',
    fontWeight: active ? 700 : 500, fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'all 0.2s',
  });

  const statusBadge = (status) => {
    const colors = {
      'Approved': { bg: 'var(--color-green-bg)', color: 'var(--color-green)' },
      'Pending': { bg: 'var(--color-amber-bg)', color: 'var(--color-amber)' },
      'Submitted': { bg: 'var(--color-blue-bg)', color: 'var(--color-blue)' },
      'Rejected': { bg: 'var(--color-red-bg)', color: 'var(--color-red)' },
    };
    const sc = colors[status] || colors['Pending'];
    return <span style={{ padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 600, background: sc.bg, color: sc.color }}>{status}</span>;
  };

  return (
    <div style={{ padding: 'var(--space-xl)', animation: 'fadeInUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)' }}>Leave & Timesheet</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: '4px' }}>Leave management and monthly timesheet tracking</p>
      </div>

      {/* Month Selector */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'var(--space-lg)',
        background: 'var(--bg-card)', padding: '12px 20px', borderRadius: 'var(--radius-base)',
        border: '1px solid var(--border-secondary)', boxShadow: 'var(--card-shadow)',
      }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}><ChevronLeft size={20} /></button>
        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--brand-primary)', minWidth: '180px', textAlign: 'center' }}>
          {MONTHS[selectedMonth]} {selectedYear}
        </div>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}><ChevronRight size={20} /></button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-secondary)', marginBottom: 'var(--space-xl)' }}>
        <button style={tabStyle(activeTab === 'leave')} onClick={() => setActiveTab('leave')}>
          <Calendar size={14} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} /> Leave
        </button>
        <button style={tabStyle(activeTab === 'timesheet')} onClick={() => setActiveTab('timesheet')}>
          <Clock size={14} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} /> Timesheet
        </button>
      </div>

      {/* ── Leave Tab ── */}
      {activeTab === 'leave' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-xl)' }}>
          {/* Calendar */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid var(--border-secondary)', boxShadow: 'var(--card-shadow)' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Leave Calendar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} style={{ padding: '8px', textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)' }}>{d}</div>
              ))}
              {calendarDays.map((day, i) => {
                const dayLeaves = getDayLeaves(day);
                const isWeekend = day && (new Date(selectedYear, selectedMonth, day).getDay() === 5 || new Date(selectedYear, selectedMonth, day).getDay() === 6);
                return (
                  <div key={i} style={{
                    padding: '6px', minHeight: '60px', borderRadius: 'var(--radius-sm)',
                    background: day ? (isWeekend ? 'var(--bg-tertiary)' : 'var(--bg-secondary)') : 'transparent',
                    border: day ? '1px solid var(--border-secondary)' : 'none', transition: 'all 0.15s',
                    cursor: day ? 'pointer' : 'default',
                  }}>
                    {day && (
                      <>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: isWeekend ? 'var(--text-tertiary)' : 'var(--text-primary)', marginBottom: '2px' }}>{day}</div>
                        {dayLeaves.slice(0, 2).map((l, li) => (
                          <div key={li} style={{ fontSize: '9px', padding: '1px 4px', borderRadius: '2px', marginBottom: '1px', background: 'var(--color-blue-bg)', color: 'var(--color-blue)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.resourceName?.split(' ')[0]}</div>
                        ))}
                        {dayLeaves.length > 2 && <div style={{ fontSize: '9px', color: 'var(--text-tertiary)' }}>+{dayLeaves.length - 2} more</div>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leave Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '18px', border: '1px solid var(--border-secondary)', boxShadow: 'var(--card-shadow)' }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>Leave Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', background: 'var(--color-green-bg)' }}>
                  <p style={{ fontSize: '10px', color: 'var(--color-green)', fontWeight: 600 }}>Approved</p>
                  <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-green)' }}>{approvedLeaves.length}</p>
                </div>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', background: 'var(--color-amber-bg)' }}>
                  <p style={{ fontSize: '10px', color: 'var(--color-amber)', fontWeight: 600 }}>Pending</p>
                  <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-amber)' }}>{pendingLeaves.length}</p>
                </div>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', background: 'var(--color-red-bg)' }}>
                  <p style={{ fontSize: '10px', color: 'var(--color-red)', fontWeight: 600 }}>Rejected</p>
                  <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-red)' }}>{rejectedLeaves.length}</p>
                </div>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', background: 'var(--color-blue-bg)' }}>
                  <p style={{ fontSize: '10px', color: 'var(--color-blue)', fontWeight: 600 }}>Total Leave Days</p>
                  <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-blue)' }}>{approvedLeaves.reduce((s, l) => s + (l.days || 0), 0)}</p>
                </div>
              </div>
            </div>

            {/* Leave List */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '18px', border: '1px solid var(--border-secondary)', flex: 1, overflow: 'auto', maxHeight: '400px', boxShadow: 'var(--card-shadow)' }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Leave Records</h3>
              {monthLeaves.length === 0 ? (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', textAlign: 'center', padding: '20px' }}>No leave records for this month</p>
              ) : (
                monthLeaves.map(l => (
                  <div key={l.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{l.resourceName}</p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{l.leaveType} · {l.startDate} → {l.endDate} · {l.days} days</p>
                    </div>
                    {statusBadge(l.status)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Timesheet Tab ── */}
      {activeTab === 'timesheet' && (
        <div>
          {/* Timesheet KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
            {[
              { label: 'Total Timesheets', value: timesheetGrid.length, color: 'var(--brand-primary)' },
              { label: 'Approved', value: timesheetGrid.filter(t => t.status === 'Approved').length, color: 'var(--color-green)' },
              { label: 'Pending', value: timesheetGrid.filter(t => t.status === 'Pending' || t.status === 'Submitted').length, color: 'var(--color-amber)' },
              { label: 'Rejected', value: timesheetGrid.filter(t => t.status === 'Rejected').length, color: 'var(--color-red)' },
            ].map((kpi, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-base)', padding: '16px', border: '1px solid var(--border-secondary)', boxShadow: 'var(--card-shadow)' }}>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: '6px' }}>{kpi.label}</p>
                <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: kpi.color }}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Timesheet Table */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-secondary)', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Monthly Timesheet — {MONTHS[selectedMonth]} {selectedYear}
              </h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    {['Resource', 'Role', 'Assignment', 'Regular Hours', 'Overtime', 'Leave Days', 'Total Days', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-secondary)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timesheetGrid.map(ts => (
                    <tr key={ts.id} style={{ borderBottom: '1px solid var(--border-secondary)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>{ts.resourceName}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{ts.role}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{ts.assignment}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>{ts.regularHours}h</td>
                      <td style={{ padding: '10px 14px', color: ts.overtimeHours > 0 ? 'var(--color-amber)' : 'var(--text-tertiary)', fontWeight: ts.overtimeHours > 0 ? 600 : 400 }}>{ts.overtimeHours}h</td>
                      <td style={{ padding: '10px 14px', color: ts.leaveDays > 0 ? 'var(--color-blue)' : 'var(--text-tertiary)' }}>{ts.leaveDays}d</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>{ts.totalDays}</td>
                      <td style={{ padding: '10px 14px' }}>{statusBadge(ts.status)}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {(ts.status === 'Pending' || ts.status === 'Submitted') && (
                            <>
                              <button onClick={() => handleApprove(ts.id)} title="Approve Timesheet" style={{
                                padding: '4px 10px', borderRadius: 'var(--radius-md)', border: 'none',
                                background: 'var(--color-green)', color: 'white', cursor: 'pointer',
                                fontSize: 'var(--text-xs)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px',
                                transition: 'all 0.2s',
                              }} onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                                <Check size={12} /> Approve
                              </button>
                              <button onClick={() => handleReject(ts.id)} title="Reject Timesheet" style={{
                                padding: '4px 10px', borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-red)', background: 'transparent',
                                color: 'var(--color-red)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s',
                              }}>
                                <X size={12} /> Reject
                              </button>
                            </>
                          )}
                          {ts.status === 'Approved' && (
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle size={12} /> {ts.approvedDate || 'Approved'}
                            </span>
                          )}
                          {ts.status === 'Rejected' && (
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-red)' }}>Needs resubmission</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
