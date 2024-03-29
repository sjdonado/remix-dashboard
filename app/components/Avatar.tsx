import clsx from 'clsx';

const TAILWIND_COLORS = [
  'bg-gray-400',
  'bg-yellow-400',
  'bg-green-400',
  'bg-blue-400',
  'bg-indigo-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-red-400',
  'bg-orange-400',
  'bg-amber-400',
  'bg-emerald-400',
  'bg-teal-400',
  'bg-cyan-400',
  'bg-violet-400',
  'bg-fuchsia-400',
  'bg-pink-400',
  'bg-rose-400',
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
