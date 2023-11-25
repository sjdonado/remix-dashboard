import clsx from 'clsx';

import type { UIMatch } from '@remix-run/react';
import { Link, useLocation, useMatches } from '@remix-run/react';

type BreadcrumbHandle = {
  breadcrumb: (match: UIMatch) => React.ReactNode;
};

export function Breadcrumbs() {
  const matches = useMatches();

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs text-2xl">
      <ul>
        {matches
          .filter(match => match.handle && (match.handle as BreadcrumbHandle).breadcrumb)
          .map((match, index) => (
            <li key={index}>{(match.handle as BreadcrumbHandle).breadcrumb(match)}</li>
          ))}
      </ul>
    </nav>
  );
}

export function Breadcrumb({ pathname, label }: { pathname: string; label: string }) {
  const location = useLocation();
  const active = pathname === location.pathname;

  return (
    <Link
      to={pathname}
      aria-current={active}
      className={clsx(active ? '' : 'text-gray-500')}
    >
      {label}
    </Link>
  );
}
