import type { PostgresError } from 'postgres';

import type { ValidationResult } from 'remix-validated-form';
import { validationError } from 'remix-validated-form';

export function duplicateUsernameError(
  error: PostgresError,
  fieldValues: ValidationResult<any>
) {
  if (error.constraint_name === 'users_username_unique') {
    return validationError(
      {
        fieldErrors: {
          username: 'This username is already taken',
        },
        formId: fieldValues.formId,
      },
      fieldValues.data
    );
  }
}
