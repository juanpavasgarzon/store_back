export const ATTRIBUTE_VALUE_TYPE = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  SELECT: 'select',
} as const;

export type AttributeValueType = (typeof ATTRIBUTE_VALUE_TYPE)[keyof typeof ATTRIBUTE_VALUE_TYPE];
