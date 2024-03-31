import { AcademicCapIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

export default function AppLogo({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'flex items-center justify-center gap-2 rounded-lg p-1 text-primary',
        className
      )}
    >
      <AcademicCapIcon className="size-8 rotate-[15deg] font-medium" />
      <span>Dashboard</span>
    </div>
  );
}
