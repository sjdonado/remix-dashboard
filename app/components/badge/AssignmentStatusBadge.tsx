import clsx from 'clsx';
import { AssignmentStatus } from '~/constants/assignment';

export function AssignmentStatusBadge({ status }: { status: AssignmentStatus }) {
  return (
    <div
      className={clsx('badge w-20 rounded-lg', {
        'bg-emerald-100 text-emerald-600 border-emerald-300':
          status === AssignmentStatus.Open,
        'bg-red-100 text-red-500 border-red-300': status === AssignmentStatus.Closed,
      })}
    >
      <span className="text-xs font-semibold">{assignmentStatusToLabel(status)}</span>
    </div>
  );
}

export function assignmentStatusToLabel(status: AssignmentStatus) {
  switch (status) {
    case AssignmentStatus.Open:
      return 'Open';
    case AssignmentStatus.Closed:
      return 'Closed';
  }
}
