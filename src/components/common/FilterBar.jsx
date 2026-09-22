import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import FilterDropdown from './FilterDropdown';
import PeriodFilter from './PeriodFilter';
import { ENTITIES, APPLICATIONS, TRACKS } from '../../data/masterData';
import { SERVICE_DOMAINS } from '../../data/serviceDomains';

export default function FilterBar({
  filters = {},
  onChange,
  onReset,
  showPeriod = false,
  showRecordType = false,
  showServiceDomain = true,
  showEntity = true,
  showPriority = true,
  showTrack = false,
  showStatus = true,
  showApp = true,
  statusOptions = ['New', 'In Progress', 'Awaiting Info', 'Resolved', 'Closed'],
}) {
  const handleFilterChange = (key, value) => {
    // If user switches recordType to Service Request and current priority is P1/P2/P3, reset priority
    if (key === 'recordType' && value === 'Service Request' && ['P1', 'P2', 'P3'].includes(filters.priority)) {
      onChange({ ...filters, [key]: value, priority: 'all' });
      return;
    }
    onChange({ ...filters, [key]: value });
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'all' && v !== '').length;

  const recordTypeOptions = [
    { value: 'all', label: 'All Ticket Types' },
    { value: 'Incident', label: 'Incidents' },
    { value: 'Service Request', label: 'Service Requests' },
  ];

  const serviceDomainOptions = [
    { value: 'all', label: 'All Service Domains (7)' },
    ...SERVICE_DOMAINS.map(sd => ({ value: sd.id, label: `${sd.id} — ${sd.shortName || sd.name}` }))
  ];

  const entityOptions = [
    { value: 'all', label: 'All Entities (34)' },
    ...ENTITIES.map(ent => ({ value: ent.name, label: ent.name }))
  ];

  // Record-type aware priority options:
  // For Service Requests: P1/P2/P3 are not applicable per business rule; only P4 is permitted.
  const isSROnly = filters.recordType === 'Service Request';
  const priorityOptions = isSROnly
    ? [
        { value: 'all', label: 'All Priorities' },
        { value: 'P4', label: 'P4 - Low (Permitted for SR)' },
      ]
    : [
        { value: 'all', label: 'All Priorities' },
        { value: 'P1', label: 'P1 - Critical' },
        { value: 'P2', label: 'P2 - High' },
        { value: 'P3', label: 'P3 - Medium' },
        { value: 'P4', label: 'P4 - Low' },
      ];

  const statusDropdownOptions = [
    { value: 'all', label: 'All Statuses' },
    ...statusOptions.map(st => ({ value: st, label: st }))
  ];

  const trackOptions = [
    { value: 'all', label: 'All Tracks' },
    ...TRACKS.map(tr => ({ value: tr.key, label: `${tr.key} (${tr.location})` }))
  ];

  const appOptions = [
    { value: 'all', label: 'All Applications' },
    ...APPLICATIONS.filter(a => a.scope === 'In Scope').map(app => ({ value: app.name, label: app.name }))
  ];

  return (
    <div
      className="filter-bar"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
        padding: '10px 16px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-secondary)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginRight: '4px',
        }}
      >
        <Filter size={14} style={{ color: 'var(--brand-primary)' }} />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span
            style={{
              background: 'var(--brand-primary)',
              color: 'white',
              borderRadius: '10px',
              padding: '1px 6px',
              fontSize: '10px',
              fontWeight: 700,
            }}
          >
            · {activeFilterCount}
          </span>
        )}
      </div>

      {/* Period Filter */}
      {showPeriod && (
        <PeriodFilter
          value={filters.period || 'all'}
          onChange={(val) => handleFilterChange('period', val)}
          minWidth="160px"
          maxWidth="210px"
        />
      )}

      {/* Record Type Filter */}
      {showRecordType && (
        <FilterDropdown
          value={filters.recordType || 'all'}
          options={recordTypeOptions}
          onChange={(val) => handleFilterChange('recordType', val)}
          minWidth="140px"
          maxWidth="190px"
        />
      )}

      {/* Primary Service Domain Filter */}
      {showServiceDomain && (
        <FilterDropdown
          value={filters.serviceDomain || 'all'}
          options={serviceDomainOptions}
          onChange={(val) => handleFilterChange('serviceDomain', val)}
          minWidth="160px"
          maxWidth="220px"
        />
      )}

      {/* Entity Filter */}
      {showEntity && (
        <FilterDropdown
          value={filters.entity || 'all'}
          options={entityOptions}
          onChange={(val) => handleFilterChange('entity', val)}
          minWidth="140px"
          maxWidth="190px"
        />
      )}


      {/* Priority Filter */}
      {showPriority && (
        <FilterDropdown
          value={filters.priority || 'all'}
          options={priorityOptions}
          onChange={(val) => handleFilterChange('priority', val)}
          minWidth="120px"
          maxWidth="160px"
        />
      )}

      {/* Status Filter */}
      {showStatus && (
        <FilterDropdown
          value={filters.status || 'all'}
          options={statusDropdownOptions}
          onChange={(val) => handleFilterChange('status', val)}
          minWidth="120px"
          maxWidth="160px"
        />
      )}

      {/* Track Filter */}
      {showTrack && (
        <FilterDropdown
          value={filters.track || 'all'}
          options={trackOptions}
          onChange={(val) => handleFilterChange('track', val)}
          minWidth="130px"
          maxWidth="170px"
        />
      )}

      {/* Application Filter */}
      {showApp && (
        <FilterDropdown
          value={filters.app || 'all'}
          options={appOptions}
          onChange={(val) => handleFilterChange('app', val)}
          minWidth="140px"
          maxWidth="200px"
        />
      )}

      {/* Reset / Clear All Button */}
      {activeFilterCount > 0 && (
        <button
          onClick={onReset}
          className="btn btn-ghost btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: 'var(--text-xs)',
            color: 'var(--brand-primary)',
            marginLeft: 'auto',
            padding: '4px 8px',
            fontWeight: 600,
          }}
        >
          <RotateCcw size={12} />
          <span>Clear All</span>
        </button>
      )}
    </div>
  );
}
