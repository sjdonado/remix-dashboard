import clsx from 'clsx';

import { NavLink } from '@remix-run/react';

import {
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  InboxIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

import type { UserSession } from '~/schemas/user';
import { UserRole } from '~/constants/user';

import Avatar from './Avatar';
import { UserRoleBadge } from './badge/UserRoleBadge';
import { DialogModalButton } from './dialog/ConfirmationDialog';

interface SidebarProps {
  userSession: UserSession;
  children: React.ReactNode;
}

export default function Sidebar({ userSession, children }: SidebarProps) {
  return (
    <div className="drawer md:drawer-open">
      <input id="header" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side z-10">
        <label htmlFor="header" aria-label="close sidebar" className="drawer-overlay" />
        <div className="flex min-h-full w-60 flex-col gap-2 border-r bg-white p-2 text-base-content sm:w-64">
          <ul className="flex flex-1 flex-col gap-2 p-4">
            <li>
              <div className="flex flex-wrap items-center justify-start gap-2 p-3">
                <Avatar name={userSession.username} />
                <div className="flex flex-col items-start">
                  <p className="text-sm font-medium">{userSession.username}</p>
                  <UserRoleBadge role={userSession.role} />
                </div>
              </div>
            </li>
            <SidebarMenuLink to="/me">
              <UserIcon />
              <span>My Profile</span>
            </SidebarMenuLink>
            <span className="divider" />
            {[UserRole.Admin, UserRole.Student].includes(userSession.role) && (
              <SidebarMenuLink to="/">
                <HomeIcon />
                <span>Home</span>
              </SidebarMenuLink>
            )}
            {[UserRole.Admin, UserRole.Teacher].includes(userSession.role) && (
              <SidebarMenuLink to="/assignments">
                <InboxIcon />
                <span>Assignments</span>
              </SidebarMenuLink>
            )}
            {UserRole.Admin === userSession.role && (
              <SidebarMenuLink to="/users">
                <UsersIcon />
                <span>Users</span>
              </SidebarMenuLink>
            )}
            <li className="flex-1" />
            <span className="divider" />
            <li>
              <DialogModalButton
                title="Logout"
                description="Are you sure you want to log out? You will be redirected to the login page."
                button="Logout"
                action="/logout"
                className="btn btn-ghost btn-sm flex w-full justify-start rounded-lg"
              >
                <ArrowLeftOnRectangleIcon className="mr-2 size-5" />
                <span className="text-sm font-medium">Logout</span>
              </DialogModalButton>
            </li>
            <li className="mt-4 text-center text-xs">
              Source code available at{' '}
              <a
                className="link"
                href="https://github.com/sjdonado/remix-dashboard"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="drawer-content">{children}</div>
    </div>
  );
}

function SidebarMenuLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li
      className="flex items-center rounded-lg"
      onClick={() => (document.activeElement as HTMLInputElement).blur()}
    >
      <NavLink
        to={to}
        className={({ isActive, isPending }) =>
          clsx(
            'btn btn-ghost btn-sm flex w-full justify-start rounded-lg',
            '[&>span]:text-sm [&>span]:font-medium [&>svg]:mr-2 [&>svg]:size-5',
            {
              'active bg-base-200 [&>span]:font-medium [&>span]:text-medium': isActive,
              'pending cursor-not-allowed': isPending,
            }
          )
        }
      >
        {children}
      </NavLink>
    </li>
  );
}
