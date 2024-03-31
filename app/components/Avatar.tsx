import clsx from 'clsx';

const TAILWIND_COLORS = [
  'bg-gray-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-violet-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
];

interface AvatarProps {
  name: string;
  className?: string;
}

export default function Avatar({ name, className }: AvatarProps) {
  const match = name.match(/\b(\w)/g) ?? []; // return an array of the first letter of each word
  let initials = (match[0] + (match[1] || '')).toUpperCase();

  const backgroundColor =
    TAILWIND_COLORS[
      (name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % TAILWIND_COLORS.length
    ];

  return (
    <div
      className={clsx(
        'flex size-9 min-w-9 items-center justify-center rounded-full',
        backgroundColor,
        className
      )}
    >
      <span className="text-xs text-white">{initials}</span>
    </div>
  );
}
