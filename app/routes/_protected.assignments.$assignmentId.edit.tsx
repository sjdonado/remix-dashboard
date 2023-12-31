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
import { json } from '@remix-run/node';
import type { UIMatch } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import { AssignmentSerializedSchema, AssignmentUpdateSchema } from '~/schemas/assignment';

import { auth } from '~/services/auth.server';

import { Input } from '~/components/forms/Input';
import { TextArea } from '~/components/forms/TextArea';
import BackButton from '~/components/forms/BackButton';
import SubmitButton from '~/components/forms/SubmitButton';
import { Breadcrumb } from '~/components/Breadcrumbs';

const validator = withZod(AssignmentUpdateSchema);

export const handle = {
  breadcrumb: (match: UIMatch) => <Breadcrumb pathname={match.pathname} label="Edit" />,
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.assignmentId, 'Missing assignmentId param');
  const { user: userSession, isTeacher } = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  });

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
        isTeacher ? eq(assignmentsTable.authorId, userSession.id) : undefined,
        eq(assignmentsTable.id, params.assignmentId)
      )
    )
    .returning({ updatedId: assignmentsTable.id });

  if (!result.length) {
    return redirectWithToast(`/assignments?${searchParams.toString()}`, {
      message: 'Assignment not found or not authorized to update',
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
        name: usersTable.name,
        username: usersTable.username,
      },
    })
    .from(assignmentsTable)
    .where(eq(assignmentsTable.id, params.assignmentId))
    .leftJoin(usersTable, eq(assignmentsTable.authorId, usersTable.id))
    .limit(1);

  if (!row) {
    throw new Response('Not Found', { status: 404 });
  }

  const result = AssignmentSerializedSchema.safeParse(row);
  if (!result.success) {
    throw new Error(result.error.toString());
  }

  return json({ assignment: result.data });
};

export default function EditAssignmentPage() {
  const { assignment } = useLoaderData<typeof loader>();

  return (
    <ValidatedForm validator={validator} method="post">
      <div className="rounded-lg bg-base-200/30 p-4 md:p-6">
        <Input
          name="title"
          label="Title"
          type="text"
          placeholder="Title"
          defaultValue={assignment.title}
          icon={
            <DocumentIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          }
        />
        <Input
          name="author"
          label="Author"
          type="text"
          defaultValue={assignment.author?.name}
          disabled
          icon={
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          }
        />
        <TextArea
          name="content"
          label="Content"
          placeholder="Content"
          defaultValue={assignment.content}
          icon={
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-[0.55rem] h-[18px] w-[18px]" />
          }
        />
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <BackButton message="Cancel" />
        <SubmitButton message="Edit Assignment" />
      </div>
    </ValidatedForm>
  );
}
