/**
 * KaarTech ITMS Control Tower — Resource Directory & Capability
 * Route: /resources/directory
 * Master resource profiles, track allocation, certifications, and workforce composition (Section 25).
 * Visuals:
 * 1. Onsite vs Offshore Track Mix (Donut)
 * 2. Gender & Nationality Composition (Donut)
 * 3. Service Domain Allocation (Bar)
 * 4. Contractual Track Compliance Plan vs Actual (Bar)
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users, Shield, Award, MapPin, Phone, Mail, Plus,
  CheckCircle2, RefreshCw, UserCheck, Briefcase, Search,
  Filter, ExternalLink, Eye, Globe, Server, X
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';
import DataTable from '../../components/common/DataTable';
import ResourceDetailModal from '../../components/resources/organization/ResourceDetailModal';
import { SERVICE_DOMAINS, getServiceDomainById } from '../../data/serviceDomains';
import { ROLES  } from '../../data/masterData';
import { RESOURCES, getResourceStats } from '../../data/demoData';
import { isResourceAvailable, subscribeTimeManagement } from '../../data/timeManagementStore';
import { getOverallResourceUtilization } from '../../data/analyticsSelectors';

export default function ResourceDirectoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlDomain = searchParams.get('domain');

  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(urlDomain || 'all'); // Service Domain / Tower
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSupportModel, setSelectedSupportModel] = useState('all'); // Dedicated / Shared
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [storeVersion, setStoreVersion] = useState(0);

  useEffect(() => {
    if (urlDomain) {
      setSelectedDomain(urlDomain);
    }
  }, [urlDomain]);

  useEffect(() => {
    return subscribeTimeManagement(() => {
      setStoreVersion(v => v + 1);
    });
  }, []);

  const stats = getResourceStats();
  const overallUtil = useMemo(() => getOverallResourceUtilization(), []);

  // Generic Workforce & Support Model Metrics (NCGR Adaptation)
  const totalFte = useMemo(() => {
    return RESOURCES.reduce((acc, r) => acc + (r.totalFte || 1.0), 0);
  }, []);

  const dedicatedCount = useMemo(() => {
    return RESOURCES.filter(r => r.supportModel !== 'Shared').length;
  }, []);

  const sharedCount = useMemo(() => {
    return RESOURCES.filter(r => r.supportModel === 'Shared').length;
  }, []);

  const activeResourcesCount = useMemo(() => {
    return RESOURCES.filter(r => r.status === 'Active' || !r.status).length;
  }, []);

  const filteredResources = useMemo(() => {
    return RESOURCES.filter(r => {
      // Primary Service Domain / Tower
      if (selectedDomain !== 'all' && r.serviceDomainId !== selectedDomain && r.towerId !== selectedDomain && r.serviceDomain !== selectedDomain) return false;
      // Department
      if (selectedDepartment !== 'all' && r.department !== selectedDepartment && r.processGroup !== selectedDepartment) return false;
      // Role
      if (selectedRole !== 'all' && r.roleCode !== selectedRole && r.role !== selectedRole) return false;
      // Level
      if (selectedLevel !== 'all' && r.level !== selectedLevel) return false;
      // Support Model (Dedicated vs Shared)
      if (selectedSupportModel !== 'all' && (r.supportModel || 'Dedicated') !== selectedSupportModel) return false;
      // Employment Type
      if (selectedEmploymentType !== 'all' && (r.employmentType || r.employmentRelationship || 'Permanent') !== selectedEmploymentType) return false;
      // Location: Onsite / Offshore
      if (selectedLocation !== 'all' && r.location !== selectedLocation) return false;
      // Track
      if (selectedTrack !== 'all' && r.track !== selectedTrack) return false;
      // Status
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      // Availability
      if (selectedAvailability !== 'all') {
        const avail = isResourceAvailable(r.id, '2026-09-16');
        if (selectedAvailability === 'Available' && !avail.available) return false;
        if (selectedAvailability === 'On Leave' && (avail.available || avail.status !== 'On Leave')) return false;
        if (selectedAvailability === 'Remote' && avail.status !== 'Remote Work') return false;
      }
      // Search query across all fields
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          r.name?.toLowerCase().includes(q) ||
          r.id?.toLowerCase().includes(q) ||
          r.role?.toLowerCase().includes(q) ||
          r.roleCode?.toLowerCase().includes(q) ||
          r.serviceDomain?.toLowerCase().includes(q) ||
          r.department?.toLowerCase().includes(q) ||
          r.processGroup?.toLowerCase().includes(q) ||
          r.skill?.toLowerCase().includes(q) ||
          r.certification?.toLowerCase().includes(q) ||
          r.positionId?.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [
    selectedDomain, selectedDepartment, selectedRole, selectedLevel,
    selectedSupportModel, selectedEmploymentType, selectedLocation,
    selectedTrack, selectedStatus, selectedAvailability, searchQuery, storeVersion
  ]);

  // Visual 1: Onsite vs Offshore
  const locationData = [
    { name: 'Onsite (HQ)', value: stats.onsite, color: '#6B1D2A' },
    { name: 'Offshore Dedicated', value: stats.offshore - 3, color: '#2563EB' },
    { name: 'Offshore Flex Pool', value: 3, color: '#7C3AED' },
  ];

  // Visual 2: Support Model Allocation (Dedicated vs Shared)
  const supportModelData = [
    { name: `Dedicated Support (${dedicatedCount} FTEs)`, value: dedicatedCount, color: '#2563EB' },
    { name: `Shared Support (${sharedCount} Specialists)`, value: sharedCount, color: '#7C3AED' },
  ];

  // Visual 3: Service Domain Distribution
  const domainData = useMemo(() => {
    return SERVICE_DOMAINS.map(d => {
      const count = RESOURCES.filter(r => r.serviceDomainId === d.id || r.serviceDomain === d.name).length;
      const shortName = d.name.length > 18 ? d.name.substring(0, 15) + '…' : d.name;
      return {
        domain: shortName,
        fullName: d.name,
        count
      };
    });
  }, []);

  // Visual 4: Contractual Compliance Plan vs Actual
  const complianceData = [
    { track: 'AMS-ON-RUN', Plan: 14, Actual: 14 },
    { track: 'AMS-OF-RUN', Plan: 10, Actual: 10 },
    { track: 'AMS-OF-Flex', Plan: 3, Actual: 3 },
    { track: 'ENH-OF-RUN', Plan: 3, Actual: 3 },
  ];

  const columns = [
    {
      key: 'name',
      label: 'Resource',
      width: '210px',
      render: (val, item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: 'var(--radius-full)',
            background: item.supportModel === 'Shared' ? 'var(--color-purple)' : 'var(--brand-primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '12px', flexShrink: 0
          }}>
            {item.name ? item.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'EM'}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '13px' }}>{val}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', gap: '6px' }}>
              <span>{item.id}</span>
              <span>•</span>
              <span>{item.department || item.processGroup || 'Operations'}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      width: '175px',
      render: (val, item) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '12px' }}>{val}</div>
          {item.roleCode && (
            <span className="badge badge-neutral" style={{ fontSize: '10px', marginTop: '2px', padding: '1px 5px' }}>
              {item.roleCode}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'serviceDomainId',
      label: 'Tower',
      width: '180px',
      render: (val, item) => {
        const dom = getServiceDomainById(val || item.towerId);
        return (
          <span
            style={{
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: 700,
              background: 'rgba(107, 29, 42, 0.08)',
              color: 'var(--brand-primary)',
              border: '1px solid rgba(107, 29, 42, 0.2)',
              display: 'inline-block',
              maxWidth: '175px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            title={dom.name}
          >
            {dom.shortName || dom.name}
          </span>
        );
      }
    },
    {
      key: 'primaryAssignment',
      label: 'Primary Assignment',
      width: '185px',
      render: (val, item) => {
        const pAssign = item.primaryAssignment?.name || item.currentAssignment || 'Core Service Delivery';
        return (
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }} title={pAssign}>
              {pAssign}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
              {item.primaryAssignment?.allocation || (item.supportModel === 'Shared' ? 60 : 100)}% Primary
            </div>
          </div>
        );
      }
    },
    {
      key: 'totalFte',
      label: 'FTE',
      width: '90px',
      render: (val, item) => {
        const fte = item.totalFte ? item.totalFte.toFixed(1) : '1.0';
        return (
          <span
            className="badge"
            style={{
              fontWeight: 700,
              fontSize: '11px',
              background: 'rgba(37, 99, 235, 0.12)',
              color: 'var(--color-blue)',
              border: '1px solid rgba(37, 99, 235, 0.3)',
            }}
          >
            {fte} FTE
          </span>
        );
      }
    },
    {
      key: 'allocation',
      label: 'Allocation',
      width: '135px',
      render: (val, item) => {
        const isShared = item.supportModel === 'Shared';
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700 }}>
              <span style={{ color: isShared ? 'var(--color-purple)' : 'var(--color-emerald)' }}>
                100% {isShared ? '(60/40 Split)' : 'Dedicated'}
              </span>
            </div>
            <div style={{ height: '6px', borderRadius: '3px', background: 'var(--bg-tertiary)', marginTop: '4px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: isShared ? '60%' : '100%', height: '100%', background: isShared ? 'var(--color-blue)' : 'var(--color-emerald)' }} title="Primary Assignment Allocation (60%)" />
              {isShared && <div style={{ width: '40%', height: '100%', background: 'var(--color-purple)' }} title="Shared Cross-Tower Support (40%)" />}
            </div>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      width: '90px',
      render: (val, item) => {
        const avail = isResourceAvailable(item.id, '2026-09-16');
        if (!avail.available && avail.status === 'On Leave') {
          return <span className="badge badge-warning" style={{ fontSize: '10px' }}>On Leave</span>;
        }
        if (avail.status === 'Remote Work') {
          return <span className="badge badge-primary" style={{ fontSize: '10px' }}>Remote</span>;
        }
        return <span className="badge badge-success" style={{ fontSize: '10px' }}>Active</span>;
      }
    },
    {
      key: 'supportModel',
      label: 'Support Model',
      width: '120px',
      render: (val, item) => {
        const isShared = (val || item.supportModel) === 'Shared';
        return (
          <span
            className="badge"
            style={{
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 700,
              background: isShared ? 'rgba(124, 58, 237, 0.12)' : 'rgba(37, 99, 235, 0.12)',
              color: isShared ? 'var(--color-purple)' : 'var(--color-blue)',
              border: `1px solid ${isShared ? 'rgba(124, 58, 237, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`,
            }}
          >
            {isShared ? '⚡ Shared' : '★ Dedicated'}
          </span>
        );
      }
    },
    {
      key: 'location',
      label: 'Location',
      width: '105px',
      render: (val) => (
        <span style={{ fontSize: '11px', fontWeight: 600, color: val === 'Onsite' ? 'var(--color-green)' : 'var(--color-blue)' }}>
          {val === 'Onsite' ? '📍 Onsite' : '🏢 Offshore'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Action',
      width: '130px',
      render: (_, item) => (
        <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setSelectedResource(item)}
            title="Open Resource Profile (NCGR Roster View)"
            style={{
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-primary)',
              background: 'var(--brand-primary)',
              color: 'white',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            <Eye size={12} /> Profile
          </button>
          <button
            onClick={() => navigate(`/resources/${item.id}`)}
            title="Open Full Page View"
            style={{
              padding: '4px 7px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '11px',
            }}
          >
            <ExternalLink size={12} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="resource-directory-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">Resource Directory</h1>
            <span className="badge badge-primary">{totalFte.toFixed(1)} Total FTE</span>
            <span className="badge badge-success">100% Staffing Compliance</span>
          </div>
          <p className="page-subtitle">
            Workforce roster, certified competencies, and contractual track allocation across dedicated and shared support pools.
          </p>
        </div>
      </div>

      {/* KPI Strip per Section 25, 30 & NCGR Adaptation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
      }}>
        <KPICard
          title="Overall Resource Utilization %"
          value={overallUtil.overallUtilizationFormatted}
          target="90.0%"
          status="success"
          trend={+(overallUtil.overallUtilization - 90).toFixed(1)}
          subtitle={`${overallUtil.totalUtilized}h / ${overallUtil.totalAllocated}h Total`}
          icon={Briefcase}
          sparklineData={[91, 92.5, 93.8, overallUtil.overallUtilization]}
        />
        <KPICard
          title="Total Headcount"
          value={stats.total}
          subtitle="Total enterprise personnel"
          icon={Users}
          sparklineData={[28, 30, 30, stats.total]}
        />
        <KPICard
          title="Total FTE"
          value={`${totalFte.toFixed(1)} FTE`}
          status="success"
          subtitle="Standardized full-time capacity"
          icon={Shield}
        />
        <KPICard
          title="Dedicated Support"
          value={`${dedicatedCount} FTEs`}
          subtitle="100% single-tower commitment"
          icon={UserCheck}
        />
        <KPICard
          title="Shared Support"
          value={`${sharedCount} SMEs`}
          status="primary"
          subtitle="Cross-tower shared capacity"
          icon={MapPin}
        />
        <KPICard
          title="Active Resources"
          value={`${activeResourcesCount}`}
          status="success"
          subtitle="On-duty & deployed specialists"
          icon={CheckCircle2}
        />
        <KPICard
          title="Staffing Coverage"
          value="100%"
          target="100%"
          status="success"
          subtitle="0 Open Resourcing Gaps"
          icon={Award}
        />
      </div>

      {/* 4 Visual Analytics Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '16px',
      }}>
        {/* Visual 1: Onsite vs Offshore Track Allocation */}
        <ChartCard
          title="Delivery Track Distribution"
          subtitle="Onsite (HQ) vs Offshore Dedicated & Flex Pool"
          badge={`${stats.total} Headcount`}
          height={250}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--bg-card)" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-lg)'
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(val, entry) => (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {val} (<strong>{entry.payload.value}</strong>)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 2: Support Model Allocation (Dedicated vs Shared) */}
        <ChartCard
          title="Support Model Allocation"
          subtitle="Dedicated Support vs Cross-Tower Shared Support FTEs"
          badge={`${totalFte.toFixed(1)} FTE Total`}
          height={250}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={supportModelData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {supportModelData.map((entry, index) => (
                  <Cell key={`cell-g-${index}`} fill={entry.color} stroke="var(--bg-card)" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-lg)'
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(val, entry) => (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {val} (<strong>{entry.payload.value}</strong>)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 3: Service Domain Distribution */}
        <ChartCard
          title="FTE Allocation by Service Domain"
          subtitle="Contractual distribution across 7 ITMS service domains"
          badge="Domain Alignment"
          height={250}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={domainData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
              <XAxis dataKey="domain" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-lg)'
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Bar dataKey="count" name="FTEs" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 4: Contractual Track Compliance */}
        <ChartCard
          title="Contractual Staffing Plan vs Actual"
          subtitle="Mandated track quotas vs deployed personnel"
          badge="100% Fulfilled"
          height={250}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={complianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
              <XAxis dataKey="track" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-lg)'
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend verticalAlign="top" align="right" height={28} />
              <Bar dataKey="Plan" fill="#71777C" radius={[4, 4, 0, 0]} name="Contract Plan" barSize={16} />
              <Bar dataKey="Actual" fill="#0D9F6E" radius={[4, 4, 0, 0]} name="Actual Deployed" barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Comprehensive Filter Bar */}
      <div
        className="card"
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '240px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search by name, ID, role, skills, certification..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                outline: 'none',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Primary Filter: Tower / Service Domain */}
            <select
              value={selectedDomain}
              onChange={e => setSelectedDomain(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
              }}
            >
              <option value="all">All Towers / Domains (7)</option>
              {SERVICE_DOMAINS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* Support Model Filter (NCGR Roster Concept) */}
            <select
              value={selectedSupportModel}
              onChange={e => setSelectedSupportModel(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
              }}
            >
              <option value="all">All Support Models</option>
              <option value="Dedicated">★ Dedicated Support (100%)</option>
              <option value="Shared">⚡ Shared Support (Cross-Tower)</option>
            </select>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
              }}
            >
              <option value="all">All Departments</option>
              <option value="Workplace Technologies">Workplace Technologies</option>
              <option value="Cloud & Data Center">Cloud & Data Center</option>
              <option value="Database & BASIS Administration">Database & BASIS Administration</option>
              <option value="Security & Identity Governance">Security & Identity Governance</option>
              <option value="Integration & Middleware">Integration & Middleware</option>
              <option value="Enterprise Applications">Enterprise Applications</option>
              <option value="Service Management & Governance">Service Management & Governance</option>
            </select>

            {/* Level Select */}
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
              }}
            >
              <option value="all">All Levels</option>
              <option value="L1">Level 1 (Junior / L1)</option>
              <option value="L2">Level 2 (Mid / L2)</option>
              <option value="L3">Level 3 (Senior / L3)</option>
            </select>

            {/* Location Select */}
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
              }}
            >
              <option value="all">All Locations</option>
              <option value="Onsite">📍 Onsite (HQ)</option>
              <option value="Offshore">🏢 Offshore Center</option>
            </select>

            {/* Availability Select */}
            <select
              value={selectedAvailability}
              onChange={e => setSelectedAvailability(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
              }}
            >
              <option value="all">All Availability</option>
              <option value="Active">Active On-Duty</option>
              <option value="On Leave">On Leave</option>
              <option value="Remote">Remote</option>
            </select>

            {/* Reset Filters */}
            {(selectedTrack !== 'all' || selectedDomain !== 'all' || selectedSupportModel !== 'all' || selectedDepartment !== 'all' || selectedLevel !== 'all' || selectedLocation !== 'all' || selectedAvailability !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedTrack('all');
                  setSelectedDomain('all');
                  setSelectedSupportModel('all');
                  setSelectedDepartment('all');
                  setSelectedLevel('all');
                  setSelectedLocation('all');
                  setSelectedAvailability('all');
                  setSearchQuery('');
                }}
                style={{
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-red)',
                  background: 'var(--color-red-light)',
                  color: 'var(--color-red)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Quick pills bar: Support Model & Track */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid var(--border-secondary)' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Model:</span>
            {[
              { id: 'all', label: 'All Models' },
              { id: 'Dedicated', label: '★ Dedicated' },
              { id: 'Shared', label: '⚡ Shared' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedSupportModel(m.id)}
                className={`btn ${selectedSupportModel === m.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                style={{ padding: '2px 8px', fontSize: '11px' }}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Track:</span>
            {['all', 'AMS-ON-RUN', 'AMS-OF-RUN', 'AMS-OF-Flex', 'ENH-OF-RUN'].map(tr => (
              <button
                key={tr}
                onClick={() => setSelectedTrack(tr)}
                className={`btn ${selectedTrack === tr ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                style={{ padding: '2px 8px', fontSize: '11px' }}
              >
                {tr === 'all' ? `All Tracks` : tr}
              </button>
            ))}
          </div>

          <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 600 }}>
            Showing <strong>{filteredResources.length}</strong> of {RESOURCES.length} specialists ({totalFte.toFixed(1)} Total FTE)
          </span>
        </div>
      </div>

      {/* Table */}
      <DataTable
        title="Enterprise Resource Roster & Workforce Directory"
        subtitle="Roster structure with dedicated and shared support model tracking, primary service assignments, and standardized FTE allocations."
        columns={columns}
        data={filteredResources}
        onRowClick={(item) => setSelectedResource(item)}
        exportFilename="itms-resource-roster.csv"
      />

      {/* Centered Record Detail Modal (Section 7, 23) */}
      <ResourceDetailModal
        isOpen={Boolean(selectedResource)}
        resourceId={selectedResource?.id}
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </div>
  );
}
