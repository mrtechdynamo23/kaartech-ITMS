/**
 * KaarTech ITMS Control Tower — System & Governance Settings Page
 * Route: /settings
 *
 * Configurable enterprise parameters:
 * - Framework & Control Tower Versioning
 * - Active IT Towers Catalogue
 * - Resource Governance & Thresholds
 * - SLA Monitoring & Breach Alert Configuration
 * - Localization & Saudi Arabia Timezone Settings
 */
import React, { useState } from 'react';
import {
  Settings, Shield, Sliders, Bell, Globe, Clock, Server,
  Check, Save, RefreshCw, AlertCircle, Info, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { SERVICE_DOMAINS } from '../data/serviceDomains';

export default function SettingsPage() {
  const { language, setLanguage, isRtl } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [config, setConfig] = useState({
    portalName: 'KaarTech ITMS Control Tower',
    portalVersion: '2.4.0 (Enterprise 2026)',
    timezone: 'Asia/Riyadh (UTC+03:00)',
    workingWeek: 'Sunday - Thursday (40 hrs/wk)',
    dailyHours: 8,
    enableBreachAlerts: true,
    enableWeeklyReminders: true,
    enableAutoMeasurement: true,
    breachWarningThreshold: 90,
    criticalBreachThreshold: 80,
    timesheetGracePeriodDays: 2,
    activeDomains: SERVICE_DOMAINS.map(d => ({ ...d, enabled: true })),
  });

  const handleDomainToggle = (domainId) => {
    setConfig(prev => ({
      ...prev,
      activeDomains: prev.activeDomains.map(d =>
        d.id === domainId ? { ...d, enabled: !d.enabled } : d
      ),
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={24} style={{ color: 'var(--brand-primary)' }} />
            System & Governance Settings
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
            Enterprise configuration, IT tower catalogue, SLA thresholds, and operational parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            background: saved ? 'var(--color-green)' : 'var(--brand-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(107, 29, 42, 0.2)',
          }}
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'Settings Saved' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid var(--border-primary)',
          marginBottom: '24px',
        }}
      >
        {[
          { key: 'general', label: 'General & Localization', icon: Globe },
          { key: 'domains', label: 'Primary Service Domains', icon: Server },
          { key: 'sla-rules', label: 'SLA & Governance Rules', icon: Shield },
          { key: 'notifications', label: 'Notifications & Alerts', icon: Bell },
          { key: 'system', label: 'System & Architecture', icon: Sliders },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--brand-primary)' : '3px solid transparent',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                marginBottom: '-2px',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: General & Localization */}
      {activeTab === 'general' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} style={{ color: 'var(--brand-primary)' }} /> Localization & Interface
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  System Language / Direction
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setLanguage('en')}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${language === 'en' ? 'var(--brand-primary)' : 'var(--border-primary)'}`,
                      background: language === 'en' ? 'var(--brand-primary-light)' : 'var(--bg-card)',
                      color: language === 'en' ? 'var(--brand-primary)' : 'var(--text-primary)',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    English (LTR)
                  </button>
                  <button
                    onClick={() => setLanguage('ar')}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${language === 'ar' ? 'var(--brand-primary)' : 'var(--border-primary)'}`,
                      background: language === 'ar' ? 'var(--brand-primary-light)' : 'var(--bg-card)',
                      color: language === 'ar' ? 'var(--brand-primary)' : 'var(--text-primary)',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    العربية (RTL)
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Display Theme
                </label>
                <button
                  onClick={toggleTheme}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                  }}
                >
                  <span>Current Theme: <strong>{theme === 'dark' ? 'Dark Mode' : 'Light Mode (Enterprise Standard)'}</strong></span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--brand-primary)' }}>Click to toggle</span>
                </button>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Enterprise Timezone
                </label>
                <input
                  type="text"
                  value={config.timezone}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                  }}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                  Standard corporate timezone for KaarTech AMS operations across Saudi Arabia.
                </span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: 'var(--brand-primary)' }} /> Working Hours & Shifts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Official Work Week
                </label>
                <input
                  type="text"
                  value={config.workingWeek}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Standard Daily Working Hours
                </label>
                <input
                  type="number"
                  value={config.dailyHours}
                  onChange={e => setConfig(prev => ({ ...prev, dailyHours: parseInt(e.target.value) || 8 }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Primary Service Domains Configuration */}
      {activeTab === 'domains' && (
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, margin: 0 }}>
                Primary Service Domains
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '4px 0 0' }}>
                All 7 Service Domains configured according to SOW requirements. Enable or disable domains for portal filtering.
              </p>
            </div>
            <span className="badge badge-primary">{config.activeDomains.filter(d => d.enabled).length} of 7 Active</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {config.activeDomains.map(domain => (
              <div
                key={domain.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${domain.enabled ? 'var(--border-primary)' : 'var(--border-secondary)'}`,
                  background: domain.enabled ? 'var(--bg-card)' : 'var(--bg-secondary)',
                  opacity: domain.enabled ? 1 : 0.65,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-primary)' }}>
                      {domain.id} • {domain.code}
                    </span>
                    <button
                      onClick={() => handleDomainToggle(domain.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        color: domain.enabled ? 'var(--color-green)' : 'var(--text-tertiary)',
                      }}
                      title={domain.enabled ? 'Disable Domain' : 'Enable Domain'}
                    >
                      {domain.enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    </button>
                  </div>
                  <h4 style={{ margin: '8px 0 4px', fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {domain.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {domain.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SLA & Governance Rules */}
      {activeTab === 'sla-rules' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} style={{ color: 'var(--brand-primary)' }} /> Compliance Thresholds
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Warning Threshold (% Compliance)
                </label>
                <input
                  type="number"
                  value={config.breachWarningThreshold}
                  onChange={e => setConfig(prev => ({ ...prev, breachWarningThreshold: parseInt(e.target.value) || 90 }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                  }}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                  Metrics below this percentage trigger yellow 'At Risk' status indicators.
                </span>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Critical Breach Threshold (% Compliance)
                </label>
                <input
                  type="number"
                  value={config.criticalBreachThreshold}
                  onChange={e => setConfig(prev => ({ ...prev, criticalBreachThreshold: parseInt(e.target.value) || 80 }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                  }}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                  Metrics below this percentage trigger red 'Breached' status alerts.
                </span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: 'var(--brand-primary)' }} /> Grace Periods & Automation
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Timesheet Submission Grace Period (Days)
                </label>
                <input
                  type="number"
                  value={config.timesheetGracePeriodDays}
                  onChange={e => setConfig(prev => ({ ...prev, timesheetGracePeriodDays: parseInt(e.target.value) || 2 }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Automated Telemetry Engine</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Calculate compliance on measurement update</div>
                </div>
                <button
                  onClick={() => setConfig(p => ({ ...p, enableAutoMeasurement: !p.enableAutoMeasurement }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: config.enableAutoMeasurement ? 'var(--color-green)' : 'var(--text-tertiary)' }}
                >
                  {config.enableAutoMeasurement ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Notifications & Alerts */}
      {activeTab === 'notifications' && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} style={{ color: 'var(--brand-primary)' }} /> Alert & Digest Preferences
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>SLA Breach Alerts</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Immediate notification when any SLA exceeds critical threshold</div>
              </div>
              <button
                onClick={() => setConfig(p => ({ ...p, enableBreachAlerts: !p.enableBreachAlerts }))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: config.enableBreachAlerts ? 'var(--color-green)' : 'var(--text-tertiary)' }}
              >
                {config.enableBreachAlerts ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Weekly Service Report Reminders</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Remind delivery leads every Thursday prior to report cutoff</div>
              </div>
              <button
                onClick={() => setConfig(p => ({ ...p, enableWeeklyReminders: !p.enableWeeklyReminders }))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: config.enableWeeklyReminders ? 'var(--color-green)' : 'var(--text-tertiary)' }}
              >
                {config.enableWeeklyReminders ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: System & Architecture */}
      {activeTab === 'system' && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} style={{ color: 'var(--brand-primary)' }} /> Platform Specifications
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Application</div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: '4px' }}>{config.portalName}</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Build Release</div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: '4px' }}>{config.portalVersion}</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Frontend Engine</div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: '4px' }}>React 18 + Vite</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Telemetry Model</div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: '4px', color: 'var(--color-green)' }}>Unified In-Memory Store</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
