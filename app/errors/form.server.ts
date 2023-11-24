import { PostgresError } from 'postgres';
import type { ValidationResult } from 'remix-validated-form';
import { validationError } from 'remix-validated-form';

export function duplicateUsernameError(error: Error, fieldValues: ValidationResult<any>) {
  if (
    typeof error === PostgresError &&
    error.constraint_name === 'users_username_unique'
  ) {
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
