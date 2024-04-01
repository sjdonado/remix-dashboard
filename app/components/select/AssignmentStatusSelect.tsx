import clsx from 'clsx';
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';

import type { FC, SelectHTMLAttributes } from 'react';

import type { AssignmentStatus } from '~/constants/assignment';
import { ALL_ASSIGNMENT_STATUSES } from '~/constants/assignment';

import { assignmentStatusToLabel } from '../badge/AssignmentStatusBadge';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  defaultValue?: AssignmentStatus;
  error?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const AssignmentStatusSelect: FC<SelectProps> = ({ error, ...rest }) => {
  return (
    <div className="mb-4">
      <label htmlFor="assignment-status" className="mb-2 block text-sm font-medium">
        Status
      </label>
      <div className="relative">
        <select
          id="assignment-status"
          className={clsx(
            'peer select input-bordered select-sm !h-10 w-full rounded-md !pl-9',
            error && 'input-error'
          )}
          {...rest}
        >
          <option value="" disabled>
            -- Select --
          </option>
          {ALL_ASSIGNMENT_STATUSES.map(status => (
            <option key={status} value={status}>
              {assignmentStatusToLabel(status)}
            </option>
          ))}
        </select>
        <ChevronUpDownIcon className="form-input-icon" />
      </div>
      {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
    </div>
  );
};
