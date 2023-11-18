import { NavLink } from '@remix-run/react';
import { HomeIcon, InboxIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ sidebarOpen, toggleSidebar }: SidebarProps) {
  return (
    <div
      className={`bg-white text-black h-screen border-r border-gray fixed inset-y-0 left-0 z-10 w-72 
      md:relative md:translate-x-0 transform transition-transform duration-300 ease-in-out 
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {sidebarOpen && (
        <button
          onClick={() => toggleSidebar()}
          className="text-gray-600 focus:outline-none md:hidden my-4 mx-6"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
      )}
      <div>
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center justify-center w-full">
            <span className="text-xl font-semibold">Remix Dashboard</span>
          </div>
        </div>
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
  );
}
