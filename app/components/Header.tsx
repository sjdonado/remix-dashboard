import { Bars3Icon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="navbar flex h-12 items-center justify-between px-4 md:justify-end md:px-12">
      <label
        htmlFor="header"
        className="btn btn-ghost drawer-button rounded-lg transition-none md:hidden"
      >
        <Bars3Icon className="size-6" />
      </label>
      <div className="ms:gap-1 flex items-center justify-center">
        <label className="btn btn-ghost swap swap-rotate rounded-lg transition-none">
          <input type="checkbox" className="theme-controller" value="dark" />
          <SunIcon className="swap-off size-6 fill-current" />
          <MoonIcon className="swap-on size-6 fill-current" />
        </label>
      </div>
    </header>
  );
}
