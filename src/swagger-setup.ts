import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerSetUp(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Store API')
    .setDescription('API for Store — real estate, vehicles and lots listings platform')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(`docs`, app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
}
