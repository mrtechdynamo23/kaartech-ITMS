/**
 * KaarTech ITMS Control Tower — FilterBar Component
 * Multi-dimensional filtering by Entity, Domain, Priority, Track, Status, Application.
 * Upgraded with custom FilterDropdowns (Section 21) and active filter badge counter (Section 22).
 */
import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import FilterDropdown from './FilterDropdown';
import { ENTITIES, APPLICATIONS, TRACKS } from '../../data/masterData';
import { SERVICE_DOMAINS } from '../../data/serviceDomains';

export default function FilterBar({
  filters = {},
  onChange,
  onReset,
  showServiceDomain = true,
  showEntity = true,
  showPriority = true,
  showTrack = false,
  showStatus = true,
  showApp = true,
  statusOptions = ['New', 'In Progress', 'Awaiting Info', 'Resolved', 'Closed'],
}) {
  const handleFilterChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'all' && v !== '').length;

  const serviceDomainOptions = [
    { value: 'all', label: 'All Service Domains (7)' },
    ...SERVICE_DOMAINS.map(sd => ({ value: sd.id, label: `${sd.id} — ${sd.shortName || sd.name}` }))
  ];

  const entityOptions = [
    { value: 'all', label: 'All Entities (34)' },
    ...ENTITIES.map(ent => ({ value: ent.name, label: ent.name }))
  ];


  const priorityOptions = [
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
