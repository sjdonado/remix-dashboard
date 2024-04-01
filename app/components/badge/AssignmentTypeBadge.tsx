import clsx from 'clsx';
import { AssignmentType } from '~/constants/assignment';

export function AssignmentTypeBadge({ type }: { type: AssignmentType }) {
  return (
    <div
      className={clsx('badge w-20 rounded-lg', {
        'bg-sky-100 text-sky-600 border-sky-300': type === AssignmentType.Quiz,
        'bg-orange-100 text-orange-600 border-orange-300':
          type === AssignmentType.Homework,
        'bg-purple-100 text-purple-600 border-purple-300':
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
