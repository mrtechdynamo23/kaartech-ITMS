/**
 * KaarTech ITMS Control Tower — Resource Management Store
 * Centralized store for Resource Requests, Assignments, and SLA Governance.
 * 
 * Connected to RESOURCES in demoData.js for data coherence.
 * 
 * SLA Architecture:
 * - 4 Categories: Response & Mobilization, Replacement & Continuity, Resource Performance, Reporting
 * - Sourced targets from original RFP
 * - Conditional rules (Common vs Specialist role targets)
 * - Composite rules (multiple conditions must be satisfied)
 * - Target versioning (original source target + current working target + history)
 * - Compliance engine with >=, <=, =, >, < operators
 */
import { useState, useEffect } from 'react';
import { RESOURCES } from './demoData.js';
import { SERVICE_DOMAINS, getServiceDomainById } from './serviceDomains.js';
import { ROLES } from './masterData.js';

// ── SLA Categories (Section 15) ──
export const SLA_CATEGORIES = [
  { key: 'response_mobilization', label: 'Response & Mobilization' },
  { key: 'replacement_continuity', label: 'Replacement & Continuity' },
  { key: 'resource_performance', label: 'Resource Performance' },
  { key: 'reporting', label: 'Reporting' },
];

// ── Request Statuses (Section 9) ──
export const REQUEST_STATUSES = [
  'Requested', 'Acknowledged', 'Candidate Shortlisted', 'Pending Approval',
  'Approved', 'Mobilization', 'Onboarded', 'Assigned', 'Closed', 'Rejected'
];

// ── Replacement Statuses (Section 9) ──
export const REPLACEMENT_STATUSES = [
  'Replacement Raised', 'Candidate Shortlisted', 'Approval',
  'Mobilization', 'Continuity Confirmed', 'Completed'
];

// ══════════════════════════════════════════════════════
// SLA DEFINITIONS — Sourced from Original RFP (Section 16)
// DO NOT invent new SLA numbers.
// ══════════════════════════════════════════════════════
const INITIAL_SLAS = [
  // ── Response & Mobilization ──
  {
    id: 'SLA-001', slaId: 'SLA-001', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', name: 'Request Acknowledgement', category: 'response_mobilization',
    description: 'Time from resource request submission to formal acknowledgement by the resource management team.',
    measurementType: 'Automated', manualEntryAllowed: false,
    originalSourceTarget: '<= 1 business day', currentTargetValue: 1, currentTargetOperator: '<=', currentTargetUnit: 'business_days',
    frequency: 'Per Event', trigger: 'Resource request submitted', owner: 'Resource Management Lead',
    measurementSource: 'Request management system', sourceType: 'System', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Automated timestamp from request system', scope: 'All resource requests',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 1, operator: '<=', unit: 'business_days', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Original source target' }],
    conditionalRules: [], compositeRules: [],
  },
  {
    id: 'SLA-002', slaId: 'SLA-002', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', name: 'Candidate Shortlist', category: 'response_mobilization',
    description: 'Time from approved resource request to presentation of qualified candidate shortlist.',
    measurementType: 'Automated', manualEntryAllowed: false,
    originalSourceTarget: '<= 10 business days', currentTargetValue: 10, currentTargetOperator: '<=', currentTargetUnit: 'business_days',
    frequency: 'Per Event', trigger: 'Resource request approved', owner: 'Resource Management Lead',
    measurementSource: 'Request management system', sourceType: 'System', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Shortlist submission timestamp', scope: 'All approved requests',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 10, operator: '<=', unit: 'business_days', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Original source target' }],
    conditionalRules: [], compositeRules: [],
  },
  {
    id: 'SLA-003', slaId: 'SLA-003', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', name: 'Long-Term Mobilization', category: 'response_mobilization',
    description: 'Time from approval to resource deployed onsite for long-term assignments (> 3 months).',
    measurementType: 'Automated', manualEntryAllowed: true,
    originalSourceTarget: '<= 30 calendar days', currentTargetValue: 30, currentTargetOperator: '<=', currentTargetUnit: 'calendar_days',
    frequency: 'Per Event', trigger: 'Resource approved for onsite deployment', owner: 'Mobilization Lead',
    measurementSource: 'Mobilization tracking system', sourceType: 'System', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Mobilization completion record and onsite confirmation', scope: 'Onsite long-term assignments',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 30, operator: '<=', unit: 'calendar_days', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Original source target' }],
    conditionalRules: [], compositeRules: [],
  },
  {
    id: 'SLA-004', slaId: 'SLA-004', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', name: 'Short-Term Mobilization', category: 'response_mobilization',
    description: 'Time from approval to resource available for short-term needs (< 3 months).',
    measurementType: 'Automated', manualEntryAllowed: true,
    originalSourceTarget: '<= 10 business days', currentTargetValue: 10, currentTargetOperator: '<=', currentTargetUnit: 'business_days',
    frequency: 'Per Event', trigger: 'Short-term resource approved', owner: 'Mobilization Lead',
    measurementSource: 'Mobilization tracking system', sourceType: 'System', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Mobilization completion record', scope: 'Short-term assignments',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 10, operator: '<=', unit: 'business_days', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Original source target' }],
    conditionalRules: [], compositeRules: [],
  },

  // ── Replacement & Continuity ──
  {
    id: 'SLA-005', slaId: 'SLA-005', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', name: 'Performance Replacement Shortlist', category: 'replacement_continuity',
    description: 'Time from replacement request to candidate shortlist presentation. Target varies by role type.',
    measurementType: 'Automated', manualEntryAllowed: false,
    originalSourceTarget: 'Common Role: <= 5 business days | Specialist Role: <= 10 business days',
    currentTargetValue: 5, currentTargetOperator: '<=', currentTargetUnit: 'business_days',
    frequency: 'Per Event', trigger: 'Replacement request raised', owner: 'Resource Management Lead',
    measurementSource: 'Request management system', sourceType: 'System', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Replacement shortlist submission timestamp', scope: 'All replacement requests',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 5, operator: '<=', unit: 'business_days', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Original source target — Common Role default' }],
    conditionalRules: [
      { condition: 'roleType', value: 'Common', targetValue: 5, operator: '<=', unit: 'business_days', label: 'Common Role' },
      { condition: 'roleType', value: 'Specialist', targetValue: 10, operator: '<=', unit: 'business_days', label: 'Specialist Role' },
    ],
    compositeRules: [],
  },
  {
    id: 'SLA-006', slaId: 'SLA-006', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', name: 'Replacement Continuity', category: 'replacement_continuity',
    description: 'Replacement resource must maintain service continuity with no gap exceeding the target.',
    measurementType: 'Manual', manualEntryAllowed: true,
    originalSourceTarget: '<= 5 business days gap', currentTargetValue: 5, currentTargetOperator: '<=', currentTargetUnit: 'business_days',
    frequency: 'Per Event', trigger: 'Replacement completed', owner: 'Delivery Lead',
    measurementSource: 'Manual assessment', sourceType: 'Manual', sourceStatus: 'Confirmed',
    evidenceRequirement: 'KT completion certificate, handover report', scope: 'All replacement events',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 5, operator: '<=', unit: 'business_days', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Original source target' }],
    conditionalRules: [], compositeRules: [],
  },
  {
    id: 'SLA-007', slaId: 'SLA-007', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', name: 'Knowledge Transfer Completion', category: 'replacement_continuity',
    description: 'Knowledge transfer must be completed within defined timeline during resource replacement.',
    measurementType: 'Manual', manualEntryAllowed: true,
    originalSourceTarget: '= 100%', currentTargetValue: 100, currentTargetOperator: '>=', currentTargetUnit: 'percent',
    frequency: 'Per Event', trigger: 'Replacement resource onboarded', owner: 'KT Lead',
    measurementSource: 'KT checklist and sign-off', sourceType: 'Manual', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Signed KT completion document', scope: 'All replacements requiring KT',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 100, operator: '>=', unit: 'percent', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Original source target' }],
    conditionalRules: [], compositeRules: [],
  },

  // ── Resource Performance (8 Canonical SOW KPIs) ──
  {
    id: 'SLA-008', slaId: 'SLA-008', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', name: 'Attendance and approved availability', category: 'resource_performance',
    description: 'Approved working time delivered, excluding authorized leave with accepted coverage.',
    measurementDescription: 'Approved working time delivered, excluding authorized leave with accepted coverage',
    measurementType: 'Percentage', manualEntryAllowed: true,
    originalSourceTarget: '>=95%', currentTargetValue: 95, currentTargetOperator: '>=', currentTargetUnit: 'percent',
    frequency: 'Monthly', trigger: 'Month-end calculation', owner: 'Delivery Lead',
    measurementSource: 'Attendance and leave management system', sourceType: 'System', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Monthly availability report from attendance system', scope: 'All active resources',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 95, operator: '>=', unit: 'percent', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Canonical RFP SOW target' }],
    conditionalRules: [], compositeRules: [],
  },
  {
    id: 'SLA-016', slaId: 'SLA-016', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration', name: 'Task and milestone adherence', category: 'resource_performance',
    description: 'Assigned tasks or milestones completed by agreed date, excluding approved dependencies.',
    measurementDescription: 'Assigned tasks or milestones completed by agreed date, excluding approved dependencies',
    measurementType: 'Percentage', manualEntryAllowed: true,
    originalSourceTarget: '>=90%', currentTargetValue: 90, currentTargetOperator: '>=', currentTargetUnit: 'percent',
    frequency: 'Monthly', trigger: 'Monthly milestone audit', owner: 'Project Delivery Lead',
    measurementSource: 'Task and project tracking system', sourceType: 'System', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Milestone delivery audit and dependency log', scope: 'All assigned tasks and deliverables',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 90, operator: '>=', unit: 'percent', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Canonical RFP SOW target' }],
    conditionalRules: [], compositeRules: [],
  },
  {
    id: 'SLA-009', slaId: 'SLA-009', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing', name: 'First-pass quality', category: 'resource_performance',
    description: 'Deliverables accepted without material rework.',
    measurementDescription: 'Deliverables accepted without material rework',
    measurementType: 'Percentage', manualEntryAllowed: true,
    originalSourceTarget: '>=90%', currentTargetValue: 90, currentTargetOperator: '>=', currentTargetUnit: 'percent',
    frequency: 'Quarterly', trigger: 'Deliverable sign-off register', owner: 'Quality Assurance Lead',
    measurementSource: 'QA acceptance and rework register', sourceType: 'Manual', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Deliverable acceptance log with rework classification', scope: 'All technical deliverables',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 90, operator: '>=', unit: 'percent', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Canonical RFP SOW target' }],
    conditionalRules: [], compositeRules: [],
  },
  {
    id: 'SLA-017', slaId: 'SLA-017', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', name: 'Documentation compliance', category: 'resource_performance',
    description: 'Required documents, work notes, code comments, runbooks, or knowledge records completed.',
    measurementDescription: 'Required documents, work notes, code comments, runbooks, or knowledge records completed',
    measurementType: 'Percentage', manualEntryAllowed: true,
    originalSourceTarget: '>=95%', currentTargetValue: 95, currentTargetOperator: '>=', currentTargetUnit: 'percent',
    frequency: 'Monthly', trigger: 'Documentation review gate', owner: 'Compliance & Quality Lead',
    measurementSource: 'Knowledge and documentation audit register', sourceType: 'Manual', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Monthly documentation audit findings report', scope: 'All work items, code repositories, and SOPs',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 95, operator: '>=', unit: 'percent', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Canonical RFP SOW target' }],
    conditionalRules: [], compositeRules: [],
  },
  {
    id: 'SLA-012', slaId: 'SLA-012', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', name: 'Timesheet accuracy and timeliness', category: 'resource_performance',
    description: 'Complete and accurate timesheets submitted by deadline.',
    measurementDescription: 'Complete and accurate timesheets submitted by deadline',
    measurementType: 'Percentage', manualEntryAllowed: true,
    originalSourceTarget: '100%', currentTargetValue: 100, currentTargetOperator: '>=', currentTargetUnit: 'percent',
    frequency: 'Monthly', trigger: 'Monthly timesheet deadline gate', owner: 'Time Management Lead',
    measurementSource: 'Timesheet management system', sourceType: 'System', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Monthly timesheet submission timestamp and audit log', scope: 'All resources',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 100, operator: '>=', unit: 'percent', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Canonical RFP SOW target' }],
    conditionalRules: [], compositeRules: [],
  },
  {
    id: 'SLA-011', slaId: 'SLA-011', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services', name: 'Policy and security compliance', category: 'resource_performance',
    description: 'Compliance with approved policies and controls.',
    measurementDescription: 'Compliance with approved policies and controls',
    measurementType: 'Boolean / Compliance', manualEntryAllowed: true,
    originalSourceTarget: '100%; zero critical breach', currentTargetValue: 100, currentTargetOperator: '>=', currentTargetUnit: 'percent',
    frequency: 'Monthly', trigger: 'Monthly security & policy compliance audit', owner: 'Security & Governance Lead',
    measurementSource: 'Security and policy audit records', sourceType: 'Manual', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Audit clearance log and security incident tracking', scope: 'All onsite and offshore resources',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 100, operator: '>=', unit: 'percent', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Canonical RFP SOW target' }],
    conditionalRules: [],
    compositeRules: [
      { condition: 'compliance', operator: '=', value: 100, unit: 'percent', label: 'Compliance Rate' },
      { condition: 'criticalBreaches', operator: '=', value: 0, unit: 'count', label: 'Critical Breaches' },
    ],
  },
  {
    id: 'SLA-010', slaId: 'SLA-010', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', name: 'Stakeholder satisfaction', category: 'resource_performance',
    description: 'Manager assessment of quality, collaboration, and communication.',
    measurementDescription: 'Manager assessment of quality, collaboration, and communication',
    measurementType: 'Rating', manualEntryAllowed: true, scale: 5,
    originalSourceTarget: '>=4.0 / 5', currentTargetValue: 4.0, currentTargetOperator: '>=', currentTargetUnit: 'score',
    frequency: 'Quarterly', trigger: 'Quarterly CSAT assessment survey', owner: 'Customer Experience Lead',
    measurementSource: 'Stakeholder satisfaction survey', sourceType: 'Manual', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Quarterly CSAT survey evaluation report', scope: 'All stakeholders',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 4.0, operator: '>=', unit: 'score', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Canonical RFP SOW target' }],
    conditionalRules: [], compositeRules: [],
  },
  {
    id: 'SLA-018', slaId: 'SLA-018', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', name: 'Knowledge transfer', category: 'resource_performance',
    description: 'Required handover and knowledge transfer completed.',
    measurementDescription: 'Required handover and knowledge transfer completed',
    measurementType: 'Boolean / Compliance', manualEntryAllowed: true,
    originalSourceTarget: '100%', currentTargetValue: 100, currentTargetOperator: '>=', currentTargetUnit: 'percent',
    frequency: 'Per Event', trigger: 'Resource transition / handover completion', owner: 'Knowledge Management Lead',
    measurementSource: 'KT sign-off certificate and checklist', sourceType: 'Manual', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Signed handover and KT completion attestation', scope: 'All transitions, rotations, and handovers',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 100, operator: '>=', unit: 'percent', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Canonical RFP SOW target' }],
    conditionalRules: [], compositeRules: [],
  },

  // ── Reporting ──
  {
    id: 'SLA-013', slaId: 'SLA-013', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', name: 'Timesheet Pack Submission', category: 'reporting',
    description: 'Monthly timesheet pack must be submitted by the 3rd business day after month end.',
    measurementType: 'Automated', manualEntryAllowed: true,
    originalSourceTarget: '<= 3rd business day after month end', currentTargetValue: 3, currentTargetOperator: '<=', currentTargetUnit: 'business_days',
    frequency: 'Monthly', trigger: 'Month-end', owner: 'Time Management Lead',
    measurementSource: 'Timesheet submission system', sourceType: 'System', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Timesheet pack submission timestamp', scope: 'All resources',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 3, operator: '<=', unit: 'business_days', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Original source target' }],
    conditionalRules: [], compositeRules: [],
  },
  {
    id: 'SLA-014', slaId: 'SLA-014', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', name: 'Monthly Service Report', category: 'reporting',
    description: 'Monthly service report delivered to stakeholders within defined timeline.',
    measurementType: 'Manual', manualEntryAllowed: true,
    originalSourceTarget: '<= 5 business days after month end', currentTargetValue: 5, currentTargetOperator: '<=', currentTargetUnit: 'business_days',
    frequency: 'Monthly', trigger: 'Month-end', owner: 'Delivery Lead',
    measurementSource: 'Report submission tracking', sourceType: 'Manual', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Report submission confirmation', scope: 'Monthly reporting',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 5, operator: '<=', unit: 'business_days', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Original source target' }],
    conditionalRules: [], compositeRules: [],
  },
  {
    id: 'SLA-015', slaId: 'SLA-015', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery', name: 'Contract Deliverables Compliance', category: 'reporting',
    description: 'All required monthly contractual governance packs submitted complete and verified.',
    measurementType: 'Manual', manualEntryAllowed: true,
    originalSourceTarget: '= 100%', currentTargetValue: 100, currentTargetOperator: '>=', currentTargetUnit: 'percent',
    frequency: 'Monthly', trigger: 'Monthly documentation audit', owner: 'Compliance Lead',
    measurementSource: 'Document checklist audit', sourceType: 'Manual', sourceStatus: 'Confirmed',
    evidenceRequirement: 'Contractual deliverable completion sign-off', scope: 'All active governance artifacts',
    status: 'Active', targetVersion: 1,
    targetHistory: [{ version: 1, value: 100, operator: '>=', unit: 'percent', effectiveDate: '2025-08-01', changedBy: 'System', reason: 'Original source target' }],
    conditionalRules: [], compositeRules: [],
  },
];

// ══════════════════════════════════════════════════════
// SLA MEASUREMENTS — Demo Data
// ══════════════════════════════════════════════════════
const INITIAL_MEASUREMENTS = [
  // Response & Mobilization
  { id: 'MEAS-001', slaId: 'SLA-001', slaName: 'Request Acknowledgement', period: 'Aug 2026', actualValue: 0.8, target: 1, operator: '<=', unit: 'business_days', assessedBy: 'Resource Management Lead', evidence: 'Automated tracking — average 0.8 business days', notes: 'All requests acknowledged within target', source: 'System', timestamp: '2026-09-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-002', slaId: 'SLA-002', slaName: 'Candidate Shortlist', period: 'Aug 2026', actualValue: 8, target: 10, operator: '<=', unit: 'business_days', assessedBy: 'Resource Management Lead', evidence: 'Average 8 business days for 5 requests processed', notes: '', source: 'System', timestamp: '2026-09-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-003', slaId: 'SLA-003', slaName: 'Long-Term Mobilization', period: 'Aug 2026', actualValue: 28, target: 30, operator: '<=', unit: 'calendar_days', assessedBy: 'Mobilization Lead', evidence: 'All onsite mobilizations completed within 30 days', notes: '', source: 'System', timestamp: '2026-09-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-004', slaId: 'SLA-004', slaName: 'Short-Term Mobilization', period: 'Aug 2026', actualValue: 12, target: 10, operator: '<=', unit: 'business_days', assessedBy: 'Mobilization Lead', evidence: 'Mobilization tracking log — 2 resources exceeded target due to visa delays', notes: 'Visa processing delays for 2 resources', source: 'System', timestamp: '2026-09-01T09:00:00', status: 'BREACH', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },

  // Replacement & Continuity
  { id: 'MEAS-005', slaId: 'SLA-005', slaName: 'Performance Replacement Shortlist', period: 'Aug 2026', actualValue: 4, target: 5, operator: '<=', unit: 'business_days', assessedBy: 'Resource Management Lead', evidence: '1 Common Role replacement processed in 4 business days', notes: 'Within target for Common Role', source: 'System', timestamp: '2026-09-01T09:00:00', status: 'MET', roleType: 'Common', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-006', slaId: 'SLA-006', slaName: 'Replacement Continuity', period: 'Aug 2026', actualValue: 3, target: 5, operator: '<=', unit: 'business_days', assessedBy: 'Delivery Lead', evidence: 'Knowledge transfer completed with 3-day overlap', notes: '', source: 'Manual', timestamp: '2026-09-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },

  // Resource Performance (8 Canonical SOW KPIs)
  { id: 'MEAS-007', slaId: 'SLA-008', slaName: 'Attendance and approved availability', period: 'Aug 2026', actualValue: 96.2, target: 95, operator: '>=', unit: 'percent', assessedBy: 'Delivery Lead', evidence: 'Monthly availability report from attendance system — 96.2% delivered', notes: 'Approved working time delivered; authorized leaves covered', source: 'System', timestamp: '2026-09-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-008', slaId: 'SLA-016', slaName: 'Task and milestone adherence', period: 'Aug 2026', actualValue: 93.5, target: 90, operator: '>=', unit: 'percent', assessedBy: 'Project Delivery Lead', evidence: 'Sprint and task tracking register — 93.5% milestones completed on time', notes: 'Within agreed timeline excluding dependencies', source: 'System', timestamp: '2026-09-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration' },
  { id: 'MEAS-009', slaId: 'SLA-009', slaName: 'First-pass quality', period: 'Q2 2026', actualValue: 91.0, target: 90, operator: '>=', unit: 'percent', assessedBy: 'Quality Assurance Lead', evidence: 'QA Acceptance log — 91% deliverables accepted without material rework', notes: 'Satisfies quality threshold', source: 'Manual', timestamp: '2026-07-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing' },
  { id: 'MEAS-010', slaId: 'SLA-017', slaName: 'Documentation compliance', period: 'Aug 2026', actualValue: 96.4, target: 95, operator: '>=', unit: 'percent', assessedBy: 'Compliance & Quality Lead', evidence: 'Document checklist audit — 96.4% completed with full work notes', notes: 'Runbooks and knowledge articles verified', source: 'Manual', timestamp: '2026-09-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-011', slaId: 'SLA-012', slaName: 'Timesheet accuracy and timeliness', period: 'Aug 2026', actualValue: 100, target: 100, operator: '>=', unit: 'percent', assessedBy: 'Time Management Lead', evidence: 'Monthly timesheet audit log — 100% complete and accurate submissions by deadline', notes: 'Zero late or rejected timesheets', source: 'System', timestamp: '2026-09-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-012', slaId: 'SLA-011', slaName: 'Policy and security compliance', period: 'Aug 2026', actualValue: 100, target: 100, operator: '>=', unit: 'percent', assessedBy: 'Security & Governance Lead', evidence: 'Security compliance audit — 100% policy adherence with zero critical breaches', notes: '100% compliance rate, zero critical breach', source: 'Manual', timestamp: '2026-09-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services' },
  { id: 'MEAS-013', slaId: 'SLA-010', slaName: 'Stakeholder satisfaction', period: 'Q2 2026', actualValue: 4.4, target: 4.0, operator: '>=', unit: 'score', assessedBy: 'Customer Experience Lead', evidence: 'Quarterly Manager CSAT survey — 4.4 / 5 average rating across 180 responses', notes: 'Exceeds contractual satisfaction floor', source: 'Manual', timestamp: '2026-07-15T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-014', slaId: 'SLA-018', slaName: 'Knowledge transfer', period: 'Aug 2026', actualValue: 100, target: 100, operator: '>=', unit: 'percent', assessedBy: 'Knowledge Management Lead', evidence: 'Formal KT checklist sign-off certificate — 100% completed', notes: 'All required handover sessions completed', source: 'Manual', timestamp: '2026-09-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },

  // Reporting
  { id: 'MEAS-015', slaId: 'SLA-013', slaName: 'Timesheet Pack Submission', period: 'Aug 2026', actualValue: 2, target: 3, operator: '<=', unit: 'business_days', assessedBy: 'Time Management Lead', evidence: 'Timesheet pack submitted on 2nd business day of September', notes: '', source: 'System', timestamp: '2026-09-02T09:00:00', status: 'MET', serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors' },
  { id: 'MEAS-016', slaId: 'SLA-014', slaName: 'Monthly Service Report', period: 'Aug 2026', actualValue: 4, target: 5, operator: '<=', unit: 'business_days', assessedBy: 'Delivery Lead', evidence: 'Monthly report delivered on 4th business day', notes: '', source: 'Manual', timestamp: '2026-09-04T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-017', slaId: 'SLA-015', slaName: 'Contract Deliverables Compliance', period: 'Aug 2026', actualValue: 100, target: 100, operator: '>=', unit: 'percent', assessedBy: 'Compliance Lead', evidence: 'All monthly contractual deliverables validated and archived', notes: '', source: 'Manual', timestamp: '2026-09-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },

  // Historical measurements for trend
  { id: 'MEAS-018', slaId: 'SLA-008', slaName: 'Attendance and approved availability', period: 'Jul 2026', actualValue: 97.1, target: 95, operator: '>=', unit: 'percent', assessedBy: 'Delivery Lead', evidence: 'Monthly availability dashboard', notes: '', source: 'System', timestamp: '2026-08-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-019', slaId: 'SLA-008', slaName: 'Attendance and approved availability', period: 'Jun 2026', actualValue: 95.8, target: 95, operator: '>=', unit: 'percent', assessedBy: 'Delivery Lead', evidence: 'Monthly availability dashboard', notes: '', source: 'System', timestamp: '2026-07-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-020', slaId: 'SLA-008', slaName: 'Attendance and approved availability', period: 'May 2026', actualValue: 94.2, target: 95, operator: '>=', unit: 'percent', assessedBy: 'Delivery Lead', evidence: 'Monthly availability dashboard — multiple unplanned leaves', notes: 'Seasonal leave surge', source: 'System', timestamp: '2026-06-01T09:00:00', status: 'BREACH', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-021', slaId: 'SLA-012', slaName: 'Timesheet accuracy and timeliness', period: 'Jul 2026', actualValue: 100, target: 100, operator: '>=', unit: 'percent', assessedBy: 'Time Management Lead', evidence: 'Monthly timesheet audit', notes: '', source: 'System', timestamp: '2026-08-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-022', slaId: 'SLA-012', slaName: 'Timesheet accuracy and timeliness', period: 'Jun 2026', actualValue: 98.0, target: 100, operator: '>=', unit: 'percent', assessedBy: 'Time Management Lead', evidence: 'Monthly timesheet audit — 2 late submissions corrected', notes: '2 late submissions', source: 'System', timestamp: '2026-07-01T09:00:00', status: 'BREACH', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-023', slaId: 'SLA-001', slaName: 'Request Acknowledgement', period: 'Jul 2026', actualValue: 0.9, target: 1, operator: '<=', unit: 'business_days', assessedBy: 'Resource Management Lead', evidence: 'Automated tracking', notes: '', source: 'System', timestamp: '2026-08-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-024', slaId: 'SLA-001', slaName: 'Request Acknowledgement', period: 'Jun 2026', actualValue: 1.2, target: 1, operator: '<=', unit: 'business_days', assessedBy: 'Resource Management Lead', evidence: 'Automated tracking — 1 delayed due to holiday period', notes: 'Holiday staffing gap', source: 'System', timestamp: '2026-07-01T09:00:00', status: 'BREACH', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
  { id: 'MEAS-025', slaId: 'SLA-016', slaName: 'Task and milestone adherence', period: 'Jul 2026', actualValue: 91.8, target: 90, operator: '>=', unit: 'percent', assessedBy: 'Project Delivery Lead', evidence: 'Task tracking system report', notes: '', source: 'System', timestamp: '2026-08-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration' },
  { id: 'MEAS-026', slaId: 'SLA-017', slaName: 'Documentation compliance', period: 'Jul 2026', actualValue: 95.2, target: 95, operator: '>=', unit: 'percent', assessedBy: 'Compliance Lead', evidence: 'Knowledge audit checklist', notes: '', source: 'Manual', timestamp: '2026-08-01T09:00:00', status: 'MET', serviceDomainId: 'TWR-07', serviceDomain: 'Service Management, Governance, and Delivery' },
];

// ── Initial Resource Requests (12 demo records) ──
const INITIAL_RESOURCE_REQUESTS = [
  {
    id: 'RRQ-0001', type: 'New', requestRef: 'RRQ-2026-001', roleCode: 'FC-SD', roleTitle: 'SAP SD Functional Consultant',
    requiredLevel: 'L2', engagementType: 'Dedicated', assignmentObjective: 'Support SAP S/4HANA Sales & Distribution module for customer ordering and billing operations',
    mandatorySkills: 'SAP SD, S/4HANA, Pricing, Output Management', mandatoryCertifications: 'SAP S/4HANA Sales',
    expectedActivities: 'Incident resolution, enhancement analysis, user training',
    duration: '12 months', expectedStartDate: '2026-10-01', workLocation: 'Onsite - Riyadh', deliveryMode: 'Onsite',
    workingHours: 'Standard (08:00-17:00 AST)', onCall: false, priority: 'High', criticality: 'Business Critical',
    candidate: '', approvedUnitRate: '', notes: 'Must have GCC experience',
    status: 'Candidate Shortlisted', submittedDate: '2026-08-15', submittedBy: 'Fatima Al-Otaibi',
    serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', approver: 'Dr. Tariq Al Nuaimi', approvedDate: '2026-08-18',
    supplierConfirmation: '', startDate: '', endDate: '',
  },
  {
    id: 'RRQ-0002', type: 'New', requestRef: 'RRQ-2026-002', roleCode: 'TC-ABAP', roleTitle: 'Senior ABAP Developer',
    requiredLevel: 'L3', engagementType: 'Dedicated', assignmentObjective: 'ABAP/Fiori development for enhancement backlog and digital extensions',
    mandatorySkills: 'ABAP, Fiori, SAP UI5, CDS Views, OData', mandatoryCertifications: 'SAP ABAP Developer',
    expectedActivities: 'Enhancement development, code review, technical design',
    duration: '18 months', expectedStartDate: '2026-10-15', workLocation: 'Offshore', deliveryMode: 'Offshore',
    workingHours: 'Standard', onCall: false, priority: 'Medium', criticality: 'Important',
    candidate: '', approvedUnitRate: '', notes: '',
    status: 'Pending Approval', submittedDate: '2026-08-20', submittedBy: 'Fatima Al-Otaibi',
    serviceDomainId: 'TWR-03', serviceDomain: 'Applications, Digital, and Integration', approver: 'Dr. Tariq Al Nuaimi', approvedDate: '',
    supplierConfirmation: '', startDate: '', endDate: '',
  },
  {
    id: 'RRQ-0003', type: 'New', requestRef: 'RRQ-2026-003', roleCode: 'FC-MM', roleTitle: 'SAP MM Consultant',
    requiredLevel: 'L2', engagementType: 'Dedicated', assignmentObjective: 'Procurement and materials management support',
    mandatorySkills: 'SAP MM, S/4HANA Sourcing, Vendor Master', mandatoryCertifications: 'SAP S/4HANA Sourcing',
    expectedActivities: 'Incident support, process optimization',
    duration: '12 months', expectedStartDate: '2026-11-01', workLocation: 'Onsite - Jeddah', deliveryMode: 'Onsite',
    workingHours: 'Standard', onCall: false, priority: 'Medium', criticality: 'Important',
    candidate: '', approvedUnitRate: '', notes: '',
    status: 'Acknowledged', submittedDate: '2026-09-01', submittedBy: 'Ravi Shankar',
    serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', approver: '', approvedDate: '',
    supplierConfirmation: '', startDate: '', endDate: '',
  },
  {
    id: 'RRQ-0004', type: 'Replacement', requestRef: 'RRQ-2026-004', roleCode: 'FC-FICO', roleTitle: 'SAP FICO Consultant',
    requiredLevel: 'L2', engagementType: 'Dedicated', assignmentObjective: 'Replace outgoing FICO resource for financial closing and reporting',
    mandatorySkills: 'SAP FI, CO, S/4HANA Finance', mandatoryCertifications: 'SAP S/4HANA Finance',
    expectedActivities: 'Month-end support, reporting, configuration',
    duration: '12 months', expectedStartDate: '2026-10-01', workLocation: 'Offshore', deliveryMode: 'Offshore',
    workingHours: 'Standard', onCall: false, priority: 'High', criticality: 'Business Critical',
    existingResource: 'Deepak Kumar', existingResourceId: 'RES-007',
    replacementReason: 'Resource rotation per contract terms', replacementDeadline: '2026-10-01',
    replacementStatus: 'Approval', continuityRequirement: '5 business days KT overlap',
    candidate: 'Shortlisted — 2 candidates', approvedUnitRate: '', notes: 'Knowledge transfer period required',
    status: 'Approved', submittedDate: '2026-08-25', submittedBy: 'Fatima Al-Otaibi',
    serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', approver: 'Dr. Tariq Al Nuaimi', approvedDate: '2026-08-28',
    supplierConfirmation: '', startDate: '', endDate: '',
  },
  {
    id: 'RRQ-0005', type: 'New', requestRef: 'RRQ-2026-005', roleCode: 'FC-SF', roleTitle: 'SuccessFactors Consultant',
    requiredLevel: 'L2', engagementType: 'Shared', assignmentObjective: 'SuccessFactors EC and Recruiting support',
    mandatorySkills: 'SAP SuccessFactors EC, Recruiting, Onboarding', mandatoryCertifications: 'SF EC Certified',
    expectedActivities: 'Configuration, support, quarterly releases',
    duration: '12 months', expectedStartDate: '2026-11-15', workLocation: 'Offshore', deliveryMode: 'Offshore',
    workingHours: 'Standard', onCall: false, priority: 'Low', criticality: 'Standard',
    candidate: '', approvedUnitRate: '', notes: '',
    status: 'Requested', submittedDate: '2026-09-05', submittedBy: 'Sara Al Marzouqi',
    serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', approver: '', approvedDate: '',
    supplierConfirmation: '', startDate: '', endDate: '',
  },
  {
    id: 'RRQ-0006', type: 'New', requestRef: 'RRQ-2026-006', roleCode: 'TC-BASIS', roleTitle: 'SAP BASIS Administrator',
    requiredLevel: 'L3', engagementType: 'Dedicated', assignmentObjective: 'Infrastructure administration and HANA DB management',
    mandatorySkills: 'SAP BASIS, HANA Admin, Solution Manager', mandatoryCertifications: 'SAP HANA Admin',
    expectedActivities: 'System monitoring, transport management, upgrades',
    duration: '24 months', expectedStartDate: '2026-10-01', workLocation: 'Onsite - Riyadh', deliveryMode: 'Onsite',
    workingHours: 'Extended (on-call rotation)', onCall: true, priority: 'Critical', criticality: 'Mission Critical',
    candidate: 'Confirmed — onboarding initiated', approvedUnitRate: '', notes: 'On-call rotation required',
    status: 'Mobilization', submittedDate: '2026-07-20', submittedBy: 'Fatima Al-Otaibi',
    serviceDomainId: 'TWR-02', serviceDomain: 'Infrastructure, Cloud, and Platform Services', approver: 'Dr. Tariq Al Nuaimi', approvedDate: '2026-07-25',
    supplierConfirmation: 'Confirmed', startDate: '2026-10-01', endDate: '2028-09-30',
  },
  {
    id: 'RRQ-0007', type: 'New', requestRef: 'RRQ-2026-007', roleCode: 'FC-EWM', roleTitle: 'SAP EWM Consultant',
    requiredLevel: 'L2', engagementType: 'Dedicated', assignmentObjective: 'Warehouse management and logistics support',
    mandatorySkills: 'SAP EWM, TM, S/4HANA Logistics', mandatoryCertifications: 'SAP EWM Certified',
    expectedActivities: 'Incident resolution, optimization, testing',
    duration: '12 months', expectedStartDate: '2026-12-01', workLocation: 'Onsite - Dammam', deliveryMode: 'Onsite',
    workingHours: 'Standard', onCall: false, priority: 'Medium', criticality: 'Important',
    candidate: '', approvedUnitRate: '', notes: '',
    status: 'Requested', submittedDate: null, submittedBy: 'Omar Bashar',
    serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', approver: '', approvedDate: '',
    supplierConfirmation: '', startDate: '', endDate: '',
  },
  {
    id: 'RRQ-0008', type: 'Replacement', requestRef: 'RRQ-2026-008', roleCode: 'FC-PP', roleTitle: 'SAP PP Consultant',
    requiredLevel: 'L2', engagementType: 'Dedicated', assignmentObjective: 'Replace outgoing PP consultant for manufacturing operations',
    mandatorySkills: 'SAP PP, QM, MES', mandatoryCertifications: 'SAP S/4HANA Manufacturing',
    expectedActivities: 'Production support, quality management',
    duration: '12 months', expectedStartDate: '2026-11-01', workLocation: 'Onsite - Riyadh', deliveryMode: 'Onsite',
    existingResource: 'Hassan Al Nuaimi', existingResourceId: 'RES-013',
    replacementReason: 'Performance improvement', replacementDeadline: '2026-11-01',
    replacementStatus: 'Completed', continuityRequirement: '10 business days KT',
    candidate: 'Replacement onboarded', approvedUnitRate: '',
    workingHours: 'Standard', onCall: false, priority: 'High', criticality: 'Business Critical',
    notes: '', status: 'Onboarded', submittedDate: '2026-07-10', submittedBy: 'Fatima Al-Otaibi',
    serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', approver: 'Dr. Tariq Al Nuaimi', approvedDate: '2026-07-15',
    supplierConfirmation: 'Confirmed', startDate: '2026-08-15', endDate: '2027-08-14',
  },
  {
    id: 'RRQ-0009', type: 'New', requestRef: 'RRQ-2026-009', roleCode: 'FC-Ariba', roleTitle: 'SAP Ariba Consultant',
    requiredLevel: 'L2', engagementType: 'Shared', assignmentObjective: 'Ariba sourcing and procurement support',
    mandatorySkills: 'SAP Ariba, Sourcing, Contracts', mandatoryCertifications: 'Ariba Sourcing Certified',
    expectedActivities: 'Support, configuration, supplier enablement',
    duration: '12 months', expectedStartDate: '2026-11-15', workLocation: 'Offshore', deliveryMode: 'Offshore',
    workingHours: 'Standard', onCall: false, priority: 'Low', criticality: 'Standard',
    candidate: '', approvedUnitRate: '', notes: '',
    status: 'Rejected', submittedDate: '2026-08-10', submittedBy: 'Noura Al Shamsi',
    serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', approver: '', approvedDate: '',
    rejectionReason: 'Budget constraints — deferred to Q1 2027',
    supplierConfirmation: '', startDate: '', endDate: '',
  },
  {
    id: 'RRQ-0010', type: 'New', requestRef: 'RRQ-2026-010', roleCode: 'FC-BW', roleTitle: 'SAP BW/4HANA Consultant',
    requiredLevel: 'L3', engagementType: 'Dedicated', assignmentObjective: 'BW reporting and analytics support',
    mandatorySkills: 'SAP BW/4HANA, BPC, Analytics Cloud', mandatoryCertifications: 'SAP BW/4HANA',
    expectedActivities: 'Report development, data modeling',
    duration: '18 months', expectedStartDate: '2026-10-15', workLocation: 'Offshore', deliveryMode: 'Offshore',
    workingHours: 'Standard', onCall: false, priority: 'Medium', criticality: 'Important',
    candidate: '', approvedUnitRate: '', notes: '',
    status: 'Candidate Shortlisted', submittedDate: '2026-08-28', submittedBy: 'Lakshmi Devi',
    serviceDomainId: 'TWR-04', serviceDomain: 'Data, Analytics, AI, and Automation', approver: 'Dr. Tariq Al Nuaimi', approvedDate: '2026-09-02',
    supplierConfirmation: '', startDate: '', endDate: '',
  },
  {
    id: 'RRQ-0011', type: 'New', requestRef: 'RRQ-2026-011', roleCode: 'FC-GRC', roleTitle: 'SAP GRC Consultant',
    requiredLevel: 'L2', engagementType: 'Dedicated', assignmentObjective: 'GRC access control and audit management',
    mandatorySkills: 'SAP GRC AC, Process Control', mandatoryCertifications: 'SAP GRC Certified',
    expectedActivities: 'Role design, SoD analysis, audit support',
    duration: '12 months', expectedStartDate: '2026-10-01', workLocation: 'Onsite - Riyadh', deliveryMode: 'Onsite',
    workingHours: 'Standard', onCall: false, priority: 'High', criticality: 'Business Critical',
    candidate: '', approvedUnitRate: '', notes: '',
    status: 'Acknowledged', submittedDate: '2026-09-10', submittedBy: 'Mariam Al Suwaidi',
    serviceDomainId: 'TWR-05', serviceDomain: 'Architecture, Quality, and Testing', approver: '', approvedDate: '',
    supplierConfirmation: '', startDate: '', endDate: '',
  },
  {
    id: 'RRQ-0012', type: 'New', requestRef: 'RRQ-2026-012', roleCode: 'FC-CRM', roleTitle: 'Dynamics 365 Consultant',
    requiredLevel: 'L2', engagementType: 'Shared', assignmentObjective: 'CRM and field service support',
    mandatorySkills: 'Dynamics 365 Sales, Field Service, Power Platform', mandatoryCertifications: 'Dynamics 365 Certified',
    expectedActivities: 'Support, customization, integration',
    duration: '12 months', expectedStartDate: '2026-11-01', workLocation: 'Offshore', deliveryMode: 'Offshore',
    workingHours: 'Standard', onCall: false, priority: 'Medium', criticality: 'Important',
    candidate: '', approvedUnitRate: '', notes: '',
    status: 'Requested', submittedDate: '2026-09-08', submittedBy: 'Hind Al Mazrouei',
    serviceDomainId: 'TWR-06', serviceDomain: 'SAP ERP and SuccessFactors', approver: '', approvedDate: '',
    supplierConfirmation: '', startDate: '', endDate: '',
  },
];

// ── Initial Resource Assignments (linked directly to canonical RESOURCES) ──
const INITIAL_ASSIGNMENTS = RESOURCES.map((r, idx) => ({
  id: `ASG-${String(idx + 1).padStart(4, '0')}`,
  resourceId: r.id,
  resourceName: r.name,
  role: r.role,
  roleCode: r.roleCode || '',
  level: r.level || (r.roleCode?.startsWith('TL-') || r.roleCode?.startsWith('SC-') || r.roleCode === 'TC-BASIS' || r.roleCode === 'VIP-SPEC' ? 'L3' : 'L2'),
  serviceDomainId: r.serviceDomainId || r.towerId || 'TWR-01',
  serviceDomain: r.serviceDomain || 'IT Helpdesk & End User Services',
  tower: r.serviceDomainId || r.towerId || 'TWR-01',
  towerName: r.serviceDomain || 'IT Helpdesk & End User Services',
  service: r.processGroup,
  project: `${r.serviceDomain || 'Core'} AMS Operations`,
  startDate: r.onboardingDate || r.startDate || '2025-08-01',
  endDate: r.endDate || '2027-08-31',
  allocation: idx % 5 === 0 ? 80 : 100,
  status: idx % 10 === 9 ? 'Planned' : idx % 12 === 11 ? 'On Leave' : idx % 8 === 7 ? 'Ending' : 'Active',
  health: idx % 7 === 6 ? 'At Risk' : idx % 10 === 9 ? 'Warning' : 'Healthy',
  location: r.location,
  track: r.track,
  manager: r.manager || '',
  deliveryTrack: r.track,
}));

// ══════════════════════════════════════════════════════
// COMPLIANCE ENGINE (Section 20)
// ══════════════════════════════════════════════════════
function evaluateCompliance(actualValue, targetValue, operator) {
  if (actualValue === null || actualValue === undefined) return 'PENDING';
  const actual = parseFloat(actualValue);
  const target = parseFloat(targetValue);
  if (isNaN(actual) || isNaN(target)) return 'PENDING';

  switch (operator) {
    case '>=': return actual >= target ? 'MET' : 'BREACH';
    case '<=': return actual <= target ? 'MET' : 'BREACH';
    case '=':  return actual === target ? 'MET' : 'BREACH';
    case '>':  return actual > target ? 'MET' : 'BREACH';
    case '<':  return actual < target ? 'MET' : 'BREACH';
    default:   return 'PENDING';
  }
}

function getConditionalTarget(sla, context = {}) {
  if (sla.conditionalRules && sla.conditionalRules.length > 0 && context.roleType) {
    const rule = sla.conditionalRules.find(r => r.value === context.roleType);
    if (rule) return { targetValue: rule.targetValue, operator: rule.operator, unit: rule.unit, label: rule.label };
  }
  return { targetValue: sla.currentTargetValue, operator: sla.currentTargetOperator, unit: sla.currentTargetUnit };
}

function evaluateComposite(sla, compositeActuals = {}) {
  if (!sla.compositeRules || sla.compositeRules.length === 0) return null;
  return sla.compositeRules.every(rule => {
    const actual = compositeActuals[rule.condition];
    if (actual === undefined || actual === null) return false;
    return evaluateCompliance(actual, rule.value, rule.operator) === 'MET';
  }) ? 'MET' : 'BREACH';
}

// Display status mapping
function displayStatus(internalStatus) {
  switch (internalStatus) {
    case 'MET': return 'Compliant';
    case 'BREACH': return 'Breached';
    case 'PENDING': return 'Pending';
    default: return internalStatus;
  }
}

// ══════════════════════════════════════════════════════
// IN-MEMORY STORE
// ══════════════════════════════════════════════════════
let globalRequests = [...INITIAL_RESOURCE_REQUESTS];
let globalAssignments = [...INITIAL_ASSIGNMENTS];
let globalSLAs = [...INITIAL_SLAS];
let globalMeasurements = [...INITIAL_MEASUREMENTS];
const listeners = new Set();

function notify() { listeners.forEach(l => l()); }

export const resourceManagementStore = {
  // ── Requests ──
  getRequests: () => [...globalRequests],
  getRequestById: (id) => globalRequests.find(r => r.id === id) || null,

  addRequest: (data) => {
    const nextNum = globalRequests.length + 1;
    const newId = `RRQ-${String(nextNum).padStart(4, '0')}`;
    const newReq = {
      id: newId,
      requestRef: `RRQ-2026-${String(nextNum).padStart(3, '0')}`,
      type: data.type || 'New',
      roleCode: data.roleCode || '',
      roleTitle: data.roleTitle || '',
      requiredLevel: data.requiredLevel || 'L2',
      engagementType: data.engagementType || 'Dedicated',
      assignmentObjective: data.assignmentObjective || '',
      mandatorySkills: data.mandatorySkills || '',
      mandatoryCertifications: data.mandatoryCertifications || '',
      expectedActivities: data.expectedActivities || '',
      duration: data.duration || '12 months',
      expectedStartDate: data.expectedStartDate || '',
      workLocation: data.workLocation || '',
      deliveryMode: data.deliveryMode || 'Onsite',
      workingHours: data.workingHours || 'Standard',
      onCall: data.onCall || false,
      priority: data.priority || 'Medium',
      criticality: data.criticality || 'Standard',
      candidate: data.candidate || '',
      approvedUnitRate: data.approvedUnitRate || '',
      notes: data.notes || '',
      status: 'Requested',
      submittedDate: new Date().toISOString().split('T')[0],
      serviceDomainId: data.serviceDomainId || 'TWR-07',
      serviceDomain: data.serviceDomain || 'Service Management, Governance, and Delivery',
      approver: data.approver || '',
      approvedDate: '',
      supplierConfirmation: '',
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      // Replacement-specific fields
      existingResource: data.existingResource || '',
      existingResourceId: data.existingResourceId || '',
      replacementReason: data.replacementReason || '',
      replacementDeadline: data.replacementDeadline || '',
      replacementStatus: data.type === 'Replacement' ? 'Replacement Raised' : '',
      continuityRequirement: data.continuityRequirement || '',
    };
    globalRequests = [newReq, ...globalRequests];
    notify();
    return newReq;
  },

  updateRequestStatus: (id, newStatus, additionalData = {}) => {
    let onboardedReq = null;
    globalRequests = globalRequests.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, status: newStatus, ...additionalData };
      // When onboarded, update the replacement status too
      if (newStatus === 'Onboarded' && r.type === 'Replacement') {
        updated.replacementStatus = 'Completed';
      }
      if (newStatus === 'Onboarded') {
        onboardedReq = updated;
      }
      return updated;
    });

    if (onboardedReq) {
      const candName = onboardedReq.candidate || `${onboardedReq.roleTitle || 'Consultant'} (${onboardedReq.id})`;
      const existingRes = RESOURCES.find(res => res.name === candName);
      if (!existingRes) {
        const newId = `RES-${String(RESOURCES.length + 1).padStart(3, '0')}`;
        const sDomain = getServiceDomainById(onboardedReq.serviceDomainId || onboardedReq.tower);
        const newResource = {
          id: newId,
          positionId: `POS-${String(RESOURCES.length + 1).padStart(3, '0')}`,
          name: candName,
          track: onboardedReq.deliveryMode === 'Offshore' ? 'AMS-OF-RUN' : 'AMS-ON-RUN',
          serviceDomainId: sDomain.id,
          serviceDomain: sDomain.name,
          towerId: sDomain.id,
          processGroup: 'General Operations',
          nationality: 'Saudi Arabia',
          resourceType: 'Saudi',
          location: onboardedReq.deliveryMode || 'Onsite',
          onboardingDate: new Date().toISOString().split('T')[0],
          reportingManager: 'RES-002',
          manager: 'Fatima Al-Otaibi',
          status: 'Active',
          gender: 'Male',
          skill: onboardedReq.mandatorySkills || 'SAP ERP',
          certification: onboardedReq.mandatoryCertifications || 'Certified Professional',
          phone: '+966-55-XXX-9999',
          email: `${candName.toLowerCase().replace(/\s+/g, '.')}@kaartech.com`,
          entity: 'ENT-001',
          role: onboardedReq.roleTitle || 'Functional Consultant',
          roleCode: onboardedReq.roleCode || 'FC-GEN',
          experience: 6,
          relevantExperience: 5,
          education: 'BSc Computer Science',
          professionalSummary: onboardedReq.assignmentObjective || 'Consultant onboarded through Resource Request pipeline.',
          certifications: onboardedReq.mandatoryCertifications ? [onboardedReq.mandatoryCertifications] : ['SAP Certified'],
          technologies: onboardedReq.mandatorySkills ? onboardedReq.mandatorySkills.split(',').map(s => s.trim()) : ['SAP'],
          languages: ['Arabic', 'English'],
          availability: 100,
          currentAssignment: onboardedReq.assignmentObjective || 'AMS Operations',
        };
        RESOURCES.push(newResource);

        // Add corresponding assignment
        const newAsg = {
          id: `ASG-${String(globalAssignments.length + 1).padStart(4, '0')}`,
          resourceId: newId,
          resourceName: newResource.name,
          role: newResource.role,
          roleCode: newResource.roleCode,
          level: onboardedReq.requiredLevel || 'L2',
          serviceDomainId: newResource.serviceDomainId,
          serviceDomain: newResource.serviceDomain,
          service: newResource.processGroup,
          project: `${newResource.serviceDomain} Operations`,
          startDate: newResource.onboardingDate,
          endDate: '2027-08-31',
          allocation: 100,
          status: 'Active',
          health: 'Healthy',
          location: newResource.location,
          track: newResource.track,
          manager: 'Fatima Al-Otaibi',
          deliveryTrack: newResource.track,
        };
        globalAssignments = [newAsg, ...globalAssignments];
      }
    }

    notify();
  },

  // ── Assignments ──
  getAssignments: () => [...globalAssignments],
  getAssignmentById: (id) => globalAssignments.find(a => a.id === id) || null,
  getAssignmentByResourceId: (resourceId) => globalAssignments.find(a => a.resourceId === resourceId) || null,

  updateAssignment: (id, data) => {
    globalAssignments = globalAssignments.map(a => a.id === id ? { ...a, ...data } : a);
    notify();
  },

  // ── SLA Definitions ──
  getSLAs: () => [...globalSLAs],
  getSLAById: (id) => globalSLAs.find(s => s.id === id) || null,

  addSLA: (data) => {
    const nextNum = globalSLAs.length + 1;
    const newId = `SLA-${String(nextNum).padStart(3, '0')}`;
    const newSLA = {
      id: newId,
      name: data.name || 'New SLA',
      category: data.category || 'resource_performance',
      description: data.description || '',
      measurementType: data.measurementType || 'Manual',
      manualEntryAllowed: data.manualEntryAllowed !== false,
      originalSourceTarget: data.originalSourceTarget || data.target || '',
      currentTargetValue: parseFloat(data.currentTargetValue || data.targetValue) || 0,
      currentTargetOperator: data.currentTargetOperator || '>=',
      currentTargetUnit: data.currentTargetUnit || data.unit || 'percent',
      frequency: data.frequency || data.measurementPeriod || 'Monthly',
      trigger: data.trigger || '',
      owner: data.owner || '',
      measurementSource: data.measurementSource || '',
      sourceType: data.sourceType || 'Manual',
      sourceStatus: data.sourceStatus || 'Configurable',
      evidenceRequirement: data.evidenceRequirement || '',
      scope: data.scope || 'All resources',
      status: 'Active',
      targetVersion: 1,
      targetHistory: [{
        version: 1,
        value: parseFloat(data.currentTargetValue || data.targetValue) || 0,
        operator: data.currentTargetOperator || '>=',
        unit: data.currentTargetUnit || data.unit || 'percent',
        effectiveDate: new Date().toISOString().split('T')[0],
        changedBy: 'Admin',
        reason: 'Initial creation',
      }],
      conditionalRules: data.conditionalRules || [],
      compositeRules: data.compositeRules || [],
    };
    globalSLAs = [newSLA, ...globalSLAs];
    notify();
    return newSLA;
  },

  updateSLA: (id, data) => {
    globalSLAs = globalSLAs.map(s => s.id === id ? { ...s, ...data } : s);
    notify();
  },

  updateSLATarget: (id, newTargetValue, newOperator, newUnit, reason) => {
    globalSLAs = globalSLAs.map(s => {
      if (s.id !== id) return s;
      const newVersion = s.targetVersion + 1;
      const newHistory = [...(s.targetHistory || []), {
        version: newVersion,
        value: parseFloat(newTargetValue),
        operator: newOperator || s.currentTargetOperator,
        unit: newUnit || s.currentTargetUnit,
        effectiveDate: new Date().toISOString().split('T')[0],
        changedBy: 'Admin',
        reason: reason || 'Target updated',
      }];
      return {
        ...s,
        currentTargetValue: parseFloat(newTargetValue),
        currentTargetOperator: newOperator || s.currentTargetOperator,
        currentTargetUnit: newUnit || s.currentTargetUnit,
        targetVersion: newVersion,
        targetHistory: newHistory,
        // originalSourceTarget remains unchanged
      };
    });
    notify();
  },

  toggleSLAStatus: (id) => {
    globalSLAs = globalSLAs.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s);
    notify();
  },

  // ── SLA Measurements ──
  getMeasurements: () => [...globalMeasurements],

  addMeasurement: (data) => {
    const nextNum = globalMeasurements.length + 1;
    const newId = `MEAS-${String(nextNum).padStart(3, '0')}`;
    const sla = globalSLAs.find(s => s.id === data.slaId);
    if (!sla) return null;

    // Get applicable target (may be conditional)
    const target = getConditionalTarget(sla, { roleType: data.roleType });
    const actualValue = parseFloat(data.actualValue);

    // Calculate compliance
    let status;
    if (sla.compositeRules && sla.compositeRules.length > 0 && data.compositeActuals) {
      status = evaluateComposite(sla, data.compositeActuals);
    } else {
      status = evaluateCompliance(actualValue, target.targetValue, target.operator);
    }

    const newMeas = {
      id: newId,
      slaId: data.slaId,
      slaName: sla.name,
      period: data.period || '',
      actualValue,
      target: target.targetValue,
      operator: target.operator,
      unit: target.unit,
      assessedBy: data.assessedBy || 'Current User',
      evidence: data.evidence || '',
      notes: data.notes || '',
      source: sla.manualEntryAllowed ? (data.source || 'Manual') : 'System',
      timestamp: new Date().toISOString(),
      status,
      roleType: data.roleType || null,
    };
    globalMeasurements = [newMeas, ...globalMeasurements];
    notify();
    return newMeas;
  },

  // ── Computed: Breaches ──
  getBreaches: () => {
    return globalMeasurements
      .filter(m => m.status === 'BREACH')
      .map(m => {
        const sla = globalSLAs.find(s => s.id === m.slaId);
        const target = getConditionalTarget(sla || {}, { roleType: m.roleType });
        const breachAmount = sla?.currentTargetOperator === '<=' || sla?.currentTargetOperator === '<'
          ? (m.actualValue - target.targetValue)
          : (target.targetValue - m.actualValue);
        return {
          ...m,
          category: sla?.category || '',
          categoryLabel: SLA_CATEGORIES.find(c => c.key === sla?.category)?.label || '',
          breachAmount: Math.abs(breachAmount).toFixed(1),
          owner: sla?.owner || '',
          slaDescription: sla?.description || '',
        };
      });
  },

  // ── Computed KPIs ──
  getRequestKPIs: () => {
    const reqs = globalRequests;
    return {
      total: reqs.length,
      requested: reqs.filter(r => r.status === 'Requested').length,
      acknowledged: reqs.filter(r => r.status === 'Acknowledged').length,
      candidateShortlisted: reqs.filter(r => r.status === 'Candidate Shortlisted').length,
      pendingApproval: reqs.filter(r => r.status === 'Pending Approval').length,
      approved: reqs.filter(r => r.status === 'Approved').length,
      mobilization: reqs.filter(r => r.status === 'Mobilization').length,
      onboarded: reqs.filter(r => r.status === 'Onboarded').length,
      assigned: reqs.filter(r => r.status === 'Assigned').length,
      closed: reqs.filter(r => r.status === 'Closed').length,
      rejected: reqs.filter(r => r.status === 'Rejected').length,
      newRequests: reqs.filter(r => r.type === 'New').length,
      replacements: reqs.filter(r => r.type === 'Replacement').length,
      activeOpen: reqs.filter(r => !['Onboarded', 'Assigned', 'Closed', 'Rejected'].includes(r.status)).length,
    };
  },

  getAssignmentKPIs: () => {
    const asgns = globalAssignments;
    return {
      total: asgns.length,
      active: asgns.filter(a => a.status === 'Active').length,
      endingSoon: asgns.filter(a => a.status === 'Ending Soon').length,
      onLeave: asgns.filter(a => a.status === 'On Leave').length,
      healthy: asgns.filter(a => a.health === 'Healthy').length,
      atRisk: asgns.filter(a => a.health === 'At Risk').length,
      warning: asgns.filter(a => a.health === 'Warning').length,
      onsite: asgns.filter(a => a.location === 'Onsite').length,
      offshore: asgns.filter(a => a.location === 'Offshore').length,
      avgAllocation: Math.round(asgns.reduce((sum, a) => sum + a.allocation, 0) / (asgns.length || 1)),
    };
  },

  getSLAKPIs: () => {
    const activeSLAs = globalSLAs.filter(s => s.status === 'Active');
    const meas = globalMeasurements;
    // Get latest measurement per SLA
    const latestBySlA = {};
    meas.forEach(m => {
      if (!latestBySlA[m.slaId] || new Date(m.timestamp) > new Date(latestBySlA[m.slaId].timestamp)) {
        latestBySlA[m.slaId] = m;
      }
    });
    const latestMeasurements = Object.values(latestBySlA);
    const met = latestMeasurements.filter(m => m.status === 'MET').length;
    const breached = latestMeasurements.filter(m => m.status === 'BREACH').length;
    const pending = activeSLAs.length - latestMeasurements.length;

    // Canonical 8 Resource Performance KPIs
    const perfSLAs = activeSLAs.filter(s => s.category === 'resource_performance');
    const resourcePerformanceKPIs = perfSLAs.map(sla => {
      const latest = latestBySlA[sla.id];
      const actualValue = latest ? latest.actualValue : null;
      let status = 'PENDING';
      if (latest) {
        status = latest.status || evaluateCompliance(actualValue, sla.currentTargetValue, sla.currentTargetOperator);
      }
      const history = meas.filter(m => m.slaId === sla.id).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      return {
        id: sla.id,
        slaId: sla.id,
        name: sla.name,
        category: 'Resource Performance',
        serviceDomain: sla.serviceDomain,
        serviceDomainId: sla.serviceDomainId,
        measurementType: sla.measurementType,
        measurementDescription: sla.measurementDescription || sla.description,
        targetValue: sla.currentTargetValue,
        targetOperator: sla.currentTargetOperator,
        targetUnit: sla.currentTargetUnit,
        target: sla.originalSourceTarget || `${sla.currentTargetOperator}${sla.currentTargetValue}${sla.currentTargetUnit === 'percent' ? '%' : ''}`,
        actualValue,
        actual: actualValue !== null && actualValue !== undefined ? `${actualValue}${sla.currentTargetUnit === 'percent' ? '%' : sla.currentTargetUnit === 'score' ? ' / 5.0' : ''}` : 'Pending',
        status,
        owner: sla.owner,
        lastMeasured: latest ? (latest.period || 'Aug 2026') : 'Pending',
        evidence: latest ? latest.evidence : sla.evidenceRequirement,
        manualEntryAllowed: sla.manualEntryAllowed,
        scale: sla.scale || null,
        history,
      };
    });

    return {
      totalSLAs: activeSLAs.length,
      totalMeasurements: meas.length,
      met,
      breached,
      pending: pending > 0 ? pending : 0,
      complianceRate: latestMeasurements.length > 0 ? Math.round((met / latestMeasurements.length) * 100) : 0,
      overallScore: latestMeasurements.length > 0 ? (latestMeasurements.reduce((sum, m) => sum + (m.status === 'MET' ? 100 : m.status === 'BREACH' ? 40 : 0), 0) / latestMeasurements.length).toFixed(1) : '0',
      resourcePerformanceKPIs,
      byCategory: SLA_CATEGORIES.map(cat => {
        const catSLAs = activeSLAs.filter(s => s.category === cat.key);
        const catMeas = catSLAs.map(s => latestBySlA[s.id]).filter(Boolean);
        const catMet = catMeas.filter(m => m.status === 'MET').length;
        return {
          category: cat.key,
          label: cat.label,
          total: catSLAs.length,
          met: catMet,
          breached: catMeas.filter(m => m.status === 'BREACH').length,
          compliance: catMeas.length > 0 ? Math.round((catMet / catMeas.length) * 100) : 0,
        };
      }),
    };
  },

  // ── Utility exports ──
  evaluateCompliance,
  getConditionalTarget,
  evaluateComposite,
  displayStatus,
  SLA_CATEGORIES,

  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

// ── React Hook ──

// ── Centralized Domain Selectors (Section 60) ──
export function getResourcesByServiceDomain(domainId) {
  if (!domainId || domainId === 'all') return RESOURCES;
  return RESOURCES.filter(r => r.serviceDomainId === domainId || r.towerId === domainId);
}

export function getRolesByServiceDomain(domainId) {
  if (!domainId || domainId === 'all') return ROLES;
  return ROLES.filter(r => r.serviceDomainId === domainId || r.tower === domainId);
}

export function getAssignmentsByServiceDomain(domainId) {
  const current = resourceManagementStore.getAssignments();
  if (!domainId || domainId === 'all') return current;
  return current.filter(a => a.serviceDomainId === domainId || a.tower === domainId);
}

export function getSLAsByServiceDomain(domainId) {
  const current = resourceManagementStore.getSLAs();
  if (!domainId || domainId === 'all') return current;
  return current.filter(s => s.serviceDomainId === domainId || s.serviceDomainId === 'TWR-ALL');
}

export function useResourceManagement() {
  const [requests, setRequests] = useState(() => resourceManagementStore.getRequests());
  const [assignments, setAssignments] = useState(() => resourceManagementStore.getAssignments());
  const [slas, setSLAs] = useState(() => resourceManagementStore.getSLAs());
  const [measurements, setMeasurements] = useState(() => resourceManagementStore.getMeasurements());

  useEffect(() => {
    const unsub = resourceManagementStore.subscribe(() => {
      setRequests(resourceManagementStore.getRequests());
      setAssignments(resourceManagementStore.getAssignments());
      setSLAs(resourceManagementStore.getSLAs());
      setMeasurements(resourceManagementStore.getMeasurements());
    });
    return unsub;
  }, []);

  return {
    requests,
    assignments,
    slas,
    measurements,
    addRequest: resourceManagementStore.addRequest,
    updateRequestStatus: resourceManagementStore.updateRequestStatus,
    addSLA: resourceManagementStore.addSLA,
    updateSLA: resourceManagementStore.updateSLA,
    updateSLATarget: resourceManagementStore.updateSLATarget,
    toggleSLAStatus: resourceManagementStore.toggleSLAStatus,
    addMeasurement: resourceManagementStore.addMeasurement,
    updateAssignment: resourceManagementStore.updateAssignment,
    getRequestKPIs: resourceManagementStore.getRequestKPIs,
    getAssignmentKPIs: resourceManagementStore.getAssignmentKPIs,
    getSLAKPIs: resourceManagementStore.getSLAKPIs,
    getBreaches: resourceManagementStore.getBreaches,
    getRequestById: resourceManagementStore.getRequestById,
    getAssignmentById: resourceManagementStore.getAssignmentById,
    getAssignmentByResourceId: resourceManagementStore.getAssignmentByResourceId,
    evaluateCompliance: resourceManagementStore.evaluateCompliance,
    getConditionalTarget: resourceManagementStore.getConditionalTarget,
    evaluateComposite: resourceManagementStore.evaluateComposite,
    displayStatus: resourceManagementStore.displayStatus,
  };
}

export default resourceManagementStore;
