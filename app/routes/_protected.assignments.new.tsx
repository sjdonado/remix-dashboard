import { redirectWithToast } from 'remix-toast';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import type { ActionFunctionArgs } from '@remix-run/node';
import type { UIMatch } from '@remix-run/react';

import { db } from '~/db/config.server';
import { assignmentsTable } from '~/db/schema';
import { AssignmentCreateSchema } from '~/schemas/assignment';

import { UserRole } from '~/constants/user';
import { MOCKED_ASSIGNMENT_BY_TYPE } from '~/constants/assignment';

import { isAuthorized } from '~/services/auth.server';

import { Breadcrumb } from '~/components/Breadcrumbs';
import BackButton from '~/components/forms/BackButton';
import SubmitButton from '~/components/forms/SubmitButton';
import AssignmentTypeSelect from '~/components/select/AssignmentTypeSelect';

const validator = withZod(AssignmentCreateSchema);

export const handle = {
  breadcrumb: (match: UIMatch) => <Breadcrumb pathname={match.pathname} label="New" />,
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userSession = await isAuthorized(request, [UserRole.Admin, UserRole.Teacher]);

  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const { type } = fieldValues.data;

  const { title, content, points, dueAt } = MOCKED_ASSIGNMENT_BY_TYPE[type];

  await db
    .insert(assignmentsTable)
    .values({ title, type, content, points, dueAt, authorId: userSession.id });

  return redirectWithToast('/assignments', {
    message: 'Assignment created successfully',
    type: 'success',
  });
};

export default function NewAssignmentPage() {
  return (
    <ValidatedForm validator={validator} method="post">
      <div className="rounded-lg border border-base-300 bg-base-200/50 p-4 md:p-6">
        <AssignmentTypeSelect name="type" />
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <BackButton message="Cancel" />
        <SubmitButton message="Save" />
      </div>
    </ValidatedForm>
  );
}
