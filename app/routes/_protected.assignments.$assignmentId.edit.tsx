import { and, eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import { redirectWithToast } from 'remix-toast';
import {
  CalculatorIcon,
  CalendarIcon,
  DocumentIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid';

import { useState } from 'react';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import type { UIMatch } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import { AssignmentSerializedSchema, AssignmentUpdateSchema } from '~/schemas/assignment';

import { UserRole } from '~/constants/user';
import type { AssignmentType } from '~/constants/assignment';
import { MOCKED_ASSIGNMENT_BY_TYPE } from '~/constants/assignment';

import { isAuthorized } from '~/services/auth.server';

import { Input } from '~/components/forms/Input';
import BackButton from '~/components/forms/BackButton';
import SubmitButton from '~/components/forms/SubmitButton';
import { Breadcrumb } from '~/components/Breadcrumbs';
import AssignmentTypeSelect from '~/components/select/AssignmentTypeSelect';

const validator = withZod(AssignmentUpdateSchema);

export const handle = {
  breadcrumb: (match: UIMatch) => <Breadcrumb pathname={match.pathname} label="Edit" />,
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.assignmentId, 'Missing assignmentId param');
  const userSession = await isAuthorized(request, [UserRole.Admin, UserRole.Teacher]);

  const { searchParams } = new URL(request.url);

  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const { type } = fieldValues.data;

  const { title, content, points, dueAt } = MOCKED_ASSIGNMENT_BY_TYPE[type];

  const result = await db
    .update(assignmentsTable)
    .set({ title, type, content, points, dueAt, updatedAt: new Date() })
    .where(
      and(
        userSession.isTeacher ? eq(assignmentsTable.authorId, userSession.id) : undefined,
        eq(assignmentsTable.id, params.assignmentId)
      )
    )
    .returning({ updatedId: assignmentsTable.id });

  if (!result.length) {
    return redirectWithToast(`/assignments?${searchParams.toString()}`, {
      message: 'Assignment not found or you are not authorized to update this assignment',
      type: 'error',
    });
  }

  return redirectWithToast(`/assignments?${searchParams.toString()}`, {
    message: 'Assignment updated successfully',
    type: 'success',
  });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.assignmentId, 'Missing assignmentId param');

  const [row] = await db
    .select({
      id: assignmentsTable.id,
      status: assignmentsTable.status,
      type: assignmentsTable.type,
      title: assignmentsTable.title,
      content: assignmentsTable.content,
      points: assignmentsTable.points,
      dueAt: assignmentsTable.dueAt,
      createdAt: assignmentsTable.createdAt,
      updatedAt: assignmentsTable.updatedAt,
      author: {
        id: assignmentsTable.authorId,
        username: usersTable.username,
      },
    })
    .from(assignmentsTable)
    .leftJoin(usersTable, eq(assignmentsTable.authorId, usersTable.id))
    .where(eq(assignmentsTable.id, params.assignmentId))
    .limit(1);

  if (!row) {
    throw new Response('Assignment Not Found', { status: 404 });
  }

  const assignment = await AssignmentSerializedSchema.parseAsync(row);

  return { assignment };
};

export default function EditAssignmentPage() {
  const { assignment } = useLoaderData<typeof loader>();

  const [assignmentType, setAssignmentType] = useState<AssignmentType>(assignment.type);

  const selectedAssignment = assignmentType
    ? MOCKED_ASSIGNMENT_BY_TYPE[assignmentType]
    : undefined;

  return (
    <ValidatedForm validator={validator} method="post">
      <div className="rounded-lg border border-base-300 bg-base-200/30 p-4 md:p-6">
        <AssignmentTypeSelect
          name="type"
          defaultValue={assignment.type}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setAssignmentType(e.target.value as AssignmentType)
          }
        />
        <Input
          name="title"
          label="Title"
          type="text"
          icon={<DocumentIcon className="form-input-icon" />}
          defaultValue={selectedAssignment?.title}
          disabled
        />
        <Input
          name="content"
          label="Content"
          type="text"
          icon={<DocumentTextIcon className="form-input-icon" />}
          defaultValue={selectedAssignment?.content}
          disabled
        />
        <div className="flex flex-wrap gap-4 [&>div]:flex-1">
          <Input
            name="points"
            label="Points"
            type="number"
            icon={<CalculatorIcon className="form-input-icon" />}
            defaultValue={selectedAssignment?.points}
            disabled
          />
          <Input
            name="dueAt"
            label="Due At"
            type="datetime-local"
            icon={<CalendarIcon className="form-input-icon" />}
            defaultValue={selectedAssignment?.dueAt.toISOString().substring(0, 16)}
            disabled
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <BackButton message="Cancel" />
        <SubmitButton message="Edit Assignment" />
      </div>
    </ValidatedForm>
  );
}
