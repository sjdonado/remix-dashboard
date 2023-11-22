import { clsx } from 'clsx';

import { Link } from '@remix-run/react';

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs text-2xl">
      <ul>
        {breadcrumbs.map(breadcrumb => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={clsx(breadcrumb.active ? 'text-content' : 'text-gray-500')}
          >
            <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
