import type { DatabaseError } from 'pg';

import type { ValidationResult } from 'remix-validated-form';
import { validationError } from 'remix-validated-form';

export function duplicateUsernameError(
  error: DatabaseError,
  fieldValues: ValidationResult<any>
) {
  if (error.constraint === 'users_username_unique') {
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
