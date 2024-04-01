import type { AssignmentSerializedCard } from '~/schemas/assignment';
import { formatDateToLocal } from '~/utils/date';

import BackButton from './forms/BackButton';
import Avatar from './Avatar';
import { AssignmentTypeBadge } from './badge/AssignmentTypeBadge';
import { AssignmentStatusBadge } from './badge/AssignmentStatusBadge';
import clsx from 'clsx';
import { Link } from '@remix-run/react';

export default function AssignmentCard({
  assignment,
  expanded,
}: {
  assignment: AssignmentSerializedCard;
  expanded?: boolean;
}) {
  const author = assignment.author!;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        {expanded && <Avatar name={author.username!} />}
        <div
          className={clsx(
            'relative w-full rounded-lg border border-base-300 p-4',
            expanded && 'card-left-arrow'
          )}
        >
          <div className={clsx('flex flex-col gap-2')}>
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col gap-2">
                <p className="text-xs text-gray-500">
                  {formatDateToLocal(assignment.createdAt)}
                </p>
                <h1 className={clsx('text-xl', expanded && '!text-2xl')}>
                  <Link to={`/assignments/${assignment.id}/show`} className="link">
                    {assignment.title}
                  </Link>
                </h1>
              </div>
              <AssignmentStatusBadge status={assignment.status} />
              <AssignmentTypeBadge type={assignment.type} />
            </div>
            {expanded && (
              <ul>
                <li className="flex items-center gap-2">
                  <label className="font-medium">Points:</label>
                  <p>{assignment.points}</p>
                </li>
                <li className="flex items-center gap-2">
                  <label className="font-medium">Due At:</label>
                  <p>{formatDateToLocal(assignment.dueAt)}</p>
                </li>
              </ul>
            )}
            <p className={clsx('whitespace-pre-line', !expanded && 'line-clamp-2')}>
              {assignment.content}
            </p>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="flex justify-end gap-4">
          <BackButton message="Back" />
        </div>
      )}
    </div>
  );
}
