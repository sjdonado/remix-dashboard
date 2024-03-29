import type { z } from 'zod';

export async function serialize<T>(schema: z.Schema<T>, data: Partial<T>) {
  const result = await schema.safeParseAsync(data);

  if (!result.success) {
    throw new Error(result.error.toString());
  }

  return result.data;
}

export async function serializeAll<T>(schema: z.Schema<T>, data: Partial<T>[]) {
  return Promise.all(data.map(d => serialize(schema, d)));
}
