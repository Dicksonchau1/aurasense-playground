import React from 'react';
import Link from 'next/link';

export type ModeCardProps = {
  title: string;
  description: string;
  href: string;
  badge?: string;
  stats: string[];
  ctaLabel: string;
};

const ModeCard: React.FC<ModeCardProps> = ({ title, description, href, badge, stats, ctaLabel }) => {
  return (
    <div className="bg-card rounded-lg shadow p-6 flex flex-col h-full">
      <div className="flex items-center mb-2">
        <h3 className="text-lg font-semibold flex-1">{title}</h3>
        {badge && (
          <span className="ml-2 px-2 py-1 text-xs rounded bg-accent text-accent-foreground font-medium">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <ul className="mb-4 space-y-1">
        {stats.map((stat) => (
          <li key={stat} className="inline-block mr-2 mb-1 px-2 py-0.5 rounded bg-muted text-xs font-medium">
            {stat}
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <Link href={href} legacyBehavior>
          <a className="btn btn-secondary w-full" tabIndex={0} aria-label={ctaLabel}>
            {ctaLabel}
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ModeCard;
