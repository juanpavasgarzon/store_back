export const REPORT_REASON = {
  SPAM: 'spam',
  FRAUD: 'fraud',
  INAPPROPRIATE: 'inappropriate',
  DUPLICATE: 'duplicate',
  WRONG_CATEGORY: 'wrong_category',
  OTHER: 'other',
} as const;

export type ReportReason = (typeof REPORT_REASON)[keyof typeof REPORT_REASON];
