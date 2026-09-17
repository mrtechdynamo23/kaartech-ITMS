/**
 * KaarTech ITMS Control Tower — Unified Global Calendar (Section 22 & 46)
 * Route: /calendar
 * 
 * Aggregates:
 * Leave, Audit, Audit Tasks, Program Milestones, Changes, Releases,
 * Meetings, Minutes of Meeting (MOM), MOM Actions, Transition Gates,
 * Training Clinics, Knowledge Reviews, SLA Reviews, Customer Corner,
 * and Critical Business Freezes.
 * 
 * Views: Month, Week, Day, Agenda.
 * Single source of truth with first-class MOM inspection and CTA tracking.
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  Calendar as CalendarIcon, Shield, Layers, Clock, AlertTriangle,
  FileText, CheckCircle2, ListChecks, GitPullRequest, Package,
  AlertOctagon, UserCheck, Flame, Plus, Search, Eye, X, ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SERVICE_DOMAINS } from '../../data/serviceDomains';

import { EVENT_TYPES, VIEW_MODES } from '../../components/calendar/calendarTypes';
import {
  normalizeCalendarEvents,
  getFilteredCalendarEvents,
} from '../../components/calendar/calendarEventAdapters';

import CalendarToolbar from '../../components/calendar/CalendarToolbar';
import CalendarFilterBar from '../../components/calendar/CalendarFilterBar';
import CalendarMonthView from '../../components/calendar/CalendarMonthView';
import CalendarWeekView from '../../components/calendar/CalendarWeekView';
import CalendarDayView from '../../components/calendar/CalendarDayView';
import CalendarAgendaView from '../../components/calendar/CalendarAgendaView';
import CalendarEventDetailModal from '../../components/calendar/CalendarEventDetailModal';
import CalendarMOMDetailModal from '../../components/calendar/CalendarMOMDetailModal';
import CalendarDayModal from '../../components/calendar/CalendarDayModal';

import './GlobalCalendarPage.css';

export default function GlobalCalendarPage() {
  const { language, isRTL } = useLanguage();

  // Anchor in September 2026 (Operational active quarter)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 15));
  const [viewMode, setViewMode] = useState(VIEW_MODES.MONTH);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);
  const [meetingEvents, setMeetingEvents] = useState([]);

  // All 15 categories active by default
  const [activeCategories, setActiveCategories] = useState(Object.values(EVENT_TYPES));

  // Modal states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dayModalState, setDayModalState] = useState({ isOpen: false, dateStr: null, events: [] });
  const [showMOMActionHub, setShowMOMActionHub] = useState(false);
  const [momHubFilter, setMomHubFilter] = useState('All');

  // 1. Single Source of Truth aggregation
  const allEvents = useMemo(() => {
    return normalizeCalendarEvents();
  }, []);

  // 2. Category counts for filter bar
  const categoryCounts = useMemo(() => {
    const counts = {};
    Object.values(EVENT_TYPES).forEach(k => {
      counts[k] = 0;
    });
    allEvents.forEach(e => {
      if (counts[e.type] !== undefined) {
        counts[e.type]++;
      }
    });
    return counts;
  }, [allEvents]);

  // 3. Filtered events based on multi-select categories and search query
  const filteredEvents = useMemo(() => {
    return getFilteredCalendarEvents(allEvents, activeCategories, searchQuery);
  }, [allEvents, activeCategories, searchQuery]);

  // 4. Executive KPI metrics
  const kpiMetrics = useMemo(() => {
    const momEvents = allEvents.filter(e => e.type === EVENT_TYPES.MOM);
    const momActions = allEvents.filter(e => e.type === EVENT_TYPES.MOM_ACTION);
    const overdueMomActions = momActions.filter(e => e.isOverdue);
    const changesAndReleases = allEvents.filter(e => e.type === EVENT_TYPES.CHANGE || e.type === EVENT_TYPES.RELEASE);
    const criticalFreezes = allEvents.filter(e => e.type === EVENT_TYPES.CRITICAL_BUSINESS_PERIOD);

    // Schedule vs Completed calculation
    const scheduledMeetings = allEvents.filter(e => e.type === EVENT_TYPES.MEETING || e.type === EVENT_TYPES.MOM);
    const completedMeetings = scheduledMeetings.filter(e => e.status === 'Completed' || e.status === 'completed');
    const scheduleVsCompletedPct = scheduledMeetings.length > 0
      ? Math.round((completedMeetings.length / scheduledMeetings.length) * 100)
      : 0;

    return {
      totalEvents: allEvents.length,
      momTotal: momEvents.length,
      openActions: momActions.filter(a => a.status === 'Open').length,
      overdueActions: overdueMomActions.length,
      changeAndReleaseTotal: changesAndReleases.length,
      freezeTotal: criticalFreezes.length,
      scheduleVsCompleted: scheduleVsCompletedPct,
      scheduledCount: scheduledMeetings.length,
      completedCount: completedMeetings.length,
    };
  }, [allEvents]);

  // Navigation handlers
  const handleNavigatePrev = useCallback(() => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (viewMode === VIEW_MODES.MONTH) {
        d.setMonth(d.getMonth() - 1);
      } else if (viewMode === VIEW_MODES.WEEK) {
        d.setDate(d.getDate() - 7);
      } else if (viewMode === VIEW_MODES.DAY) {
        d.setDate(d.getDate() - 1);
      } else {
        d.setMonth(d.getMonth() - 1);
      }
      return d;
    });
  }, [viewMode]);

  const handleNavigateNext = useCallback(() => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (viewMode === VIEW_MODES.MONTH) {
        d.setMonth(d.getMonth() + 1);
      } else if (viewMode === VIEW_MODES.WEEK) {
        d.setDate(d.getDate() + 7);
      } else if (viewMode === VIEW_MODES.DAY) {
        d.setDate(d.getDate() + 1);
      } else {
        d.setMonth(d.getMonth() + 1);
      }
      return d;
    });
  }, [viewMode]);

  const handleNavigateToday = useCallback(() => {
    // Navigate to today's date in 2026 simulation horizon
    setCurrentDate(new Date(2026, 8, 15));
  }, []);

  const handleSelectMonth = useCallback((year, month) => {
    setCurrentDate(new Date(year, month, 1));
  }, []);

  // Filter actions
  const handleToggleCategory = useCallback((catKey) => {
    setActiveCategories(prev => {
      if (prev.includes(catKey)) {
        // Deselect
        return prev.filter(k => k !== catKey);
      } else {
        // Select
        return [...prev, catKey];
      }
    });
  }, []);

  const handleSelectAllCategories = useCallback(() => {
    setActiveCategories(Object.values(EVENT_TYPES));
  }, []);

  const handleClearAllCategories = useCallback(() => {
    setActiveCategories([]);
  }, []);

  // Modal openers
  const handleSelectEvent = useCallback((ev) => {
    setSelectedEvent(ev);
  }, []);

  const handleOpenDayModal = useCallback((dateStr, dayEvents) => {
    setDayModalState({
      isOpen: true,
      dateStr,
      events: dayEvents,
    });
  }, []);

  const handleCloseDayModal = useCallback(() => {
    setDayModalState({ isOpen: false, dateStr: null, events: [] });
  }, []);

  const handleCloseEventModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const isMOMEvent = selectedEvent && (
    selectedEvent.type === EVENT_TYPES.MOM ||
    selectedEvent.type === EVENT_TYPES.MOM_ACTION
  );

  return (
    <div className="global-calendar-page animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <div className="cal-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div className="cal-title-lockup">
          <div className="cal-title-icon-badge">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h1 className="cal-page-title">
              {language === 'ar' ? 'التقويم التشغيلي العام والتحكم' : 'Global Control Tower Calendar'}
            </h1>
            <p className="cal-page-subtitle">
              {language === 'ar'
                ? 'لوحة تحكم تشغيلية موحدة تجمع بين التدقيق، محاضر الاجتماعات (MOM)، الإجازات، الإصدارات، والتجميدات الحرجة'
                : 'Unified operational timeline aggregating Audits, MOMs, Action Items, Approved Leave, CAB Changes, and Freezes.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateMeeting(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: 'var(--radius-md)',
            background: 'var(--brand-primary)', color: 'white',
            border: 'none', cursor: 'pointer', fontWeight: 700,
            fontSize: 'var(--text-xs)', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          <Plus size={14} /> Create Meeting
        </button>
      </div>

      {/* Top Executive KPI Strip */}
      <div className="cal-kpi-strip">
        <div className="cal-kpi-card">
          <div className="cal-kpi-info">
            <span className="cal-kpi-title">Total Active Events</span>
            <span className="cal-kpi-value">{kpiMetrics.totalEvents}</span>
            <span className="cal-kpi-sub">Across 15 categories</span>
          </div>
          <div className="cal-kpi-icon" style={{ background: 'rgba(37, 99, 235, 0.15)', color: '#2563EB' }}>
            <Layers size={18} />
          </div>
        </div>

        <div className="cal-kpi-card" style={{ cursor: 'pointer' }} onClick={() => {
          setMomHubFilter('All');
          setShowMOMActionHub(true);
        }}>
          <div className="cal-kpi-info">
            <span className="cal-kpi-title">MOM Action Hub</span>
            <span className="cal-kpi-value">{kpiMetrics.momTotal} MOMs</span>
            <span className="cal-kpi-sub">{kpiMetrics.openActions} Open Action Items</span>
          </div>
          <div className="cal-kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366F1' }}>
            <FileText size={18} />
          </div>
        </div>

        <div className={`cal-kpi-card ${kpiMetrics.overdueActions > 0 ? 'alert-critical' : ''}`} style={{ cursor: 'pointer' }} onClick={() => {
          setMomHubFilter('Overdue');
          setShowMOMActionHub(true);
        }}>
          <div className="cal-kpi-info">
            <span className="cal-kpi-title">Overdue MOMs</span>
            <span className="cal-kpi-value" style={{ color: kpiMetrics.overdueActions > 0 ? '#DC2626' : '#10B981' }}>
              {kpiMetrics.overdueActions} Critical
            </span>
            <span className="cal-kpi-sub">Requires immediate SteerCom CTA</span>
          </div>
          <div className="cal-kpi-icon" style={{ background: 'rgba(220, 38, 38, 0.15)', color: '#DC2626' }}>
            <AlertOctagon size={18} />
          </div>
        </div>

        <div className="cal-kpi-card">
          <div className="cal-kpi-info">
            <span className="cal-kpi-title">CAB Releases and Changes</span>
            <span className="cal-kpi-value">{kpiMetrics.changeAndReleaseTotal}</span>
            <span className="cal-kpi-sub">Approved production windows</span>
          </div>
          <div className="cal-kpi-icon" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#7C3AED' }}>
            <Package size={18} />
          </div>
        </div>

        <div className="cal-kpi-card" style={{ cursor: 'pointer' }} onClick={() => {
          setActiveCategories([EVENT_TYPES.MEETING, EVENT_TYPES.MOM]);
        }}>
          <div className="cal-kpi-info">
            <span className="cal-kpi-title">Schedule vs Completed</span>
            <span className="cal-kpi-value" style={{ color: kpiMetrics.scheduleVsCompleted >= 80 ? '#10B981' : '#D97706' }}>
              {kpiMetrics.scheduleVsCompleted}%
            </span>
            <span className="cal-kpi-sub">{kpiMetrics.completedCount} of {kpiMetrics.scheduledCount} meetings</span>
          </div>
          <div className="cal-kpi-icon" style={{ background: 'rgba(13, 159, 110, 0.15)', color: '#0D9F6E' }}>
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* Calendar Toolbar */}
      <CalendarToolbar
        currentDate={currentDate}
        viewMode={viewMode}
        searchQuery={searchQuery}
        totalEventsCount={filteredEvents.length}
        onNavigatePrev={handleNavigatePrev}
        onNavigateNext={handleNavigateNext}
        onNavigateToday={handleNavigateToday}
        onSelectMonth={handleSelectMonth}
        onChangeViewMode={setViewMode}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        isRTL={isRTL}
      />

      {/* 15-Category Filter Bar */}
      <CalendarFilterBar
        activeCategories={activeCategories}
        categoryCounts={categoryCounts}
        onToggleCategory={handleToggleCategory}
        onSelectAll={handleSelectAllCategories}
        onClearAll={handleClearAllCategories}
      />

      {/* Main View Container */}
      <div className="cal-view-viewport">
        {viewMode === VIEW_MODES.MONTH && (
          <CalendarMonthView
            currentDate={currentDate}
            events={filteredEvents}
            selectedDate={null}
            onSelectEvent={handleSelectEvent}
            onOpenDayModal={handleOpenDayModal}
            isRTL={isRTL}
          />
        )}

        {viewMode === VIEW_MODES.WEEK && (
          <CalendarWeekView
            currentDate={currentDate}
            events={filteredEvents}
            onSelectEvent={handleSelectEvent}
            onOpenDayModal={handleOpenDayModal}
          />
        )}

        {viewMode === VIEW_MODES.DAY && (
          <CalendarDayView
            currentDate={currentDate}
            events={filteredEvents}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {viewMode === VIEW_MODES.AGENDA && (
          <CalendarAgendaView
            currentDate={currentDate}
            events={filteredEvents}
            onSelectEvent={handleSelectEvent}
          />
        )}
      </div>

      {/* Day Events Modal (when clicking on a day or "+X more") */}
      {dayModalState.isOpen && (
        <CalendarDayModal
          dateStr={dayModalState.dateStr}
          events={dayModalState.events}
          onClose={handleCloseDayModal}
          onSelectEvent={handleSelectEvent}
        />
      )}

      {/* Event Detail Modal (MOM Dedicated or General) */}
      {selectedEvent && (
        isMOMEvent ? (
          <CalendarMOMDetailModal
            event={selectedEvent}
            onClose={handleCloseEventModal}
          />
        ) : (
          <CalendarEventDetailModal
            event={selectedEvent}
            onClose={handleCloseEventModal}
          />
        )
      )}

      {/* Create Meeting Modal */}
      {showCreateMeeting && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeInUp 0.2s ease',
        }} onClick={e => { if (e.target === e.currentTarget) setShowCreateMeeting(false); }}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-xl)',
            width: '90%', maxWidth: '580px', padding: '24px', maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                <CalendarIcon size={18} style={{ color: 'var(--brand-primary)', marginRight: '8px', verticalAlign: 'middle' }} />
                Create / Schedule Meeting
              </h2>
              <button onClick={() => setShowCreateMeeting(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: '18px' }}>×</button>
            </div>
            <CreateMeetingForm onClose={() => setShowCreateMeeting(false)} onCreated={(mtg) => {
              setMeetingEvents(prev => [...prev, mtg]);
              setShowCreateMeeting(false);
            }} />
          </div>
        </div>
      )}

      {/* MOM Action Hub Modal (Section 29) */}
      {showMOMActionHub && (
        <MOMActionHubModal
          isOpen={showMOMActionHub}
          onClose={() => setShowMOMActionHub(false)}
          events={allEvents}
          initialFilter={momHubFilter}
          onSelectEvent={(ev) => {
            setSelectedEvent(ev);
            setShowMOMActionHub(false);
          }}
        />
      )}
    </div>
  );
}

// ── MOM Action Hub Modal (Section 29: Functional MOM/Action View) ──
function MOMActionHubModal({ isOpen, onClose, events, initialFilter = 'All', onSelectEvent }) {
  const [filter, setFilter] = useState(initialFilter);
  const [search, setSearch] = useState('');

  // Extract all MOM action items
  const actionItems = useMemo(() => {
    return events
      .filter(e => e.type === EVENT_TYPES.MOM_ACTION)
      .map(e => {
        const isOverdue = e.isOverdue || (e.endDate && new Date(e.endDate) < new Date('2026-09-01') && e.status !== 'Completed');
        return {
          id: e.id,
          meetingRef: e.metadata?.meetingRef || e.metadata?.momId || 'MOM-REV',
          meetingTitle: e.metadata?.meetingTitle || e.meetingTitle || 'Weekly Service Review (WSR)',
          meetingDate: e.metadata?.meetingDate || (e.startDate ? e.startDate.slice(0, 10) : '2026-08-25'),
          actionItem: e.description || e.title?.replace(/^MOM Action\s*[—–-]\s*/i, ''),
          owner: e.metadata?.owner || e.organizer || 'Sara Al Marzouqi',
          dueDate: (e.endDate ? e.endDate.slice(0, 10) : e.startDate ? e.startDate.slice(0, 10) : '2026-09-05'),
          priority: e.metadata?.priority || (isOverdue ? 'Critical' : 'High'),
          status: isOverdue ? 'Overdue' : (e.status === 'Completed' ? 'Completed' : 'Open'),
          event: e,
        };
      });
  }, [events]);

  const filteredItems = useMemo(() => {
    return actionItems.filter(item => {
      if (filter === 'Open' && item.status === 'Completed') return false;
      if (filter === 'Overdue' && item.status !== 'Overdue') return false;
      if (filter === 'Completed' && item.status !== 'Completed') return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = item.meetingTitle.toLowerCase().includes(q);
        const matchAction = item.actionItem.toLowerCase().includes(q);
        const matchOwner = item.owner.toLowerCase().includes(q);
        const matchRef = item.meetingRef.toLowerCase().includes(q);
        if (!matchTitle && !matchAction && !matchOwner && !matchRef) return false;
      }
      return true;
    });
  }, [actionItems, filter, search]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="card"
        style={{
          width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto',
          padding: 0, boxShadow: 'var(--shadow-xl)', animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                MOM Action Hub & Tracking Ledger
              </h2>
              <span className="badge badge-primary">{filteredItems.length} Action Items</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Contractual governance action items derived from Minutes of Meetings, SteerCom reviews, and operational handovers.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Filter Controls */}
        <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border-secondary)', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search Action, Meeting, Owner..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '6px 10px 6px 30px', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)',
                color: 'var(--text-primary)', fontSize: 'var(--text-xs)',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'Open', 'Overdue', 'Completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '5px 12px', borderRadius: 'var(--radius-sm)',
                  border: filter === f ? '1px solid var(--brand-primary)' : '1px solid var(--border-primary)',
                  background: filter === f ? 'rgba(107, 29, 42, 0.1)' : 'transparent',
                  color: filter === f ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontSize: 'var(--text-xs)', fontWeight: filter === f ? 700 : 500, cursor: 'pointer',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Action Table (Section 29: Meeting, Meeting Date, Meeting Title, Action Item, Owner, Due Date, Priority, Status) */}
        <div style={{ overflowX: 'auto', padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-primary)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Meeting / Ref</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Meeting Date</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Meeting Title</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Action Item</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Owner</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Due Date</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Priority</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-primary)' }}>
                    {item.meetingRef}
                  </td>
                  <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                    {item.meetingDate}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '180px' }}>
                    {item.meetingTitle}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', maxWidth: '240px', lineHeight: 1.3 }}>
                    {item.actionItem}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                    {item.owner}
                  </td>
                  <td style={{ padding: '12px 14px', whiteSpace: 'nowrap', fontWeight: 600, color: item.status === 'Overdue' ? 'var(--color-red)' : 'var(--text-primary)' }}>
                    {item.dueDate}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className={`badge ${item.priority === 'Critical' ? 'badge-danger' : item.priority === 'High' ? 'badge-warning' : 'badge-primary'}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className={`badge ${item.status === 'Overdue' ? 'badge-danger' : item.status === 'Completed' ? 'badge-success' : 'badge-neutral'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <button
                      onClick={() => onSelectEvent(item.event)}
                      style={{
                        padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)',
                        background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600,
                      }}
                    >
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px', borderRadius: 'var(--radius-md)', border: 'none',
              background: 'var(--brand-primary)', color: 'white', fontWeight: 700, fontSize: 'var(--text-xs)', cursor: 'pointer',
            }}
          >
            Close Action Hub
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Create Meeting Form (Section 30: Functional Scheduling Modal) ──
function CreateMeetingForm({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    type: 'Governance',
    serviceDomainId: 'TWR-07',
    serviceDomain: 'Service Management, Governance, and Delivery',
    date: '2026-09-20',
    startTime: '10:00',
    endTime: '11:00',
    location: 'Riyadh HQ - Boardroom A / Microsoft Teams',
    organizer: 'Sara Al Marzouqi (AMS Delivery Manager)',
    participants: 'Service Manager, SLA Lead, Customer PM, Enterprise Solutions Lead',
    description: 'Quarterly operational review and contractual SLA performance walk-through.',
  });

  const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const matchedDomain = SERVICE_DOMAINS.find(d => d.id === form.serviceDomainId);

    const newMeeting = {
      id: `MTG-NEW-${Date.now()}`,
      title: form.title,
      type: 'MEETING',
      meetingType: form.type,
      serviceDomainId: form.serviceDomainId,
      serviceDomain: matchedDomain ? matchedDomain.name : form.serviceDomain,
      date: form.date,
      startDate: `${form.date}T${form.startTime}:00`,
      endDate: `${form.date}T${form.endTime}:00`,
      time: `${form.startTime} - ${form.endTime}`,
      location: form.location,
      organizer: form.organizer,
      participants: form.participants.split(',').map(p => p.trim()).filter(Boolean),
      description: form.description,
      status: 'Scheduled',
    };

    onCreated(newMeeting);
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-primary)', background: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontSize: 'var(--text-sm)',
  };
  const labelStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={labelStyle}>Meeting Title *</label>
        <input style={inputStyle} value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g. Weekly SLA Governance Review" required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Meeting Type</label>
          <select style={inputStyle} value={form.type} onChange={e => handleChange('type', e.target.value)}>
            <option value="Governance">Governance Review</option>
            <option value="SteerCom">SteerCom</option>
            <option value="Operational Review">Operational Review</option>
            <option value="SLA Review">SLA Review</option>
            <option value="MOM Follow-up">MOM Follow-up</option>
            <option value="Training">Training Clinic</option>
            <option value="Ad-hoc">Ad-hoc Coordination</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Primary Service Domain</label>
          <select
            style={inputStyle}
            value={form.serviceDomainId}
            onChange={e => {
              const dId = e.target.value;
              const d = SERVICE_DOMAINS.find(dm => dm.id === dId);
              setForm(prev => ({ ...prev, serviceDomainId: dId, serviceDomain: d ? d.name : '' }));
            }}
          >
            {SERVICE_DOMAINS.map(d => (
              <option key={d.id} value={d.id}>{d.id} — {d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Date *</label>
          <input style={inputStyle} type="date" value={form.date} onChange={e => handleChange('date', e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>Start Time (AST)</label>
          <input style={inputStyle} type="time" value={form.startTime} onChange={e => handleChange('startTime', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>End Time (AST)</label>
          <input style={inputStyle} type="time" value={form.endTime} onChange={e => handleChange('endTime', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Location / Meeting Link</label>
          <input style={inputStyle} value={form.location} onChange={e => handleChange('location', e.target.value)} placeholder="Room or Teams link" />
        </div>
        <div>
          <label style={labelStyle}>Organizer</label>
          <input style={inputStyle} value={form.organizer} onChange={e => handleChange('organizer', e.target.value)} placeholder="e.g. Sara Al Marzouqi" />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Participants (comma-separated)</label>
        <input style={inputStyle} value={form.participants} onChange={e => handleChange('participants', e.target.value)} placeholder="Service Manager, SLA Lead, Customer PM" />
      </div>

      <div>
        <label style={labelStyle}>Description / Agenda</label>
        <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Meeting agenda, deliverables, and objectives..." />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
        <button type="button" onClick={onClose} style={{
          padding: '8px 16px', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)',
          color: 'var(--text-primary)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600,
        }}>Cancel</button>
        <button type="submit" style={{
          padding: '8px 20px', borderRadius: 'var(--radius-md)',
          border: 'none', background: 'var(--brand-primary)', color: 'white',
          cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 700,
        }}>Schedule Meeting</button>
      </div>
    </form>
  );
}
