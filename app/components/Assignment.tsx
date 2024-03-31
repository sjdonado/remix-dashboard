import type { AssignmentSerialized } from '~/schemas/assignment';
import { formatDateToLocal } from '~/utils/date';

import BackButton from './forms/BackButton';
import Avatar from './Avatar';

interface AssignmentProps {
  assignment: AssignmentSerialized;
}

export default function Assignment({ assignment }: AssignmentProps) {
  const author = assignment.author!;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-base-300 bg-base-200/50 p-2">
        <div className="flex flex-col gap-4 rounded-lg bg-base-100 p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Avatar name={assignment.author.username!} />
              <span className="font-semibold">{author.username}</span>
              <p className="text-gray-500">{formatDateToLocal(assignment.createdAt)}</p>
            </div>
            <h1 className="text-3xl">{assignment.title}</h1>
            <p className="whitespace-pre-line border-t pt-4">{assignment.content}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <BackButton message="Back" />
      </div>
    </div>
  );
}
