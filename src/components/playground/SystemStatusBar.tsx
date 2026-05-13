import React from 'react';

export type SystemStatusItem = {
  label: string;
  value: string;
  tone?: 'neutral' | 'good' | 'warning';
};

export type SystemStatusBarProps = {
  items: SystemStatusItem[];
};

const toneClass = (tone?: string) => {
  switch (tone) {
    case 'good':
      return 'text-green-600';
    case 'warning':
      return 'text-yellow-700';
    default:
      return 'text-muted-foreground';
  }
};

const SystemStatusBar: React.FC<SystemStatusBarProps> = ({ items }) => (
  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
    {items.map((item) => (
      <div
        key={item.label}
        className="flex flex-col items-center min-w-[120px] bg-muted rounded p-2"
      >
        <span className="text-xs text-muted-foreground">{item.label}</span>
        <span className={`font-semibold ${toneClass(item.tone)}`}>{item.value}</span>
      </div>
    ))}
  </div>
);

export default SystemStatusBar;
