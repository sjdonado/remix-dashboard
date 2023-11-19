import { NavLink } from '@remix-run/react';
import { HomeIcon, InboxIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side z-10">
        <div className="w-80 min-h-full bg-base-200 text-base-content">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="btn btn-ghost drawer-overlay ml-6 mt-3 md:hidden"
          >
            <XMarkIcon className="w-6 h-6" />
          </label>
          <div className="flex flex-col pt-3 md:pt-12 px-6">
            <span className="text-xl font-semibold text-center mb-12">
              Remix Dashboard
            </span>
            <nav className="p-4">
              <ul>
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive, isPending }) =>
                      `flex items-center p-3 rounded-md ${
                        isActive
                          ? 'bg-gray-200 active'
                          : isPending
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`
                    }
                  >
                    <HomeIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Home</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/inbox"
                    className={({ isActive, isPending }) =>
                      `flex items-center p-3 rounded-md ${
                        isActive
                          ? 'bg-gray-200 active'
                          : isPending
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`
                    }
                  >
                    <InboxIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Inbox</span>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div className="drawer-content flex flex-col flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
