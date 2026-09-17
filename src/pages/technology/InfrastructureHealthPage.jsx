/**
 * KaarTech ITMS Control Tower — Infrastructure Health Page
 * Route: /technology/infrastructure-health
 *
 * Provides real-time infrastructure telemetry, health monitoring,
 * estate inventory, node utilization, and deep node inspection.
 */
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Server, Cpu, HardDrive, Network, Database, Cloud, Monitor, Shield,
  AlertTriangle, CheckCircle2, XCircle, Clock, Activity, Search, Filter,
  RotateCcw, Eye, X, Check, ArrowUpRight, Layers, Tag, MapPin, Laptop,
  Wifi, HelpCircle, Wrench, ChevronRight, Copy, ExternalLink
} from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import {
  infraNodes,
  getInfraStats,
  INFRA_ASSET_TYPES,
  INFRA_TOWERS,
  INFRA_STATUSES,
  INFRA_CRITICALITIES
} from '../../data/infrastructureHealth';

const CATEGORIES = [
  { id: 'all', label: 'All Estate', icon: Layers },
  { id: 'compute', label: 'Compute & Servers', icon: Server, filter: n => n.type === 'Compute Server' },
  { id: 'storage', label: 'Storage', icon: HardDrive, filter: n => n.type === 'Storage Array' },
  { id: 'network', label: 'Network & Security', icon: Network, filter: n => n.tower === 'Network' || n.tower === 'Security' },
  { id: 'database', label: 'Database', icon: Database, filter: n => n.tower === 'Database' },
  { id: 'vm', label: 'Virtual Machines', icon: Cpu, filter: n => n.type === 'Virtual Machine' },
  { id: 'cloud', label: 'Cloud Infrastructure', icon: Cloud, filter: n => n.tower === 'Cloud' },
  { id: 'workplace', label: 'Digital Workplace', icon: Monitor, filter: n => n.tower === 'Digital Workplace' },
];

const statusStyles = {
  Healthy: {
    bg: 'rgba(13, 159, 110, 0.12)',
    color: 'var(--color-green, #0D9F6E)',
    border: 'rgba(13, 159, 110, 0.3)',
    icon: CheckCircle2,
  },
  Warning: {
    bg: 'rgba(217, 119, 6, 0.12)',
    color: 'var(--color-amber, #D97706)',
    border: 'rgba(217, 119, 6, 0.3)',
    icon: AlertTriangle,
  },
  Critical: {
    bg: 'rgba(220, 38, 38, 0.12)',
    color: 'var(--color-red, #DC2626)',
    border: 'rgba(220, 38, 38, 0.3)',
    icon: XCircle,
  },
  Maintenance: {
    bg: 'rgba(124, 58, 237, 0.12)',
    color: '#7C3AED',
    border: 'rgba(124, 58, 237, 0.3)',
    icon: Wrench,
  },
};

const criticalityStyles = {
  'Tier 1': { bg: 'rgba(220, 38, 38, 0.10)', color: 'var(--color-red, #DC2626)' },
  'Tier 2': { bg: 'rgba(217, 119, 6, 0.10)', color: 'var(--color-amber, #D97706)' },
  'Tier 3': { bg: 'rgba(37, 99, 235, 0.10)', color: 'var(--color-blue, #2563EB)' },
};

export default function InfrastructureHealthPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [towerFilter, setTowerFilter] = useState('All');
  const [criticalityFilter, setCriticalityFilter] = useState('All');
  const [selectedNode, setSelectedNode] = useState(null);
  const [copiedIp, setCopiedIp] = useState(false);

  // Dynamic KPI Stats derived from canonical dataset
  const stats = useMemo(() => getInfraStats(infraNodes), []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: infraNodes.length };
    CATEGORIES.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = infraNodes.filter(cat.filter).length;
      }
    });
    return counts;
  }, []);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return infraNodes.filter(node => {
      // Category filter
      if (activeCategory !== 'all') {
        const catObj = CATEGORIES.find(c => c.id === activeCategory);
        if (catObj && catObj.filter && !catObj.filter(node)) return false;
      }

      // Status filter
      if (statusFilter !== 'All' && node.status !== statusFilter) return false;

      // Asset Type filter
      if (typeFilter !== 'All' && node.type !== typeFilter) return false;

      // Tower filter
      if (towerFilter !== 'All' && node.tower !== towerFilter) return false;

      // Criticality filter
      if (criticalityFilter !== 'All' && node.criticality !== criticalityFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          node.id.toLowerCase().includes(q) ||
          node.name.toLowerCase().includes(q) ||
          node.type.toLowerCase().includes(q) ||
          node.tower.toLowerCase().includes(q) ||
          node.location.toLowerCase().includes(q) ||
          node.ipAddress.toLowerCase().includes(q) ||
          node.assignedService.toLowerCase().includes(q) ||
          node.owner.toLowerCase().includes(q) ||
          node.modelOrFamily.toLowerCase().includes(q) ||
          node.osVersion.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [activeCategory, statusFilter, typeFilter, towerFilter, criticalityFilter, searchQuery]);

  const hasActiveFilters =
    activeCategory !== 'all' ||
    statusFilter !== 'All' ||
    typeFilter !== 'All' ||
    towerFilter !== 'All' ||
    criticalityFilter !== 'All' ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setActiveCategory('all');
    setStatusFilter('All');
    setTypeFilter('All');
    setTowerFilter('All');
    setCriticalityFilter('All');
    setSearchQuery('');
  };

  const handleCopyIp = (ip) => {
    navigator.clipboard?.writeText(ip);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  // Keyboard shortcut (ESC to close) and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedNode(null);
    };
    if (selectedNode) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedNode]);

  const getUtilColor = (val) => {
    if (val >= 80) return 'var(--color-red, #DC2626)';
    if (val >= 65) return 'var(--color-amber, #D97706)';
    return 'var(--color-green, #0D9F6E)';
  };

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <Server size={22} style={{ color: 'var(--brand-primary)' }} />
          <h1 className="page-title" style={{ margin: 0 }}>Infrastructure Health</h1>
          <span className="badge badge-primary">KAARTECH ITMS</span>
        </div>
        <p className="page-subtitle" style={{ margin: 0 }}>
          Real-time telemetry, node utilization, estate inventory, and health governance across physical, virtual, and cloud assets
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        {/* Monitored Nodes */}
        <div
          className="card"
          style={{
            padding: '16px',
            borderLeft: '3px solid var(--brand-primary)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onClick={() => { setStatusFilter('All'); setActiveCategory('all'); }}
        >
          <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
            Monitored Nodes
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            Physical, Virtual & Cloud
          </div>
        </div>

        {/* Healthy Nodes */}
        <div
          className="card"
          style={{
            padding: '16px',
            borderLeft: '3px solid var(--color-green, #0D9F6E)',
            cursor: 'pointer',
            background: statusFilter === 'Healthy' ? 'rgba(13, 159, 110, 0.06)' : undefined,
            transition: 'all 0.2s',
          }}
          onClick={() => setStatusFilter(statusFilter === 'Healthy' ? 'All' : 'Healthy')}
        >
          <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-green, #0D9F6E)', letterSpacing: '0.04em' }}>
            Healthy Nodes
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-green, #0D9F6E)', marginTop: '4px' }}>
            {stats.healthy}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-green, #0D9F6E)', marginTop: '2px', fontWeight: 600 }}>
            Normal Telemetry
          </div>
        </div>

        {/* Warning Nodes */}
        <div
          className="card"
          style={{
            padding: '16px',
            borderLeft: '3px solid var(--color-amber, #D97706)',
            cursor: 'pointer',
            background: statusFilter === 'Warning' ? 'rgba(217, 119, 6, 0.06)' : undefined,
            transition: 'all 0.2s',
          }}
          onClick={() => setStatusFilter(statusFilter === 'Warning' ? 'All' : 'Warning')}
        >
          <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-amber, #D97706)', letterSpacing: '0.04em' }}>
            Warning Nodes
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-amber, #D97706)', marginTop: '4px' }}>
            {stats.warning}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-amber, #D97706)', marginTop: '2px', fontWeight: 600 }}>
            Load / RAM &gt; 80%
          </div>
        </div>

        {/* Critical Nodes */}
        <div
          className="card"
          style={{
            padding: '16px',
            borderLeft: '3px solid var(--color-red, #DC2626)',
            cursor: 'pointer',
            background: statusFilter === 'Critical' ? 'rgba(220, 38, 38, 0.06)' : undefined,
            transition: 'all 0.2s',
          }}
          onClick={() => setStatusFilter(statusFilter === 'Critical' ? 'All' : 'Critical')}
        >
          <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-red, #DC2626)', letterSpacing: '0.04em' }}>
            Critical Outages
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-red, #DC2626)', marginTop: '4px' }}>
            {stats.critical}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-red, #DC2626)', marginTop: '2px', fontWeight: 600 }}>
            Remediation Active
          </div>
        </div>

        {/* Maintenance Nodes */}
        <div
          className="card"
          style={{
            padding: '16px',
            borderLeft: '3px solid #7C3AED',
            cursor: 'pointer',
            background: statusFilter === 'Maintenance' ? 'rgba(124, 58, 237, 0.06)' : undefined,
            transition: 'all 0.2s',
          }}
          onClick={() => setStatusFilter(statusFilter === 'Maintenance' ? 'All' : 'Maintenance')}
        >
          <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#7C3AED', letterSpacing: '0.04em' }}>
            Maintenance
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7C3AED', marginTop: '4px' }}>
            {stats.maintenance}
          </div>
          <div style={{ fontSize: '11px', color: '#7C3AED', marginTop: '2px', fontWeight: 600 }}>
            Patch / Change Window
          </div>
        </div>

        {/* Average CPU */}
        <div
          className="card"
          style={{
            padding: '16px',
            borderLeft: '3px solid #0284C7',
          }}
        >
          <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
            Average CPU Load
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284C7', marginTop: '4px' }}>
            {stats.avgCpu}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            Estate-Wide Telemetry
          </div>
        </div>

        {/* Average Memory */}
        <div
          className="card"
          style={{
            padding: '16px',
            borderLeft: '3px solid #4F46E5',
          }}
        >
          <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
            Average RAM Load
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4F46E5', marginTop: '4px' }}>
            {stats.avgMem}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            Estate-Wide Telemetry
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--border-secondary)',
        }}
      >
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: isActive ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                color: isActive ? 'white' : 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={14} />
              <span>{cat.label}</span>
              <span
                style={{
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '10px',
                  fontWeight: 700,
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--border-secondary)',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
            <Search size={16} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search nodes by ID, name, service, IP, location, owner, or OS..."
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

          {/* Filter Dropdowns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />

            {/* Status Filter */}
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
              <option value="All">All Statuses</option>
              {INFRA_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Asset Type Filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
              }}
            >
              <option value="All">All Asset Types</option>
              {INFRA_ASSET_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Tower Filter */}
            <select
              value={towerFilter}
              onChange={e => setTowerFilter(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
              }}
            >
              <option value="All">All Towers</option>
              {INFRA_TOWERS.map(tw => (
                <option key={tw} value={tw}>{tw}</option>
              ))}
            </select>

            {/* Criticality Filter */}
            <select
              value={criticalityFilter}
              onChange={e => setCriticalityFilter(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
              }}
            >
              <option value="All">All Criticalities</option>
              {INFRA_CRITICALITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-primary)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={12} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Table Card */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Infrastructure Nodes Inventory ({filteredNodes.length} {filteredNodes.length === 1 ? 'Node' : 'Nodes'})
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
              Physical datacenter blades, SAN arrays, network cores, database clusters, VMs, and managed endpoints
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>Node ID</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>Node Name & Specifications</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>Type & Tower</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>Location & IP</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>Assigned Service</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase', minWidth: '130px' }}>CPU & Memory</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>Uptime</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>Tier</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredNodes.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    No infrastructure nodes match the current filter selection.
                  </td>
                </tr>
              ) : (
                filteredNodes.map(node => {
                  const ss = statusStyles[node.status] || statusStyles.Healthy;
                  const StatusIcon = ss.icon;
                  const cs = criticalityStyles[node.criticality] || criticalityStyles['Tier 2'];

                  return (
                    <tr
                      key={node.id}
                      style={{ borderBottom: '1px solid var(--border-secondary)', transition: 'background 0.15s', cursor: 'pointer' }}
                      onClick={() => setSelectedNode(node)}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      {/* Node ID */}
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-primary)', fontSize: '12px' }}>
                          {node.id}
                        </span>
                      </td>

                      {/* Node Name & Model */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{node.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                          {node.modelOrFamily} • {node.osVersion}
                        </div>
                      </td>

                      {/* Type & Tower */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)' }}>{node.type}</div>
                        <span
                          style={{
                            display: 'inline-block',
                            marginTop: '2px',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)',
                            fontSize: '10px',
                            fontWeight: 600,
                          }}
                        >
                          {node.tower}
                        </span>
                      </td>

                      {/* Location & IP */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{node.location}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                          {node.ipAddress}
                        </div>
                      </td>

                      {/* Assigned Service */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)' }}>{node.assignedService}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>Owner: {node.owner}</div>
                      </td>

                      {/* CPU & Memory Bars */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {/* CPU Bar */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>
                              <span>CPU</span>
                              <strong style={{ color: getUtilColor(node.cpuUtilization) }}>{node.cpuUtilization}%</strong>
                            </div>
                            <div style={{ height: '4px', background: 'var(--border-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${node.cpuUtilization}%`,
                                  background: getUtilColor(node.cpuUtilization),
                                  borderRadius: '2px',
                                }}
                              />
                            </div>
                          </div>

                          {/* RAM Bar */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>
                              <span>RAM</span>
                              <strong style={{ color: getUtilColor(node.memoryUtilization) }}>{node.memoryUtilization}%</strong>
                            </div>
                            <div style={{ height: '4px', background: 'var(--border-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${node.memoryUtilization}%`,
                                  background: getUtilColor(node.memoryUtilization),
                                  borderRadius: '2px',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Uptime */}
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {node.uptime}
                      </td>

                      {/* Criticality */}
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '10px',
                            fontWeight: 700,
                            background: cs.bg,
                            color: cs.color,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {node.criticality}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: ss.bg,
                            color: ss.color,
                            border: `1px solid ${ss.border}`,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <StatusIcon size={12} />
                          {node.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedNode(node)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-primary)',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-primary)'; }}
                        >
                          <Eye size={12} /> Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Infrastructure Node Detail Modal (Section 10) */}
      {selectedNode && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="modal-backdrop"
              onClick={() => setSelectedNode(null)}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="modal-dialog-centered"
                onClick={e => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '720px',
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
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'rgba(107, 29, 42, 0.10)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--brand-primary)',
                      }}
                    >
                      <Server size={18} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                          {selectedNode.name}
                        </h3>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '10px',
                            fontWeight: 700,
                            background: statusStyles[selectedNode.status]?.bg,
                            color: statusStyles[selectedNode.status]?.color,
                            border: `1px solid ${statusStyles[selectedNode.status]?.border}`,
                          }}
                        >
                          {selectedNode.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                        {selectedNode.id} • {selectedNode.type} • {selectedNode.tower}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
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
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '75vh', overflowY: 'auto' }}>
                  {/* Telemetry Section */}
                  <div>
                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-tertiary)', margin: '0 0 8px', letterSpacing: '0.04em' }}>
                      Live Health Telemetry
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      {/* CPU Metric */}
                      <div style={{ padding: '10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 600 }}>CPU LOAD</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: getUtilColor(selectedNode.cpuUtilization), margin: '2px 0 4px' }}>
                          {selectedNode.cpuUtilization}%
                        </div>
                        <div style={{ height: '4px', background: 'var(--border-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${selectedNode.cpuUtilization}%`, background: getUtilColor(selectedNode.cpuUtilization) }} />
                        </div>
                      </div>

                      {/* RAM Metric */}
                      <div style={{ padding: '10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 600 }}>MEMORY LOAD</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: getUtilColor(selectedNode.memoryUtilization), margin: '2px 0 4px' }}>
                          {selectedNode.memoryUtilization}%
                        </div>
                        <div style={{ height: '4px', background: 'var(--border-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${selectedNode.memoryUtilization}%`, background: getUtilColor(selectedNode.memoryUtilization) }} />
                        </div>
                      </div>

                      {/* Disk Metric */}
                      <div style={{ padding: '10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 600 }}>DISK STORAGE</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: getUtilColor(selectedNode.diskUtilization), margin: '2px 0 4px' }}>
                          {selectedNode.diskUtilization}%
                        </div>
                        <div style={{ height: '4px', background: 'var(--border-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${selectedNode.diskUtilization}%`, background: getUtilColor(selectedNode.diskUtilization) }} />
                        </div>
                      </div>

                      {/* Uptime Metric */}
                      <div style={{ padding: '10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 600 }}>UPTIME</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 4px' }}>
                          {selectedNode.uptime}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-green, #0D9F6E)', fontWeight: 600 }}>Active Online</div>
                      </div>
                    </div>
                  </div>

                  {/* Specifications Card */}
                  <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-tertiary)', margin: '0 0 10px', letterSpacing: '0.04em' }}>
                      Platform & Identification
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                      <div>
                        <span style={{ color: 'var(--text-tertiary)' }}>Hardware Model / Family:</span>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedNode.modelOrFamily}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-tertiary)' }}>Operating System / Hypervisor:</span>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedNode.osVersion}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-tertiary)' }}>IP Address:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                          <span>{selectedNode.ipAddress}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyIp(selectedNode.ipAddress)}
                            title="Copy IP Address"
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '2px', display: 'flex' }}
                          >
                            {copiedIp ? <Check size={12} style={{ color: 'var(--color-green)' }} /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-tertiary)' }}>Facility Location:</span>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedNode.location}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-tertiary)' }}>Last Security Patch Date:</span>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedNode.lastPatched}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-tertiary)' }}>Criticality Level:</span>
                        <div style={{ fontWeight: 700, color: criticalityStyles[selectedNode.criticality]?.color }}>{selectedNode.criticality}</div>
                      </div>
                    </div>
                  </div>

                  {/* Service & Governance Alignment */}
                  <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-tertiary)', margin: '0 0 10px', letterSpacing: '0.04em' }}>
                      Operational Governance Alignment
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                      <div>
                        <span style={{ color: 'var(--text-tertiary)' }}>Assigned Operational Service:</span>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedNode.assignedService}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-tertiary)' }}>Primary Systems Owner:</span>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedNode.owner}</div>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <span style={{ color: 'var(--text-tertiary)' }}>KaarTech Service Domain:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                          <span className="badge badge-primary">{selectedNode.serviceDomain}</span>
                        </div>
                      </div>
                    </div>
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
                    onClick={() => setSelectedNode(null)}
                    style={{
                      padding: '7px 18px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: 'var(--brand-primary)',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    Close Inspector
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
