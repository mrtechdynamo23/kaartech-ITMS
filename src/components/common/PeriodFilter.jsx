/**
 * KaarTech ITMS Control Tower — Canonical Period Filter Component
 * 
 * Reusable dropdown supporting:
 * - All Periods
 * - YTD 2026
 * - Quarters (Q1, Q2, Q3, Q4 2026 - strictly 3 months each)
 * - Months (Jan 2026 through Dec 2026)
 */
import React from 'react';
import { Calendar } from 'lucide-react';
import FilterDropdown from './FilterDropdown';
import { PERIOD_OPTIONS, normalizePeriodKey } from '../../utils/periodUtils';

export default function PeriodFilter({
  value = 'all',
  onChange,
  minWidth = '160px',
  maxWidth = '220px',
  disabled = false,
  showIcon = true,
}) {
  const normalizedValue = normalizePeriodKey(value);

  return (
    <FilterDropdown
      value={normalizedValue}
      options={PERIOD_OPTIONS}
      onChange={onChange}
      placeholder="Select Period"
      icon={showIcon ? Calendar : null}
      minWidth={minWidth}
      maxWidth={maxWidth}
      disabled={disabled}
    />
  );
}
