import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
}

interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDef<T> {
  key: keyof T | string;
  label: string;
  options: FilterOption[];
  filterFn?: (row: T, selectedValue: string) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  filters?: FilterDef<T>[];
  pageSize?: number;
  onRowClick?: (row: T) => void;
  onFilteredDataChange?: (filtered: T[]) => void;
  title?: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
  exportFilename?: string;
  maxHeight?: number | string;
  containerStyle?: React.CSSProperties;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder,
  searchKeys,
  filters = [],
  pageSize = 15,
  onRowClick,
  onFilteredDataChange,
  title,
  subtitle,
  actionButton,
  exportFilename,
  maxHeight = '540px',
  containerStyle,
}: DataTableProps<T>) {
  const { i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const defaultPlaceholder = searchPlaceholder || (isRtl ? 'بحث في السجلات...' : 'Search records...');

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Search Term Check
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        let matches = false;
        if (searchKeys && searchKeys.length > 0) {
          matches = searchKeys.some((k) => {
            const val = row[k];
            return val ? String(val).toLowerCase().includes(query) : false;
          });
        } else {
          matches = Object.values(row).some((val) =>
            val ? String(val).toLowerCase().includes(query) : false
          );
        }
        if (!matches) return false;
      }

      // Dropdown Filter Checks
      for (const filter of filters) {
        const filterKey = String(filter.key);
        const selectedVal = activeFilters[filterKey];
        if (selectedVal && selectedVal !== 'ALL') {
          if (filter.filterFn) {
            if (!filter.filterFn(row, selectedVal)) return false;
          } else {
            const rowVal = String(row[filter.key as keyof T] || '');
            if (rowVal !== selectedVal) return false;
          }
        }
      }

      return true;
    });
  }, [data, searchTerm, activeFilters, filters, searchKeys]);

  // Notify parent of filtered dataset change
  useEffect(() => {
    onFilteredDataChange?.(filteredData);
  }, [filteredData, onFilteredDataChange]);

  // Sorting Logic
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      return sortDirection === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key?: keyof T) => {
    if (!key) return;
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    if (sortedData.length === 0) return;
    const headers = columns.map(c => c.header).join(',');
    const rows = sortedData.map(row => {
      return columns.map(c => {
        const val = c.accessorKey ? row[c.accessorKey] : '';
        const escaped = String(val || '').replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',');
    });
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${exportFilename || 'ncgr_export'}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Table Header Controls */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border, #E2E8F0)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: 'var(--card-bg, #FFFFFF)',
        }}
      >
        <div>
          {title && (
            <h3 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text, #0F172A)' }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary, #475569)' }}>
              {subtitle} • {isRtl ? `عرض ${sortedData.length} سجل` : `Showing ${sortedData.length} records`}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: 220 }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: isRtl ? 'auto' : 10,
                right: isRtl ? 10 : 'auto',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary, #94A3B8)',
              }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={defaultPlaceholder}
              style={{
                width: '100%',
                padding: isRtl ? '8px 32px 8px 10px' : '8px 10px 8px 32px',
                fontSize: '0.8125rem',
                borderRadius: 6,
                border: '1px solid var(--border, #E2E8F0)',
                background: 'var(--input-bg, #F8FAFC)',
                color: 'var(--input-text, #0F172A)',
                outline: 'none',
              }}
            />
          </div>

          {/* Filter Dropdowns */}
          {filters.map((filter) => {
            const filterKey = String(filter.key);
            return (
              <select
                key={filterKey}
                value={activeFilters[filterKey] || 'ALL'}
                onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                style={{
                  padding: '8px 12px',
                  fontSize: '0.8125rem',
                  borderRadius: 6,
                  border: '1px solid var(--border, #E2E8F0)',
                  background: 'var(--surface, #FFFFFF)',
                  color: 'var(--text, #0F172A)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value="ALL">{isRtl ? `كل ${filter.label}` : `All ${filter.label}`}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            );
          })}

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              border: '1px solid var(--border, #E2E8F0)',
              background: 'var(--surface, #FFFFFF)',
              color: 'var(--text-secondary, #475569)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            title="Export CSV"
          >
            <Download size={14} />
            <span>{isRtl ? 'تصدير CSV' : 'Export'}</span>
          </button>

          {actionButton}
        </div>
      </div>

      {/* Table Container — Frozen Header & Contained Scroll */}
      <div
        className="data-table-scroll-container"
        style={{
          maxHeight: maxHeight,
          ...containerStyle,
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: isRtl ? 'right' : 'left',
            fontSize: '0.8125rem',
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid var(--border, #E2E8F0)',
              }}
            >
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => col.sortable !== false && handleSort(col.accessorKey)}
                  style={{
                    padding: '12px 16px',
                    fontWeight: 700,
                    color: 'var(--text-secondary, #475569)',
                    cursor: col.sortable !== false ? 'pointer' : 'default',
                    userSelect: 'none',
                    width: col.width,
                    whiteSpace: 'nowrap',
                    textAlign: isRtl ? 'right' : 'left',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: isRtl ? 'flex-start' : 'flex-start' }}>
                    <span>{col.header}</span>
                    {col.sortable !== false && col.accessorKey && sortKey === col.accessorKey && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: 'var(--text-tertiary, #94A3B8)',
                  }}
                >
                  {isRtl ? 'لا توجد سجلات مطابقة للبحث' : 'No matching records found'}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{
                    borderBottom: '1px solid var(--border, #E2E8F0)',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background 0.15s ease',
                  }}
                  className="data-table-row"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      style={{
                        padding: '12px 16px',
                        color: 'var(--text, #0F172A)',
                        verticalAlign: 'middle',
                        textAlign: isRtl ? 'right' : 'left',
                      }}
                    >
                      {col.cell
                        ? col.cell(row)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? '')
                        : ''}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border, #E2E8F0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--card-bg, #FFFFFF)',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary, #475569)',
          }}
        >
          <div>
            {isRtl
              ? `عرض ${(currentPage - 1) * pageSize + 1} إلى ${Math.min(currentPage * pageSize, sortedData.length)} من أصل ${sortedData.length} سجل`
              : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, sortedData.length)} of ${sortedData.length} entries`}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid var(--border, #E2E8F0)',
                background: 'var(--surface, #FFFFFF)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <span style={{ padding: '0 8px', fontWeight: 700 }}>
              {isRtl ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid var(--border, #E2E8F0)',
                background: 'var(--surface, #FFFFFF)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
