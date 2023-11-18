import { Form } from '@remix-run/react';
import { Link } from 'react-router-dom';

import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

interface HeaderProps {
  email: string;
  toggleSidebar: () => void;
}

export default function Header({ email, toggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-white shadow z-30">
      <div className="px-4 flex items-center justify-between h-16">
        <button
          className="text-gray-500 md:hidden focus:outline-none"
          onClick={toggleSidebar}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <h1 className="font-semibold">App</h1>
        <div className="flex items-center">
          <button className="text-gray-500 mr-2">
            <BellIcon className="h-6 w-6" />
          </button>
          <div className="dropdown">
            <label tabIndex={0} className="btn border-none">
              {email}
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
      </div>
    </header>
  );
}
