import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync } from 'fs';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join, resolve, dirname } from 'path';
import type { Readable } from 'stream';
import type { IStorageService } from '../interfaces/storage-service.interface';

const DEFAULT_UPLOADS_DIR = join(process.cwd(), 'uploads');
const LISTINGS_PATH_PREFIX = 'listings/';

@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly uploadsDir: string;
  private readonly apiBase: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadsDir = this.configService.get<string>('uploads.dir') ?? DEFAULT_UPLOADS_DIR;
    const prefix = this.configService.get<string>('app.apiPrefix') ?? 'api';
    this.apiBase = `/${prefix}/v1`;
  }

  async saveFile(relativePath: string, buffer: Buffer): Promise<void> {
    const absolutePath = this.toAbsolutePath(relativePath);
    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, buffer);
  }

  async deleteFile(relativePath: string): Promise<void> {
    const absolutePath = this.toAbsolutePath(relativePath);
    await unlink(absolutePath).catch(() => undefined);
  }

  async readFile(relativePath: string): Promise<Readable> {
    const absolutePath = this.toAbsolutePath(relativePath);
    return createReadStream(absolutePath);
  }

  async fileExists(relativePath: string): Promise<boolean> {
    const absolutePath = this.toAbsolutePath(relativePath);
    const resolvedBase = resolve(this.uploadsDir);
    const resolvedFile = resolve(absolutePath);
    return resolvedFile.startsWith(resolvedBase) && existsSync(resolvedFile);
  }

  resolvePublicUrl(relativePath: string): string {
    if (relativePath.startsWith(LISTINGS_PATH_PREFIX)) {
      const withoutPrefix = relativePath.slice(LISTINGS_PATH_PREFIX.length);
      const slashIndex = withoutPrefix.indexOf('/');
      if (slashIndex !== -1) {
        const listingId = withoutPrefix.slice(0, slashIndex);
        const filename = withoutPrefix.slice(slashIndex + 1);
        return `${this.apiBase}/listings/${listingId}/photos/${filename}`;
      }
    }
    return `/${relativePath}`;
  }

  private toAbsolutePath(relativePath: string): string {
    return join(this.uploadsDir, relativePath);
  }
}
