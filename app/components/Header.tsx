import { Form, useLocation } from '@remix-run/react';
import { Link } from 'react-router-dom';

import { Bars3Icon, BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  username: string;
}

export default function Header({ username }: HeaderProps) {
  const location = useLocation();
  const pageTitle = location.pathname.split('/').pop()!;
  const pageTitleCapitalized = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  return (
    <header className="sticky top-0 flex items-center justify-between h-16 mx-6">
      <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button md:hidden">
        <Bars3Icon className="h-6 w-6" />
      </label>
      <h1 className="text-xl font-semibold">{pageTitleCapitalized}</h1>
      <div className="flex items-center">
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
            className="dropdown-content z-[1] menu shadow bg-base-100 rounded-box w-52 right-0 mt-1 p-2"
          >
            <li>
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
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
                <button type="submit" role="menuitem">
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
