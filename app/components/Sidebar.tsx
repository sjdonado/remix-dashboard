import clsx from 'clsx';

import { NavLink } from '@remix-run/react';

import { HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/24/outline';

import { UserRole } from '~/constants/user';

import AppLogo from './AppLogo';

interface SidebarProps {
  userSessionRole: UserRole;
  children: React.ReactNode;
}

export default function Sidebar({ userSessionRole, children }: SidebarProps) {
  return (
    <div className="drawer md:drawer-open">
      <input id="header" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side z-10">
        <label
          htmlFor="header"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex flex-col w-64 min-h-full bg-base-100 text-base-content p-4 sm:w-72">
          <div className="flex shrink-0 items-end rounded-lg bg-primary p-4 mb-2 h-44">
            <AppLogo />
          </div>
          <ul className="flex-1 flex flex-col gap-2">
            {[UserRole.Admin, UserRole.Student].includes(userSessionRole) && (
              <li
                className="bg-base-200/40 rounded-lg"
                onClick={() => (document.activeElement as HTMLInputElement).blur()}
              >
                <NavLink
                  to="home"
                  className={({ isActive, isPending }) =>
                    clsx(
                      'flex items-center p-3 rounded-lg hover:bg-primary/40 hover:text-primary transition-colors',
                      {
                        'active bg-primary-100 text-primary': isActive,
                        'pending cursor-not-allowed': isPending,
                      }
                    )
                  }
                >
                  <HomeIcon className="w-6 h-6 mr-2" />
                  <span className="text-sm font-medium">Home</span>
                </NavLink>
              </li>
            )}
            {[UserRole.Admin, UserRole.Teacher].includes(userSessionRole) && (
              <li
                className="bg-base-200/40 rounded-lg"
                onClick={() => (document.activeElement as HTMLInputElement).blur()}
              >
                <NavLink
                  to="assignments"
                  className={({ isActive, isPending }) =>
                    clsx(
                      'flex items-center p-3 rounded-lg hover:bg-primary/40 hover:text-primary transition-colors',
                      {
                        'active bg-primary-100 text-primary': isActive,
                        'pending cursor-not-allowed': isPending,
                      }
                    )
                  }
                >
                  <InboxIcon className="w-6 h-6 mr-2" />
                  <span className="text-sm font-medium">Assignments</span>
                </NavLink>
              </li>
            )}
            {UserRole.Admin === userSessionRole && (
              <li
                className="bg-base-200/40 rounded-lg"
                onClick={() => (document.activeElement as HTMLInputElement).blur()}
              >
                <NavLink
                  to="users"
                  className={({ isActive, isPending }) =>
                    clsx(
                      'flex items-center p-3 rounded-lg hover:bg-primary/40 hover:text-primary transition-colors',
                      {
                        'active bg-primary-100 text-primary': isActive,
                        'pending cursor-not-allowed': isPending,
                      }
                    )
                  }
                >
                  <UsersIcon className="w-6 h-6 mr-2" />
                  <span className="text-sm font-medium">Users</span>
                </NavLink>
              </li>
            )}
            <li className="flex-1 bg-base-200/40 rounded-lg"></li>
            <span className="text-xs bg-base-200/40 rounded-lg p-4 text-center">
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
