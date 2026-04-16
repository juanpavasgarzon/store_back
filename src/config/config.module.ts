import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { envSchema } from './env.validation';
import { appConfig } from './app.config';
import { databaseConfig } from './database.config';
import { jwtConfig } from './jwt.config';
import { uploadsConfig } from './uploads.config';
import { storageConfig } from './storage.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, uploadsConfig, storageConfig],
      validationSchema: envSchema,
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
