import clsx from 'clsx';
import { AssignmentStatus } from '~/constants/assignment';

export function AssignmentStatusBadge({ status }: { status: AssignmentStatus }) {
  return (
    <div
      className={clsx('badge w-20 rounded-lg', {
        'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700':
          status === AssignmentStatus.Open,
        'bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400 border-red-300 dark:border-red-700':
          status === AssignmentStatus.Closed,
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
