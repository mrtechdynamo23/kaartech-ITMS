/**
 * KaarTech ITMS Control Tower — ServiceDomainFilter Component
 * Canonical reusable filter for selecting from the 7 primary RFP Service Domains.
 * Single source of truth consuming SERVICE_DOMAINS master (Section 24).
 */
import React from 'react';
import { Layers } from 'lucide-react';
import { SERVICE_DOMAINS } from '../../data/serviceDomains';

export default function ServiceDomainFilter({
  value = 'all',
  onChange,
  showAll = true,
  allLabel = 'All Service Domains (7)',
  minWidth = '180px',
  showIcon = false,
  style = {},
  className = '',
}) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', ...style }}>
      {showIcon && (
        <Layers
          size={14}
          style={{
            position: 'absolute',
            left: '10px',
            color: 'var(--brand-primary)',
            pointerEvents: 'none',
          }}
        />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        style={{
          padding: showIcon ? '8px 12px 8px 30px' : '8px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)',
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          minWidth,
          cursor: 'pointer',
          outline: 'none',
          transition: 'border-color 0.15s ease',
        }}
      >
        {showAll && <option value="all">{allLabel}</option>}
        {SERVICE_DOMAINS.map((domain) => (
          <option key={domain.id} value={domain.id}>
            {domain.id} — {domain.name}
          </option>
        ))}
      </select>
    </div>
  );
}
