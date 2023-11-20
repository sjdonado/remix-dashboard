import { Form, useLocation } from '@remix-run/react';
import { Link } from 'react-router-dom';

import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface HeaderProps {
  username: string;
}

export default function Header({ username }: HeaderProps) {
  const location = useLocation();
  const pageTitle = location.pathname.split('/').pop()!;
  const pageTitleCapitalized = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  return (
    <header className="navbar flex items-center justify-between h-24 px-4 md:px-12">
      <label htmlFor="header" className="btn btn-ghost drawer-button md:hidden">
        <Bars3Icon className="h-6 w-6" />
      </label>
      <h1 className="text-xl md:text-3xl font-semibold">{pageTitleCapitalized}</h1>
      <div className="flex items-center justify-center">
        <button className="text-gray-500 mr-2">
          <BellIcon className="h-6 w-6" />
        </button>
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost">
            {username}
            <ChevronDownIcon className="h-4 w-4" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu shadow-lg bg-base-100 
              rounded-box w-52 right-0 mt-1 p-2"
          >
            <li>
              <Link
                to="/profile"
                className="flex items-center justify-start block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-200"
                role="menuitem"
              >
                <UserIcon className="w-6 h-6" />
                My Profile
              </Link>
            </li>
            <Form
              method="post"
              action="/logout"
              onSubmit={event => {
                const response = confirm(
                  'Are you sure you want to log out? You will be redirected to the login page.'
                );
                if (!response) {
                  event.preventDefault();
                }
              }}
            >
              <li>
                <button
                  type="submit"
                  role="menuitem"
                  className="flex items-center justify-start block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-200"
                >
                  <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                  Logout
                </button>
              </li>
            </Form>
          </ul>
        </div>
      </div>
    </header>
  );
}
