export const VARIANT_VALUE_TYPE = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  SELECT: 'select',
} as const;

export type VariantValueType = (typeof VARIANT_VALUE_TYPE)[keyof typeof VARIANT_VALUE_TYPE];
