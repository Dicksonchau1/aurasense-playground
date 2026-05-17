# ATLAS UI Components

This directory contains reusable, presentational React components for ATLAS enterprise dashboards. All components are typed to consume view-model outputs from `../view-models.ts`.

## Component List
- `KpiCard`, `KpiCardGrid`: Display KPI metrics
- `StatusChip`: Status indicator chip
- `TimelineList`: Timeline/event list
- `AtlasPageHeader`: Page header with title and chips
- `ValidationList`: Mission validation issues
- `TopRisksList`: Predicted risks
- `AuditExportList`: Audit export artifacts
- `SectionCard`: Group related content
- `TabbedPanel`: Tabbed content switching
- `LoadingSkeleton`: Async loading placeholder
- `ErrorBanner`: Error display
- `EmptyState`: No-data state
- `ModalDialog`: Modal dialog for confirmations/details
- `ActionButtonBar`: Contextual action buttons

## Usage Example

```tsx
import { KpiCardGrid, StatusChip, TimelineList, AtlasPageHeader, SectionCard, TabbedPanel, LoadingSkeleton, ErrorBanner, EmptyState, ModalDialog, ActionButtonBar } from "./";
import { getMissionKpis, getTimelineRows, getAtlasPageHeaderVM } from "../view-models";

// Example usage in a page component
export default function AtlasMissionPage({ mission, validation, auditBundle }) {
  const header = getAtlasPageHeaderVM({ mission, validation });
  const kpis = getMissionKpis(mission, validation);
  const timeline = getTimelineRows(auditBundle?.events);

  return (
    <div>
      <AtlasPageHeader {...header} />
      <SectionCard title="KPIs">
        <KpiCardGrid items={kpis} />
      </SectionCard>
      <SectionCard title="Timeline">
        <TimelineList rows={timeline} />
      </SectionCard>
      {/* More sections as needed */}
    </div>
  );
}
```

## Guidelines
- Always use view-model outputs as props.
- Compose these components for consistent, maintainable ATLAS UIs.
- Style overrides can be applied via Tailwind or custom classes.
