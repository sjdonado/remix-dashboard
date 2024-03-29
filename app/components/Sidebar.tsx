import clsx from 'clsx';

import { NavLink } from '@remix-run/react';

import { HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/24/outline';

import type { UserSession } from '~/schemas/user';
import { UserRole } from '~/constants/user';

import AppLogo from './AppLogo';

interface SidebarProps {
  userSession: UserSession;
  children: React.ReactNode;
}

export default function Sidebar({ userSession, children }: SidebarProps) {
  return (
    <div className="drawer md:drawer-open">
      <input id="header" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side z-10">
        <label
          htmlFor="header"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full w-64 flex-col bg-base-100 p-4 text-base-content sm:w-72">
          <div className="mb-2 flex h-44 shrink-0 items-end rounded-lg bg-primary p-4">
            <AppLogo />
          </div>
          <ul className="flex flex-1 flex-col gap-2">
            {[UserRole.Admin, UserRole.Student].includes(userSession.role) && (
              <li
                className="rounded-lg border border-base-200 bg-base-200/40"
                onClick={() => (document.activeElement as HTMLInputElement).blur()}
              >
                <NavLink
                  to="home"
                  className={({ isActive, isPending }) =>
                    clsx(
                      'flex items-center rounded-lg p-3 transition-colors hover:bg-primary/40 hover:text-primary',
                      {
                        'active bg-primary-100 text-primary': isActive,
                        'pending cursor-not-allowed': isPending,
                      }
                    )
                  }
                >
                  <HomeIcon className="mr-2 size-6" />
                  <span className="text-sm font-medium">Home</span>
                </NavLink>
              </li>
            )}
            {[UserRole.Admin, UserRole.Teacher].includes(userSession.role) && (
              <li
                className="rounded-lg border border-base-200 bg-base-200/40"
                onClick={() => (document.activeElement as HTMLInputElement).blur()}
              >
                <NavLink
                  to="assignments"
                  className={({ isActive, isPending }) =>
                    clsx(
                      'flex items-center rounded-lg p-3 transition-colors hover:bg-primary/40 hover:text-primary',
                      {
                        'active bg-primary-100 text-primary': isActive,
                        'pending cursor-not-allowed': isPending,
                      }
                    )
                  }
                >
                  <InboxIcon className="mr-2 size-6" />
                  <span className="text-sm font-medium">Assignments</span>
                </NavLink>
              </li>
            )}
            {UserRole.Admin === userSession.role && (
              <li
                className="rounded-lg border border-base-200 bg-base-200/40"
                onClick={() => (document.activeElement as HTMLInputElement).blur()}
              >
                <NavLink
                  to="users"
                  className={({ isActive, isPending }) =>
                    clsx(
                      'flex items-center rounded-lg p-3 transition-colors hover:bg-primary/40 hover:text-primary',
                      {
                        'active bg-primary-100 text-primary': isActive,
                        'pending cursor-not-allowed': isPending,
                      }
                    )
                  }
                >
                  <UsersIcon className="mr-2 size-6" />
                  <span className="text-sm font-medium">Users</span>
                </NavLink>
              </li>
            )}
            <li className="flex-1 rounded-lg border border-base-200 bg-base-200/40" />
            <span className="rounded-lg border border-base-200 bg-base-200/40 p-4 text-center text-xs">
              Source code available at{' '}
              <a
                className="link"
                href="https://github.com/sjdonado/remix-dashboard"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </span>
          </ul>
        </div>
      </div>
      <div className="drawer-content">{children}</div>
    </div>
  );
}
