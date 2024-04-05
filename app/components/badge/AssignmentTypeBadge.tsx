import clsx from 'clsx';
import { AssignmentType } from '~/constants/assignment';

export function AssignmentTypeBadge({ type }: { type: AssignmentType }) {
  return (
    <div
      className={clsx('badge w-20 rounded-lg', {
        'bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400 border-sky-300 dark:border-sky-700':
          type === AssignmentType.Quiz,
        'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700':
          type === AssignmentType.Homework,
        'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-700':
          type === AssignmentType.Project,
      })}
    >
      <span className="text-xs font-semibold">{assignmentTypeToLabel(type)}</span>
    </div>
  );
}

export function assignmentTypeToLabel(type: AssignmentType) {
  switch (type) {
    case AssignmentType.Quiz:
      return 'Quiz';
    case AssignmentType.Homework:
      return 'Homework';
    case AssignmentType.Project:
      return 'Project';
  }
}
