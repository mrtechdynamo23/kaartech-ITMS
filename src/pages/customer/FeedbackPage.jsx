/**
 * KaarTech ITMS Control Tower — Customer Feedback & CSAT Dashboard
 * Route: /customer/feedback
 *
 * Executive-grade analytical CSAT score visualization and survey registry.
 * Dynamic period-aware CSAT recalculation (Q1-Q4, Monthly, YTD)
 * Percentage-based CSAT update modal with 100% validation.
 * Explicit formula: CSAT = Satisfied % + Very Satisfied %
 */
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  MessageSquare, Star, Smile, ThumbsUp, Award, TrendingUp,
  ShieldCheck, CheckCircle2, AlertTriangle, Filter, BarChart3,
  Plus, X, Calendar, Calculator, Check, Clock
} from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import PeriodFilter from '../../components/common/PeriodFilter';
import { isDateInPeriod, formatPeriodLabel } from '../../utils/periodUtils';
import { customerFeedback } from '../../data/demoData';

export default function FeedbackPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('All');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  // Custom period overrides entered via "Update CSAT" modal
  const [customPeriodOverrides, setCustomPeriodOverrides] = useState({});

  // Modal form state
  const [targetPeriod, setTargetPeriod] = useState('q2_2026');
  const [formVeryDissatisfied, setFormVeryDissatisfied] = useState(2);
  const [formDissatisfied, setFormDissatisfied] = useState(2);
  const [formNeutral, setFormNeutral] = useState(4);
  const [formSatisfied, setFormSatisfied] = useState(10);
  const [formVerySatisfied, setFormVerySatisfied] = useState(82);

  const formSum = Number(formVeryDissatisfied) + Number(formDissatisfied) + Number(formNeutral) + Number(formSatisfied) + Number(formVerySatisfied);
  const formCalculatedCsat = Number(formSatisfied) + Number(formVerySatisfied);
  const isFormValid = formSum === 100;

  const handleSaveCSAT = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setCustomPeriodOverrides(prev => ({
      ...prev,
      [targetPeriod]: {
        veryDissatisfied: Number(formVeryDissatisfied),
        dissatisfied: Number(formDissatisfied),
        neutral: Number(formNeutral),
        satisfied: Number(formSatisfied),
        verySatisfied: Number(formVerySatisfied),
      }
    }));

    setIsUpdateModalOpen(false);
    setSuccessBanner(`CSAT distribution updated for ${formatPeriodLabel(targetPeriod)}: Satisfied ${formSatisfied}% + Very Satisfied ${formVerySatisfied}% = CSAT ${formCalculatedCsat}%`);
    setTimeout(() => setSuccessBanner(null), 6000);
  };

  // Feedback records matching the selected period
  const periodFeedback = useMemo(() => {
    if (selectedPeriod === 'all') return customerFeedback;
    return customerFeedback.filter(f => isDateInPeriod(f.date, selectedPeriod));
  }, [selectedPeriod]);

  // Compute dynamic CSAT metrics from data layer or override
  const stats = useMemo(() => {
    const hasOverride = Boolean(customPeriodOverrides[selectedPeriod]);

    if (hasOverride) {
      const ov = customPeriodOverrides[selectedPeriod];
      const distribution = [
        { key: 'Very Satisfied', label: 'Very Satisfied', count: Math.round((ov.verySatisfied / 100) * (periodFeedback.length || 50)), pct: ov.verySatisfied, color: '#0D9F6E' },
        { key: 'Satisfied',      label: 'Satisfied',      count: Math.round((ov.satisfied / 100) * (periodFeedback.length || 50)), pct: ov.satisfied, color: '#2563EB' },
        { key: 'Neutral',        label: 'Neutral',        count: Math.round((ov.neutral / 100) * (periodFeedback.length || 50)), pct: ov.neutral, color: '#6366F1' },
        { key: 'Dissatisfied',   label: 'Dissatisfied',   count: Math.round((ov.dissatisfied / 100) * (periodFeedback.length || 50)), pct: ov.dissatisfied, color: '#D97706' },
        { key: 'Very Dissatisfied', label: 'Very Dissatisfied', count: Math.round((ov.veryDissatisfied / 100) * (periodFeedback.length || 50)), pct: ov.veryDissatisfied, color: '#DC2626' },
      ];
      // Explicit formula: CSAT = Satisfied % + Very Satisfied %
      const csatScore = ov.satisfied + ov.verySatisfied;

      return {
        total: periodFeedback.length || 50,
        csatScore,
        positiveRate: (ov.verySatisfied + ov.satisfied + ov.neutral).toFixed(1),
        distribution,
        targetScore: 90,
        trend: '+3.4% vs baseline',
        isOverride: true,
      };
    }

    if (periodFeedback.length === 0) {
      const distribution = [
        { key: 'Very Satisfied', label: 'Very Satisfied (Excellent)', tier: 'Very Satisfied', sub: 'Excellent', count: 0, pct: 0, color: '#0D9F6E' },
        { key: 'Satisfied',      label: 'Satisfied (Very Good)',      tier: 'Satisfied',      sub: 'Very Good',  count: 0, pct: 0, color: '#2563EB' },
        { key: 'Neutral',        label: 'Neutral (Good)',             tier: 'Neutral',        sub: 'Good',       count: 0, pct: 0, color: '#6366F1' },
        { key: 'Dissatisfied',   label: 'Dissatisfied (Average)',     tier: 'Dissatisfied',   sub: 'Average',    count: 0, pct: 0, color: '#D97706' },
        { key: 'Very Dissatisfied', label: 'Very Dissatisfied (Poor)', tier: 'Very Dissatisfied', sub: 'Poor',    count: 0, pct: 0, color: '#DC2626' },
      ];
      return {
        total: 0,
        csatScore: 0,
        positiveRate: '0.0',
        distribution,
        targetScore: 90,
        trend: 'Awaiting survey data',
        isOverride: false,
        noData: true,
      };
    }

    const total = periodFeedback.length;
    const vSatCount = periodFeedback.filter(f => f.rating === 'Excellent' || f.rating === 'Very Satisfied').length;
    const satCount = periodFeedback.filter(f => f.rating === 'Very Good' || f.rating === 'Satisfied').length;
    const neuCount = periodFeedback.filter(f => f.rating === 'Good' || f.rating === 'Neutral').length;
    const disCount = periodFeedback.filter(f => f.rating === 'Average' || f.rating === 'Dissatisfied').length;
    const vDisCount = periodFeedback.filter(f => f.rating === 'Poor' || f.rating === 'Very Dissatisfied').length;

    const vSatPct = Math.round((vSatCount / total) * 100);
    const satPct = Math.round((satCount / total) * 100);
    const neuPct = Math.round((neuCount / total) * 100);
    const disPct = Math.round((disCount / total) * 100);
    const vDisPct = Math.round((vDisCount / total) * 100);

    const distribution = [
      { key: 'Very Satisfied', label: 'Very Satisfied (Excellent)', tier: 'Very Satisfied', sub: 'Excellent', count: vSatCount, pct: vSatPct, color: '#0D9F6E' },
      { key: 'Satisfied',      label: 'Satisfied (Very Good)',      tier: 'Satisfied',      sub: 'Very Good',  count: satCount,  pct: satPct,  color: '#2563EB' },
      { key: 'Neutral',        label: 'Neutral (Good)',             tier: 'Neutral',        sub: 'Good',       count: neuCount,  pct: neuPct,  color: '#6366F1' },
      { key: 'Dissatisfied',   label: 'Dissatisfied (Average)',     tier: 'Dissatisfied',   sub: 'Average',    count: disCount,  pct: disPct,  color: '#D97706' },
      { key: 'Very Dissatisfied', label: 'Very Dissatisfied (Poor)', tier: 'Very Dissatisfied', sub: 'Poor',    count: vDisCount, pct: vDisPct, color: '#DC2626' },
    ];

    // Explicit formula per Item 40: CSAT = (Satisfied + Very Satisfied) / Total * 100
    const csatScore = Math.round(((vSatCount + satCount) / total) * 100);
    const positiveCount = vSatCount + satCount + neuCount;
    const positiveRate = ((positiveCount / total) * 100).toFixed(1);

    return {
      total: periodFeedback.length,
      csatScore,
      positiveRate,
      distribution,
      targetScore: 90,
      trend: csatScore >= 90 ? '+3.4% above SLA baseline' : '-1.2% below SLA baseline',
      isOverride: false,
      noData: false,
    };
  }, [periodFeedback, selectedPeriod, customPeriodOverrides]);

  // Monthly Breakdown (Dynamic calculation across months in selected period or quarter)
  const monthlyBreakdown = useMemo(() => {
    let monthsToEval = [];
    if (selectedPeriod === 'q1_2026') monthsToEval = ['2026-01', '2026-02', '2026-03'];
    else if (selectedPeriod === 'q2_2026') monthsToEval = ['2026-04', '2026-05', '2026-06'];
    else if (selectedPeriod === 'q3_2026') monthsToEval = ['2026-07', '2026-08', '2026-09'];
    else if (selectedPeriod === 'q4_2026') monthsToEval = ['2026-10', '2026-11', '2026-12'];
    else if (selectedPeriod === 'all' || selectedPeriod === 'ytd_2026') monthsToEval = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
    else monthsToEval = [selectedPeriod];

    return monthsToEval.map(mStr => {
      const monthFb = customerFeedback.filter(f => isDateInPeriod(f.date, mStr));
      const mTotal = monthFb.length;
      if (mTotal === 0) {
        return {
          monthKey: mStr,
          label: formatPeriodLabel(mStr),
          count: 0,
          csat: 0,
          noData: true,
        };
      }
      const mSat = monthFb.filter(f => ['Excellent', 'Very Good', 'Very Satisfied', 'Satisfied'].includes(f.rating)).length;
      const score = Math.round((mSat / mTotal) * 100);
      return {
        monthKey: mStr,
        label: formatPeriodLabel(mStr),
        count: mTotal,
        csat: score,
        noData: false,
      };
    });
  }, [selectedPeriod]);

  // Filtered table data by rating filter
  const filteredData = useMemo(() => {
    if (selectedRatingFilter === 'All') return periodFeedback;
    return periodFeedback.filter(f => {
      if (selectedRatingFilter === 'Very Satisfied' || selectedRatingFilter === 'Excellent') {
        return f.rating === 'Excellent' || f.rating === 'Very Satisfied';
      }
      if (selectedRatingFilter === 'Satisfied' || selectedRatingFilter === 'Very Good') {
        return f.rating === 'Very Good' || f.rating === 'Satisfied';
      }
      if (selectedRatingFilter === 'Neutral' || selectedRatingFilter === 'Good') {
        return f.rating === 'Good' || f.rating === 'Neutral';
      }
      if (selectedRatingFilter === 'Dissatisfied' || selectedRatingFilter === 'Average') {
        return f.rating === 'Average' || f.rating === 'Dissatisfied';
      }
      if (selectedRatingFilter === 'Very Dissatisfied' || selectedRatingFilter === 'Poor') {
        return f.rating === 'Poor' || f.rating === 'Very Dissatisfied';
      }
      return f.rating === selectedRatingFilter;
    });
  }, [periodFeedback, selectedRatingFilter]);

  const columns = [
    { key: 'id', label: 'Survey Ref', width: '120px' },
    {
      key: 'ticketId',
      label: 'Ticket Ref',
      width: '120px',
      render: (v) => <span style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>{v}</span>
    },
    { key: 'entity', label: 'Entity', width: '160px' },
    {
      key: 'rating',
      label: 'Rating',
      width: '150px',
      render: (val) => {
        let cls = 'badge-success';
        let displayLabel = val;
        if (val === 'Poor' || val === 'Very Dissatisfied') { cls = 'badge-error'; displayLabel = 'Very Dissatisfied'; }
        else if (val === 'Average' || val === 'Dissatisfied') { cls = 'badge-warning'; displayLabel = 'Dissatisfied'; }
        else if (val === 'Good' || val === 'Neutral') { cls = 'badge-info'; displayLabel = 'Neutral'; }
        else if (val === 'Very Good' || val === 'Satisfied') { cls = 'badge-primary'; displayLabel = 'Satisfied'; }
        else if (val === 'Excellent' || val === 'Very Satisfied') { cls = 'badge-success'; displayLabel = 'Very Satisfied'; }

        return (
          <span className={`badge ${cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
            {(val === 'Excellent' || val === 'Very Satisfied') && <Star size={12} fill="currentColor" />}
            {displayLabel}
          </span>
        );
      }
    },
    { key: 'comment', label: 'Verbatim Customer Feedback', wrap: true },
    { key: 'respondent', label: 'Stakeholder', width: '170px' },
    { key: 'date', label: 'Date', type: 'date', width: '120px' },
  ];

  return (
    <div className="feedback-page animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Customer Feedback & CSAT</h1>
            <span className="badge badge-primary">{stats.total} Verified Surveys</span>
            {stats.isOverride && <span className="badge badge-warning">Custom Distribution Active</span>}
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            Executive satisfaction indices, ratings distribution bands, and verbatim post-resolution feedback.
          </p>
        </div>

        {/* Action Controls: Period Filter + Update CSAT Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <PeriodFilter
            value={selectedPeriod}
            onChange={setSelectedPeriod}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              setTargetPeriod(selectedPeriod !== 'all' ? selectedPeriod : 'q2_2026');
              setIsUpdateModalOpen(true);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Update CSAT</span>
          </button>
        </div>
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

      {/* ─── PRIMARY EXECUTIVE CSAT SCORE VISUALIZATION TILE ─── */}
      <div
        className="csat-analytical-card border-thick-strategic"
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: '24px',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(107, 29, 42, 0.12)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', fontWeight: 700 }}>
                Executive Customer Satisfaction Index (CSAT) — {formatPeriodLabel(selectedPeriod)}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                Multi-tier satisfaction distribution across all contractual services
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#10B981',
                background: 'rgba(16, 185, 129, 0.12)',
                padding: '4px 10px',
                borderRadius: '9999px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              <TrendingUp size={13} /> {stats.trend}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                background: 'var(--bg-secondary)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-secondary)',
              }}
            >
              Target: ≥ {stats.targetScore}%
            </span>
          </div>
        </div>

        {/* Core Visualization Layout: Big Score + Horizontal Distribution Bands */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '28px',
            alignItems: 'center',
          }}
        >
          {/* Main Score Hero */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '20px 24px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-base)',
              border: '1px solid var(--border-secondary)',
            }}
          >
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 700 }}>
              Calculated CSAT Score
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {stats.noData ? '—' : `${stats.csatScore}%`}
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                CSAT
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
              {stats.noData ? (
                <>
                  <Clock size={16} style={{ color: 'var(--text-tertiary)' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>
                    No survey responses recorded for this period yet
                  </span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} style={{ color: stats.csatScore >= stats.targetScore ? '#10B981' : '#D97706' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: stats.csatScore >= stats.targetScore ? '#10B981' : '#D97706' }}>
                    {stats.csatScore >= stats.targetScore
                      ? `Contractual CSAT Benchmark Met (${stats.csatScore}% vs ${stats.targetScore}%)`
                      : `CSAT Below Benchmark (${stats.csatScore}% vs ${stats.targetScore}%)`}
                  </span>
                </>
              )}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginTop: 8,
              padding: '6px 10px',
              background: 'var(--bg-card)',
              borderRadius: '4px',
              border: '1px solid var(--border-primary)',
            }}>
              {stats.noData ? (
                <span><strong>Status:</strong> Future / unrecorded period — 0 survey responses recorded</span>
              ) : (
                <span><strong>Formula:</strong> CSAT = Satisfied % + Very Satisfied % = {stats.distribution[1].pct}% + {stats.distribution[0].pct}% = <strong>{stats.csatScore}%</strong></span>
              )}
            </div>
          </div>

          {/* Horizontal Score Distribution Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '195px minmax(100px, 1fr) 45px 65px',
              gap: 14,
              fontSize: '0.6875rem',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              fontWeight: 700,
              letterSpacing: '0.04em',
              padding: '0 8px 4px 8px'
            }}>
              <span>Satisfaction Tier</span>
              <span>Distribution</span>
              <span style={{ textAlign: 'right' }}>Share</span>
              <span style={{ textAlign: 'right' }}>Volume</span>
            </div>

            {stats.distribution.map((d) => (
              <div
                key={d.key}
                onClick={() => setSelectedRatingFilter(selectedRatingFilter === d.key ? 'All' : d.key)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '195px minmax(100px, 1fr) 45px 65px',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: selectedRatingFilter === d.key ? 'var(--bg-active)' : 'transparent',
                  border: selectedRatingFilter === d.key ? '1px solid var(--brand-primary)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
                title={`Click to filter by ${d.label}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                    {d.tier || d.key}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                    ({d.sub || d.label.split('(')[1]?.replace(')', '') || ''})
                  </span>
                </div>

                {/* Progress bar track */}
                <div
                  style={{
                    height: 10,
                    width: '100%',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 9999,
                    overflow: 'hidden',
                    border: '1px solid var(--border-secondary)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, Math.max(0, d.pct))}%`,
                      background: d.color,
                      borderRadius: 9999,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>

                {/* Percentage */}
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                  {d.pct}%
                </span>

                {/* Count badge */}
                <span
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-secondary)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {d.count} resp
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── DYNAMIC MONTHLY BREAKDOWN STRIP ─── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} color="var(--brand-primary)" />
            Monthly CSAT Breakdown ({formatPeriodLabel(selectedPeriod)})
          </h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Recalculated dynamically from underlying survey dates
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {monthlyBreakdown.map((m) => (
            <div
              key={m.monthKey}
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md, 8px)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-secondary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                {m.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: m.noData ? 'var(--text-tertiary)' : m.csat >= 90 ? 'var(--color-emerald)' : 'var(--color-amber)' }}>
                  {m.noData ? '—' : `${m.csat}%`}
                </span>
                <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                  {m.count} responses
                </span>
              </div>
              <div style={{ height: '4px', width: '100%', background: 'var(--border-primary)', borderRadius: '2px', overflow: 'hidden', marginTop: '8px' }}>
                <div style={{
                  height: '100%',
                  width: m.noData ? '0%' : `${m.csat}%`,
                  background: m.csat >= 90 ? 'var(--color-emerald)' : 'var(--color-amber)',
                  borderRadius: '2px',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── SECONDARY KPI STRIP ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div
          className="kpi-card"
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Positive Satisfaction Rate
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981', marginTop: 4 }}>
            {stats.positiveRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
            Very Satisfied, Satisfied & Neutral
          </div>
        </div>

        <div
          className="kpi-card"
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Average Resolution Quality
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
            4.8 <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ 5.0</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
            Rated on closure verification
          </div>
        </div>

        <div
          className="kpi-card"
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Survey Participation Rate
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
            86.4%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: 2, fontWeight: 600 }}>
            +11.4% above SLA baseline
          </div>
        </div>

        <div
          className="kpi-card"
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Critical Feedback / Escalations
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stats.distribution[3].count + stats.distribution[4].count > 0 ? '#F59E0B' : '#10B981', marginTop: 4 }}>
            {stats.distribution[3].count + stats.distribution[4].count} <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Surveys</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
            Actioned via Service Manager review
          </div>
        </div>
      </div>

      {/* ─── QUICK RATING FILTER PILLS ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Filter size={13} /> Filter Surveys:
        </span>
        {['All', 'Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'].map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedRatingFilter(tag)}
            style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: selectedRatingFilter === tag ? '1.5px solid var(--brand-primary)' : '1px solid var(--border-primary)',
              background: selectedRatingFilter === tag ? 'var(--brand-primary)' : 'var(--bg-card)',
              color: selectedRatingFilter === tag ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            {tag} {tag !== 'All' ? `(${customerFeedback.filter(f => f.rating === tag || (tag === 'Very Satisfied' && f.rating === 'Excellent') || (tag === 'Satisfied' && f.rating === 'Very Good') || (tag === 'Neutral' && f.rating === 'Good') || (tag === 'Dissatisfied' && f.rating === 'Average') || (tag === 'Very Dissatisfied' && f.rating === 'Poor')).length})` : `(${periodFeedback.length})`}
          </button>
        ))}
        {selectedRatingFilter !== 'All' && (
          <button
            type="button"
            onClick={() => setSelectedRatingFilter('All')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.75rem',
              color: 'var(--brand-primary)',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Response Table */}
      <DataTable
        title={`Customer Survey Responses ${selectedRatingFilter !== 'All' ? `(${selectedRatingFilter})` : ''} — ${formatPeriodLabel(selectedPeriod)}`}
        subtitle="Individual ticket feedback logged by end-users and process owners across KaarTech service domains."
        columns={columns}
        data={filteredData}
        exportFilename="kaartech-customer-feedback.csv"
      />

      {/* ─── UPDATE CSAT DISTRIBUTION MODAL ─── */}
      {isUpdateModalOpen && typeof document !== 'undefined' && createPortal(
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
          onClick={() => setIsUpdateModalOpen(false)}
        >
          <div
            className="modal-dialog-centered"
            style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: 'var(--radius-xl, 16px)',
              border: '2px solid var(--border-secondary, #e2e8f0)',
              boxShadow: 'var(--shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25))',
              maxWidth: '560px',
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
                  <Award size={18} color="var(--brand-primary)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Update CSAT Distribution
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                  Enter percentage-based categories totaling exactly 100%. CSAT = Satisfied % + Very Satisfied %.
                </p>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCSAT} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div className="modal-form-scrollable-body" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                {/* Target Period Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Target Reporting Period *
                  </label>
                  <select
                    value={targetPeriod}
                    onChange={(e) => setTargetPeriod(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    <option value="q1_2026">Q1 2026 (Jan – Mar)</option>
                    <option value="q2_2026">Q2 2026 (Apr – Jun)</option>
                    <option value="q3_2026">Q3 2026 (Jul – Sep)</option>
                    <option value="q4_2026">Q4 2026 (Oct – Dec)</option>
                    <option value="2026-04">April 2026</option>
                    <option value="2026-05">May 2026</option>
                    <option value="2026-06">June 2026</option>
                    <option value="2026-07">July 2026</option>
                    <option value="2026-08">August 2026</option>
                    <option value="2026-09">September 2026</option>
                  </select>
                </div>

                {/* Percentage Distribution Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Very Satisfied (%) *
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px' }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={formVerySatisfied}
                        onChange={(e) => setFormVerySatisfied(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-primary)',
                          textAlign: 'right',
                          fontWeight: 700,
                          fontSize: '13px',
                        }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-tertiary)' }}>%</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Satisfied (%) *
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px' }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={formSatisfied}
                        onChange={(e) => setFormSatisfied(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-primary)',
                          textAlign: 'right',
                          fontWeight: 700,
                          fontSize: '13px',
                        }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-tertiary)' }}>%</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Neutral (%) *
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px' }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={formNeutral}
                        onChange={(e) => setFormNeutral(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-primary)',
                          textAlign: 'right',
                          fontWeight: 700,
                          fontSize: '13px',
                        }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-tertiary)' }}>%</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Dissatisfied (%) *
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px' }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={formDissatisfied}
                        onChange={(e) => setFormDissatisfied(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-primary)',
                          textAlign: 'right',
                          fontWeight: 700,
                          fontSize: '13px',
                        }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-tertiary)' }}>%</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Very Dissatisfied (%) *
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px' }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={formVeryDissatisfied}
                        onChange={(e) => setFormVeryDissatisfied(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-primary)',
                          textAlign: 'right',
                          fontWeight: 700,
                          fontSize: '13px',
                        }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-tertiary)' }}>%</span>
                    </div>
                  </div>
                </div>

                {/* Validation Summary & Calculation Card */}
                <div style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: isFormValid ? 'rgba(21, 154, 106, 0.08)' : 'rgba(220, 38, 38, 0.08)',
                  border: `1.5px solid ${isFormValid ? 'var(--color-emerald)' : 'var(--color-red)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: isFormValid ? 'var(--color-emerald)' : 'var(--color-red)' }}>
                      {isFormValid ? '✓ Validation Passed: 100% Total' : `⚠️ Total Sum: ${formSum}% (Must Equal 100%)`}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Resulting CSAT = {formSatisfied}% + {formVerySatisfied}% = <strong>{formCalculatedCsat}%</strong>
                    </div>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isFormValid ? 'var(--color-emerald)' : 'var(--color-red)' }}>
                    {formSum}%
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-form-sticky-footer" style={{ padding: '14px 24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!isFormValid}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? 'pointer' : 'not-allowed' }}
                >
                  <Check size={14} />
                  <span>Save CSAT Distribution</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
