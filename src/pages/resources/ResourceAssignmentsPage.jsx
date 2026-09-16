/**
 * KaarTech ITMS Control Tower — Resource Assignments Page
 * Aligned with RFP Master Specification Section 13
 * 
 * Shows all current assignments connected to:
 * - Resource, Service Domain, Role, Level, Location, Status, Allocation
 * - Supports states: Planned, Mobilization, Active, On Leave, Ending, Completed, Replaced
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResourceManagement } from '../../data/resourceManagementStore';
import { SERVICE_DOMAINS, getServiceDomainById } from '../../data/serviceDomains';
import {
  Users, MapPin, Clock, Activity, Search, LayoutGrid, List,
  AlertTriangle, CheckCircle, Shield, ExternalLink
} from 'lucide-react';

const healthColors = {
  'Healthy': { bg: 'rgba(13, 159, 110, 0.12)', color: 'var(--color-green)', icon: '●' },
  'At Risk': { bg: 'rgba(220, 38, 38, 0.12)', color: 'var(--color-red)', icon: '▲' },
  'Warning': { bg: 'rgba(217, 119, 6, 0.12)', color: 'var(--color-amber)', icon: '◆' },
};

const statusColors = {
  'Active': { bg: 'rgba(13, 159, 110, 0.15)', color: 'var(--color-green)' },
  'Mobilization': { bg: 'rgba(124, 58, 237, 0.15)', color: '#7c3aed' },
  'Planned': { bg: 'rgba(37, 99, 235, 0.15)', color: 'var(--color-blue)' },
  'On Leave': { bg: 'rgba(217, 119, 6, 0.15)', color: 'var(--color-amber)' },
  'Ending': { bg: 'rgba(234, 88, 12, 0.15)', color: '#ea580c' },
  'Ending Soon': { bg: 'rgba(234, 88, 12, 0.15)', color: '#ea580c' },
  'Completed': { bg: 'var(--color-grey-bg)', color: 'var(--text-tertiary)' },
  'Replaced': { bg: 'rgba(220, 38, 38, 0.12)', color: 'var(--color-red)' },
};

export default function ResourceAssignmentsPage() {
  const navigate = useNavigate();
  const { assignments, getAssignmentKPIs } = useResourceManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('cards'); // 'cards' | 'table'
  const [healthFilter, setHealthFilter] = useState('All');
  const [domainFilter, setDomainFilter] = useState('All');

  const kpis = getAssignmentKPIs();

  const filtered = assignments.filter(a => {
    if (healthFilter !== 'All' && a.health !== healthFilter) return false;
    if (domainFilter !== 'All' && a.serviceDomainId !== domainFilter) return false;
    if (
      searchTerm &&
      !a.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !a.role.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const kpiCards = [
    { label: 'Total Assignments', value: kpis.total, color: 'var(--brand-primary)' },
    { label: 'Active', value: kpis.active, color: 'var(--color-green)' },
    { label: 'Ending Soon', value: kpis.endingSoon, color: 'var(--color-amber)' },
    { label: 'Avg Allocation', value: `${kpis.avgAllocation}%`, color: 'var(--color-blue)' },
    { label: 'Onsite Deployed', value: kpis.onsite, color: '#7c3aed' },
    { label: 'At Risk / Watch', value: kpis.atRisk, color: 'var(--color-red)' },
  ];

  return (
    <div style={{ padding: 'var(--space-xl)', animation: 'fadeInUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Resource Assignments
            </h1>
            <span className="badge badge-success">RFP SOW Governed</span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Operational pod deployment, SLA health alignment, and contractual allocation tracking
          </p>
        </div>

        <button
          onClick={() => navigate('/resources/requests')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--brand-primary)',
            color: 'white',
            border: 'none',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Request Assignment
        </button>
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

      {/* Filters & View Toggle */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', alignItems: 'center' }}>
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
            placeholder="Search by consultant or role..."
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

        {/* Health Filter */}
        <select
          value={healthFilter}
          onChange={e => setHealthFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-sm)',
          }}
        >
          <option value="All">All Health Statuses</option>
          <option value="Healthy">Healthy</option>
          <option value="At Risk">At Risk</option>
          <option value="Warning">Warning</option>
        </select>

        <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
          <button
            onClick={() => setView('cards')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              background: view === 'cards' ? 'var(--brand-primary-light)' : 'transparent',
              color: view === 'cards' ? 'var(--brand-primary)' : 'var(--text-tertiary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
            }}
          >
            <LayoutGrid size={14} /> Cards
          </button>
          <button
            onClick={() => setView('table')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              background: view === 'table' ? 'var(--brand-primary-light)' : 'transparent',
              color: view === 'table' ? 'var(--brand-primary)' : 'var(--text-tertiary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
            }}
          >
            <List size={14} /> Table
          </button>
        </div>
      </div>

      {/* Cards View */}
      {view === 'cards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: 'var(--space-md)' }}>
          {filtered.map(asg => {
            const hc = healthColors[asg.health] || healthColors['Healthy'];
            const sc = statusColors[asg.status] || statusColors['Active'];
            const sd = getServiceDomainById(asg.serviceDomainId) || { name: asg.serviceDomain || asg.tower };

            return (
              <div
                key={asg.id}
                onClick={() => asg.resourceId && navigate(`/resources/${asg.resourceId}`)}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px',
                  border: '1px solid var(--border-secondary)',
                  boxShadow: 'var(--card-shadow)',
                  transition: 'all 0.25s',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Health indicator bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: hc.color }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', marginTop: '4px' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {asg.resourceName}
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--brand-primary)', fontWeight: 600, marginTop: '2px' }}>
                      {asg.role} ({asg.level || 'L2'})
                    </p>
                  </div>
                  <span
                    style={{
                      padding: '3px 9px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '10px',
                      fontWeight: 700,
                      background: sc.bg,
                      color: sc.color,
                    }}
                  >
                    {asg.status}
                  </span>
                </div>

                {/* Service Domain Badge */}
                <div style={{ marginBottom: '10px' }}>
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
                    {sd.name}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>Location:</span> {asg.location}</div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>Track:</span> {asg.track}</div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>Service Domain:</span> {asg.serviceDomain || 'Core AMS'}</div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>Manager:</span> {asg.manager || 'Fatima Al-Otaibi'}</div>
                </div>

                {/* Allocation Bar */}
                <div style={{ marginTop: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Contractual Allocation</span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: asg.allocation < 100 ? 'var(--color-amber)' : 'var(--color-green)' }}>
                      {asg.allocation}%
                    </span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${asg.allocation}%`,
                        borderRadius: '3px',
                        background: asg.allocation < 100 ? 'var(--color-amber)' : 'var(--color-green)',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-secondary)', paddingTop: '8px' }}>
                  <span>{asg.startDate} → {asg.endDate}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: hc.color, fontWeight: 700 }}>
                    {hc.icon} {asg.health}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-secondary)', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)' }}>
                  {['Resource', 'Role', 'Level', 'Service Domain', 'Location', 'Track', 'Allocation', 'Status', 'SLA Health', 'Validity'].map(h => (
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
                {filtered.map(asg => {
                  const hc = healthColors[asg.health] || healthColors['Healthy'];
                  const sc = statusColors[asg.status] || statusColors['Active'];
                  const sd = getServiceDomainById(asg.serviceDomainId) || { name: asg.serviceDomain || asg.tower };

                  return (
                    <tr
                      key={asg.id}
                      onClick={() => asg.resourceId && navigate(`/resources/${asg.resourceId}`)}
                      style={{ borderBottom: '1px solid var(--border-secondary)', transition: 'background 0.15s', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {asg.resourceName}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{asg.role}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{asg.level}</td>
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
                          }}
                        >
                          {sd.name}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{asg.location}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{asg.track}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '48px', height: '5px', borderRadius: '3px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${asg.allocation}%`, background: asg.allocation < 100 ? 'var(--color-amber)' : 'var(--color-green)', borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{asg.allocation}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 600, background: sc.bg, color: sc.color }}>
                          {asg.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ color: hc.color, fontWeight: 700, fontSize: 'var(--text-xs)' }}>{hc.icon} {asg.health}</span>
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
                        {asg.startDate} → {asg.endDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-secondary)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Showing {filtered.length} of {assignments.length} assignments
          </div>
        </div>
      )}
    </div>
  );
}
