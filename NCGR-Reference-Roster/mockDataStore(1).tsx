import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { masterEmployees, type MasterEmployee, leaveRecordsList, type LeaveRecord, activityChecklistItems, type ActivityItem, handoverLogsList, type HandoverRecord, momActionsList, type MomAction, attendanceRecordsList, type AttendanceRecord } from './master-employees';
import { incidents as initialIncidents, type Incident, healthGrid as initialHealthGrid, type HealthGridItem, managementExceptions as initialExceptions, type ManagementException } from './incidents';
import { licenses as initialLicenses, type LicenseRecord } from './licenses';
import { vendors as initialVendors, type VendorRecord, vendorRisks as initialVendorRisks, type VendorRiskRecord, vendorActions as initialVendorActions, type VendorAction } from './vendorData';
import { programs as initialPrograms, type ProgramRecord, milestones as initialMilestones, type MilestoneRecord, dependencies as initialDependencies, type DependencyRecord, issuesAndActions as initialIssues, type IssueActionRecord } from './programs';
import { audits as initialAudits, type AuditRecord, governanceCommitments as initialGovCommitments, type GovernanceCommitment } from './audits';
import { serviceRequests as initialServiceRequests, type ServiceRequest } from './serviceRequests';
import { resourceMobilization as initialResourceMob, type ResourceMobilizationRecord } from './resourceMobilization';
import { notifications as initialNotifications, type NotificationItem } from './notifications';
import { initiativesList as initialInitiatives, type InitiativeItem } from './transformation';
import { infraNodes as initialInfraNodes, type InfraNode } from './infrastructure';

interface DataStoreContextType {
  // Employees & Attendance
  employees: MasterEmployee[];
  leaveRecords: LeaveRecord[];
  attendanceRecords: AttendanceRecord[];
  activityItems: ActivityItem[];
  handoverLogs: HandoverRecord[];
  momActions: MomAction[];
  
  // Operational Incident & Health
  incidents: Incident[];
  healthGrid: HealthGridItem[];
  managementExceptions: ManagementException[];
  serviceRequests: ServiceRequest[];
  
  // Licenses & Entitlements
  licenses: LicenseRecord[];
  
  // Vendor & SIAM
  vendors: VendorRecord[];
  vendorRisks: VendorRiskRecord[];
  vendorActions: VendorAction[];
  
  // Program Management
  programs: ProgramRecord[];
  milestones: MilestoneRecord[];
  dependencies: DependencyRecord[];
  issuesAndActions: IssueActionRecord[];
  resourceMobilization: ResourceMobilizationRecord[];
  
  // Compliance & Transformation & Infra
  audits: AuditRecord[];
  governanceCommitments: GovernanceCommitment[];
  initiatives: InitiativeItem[];
  infraNodes: InfraNode[];
  
  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  
  // Mutators
  approveLeave: (id: string) => void;
  rejectLeave: (id: string, reason?: string) => void;
  cancelLeave: (id: string) => void;
  toggleActivityItem: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
  updateIncidentStatus: (id: string, status: Incident['status']) => void;
  updateRiskStatus: (id: string, status: VendorRiskRecord['currentStatus']) => void;
  updateActionStatus: (id: string, status: VendorAction['status']) => void;
}

const DataStoreContext = createContext<DataStoreContextType | null>(null);

export const DataStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees] = useState<MasterEmployee[]>(masterEmployees);
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>(() => {
    const saved = localStorage.getItem('ncgr-leaves');
    return saved ? JSON.parse(saved) : leaveRecordsList;
  });
  const [attendanceRecords] = useState<AttendanceRecord[]>(attendanceRecordsList);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>(activityChecklistItems);
  const [handoverLogs] = useState<HandoverRecord[]>(handoverLogsList);
  const [momActions] = useState<MomAction[]>(momActionsList);

  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [healthGrid] = useState<HealthGridItem[]>(initialHealthGrid);
  const [managementExceptions] = useState<ManagementException[]>(initialExceptions);
  const [serviceRequests] = useState<ServiceRequest[]>(initialServiceRequests);

  const [licenses] = useState<LicenseRecord[]>(initialLicenses);
  const [vendors] = useState<VendorRecord[]>(initialVendors);
  const [vendorRisks, setVendorRisks] = useState<VendorRiskRecord[]>(initialVendorRisks);
  const [vendorActions, setVendorActions] = useState<VendorAction[]>(initialVendorActions);

  const [programs] = useState<ProgramRecord[]>(initialPrograms);
  const [milestones] = useState<MilestoneRecord[]>(initialMilestones);
  const [dependencies] = useState<DependencyRecord[]>(initialDependencies);
  const [issuesAndActions] = useState<IssueActionRecord[]>(initialIssues);
  const [resourceMobilization] = useState<ResourceMobilizationRecord[]>(initialResourceMob);

  const [audits] = useState<AuditRecord[]>(initialAudits);
  const [governanceCommitments] = useState<GovernanceCommitment[]>(initialGovCommitments);
  const [initiatives] = useState<InitiativeItem[]>(initialInitiatives);
  const [infraNodes] = useState<InfraNode[]>(initialInfraNodes);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ncgr-notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  useEffect(() => {
    localStorage.setItem('ncgr-leaves', JSON.stringify(leaveRecords));
  }, [leaveRecords]);

  useEffect(() => {
    localStorage.setItem('ncgr-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Leave Mutators
  const approveLeave = (id: string) => {
    setLeaveRecords(prev => prev.map(l => {
      if (l.id === id) {
        // also reflect in employee status if currently within date
        return { ...l, status: 'Approved' };
      }
      return l;
    }));
  };

  const rejectLeave = (id: string) => {
    setLeaveRecords(prev => prev.map(l => l.id === id ? { ...l, status: 'Rejected' } : l));
  };

  const cancelLeave = (id: string) => {
    setLeaveRecords(prev => prev.map(l => l.id === id ? { ...l, status: 'Cancelled' } : l));
  };

  // Activity Checklist Mutator
  const toggleActivityItem = (id: string) => {
    setActivityItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Completed' ? 'Pending' : 'Completed';
        return {
          ...item,
          status: nextStatus,
          completionPct: nextStatus === 'Completed' ? 100 : 0,
          lastCompleted: nextStatus === 'Completed' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : item.lastCompleted,
        };
      }
      return item;
    }));
  };

  // Notification Mutators
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updateIncidentStatus = (id: string, status: Incident['status']) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
  };

  const updateRiskStatus = (id: string, status: VendorRiskRecord['currentStatus']) => {
    setVendorRisks(prev => prev.map(r => r.id === id ? { ...r, currentStatus: status } : r));
  };

  const updateActionStatus = (id: string, status: VendorAction['status']) => {
    setVendorActions(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  return (
    <DataStoreContext.Provider
      value={{
        employees,
        leaveRecords,
        attendanceRecords,
        activityItems,
        handoverLogs,
        momActions,
        incidents,
        healthGrid,
        managementExceptions,
        serviceRequests,
        licenses,
        vendors,
        vendorRisks,
        vendorActions,
        programs,
        milestones,
        dependencies,
        issuesAndActions,
        resourceMobilization,
        audits,
        governanceCommitments,
        initiatives,
        infraNodes,
        notifications,
        unreadNotificationCount,
        approveLeave,
        rejectLeave,
        cancelLeave,
        toggleActivityItem,
        markNotificationRead,
        markAllNotificationsRead,
        dismissNotification,
        updateIncidentStatus,
        updateRiskStatus,
        updateActionStatus,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  );
};

export const useDataStore = () => {
  const context = useContext(DataStoreContext);
  if (!context) {
    throw new Error('useDataStore must be used within a DataStoreProvider');
  }
  return context;
};
