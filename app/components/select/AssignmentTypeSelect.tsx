import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

import { ALL_ASSIGNMENT_TYPES, AssignmentType } from '~/constants/assignment';

import { Select } from './Select';
import { assignmentTypeToLabel } from '../badge/AssignmentTypeBadge';

export default function AssignmentTypeSelect({
  name,
  defaultValue = AssignmentType.Quiz,
  disabled,
}: {
  name: string;
  defaultValue?: string;
  disabled?: boolean;
}) {
  return (
    <Select
      name={name}
      label="Choose type"
      defaultValue={defaultValue}
      icon={<ChevronUpDownIcon className="form-input-icon" />}
      disabled={disabled}
    >
      <option value="" disabled>
        -- Select --
      </option>
      {ALL_ASSIGNMENT_TYPES.map(role => (
        <option key={role} value={role}>
          {assignmentTypeToLabel(role)}
        </option>
      ))}
    </Select>
  );
}
