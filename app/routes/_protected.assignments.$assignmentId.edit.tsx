import { and, eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import {
  DocumentIcon,
  DocumentTextIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { redirectWithToast } from 'remix-toast';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import type { UIMatch } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import { AssignmentSerializedSchema, AssignmentUpdateSchema } from '~/schemas/assignment';

import { isAuthorized } from '~/services/auth.server';

import { Input } from '~/components/forms/Input';
import { TextArea } from '~/components/forms/TextArea';
import BackButton from '~/components/forms/BackButton';
import SubmitButton from '~/components/forms/SubmitButton';
import { Breadcrumb } from '~/components/Breadcrumbs';
import { UserRole } from '~/constants/user';

const validator = withZod(AssignmentUpdateSchema);

export const handle = {
  breadcrumb: (match: UIMatch) => <Breadcrumb pathname={match.pathname} label="Edit" />,
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.assignmentId, 'Missing assignmentId param');
  const userSession = await isAuthorized(request, [UserRole.Teacher]);

  const { searchParams } = new URL(request.url);

  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const { title, content } = fieldValues.data;

  const result = await db
    .update(assignmentsTable)
    .set({ title, content, updatedAt: new Date().toISOString() })
    .where(
      and(
        eq(assignmentsTable.authorId, userSession.id),
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
      title: assignmentsTable.title,
      content: assignmentsTable.content,
      createdAt: assignmentsTable.createdAt,
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

  return (
    <ValidatedForm validator={validator} method="post">
      <div className="rounded-lg border border-base-300 bg-base-200/50 p-4 md:p-6">
        <Input
          name="title"
          label="Title"
          type="text"
          placeholder="Title"
          defaultValue={assignment.title}
          icon={<DocumentIcon className="form-input-icon" />}
        />
        <Input
          name="author"
          label="Author"
          type="text"
          defaultValue={assignment.author.username!}
          disabled
          icon={<UserCircleIcon className="form-input-icon" />}
        />
        <TextArea
          name="content"
          label="Content"
          placeholder="Content"
          defaultValue={assignment.content}
          icon={<DocumentTextIcon className="form-input-icon" />}
        />
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <BackButton message="Cancel" />
        <SubmitButton message="Edit Assignment" />
      </div>
    </ValidatedForm>
  );
}
