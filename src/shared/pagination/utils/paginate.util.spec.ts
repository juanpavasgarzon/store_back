import { encodeCursor, decodeCursor } from './cursor.utils';

describe('cursor utils', () => {
  describe('encodeCursor / decodeCursor', () => {
    it('round-trips a string sort value', () => {
      const payload = { id: 'abc-123', sortValue: '2024-01-15T10:00:00.000Z' };
      const encoded = encodeCursor(payload);
      const decoded = decodeCursor(encoded);
      expect(decoded).toEqual(payload);
    });

    it('round-trips a numeric sort value', () => {
      const payload = { id: 'xyz-789', sortValue: 42 };
      const encoded = encodeCursor(payload);
      const decoded = decodeCursor(encoded);
      expect(decoded).toEqual(payload);
    });

    it('round-trips a Date sort value as ISO string', () => {
      const date = new Date('2024-03-10T08:00:00.000Z');
      const payload = { id: 'id-1', sortValue: date };
      const encoded = encodeCursor(payload);
      const decoded = decodeCursor(encoded);
      expect(decoded?.id).toBe('id-1');
      expect(decoded?.sortValue).toBe(date.toISOString());
    });

    it('returns null for a malformed cursor', () => {
      expect(decodeCursor('not-valid-base64url$$')).toBeNull();
    });

    it('returns null for a cursor missing id', () => {
      const raw = Buffer.from(JSON.stringify({ sortValue: 'x' })).toString('base64url');
      expect(decodeCursor(raw)).toBeNull();
    });
  });
});
