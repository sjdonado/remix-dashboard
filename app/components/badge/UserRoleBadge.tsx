import { UserRole } from '~/constants/user';

export function UserRoleBadge({ role }: { role: UserRole }) {
  return (
    <div className="border-base-custom badge h-5 rounded-md bg-base-200/30">
      <span className="text-xs font-semibold">{userRoleToLabel(role)}</span>
    </div>
  );
}

export function userRoleToLabel(role: UserRole) {
  switch (role) {
    case UserRole.Admin:
      return 'Admin';
    case UserRole.Teacher:
      return 'Teacher';
    case UserRole.Student:
      return 'Student';
  }
}
