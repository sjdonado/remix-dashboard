import type { z } from 'zod';

export async function flatSafeParseAsync<Input>(
  schema: z.Schema<Input>,
  data?: Partial<Input> | null
) {
  const result = await schema.safeParseAsync(data);

  if (!result.success) {
    const { fieldErrors, formErrors } = result.error?.flatten() ?? {};

    const fieldErrorsKeys = Object.keys(fieldErrors ?? {});
    const fieldErrorsMessage = fieldErrorsKeys.length
      ? `${fieldErrorsKeys[0] ?? ''}: ${
          fieldErrors?.[fieldErrorsKeys[0] as keyof typeof fieldErrors]?.[0] ?? ''
        }`
      : undefined;

    const formErrorsMessage = `${formErrors?.[0] ?? ''}`;

    throw new Error(fieldErrorsMessage ?? formErrorsMessage ?? 'Unexpected error');
  }

  return result.data;
}

export async function flatSafeParseAsyncAll<Input>(
  schema: z.Schema<Input>,
  data: Partial<Input>[]
) {
  return Promise.all(data.map(d => flatSafeParseAsync(schema, d)));
}
