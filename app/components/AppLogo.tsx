import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function AppLogo() {
  return (
    <div
      className={`flex justify-center items-center gap-1 leading-none text-white w-full`}
    >
      <AcademicCapIcon className="h-10 w-10 rotate-[15deg]" />
      <p className="text-3xl">Dashboard</p>
    </div>
  );
}
