import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync } from 'fs';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join, resolve, dirname } from 'path';
import type { Readable } from 'stream';
import type { IStorageService } from '../interfaces/storage-service.interface';

const DEFAULT_UPLOADS_DIR = join(process.cwd(), 'uploads');

@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly uploadsDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadsDir = this.configService.get<string>('uploads.dir') ?? DEFAULT_UPLOADS_DIR;
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

  readFile(relativePath: string): Readable {
    const absolutePath = this.toAbsolutePath(relativePath);
    return createReadStream(absolutePath);
  }

  fileExists(relativePath: string): boolean {
    const absolutePath = this.toAbsolutePath(relativePath);
    const resolvedBase = resolve(this.uploadsDir);
    const resolvedFile = resolve(absolutePath);
    return resolvedFile.startsWith(resolvedBase) && existsSync(resolvedFile);
  }

  resolvePublicUrl(relativePath: string): string {
    return `/${relativePath}`;
  }

  private toAbsolutePath(relativePath: string): string {
    return join(this.uploadsDir, relativePath);
  }
}
