import { eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import {
  DocumentIcon,
  DocumentTextIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import { AssignmentUpdateSchema } from '~/schemas/assignment';

import { Input } from '~/components/forms/Input';
import { TextArea } from '~/components/forms/TextArea';

const validator = withZod(AssignmentUpdateSchema);

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.assignmentId, 'Missing assignmentId param');
  const { searchParams } = new URL(request.url);

  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const { title, content } = fieldValues.data;

  await db
    .update(assignmentsTable)
    .set({ title, content, updatedAt: new Date() })
    .where(eq(assignmentsTable.id, params.assignmentId));

  return redirect(`/assignments?${searchParams.toString()}`);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.assignmentId, 'Missing assignmentId param');

  const [assignment] = await db
    .select({
      id: assignmentsTable.id,
      title: assignmentsTable.title,
      content: assignmentsTable.content,
      author: {
        name: usersTable.name,
      },
    })
    .from(assignmentsTable)
    .where(eq(assignmentsTable.id, params.assignmentId))
    .leftJoin(usersTable, eq(assignmentsTable.authorId, usersTable.id))
    .limit(1);

  if (!assignment) {
    throw new Response('Not Found', { status: 404 });
  }

  return json({ assignment });
};

export default function EditAssignmentPage() {
  const navigate = useNavigate();
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
        <button
          className="flex h-10 items-center rounded-lg bg-base-200 px-4 text-sm font-medium hover:bg-base-200/50"
          onClick={() => navigate(-1)}
          type="button"
        >
          Cancel
        </button>
        <button
          className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary/50"
          type="submit"
        >
          Edit Assignment
        </button>
      </div>
    </ValidatedForm>
  );
}
