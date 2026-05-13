import React from 'react';

export type ActivityItem = {
  title: string;
  category: 'rehearse' | 'drone' | 'robotics';
  timestamp: string;
  status: string;
  href?: string;
};

export type RecentSessionsPanelProps = {
  items: ActivityItem[];
};

const categoryColor = {
  rehearse: 'bg-blue-100 text-blue-700',
  drone: 'bg-yellow-100 text-yellow-700',
  robotics: 'bg-green-100 text-green-700',
};

const RecentSessionsPanel: React.FC<RecentSessionsPanelProps> = ({ items }) => (
  <div className="bg-card rounded-lg p-4">
    <h4 className="font-semibold mb-2 text-base">Recent Activity</h4>
    <ul className="divide-y divide-muted">
      {items.map((item) => (
        <li key={item.title + item.timestamp} className="py-2 flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColor[item.category]}`}>{item.category}</span>
          <div className="flex-1 min-w-0">
            {item.href ? (
              <a href={item.href} className="hover:underline font-medium truncate block">
                {item.title}
              </a>
            ) : (
              <span className="font-medium truncate block">{item.title}</span>
            )}
            <span className="block text-xs text-muted-foreground truncate">
              {new Date(item.timestamp).toLocaleString()} &ndash; {item.status}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentSessionsPanel;
