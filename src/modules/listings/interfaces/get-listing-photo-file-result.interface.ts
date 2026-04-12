import type { Readable } from 'stream';

export interface GetListingPhotoFileResult {
  stream: Readable;
  contentType: string;
}
