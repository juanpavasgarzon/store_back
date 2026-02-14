export interface CursorPayload {
  id: string;
  sortValue: string | number | Date;
}

export interface DecodedCursorPayload {
  id?: string;
  sortValue?: string | number;
}
