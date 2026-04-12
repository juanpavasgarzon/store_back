import type { Readable } from 'stream';

export const STORAGE_SERVICE = 'STORAGE_SERVICE';

export interface IStorageService {
  saveFile(relativePath: string, buffer: Buffer): Promise<void>;
  deleteFile(relativePath: string): Promise<void>;
  readFile(relativePath: string): Readable;
  fileExists(relativePath: string): boolean;
  resolvePublicUrl(relativePath: string): string;
}
