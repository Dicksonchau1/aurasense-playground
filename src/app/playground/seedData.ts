import { ModeCardProps } from '@/components/playground/ModeCard';
import { SystemStatusItem } from '@/components/playground/SystemStatusBar';
import { ActivityItem } from '@/components/playground/RecentSessionsPanel';
import { CapabilityRow } from '@/components/playground/CapabilityMatrix';

export const modes: ModeCardProps[] = [
  {
    title: 'Rehearse',
    description: 'Clinical and professional skill rehearsal with guided session feedback and measurable performance review.',
    href: '/rehearse',
    stats: ['Session Feedback', 'Performance Review', 'Guided Scenarios', 'Skill Tracking'],
    ctaLabel: 'Open Rehearse',
  },
  {
    title: 'Drone / ATTAS',
    description: 'Mission planning, compliance-aware operations, and enterprise inspection workflows through the official ATTAS dashboard.',
    href: '/drone',
    badge: 'Enterprise: Rehearse-3D',
    stats: ['Mission Planning', 'Compliance', 'Enterprise Workflows', 'Rehearse-3D (Enterprise)'],
    ctaLabel: 'Open ATTAS',
  },
  {
    title: 'Robotics',
    description: 'Runtime substrate for perception, agentic control loops, and physical-world execution surfaces.',
    href: '/robotics',
    stats: ['Perception', 'Agentic Control', 'Runtime Substrate', 'Physical Execution'],
    ctaLabel: 'Open Robotics Runtime',
  },
];

export const systemStatus: SystemStatusItem[] = [
  { label: 'NEPA Runtime', value: 'Online', tone: 'good' },
  { label: 'Supabase', value: 'Connected', tone: 'good' },
  { label: 'Last Inference', value: '188 ms', tone: 'neutral' },
  { label: 'Signed Sessions (24h)', value: '12', tone: 'neutral' },
  { label: 'Deployment Target', value: 'Jetson / Cloud', tone: 'neutral' },
];

export const recentActivity: ActivityItem[] = [
  {
    title: 'Nursing Session: Airway Management',
    category: 'rehearse',
    timestamp: '2026-05-13T09:12:00Z',
    status: 'Completed',
    href: '/rehearse/session/airway-management',
  },
  {
    title: 'Drone Mission: Bridge Inspection',
    category: 'drone',
    timestamp: '2026-05-13T08:45:00Z',
    status: 'In Progress',
    href: '/drone/mission/bridge-inspection',
  },
  {
    title: 'Robotics Runtime: NEPA Event',
    category: 'robotics',
    timestamp: '2026-05-13T07:30:00Z',
    status: 'Online',
    href: '/robotics/event/nepa',
  },
];

export const capabilityRows: CapabilityRow[] = [
  {
    surface: 'Rehearse',
    summary: 'Guided clinical/professional rehearsal',
    primaryUse: 'Skill development & review',
  },
  {
    surface: 'ATTAS',
    summary: 'Enterprise drone ops & inspection',
    primaryUse: 'Mission planning & compliance',
  },
  {
    surface: 'Robotics',
    summary: 'Runtime substrate for agentic robotics',
    primaryUse: 'Physical-world execution',
  },
];
