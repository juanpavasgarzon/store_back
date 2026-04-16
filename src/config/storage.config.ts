import { registerAs } from '@nestjs/config';

export const storageConfig = registerAs('storage', () => ({
  endpoint: process.env.S3_ENDPOINT,
  bucket: process.env.S3_BUCKET ?? 'store-media',
  accessKey: process.env.S3_ACCESS_KEY ?? 'minioadmin',
  secretKey: process.env.S3_SECRET_KEY ?? 'minioadmin',
  region: process.env.S3_REGION ?? 'us-east-1',
  publicUrl: process.env.S3_PUBLIC_URL,
}));
