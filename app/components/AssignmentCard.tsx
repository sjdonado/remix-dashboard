import clsx from 'clsx';
import { Link } from '@remix-run/react';

import type { AssignmentSerializedCard } from '~/schemas/assignment';

import BackButton from './forms/BackButton';
import Avatar from './Avatar';
import { AssignmentTypeBadge } from './badge/AssignmentTypeBadge';
import { AssignmentStatusBadge } from './badge/AssignmentStatusBadge';

export default function AssignmentCard({
  showUrl,
  assignment,
  expanded,
}: {
  showUrl: string;
  assignment: AssignmentSerializedCard;
  expanded?: boolean;
}) {
  const author = assignment.author!;

  return (
    <div className="flex flex-col gap-4">
      <div className={clsx('relative w-full rounded-lg border border-base-300 p-4')}>
        <div className={clsx('flex flex-col gap-2', expanded && '!gap-4')}>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center gap-2">
                {expanded && (
                  <div className="flex items-center gap-2">
                    <Avatar name={author.username!} />
                    <p>{author.username}</p>
                  </div>
                )}
                <p className="min-w-24 text-xs text-gray-500">{assignment.createdAt}</p>
              </div>
              {!expanded && (
                <h1 className="text-xl">
                  <Link to={showUrl} className="link">
                    {assignment.title}
                  </Link>
                </h1>
              )}
            </div>
            <div className="flex items-center gap-2">
              <AssignmentStatusBadge status={assignment.status} />
              <AssignmentTypeBadge type={assignment.type} />
            </div>
          </div>
          {expanded && (
            <ul>
              <li className="flex items-center gap-2">
                <label className="font-medium">Points:</label>
                <p>{assignment.points}</p>
              </li>
              <li className="flex items-center gap-2">
                <label className="font-medium">Due At:</label>
                <p>{assignment.dueAt}</p>
              </li>
            </ul>
          )}
          <p className={clsx('whitespace-pre-line', !expanded && 'line-clamp-2')}>
            {assignment.content}
          </p>
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
