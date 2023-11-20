import clsx from 'clsx';

import { NavLink } from '@remix-run/react';

import { HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/24/outline';

import { userRoles } from '~/db/schema';
import AppLogo from './AppLogo';

interface SidebarProps {
  userSessionRole: string;
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
        <div className="flex flex-col w-64 min-h-full bg-white text-base-content p-4 sm:w-72">
          <div className="flex shrink-0 items-end rounded-lg bg-indigo-600 p-4 mb-2 h-44">
            <AppLogo />
          </div>
          <ul className="flex-1 flex flex-col gap-2">
            <li className="bg-gray-100 rounded-md">
              <NavLink
                to={`/${userSessionRole}/home`}
                className={({ isActive, isPending }) =>
                  clsx('flex items-center p-3 rounded-md hover:bg-indigo-200', {
                    'active bg-indigo-100 text-indigo-600': isActive,
                    'pending cursor-not-allowed': isPending,
                  })
                }
              >
                <HomeIcon className="w-6 h-6 mr-2" />
                <span className="text-sm font-medium">Home</span>
              </NavLink>
            </li>
            <li className="bg-gray-100 rounded-md">
              <NavLink
                to={`/${userSessionRole}/inbox`}
                className={({ isActive, isPending }) =>
                  clsx('flex items-center p-3 rounded-md hover:bg-indigo-200', {
                    'active bg-indigo-100 text-indigo-600': isActive,
                    'pending cursor-not-allowed': isPending,
                  })
                }
              >
                <InboxIcon className="w-6 h-6 mr-2" />
                <span className="text-sm font-medium">Inbox</span>
              </NavLink>
            </li>
            {userSessionRole === userRoles.enumValues[0] && (
              <li className="bg-gray-100 rounded-md">
                <NavLink
                  to={`/${userSessionRole}/users`}
                  className={({ isActive, isPending }) =>
                    clsx('flex items-center p-3 rounded-md hover:bg-indigo-200', {
                      'active bg-indigo-100 text-indigo-600': isActive,
                      'pending cursor-not-allowed': isPending,
                    })
                  }
                >
                  <UsersIcon className="w-6 h-6 mr-2" />
                  <span className="text-sm font-medium">Users</span>
                </NavLink>
              </li>
            )}
            <li className="flex-1 bg-gray-100 rounded-md"></li>
          </ul>
        </div>
      </div>
      <div className="drawer-content flex flex-col flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
