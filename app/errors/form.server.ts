import type { SqliteError } from 'better-sqlite3';

import type { ValidationResult } from 'remix-validated-form';
import { validationError } from 'remix-validated-form';

export function duplicateUsernameError(
  error: SqliteError,
  fieldValues: ValidationResult<any>
) {
  // @ts-expect-error
  if (error.message === 'UNIQUE constraint failed: users.username') {
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
