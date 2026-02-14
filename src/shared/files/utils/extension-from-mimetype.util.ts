import { MIME_TO_EXT } from '../constants/mime-to-ext.constants';

export function extensionFromMimetype(mimetype: string): string {
  return MIME_TO_EXT[mimetype] ?? 'jpg';
}
