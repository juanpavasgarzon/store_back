import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import type { HelmetOptions } from 'helmet';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter, httpRequestLogger, requestIdMiddleware } from './shared';
import { swaggerSetUp } from './swagger-setup';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const nodeEnv = config.get<string>('app.nodeEnv', 'development');
  const isProduction = nodeEnv === 'production';

  const helmetOptions: HelmetOptions = {
    contentSecurityPolicy: isProduction,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  };
  app.use(helmet(helmetOptions));
  app.use(compression());
  app.use(requestIdMiddleware);
  app.use(httpRequestLogger);

  const corsOrigin = config.get<string>('app.corsOrigin');
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  const validationPipeOptions = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });
  app.useGlobalPipes(validationPipeOptions);

  const allExceptionsFilter = new AllExceptionsFilter();
  app.useGlobalFilters(allExceptionsFilter);

  const apiPrefix = config.get<string>('app.apiPrefix', 'api');
  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  if (!isProduction) {
    swaggerSetUp(app);
  }

  const port = config.get<number>('app.port', 3001);
  await app.listen(port, '0.0.0.0');
  logger.log(`Application running on port ${port} [${nodeEnv}]`);
}

bootstrap().catch((error: unknown) => {
  logger.error('Fatal error during bootstrap', error);
  process.exit(1);
});
