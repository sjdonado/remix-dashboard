import { redirectWithToast } from 'remix-toast';
import {
  CalculatorIcon,
  CalendarIcon,
  DocumentIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid';

import { useCallback, useState } from 'react';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import type { ActionFunctionArgs } from '@remix-run/node';
import type { UIMatch } from '@remix-run/react';

import { db } from '~/db/config.server';
import { assignmentsTable } from '~/db/schema';
import { AssignmentCreateSchema } from '~/schemas/assignment';

import { UserRole } from '~/constants/user';
import { AssignmentType, MOCKED_ASSIGNMENT_BY_TYPE } from '~/constants/assignment';

import { isAuthorized } from '~/services/auth.server';

import { Breadcrumb } from '~/components/Breadcrumbs';
import BackButton from '~/components/forms/BackButton';
import SubmitButton from '~/components/forms/SubmitButton';
import AssignmentTypeSelect from '~/components/select/AssignmentTypeSelect';
import { Input } from '~/components/forms/Input';

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
  const [assignmentType, setAssignmentType] = useState<AssignmentType>(
    AssignmentType.Quiz
  );

  const assignment = useCallback(
    () => (assignmentType ? MOCKED_ASSIGNMENT_BY_TYPE[assignmentType] : undefined),
    [assignmentType]
  );

  return (
    <ValidatedForm validator={validator} method="post">
      <div className="rounded-lg border border-base-300 bg-base-200/30 p-4 md:p-6">
        <AssignmentTypeSelect
          name="type"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setAssignmentType(e.target.value as AssignmentType)
          }
        />
        <Input
          name="title"
          label="Title"
          type="text"
          icon={<DocumentIcon className="form-input-icon" />}
          defaultValue={assignment()?.title}
          disabled
        />
        <Input
          name="content"
          label="Content"
          type="text"
          icon={<DocumentTextIcon className="form-input-icon" />}
          defaultValue={assignment()?.content}
          disabled
        />
        <div className="flex flex-wrap gap-4 [&>div]:flex-1">
          <Input
            name="points"
            label="Points"
            type="number"
            icon={<CalculatorIcon className="form-input-icon" />}
            defaultValue={assignment()?.points}
            disabled
          />
          <Input
            name="dueAt"
            label="Due At"
            type="datetime-local"
            icon={<CalendarIcon className="form-input-icon" />}
            defaultValue={assignment()?.dueAt.toISOString().substring(0, 16)}
            disabled
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <BackButton message="Cancel" />
        <SubmitButton message="Save" />
      </div>
    </ValidatedForm>
  );
}
