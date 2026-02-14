import { registerAs } from '@nestjs/config';

export const uploadsConfig = registerAs('uploads', () => ({
  dir: process.env.UPLOADS_DIR,
}));
