# NCGR Reference Roster — REFERENCE ONLY

Purpose: This folder contains only the NCGR source files relevant to the Resource Roster / Resource Directory implementation so an AI coding agent can inspect the existing roster implementation while modifying the separate ITMS portal.

## Primary reference
- `src/pages/operations/ResourceRoster.tsx` — roster page: columns, filters, search, row selection, summary strip, pagination/export wiring.
- `src/components/common/EmployeeDetailModal.tsx` — employee profile/detail experience, assignment/resource timeline, knowledge-transfer/development sections.
- `src/components/common/DataTable.tsx` — reusable table, search, filters, sorting, pagination, export behavior used by the roster.

## Data/model references
- `src/data/master-employees.ts` — MasterEmployee type and NCGR employee dataset/helpers used by the roster.
- `src/data/resourceMobilization.ts` — resource assignment/mobilization and history data consumed by the employee detail modal.
- `src/data/empowerment.ts` — KT/development data consumed by the employee detail modal.
- `src/data/mockDataStore.tsx` — exposes the employee collection through the NCGR data store.
- `src/pages/operations/TeamOverviewLandingPage.tsx` — contains the sibling-navigation constant imported by the roster page; included only to keep the reference dependency context complete.

## IMPORTANT
These files are NOT part of the ITMS application and must NOT be imported into production ITMS code merely because they are present here.

The current ITMS portal is the source of truth for:
- architecture
- sidebar/navigation
- styling/design system
- routing
- existing Resource Directory functionality
- existing data model

Use NCGR only as a reference for useful Resource Directory/Roster patterns.

Do NOT copy into ITMS:
- NCGR branding or logos
- NCGR names or employee records
- Saudization governance/targets
- Saudi/Expat classification
- NCGR-specific business rules
- NCGR-specific navigation
- NCGR-specific customer information

Adapt only useful generic concepts such as:
- resource roster table structure
- search/filter patterns
- resource profile/detail view
- manager/role/tower/status fields
- assignment/history presentation
- FTE/allocation concepts

For the ITMS portal, additionally implement Shared Support / multi-assignment allocation so one resource can support multiple services/projects without double-counting FTE.
