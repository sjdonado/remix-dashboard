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
      <div className="rounded-lg bg-base-200/50 p-2">
        <div className="flex flex-col bg-base-100 rounded-lg gap-4 p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center text-sm gap-2">
              <Avatar name={assignment.author.name} />
              <span className="font-semibold">{author.name}</span>
              <p className="text-gray-500">{formatDateToLocal(assignment.createdAt)}</p>
            </div>
            <h1 className="text-3xl">{assignment.title}</h1>
            <p className="border-t pt-4 whitespace-pre-line">{assignment.content}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <BackButton message="Go back" />
      </div>
    </div>
  );
}
