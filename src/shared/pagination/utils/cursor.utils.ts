import type { CursorPayload, DecodedCursorPayload } from '../interfaces/cursor.interface';

export function encodeCursor(payload: CursorPayload): string {
  const data = JSON.stringify({
    id: payload.id,
    sortValue:
      payload.sortValue instanceof Date ? payload.sortValue.toISOString() : payload.sortValue,
  });
  return Buffer.from(data).toString('base64url');
}

export function decodeCursor(cursor: string): CursorPayload | null {
  try {
    const data = Buffer.from(cursor, 'base64url').toString('utf-8');
    const parsed = JSON.parse(data) as DecodedCursorPayload;
    if (parsed.id == null) {
      return null;
    }
    return {
      id: parsed.id,
      sortValue: (parsed.sortValue ?? parsed.id) as string | number | Date,
    };
  } catch {
    return null;
  }
}
