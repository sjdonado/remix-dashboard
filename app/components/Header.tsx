import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

import { DialogModalButton } from './ConfirmationDialog';
import { Link } from '@remix-run/react';

interface HeaderProps {
  username: string;
}

export default function Header({ username }: HeaderProps) {
  return (
    <header className="navbar flex items-center justify-between h-12 px-4 md:px-12 md:justify-end">
      <label
        htmlFor="header"
        className="btn btn-ghost rounded-lg drawer-button md:hidden"
      >
        <Bars3Icon className="h-6 w-6" />
      </label>
      <div className="flex items-center justify-center ms:gap-1">
        <label className="btn btn-ghost rounded-lg swap swap-rotate">
          <input type="checkbox" className="theme-controller" value="dark" />
          <SunIcon className="swap-off fill-current w-6 h-6" />
          <MoonIcon className="swap-on fill-current w-6 h-6" />
        </label>
        <button className="btn btn-ghost rounded-lg">
          <BellIcon className="h-6 w-6" />
        </button>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost rounded-lg p-2">
            {username}
            <ChevronDownIcon className="h-4 w-4" />
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] shadow-lg bg-base-100 rounded-box rounded-lg w-52 right-0 mt-1 p-2"
          >
            <li onClick={() => (document.activeElement as HTMLInputElement).blur()}>
              <Link
                to="/me"
                className="flex items-center justify-start block rounded-lg px-4 py-2 text-sm hover:bg-content-200"
                role="menuitem"
              >
                <UserIcon className="w-6 h-6" />
                My Profile
              </Link>
            </li>
            <li>
              <DialogModalButton
                title="Logout"
                description="Are you sure you want to log out? You will be redirected to the login page."
                button="Logout"
                action="/logout"
                className="flex items-center justify-start block rounded-lg px-4 py-2 text-sm hover:bg-content-200"
              >
                <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                Logout
              </DialogModalButton>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
