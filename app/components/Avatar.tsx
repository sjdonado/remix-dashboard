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
  const initials = `${name.split(' ')[0][0]}${
    name.split(' ')[1]?.[0] ?? ''
  }`.toUpperCase();
  const backgroundColor = TAILWIND_COLORS[name.charCodeAt(0) % TAILWIND_COLORS.length];

  return (
    <div
      className={`rounded-full w-8 h-8 flex items-center justify-center ${backgroundColor} ${className}`}
    >
      <span className="text-white text-xs">{initials}</span>
    </div>
  );
}
