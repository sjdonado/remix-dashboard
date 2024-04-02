import { UserGroupIcon } from '@heroicons/react/24/outline';

import { ALL_USER_ROLES, UserRole } from '~/constants/user';

import { Select } from './Select';
import { userRoleToLabel } from '../badge/UserRoleBadge';

export default function UserRoleSelect({
  name,
  defaultValue = UserRole.Admin,
  disabled,
}: {
  name: string;
  defaultValue?: string;
  disabled?: boolean;
}) {
  return (
    <Select
      name={name}
      label="Choose role"
      defaultValue={defaultValue}
      icon={<UserGroupIcon className="form-input-icon" />}
      disabled={disabled}
    >
      <option value="" disabled>
        -- Select --
      </option>
      {ALL_USER_ROLES.map(role => (
        <option key={role} value={role}>
          {userRoleToLabel(role)}
        </option>
      ))}
    </Select>
  );
}
