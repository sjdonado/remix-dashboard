import { v4 as uuidv4 } from 'uuid';

import { DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import { db } from '~/db/config.server';
import { assignmentsTable } from '~/db/schema';
import { AssignmentCreateSchema } from '~/schemas/assignment';
import type { UserSession } from '~/schemas/user';

import { auth } from '~/session.server';

import { Input } from '~/components/forms/Input';
import { TextArea } from '~/components/forms/TextArea';

const validator = withZod(AssignmentCreateSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await auth.isAuthenticated(request, { failureRedirect: '/login' });
  const userSession = JSON.parse(data) satisfies UserSession;
  const authorId = userSession.id;

  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const { title, content } = fieldValues.data;

  await db.insert(assignmentsTable).values({ id: uuidv4(), title, content, authorId });

  return redirect('/assignments');
};

export default function NewAssignmentPage() {
  const navigate = useNavigate();

  return (
    <ValidatedForm validator={validator} method="post">
      <div className="rounded-lg bg-base-200/30 p-4 md:p-6">
        <Input
          name="title"
          label="Title"
          type="text"
          placeholder="Title"
          icon={
            <DocumentIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          }
        />
        <TextArea
          name="content"
          label="Content"
          placeholder="Content"
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
          New Assignment
        </button>
      </div>
    </ValidatedForm>
  );
}