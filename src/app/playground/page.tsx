import PlaygroundShell from '@/components/playground/PlaygroundShell';
import { modes, capabilityRows } from './seedData';
import type { SystemStatusItem, ActivityItem } from '@/components/playground/SystemStatusBar';

async function fetchSystemStatus(): Promise<SystemStatusItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/playground/system-status`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch {
    return [];
  }
}

async function fetchRecentActivity(): Promise<ActivityItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/playground/recent-activity`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch {
    return [];
  }
}

export default async function PlaygroundPage() {
  const [systemStatus, recentActivity] = await Promise.all([
    fetchSystemStatus(),
    fetchRecentActivity(),
  ]);
  return (
    <PlaygroundShell
      modes={modes}
      systemStatus={systemStatus}
      recentActivity={recentActivity}
      capabilityRows={capabilityRows}
    />
  );
}
