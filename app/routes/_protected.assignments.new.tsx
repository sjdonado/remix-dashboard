import { DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

import { redirectWithToast } from 'remix-toast';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import type { ActionFunctionArgs } from '@remix-run/node';
import type { UIMatch } from '@remix-run/react';

import { db } from '~/db/config.server';
import { assignmentsTable } from '~/db/schema';
import { AssignmentCreateSchema } from '~/schemas/assignment';

import { auth } from '~/services/auth.server';

import { Breadcrumb } from '~/components/Breadcrumbs';
import { Input } from '~/components/forms/Input';
import { TextArea } from '~/components/forms/TextArea';
import BackButton from '~/components/forms/BackButton';
import SubmitButton from '~/components/forms/SubmitButton';

const validator = withZod(AssignmentCreateSchema);

export const handle = {
  breadcrumb: (match: UIMatch) => <Breadcrumb pathname={match.pathname} label="New" />,
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { user: author } = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const { title, content } = fieldValues.data;

  await db.insert(assignmentsTable).values({ title, content, authorId: author.id });

  return redirectWithToast('/assignments', {
    message: 'Assignment created successfully',
    type: 'success',
  });
};

export default function NewAssignmentPage() {
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
        <BackButton message="Cancel" />
        <SubmitButton message="New Assignment" />
      </div>
    </ValidatedForm>
  );
}
