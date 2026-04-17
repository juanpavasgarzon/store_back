import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import type { Readable } from 'stream';
import type { IStorageService } from '../interfaces/storage-service.interface';

const EXT_CONTENT_TYPES: Record<string, string> = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
};

@Injectable()
export class S3StorageService implements IStorageService {
  private readonly logger = new Logger(S3StorageService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('storage.endpoint') ?? 'http://localhost:9000';
    this.bucket = this.configService.get<string>('storage.bucket') ?? 'store-media';
    this.publicUrl = this.configService.get<string>('storage.publicUrl') ?? endpoint;

    this.s3 = new S3Client({
      endpoint,
      region: this.configService.get<string>('storage.region') ?? 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('storage.accessKey') ?? 'minioadmin',
        secretAccessKey: this.configService.get<string>('storage.secretKey') ?? 'minioadmin',
      },
      forcePathStyle: true, // Required for MinIO path-style URLs
    });
  }

  async saveFile(relativePath: string, buffer: Buffer): Promise<void> {
    const ext = relativePath.split('.').pop()?.toLowerCase() ?? '';
    const contentType = EXT_CONTENT_TYPES[ext] ?? 'application/octet-stream';

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: relativePath,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    this.logger.debug(`Uploaded: ${relativePath}`);
  }

  async deleteFile(relativePath: string): Promise<void> {
    await this.s3
      .send(new DeleteObjectCommand({ Bucket: this.bucket, Key: relativePath }))
      .catch((err: unknown) =>
        this.logger.warn(`Delete failed for ${relativePath}: ${String(err)}`),
      );
  }

  async readFile(relativePath: string): Promise<Readable> {
    const response = await this.s3.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: relativePath }),
    );
    return response.Body as Readable;
  }

  async fileExists(relativePath: string): Promise<boolean> {
    try {
      await this.s3.send(new HeadObjectCommand({ Bucket: this.bucket, Key: relativePath }));
      return true;
    } catch {
      return false;
    }
  }

  resolvePublicUrl(relativePath: string): string {
    // MinIO public URL: http://host:9000/bucket/path/to/file
    return `${this.publicUrl}/${this.bucket}/${relativePath}`;
  }
}
