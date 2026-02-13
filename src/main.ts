import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HealthModule } from './health.module';
import { loadVaultSecret } from '@adeo/fact--vault-configuration-agregator';

async function bootstrap() {
  const helloBotSecret = await loadVaultSecret('hellobot/backend', process.env.ENV);

  process.env = {
    ...process.env,
    ...helloBotSecret,
  };

  const app = await NestFactory.create(AppModule);
  const healthApp = await NestFactory.create(HealthModule);

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS
  app.enableCors();

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('HelloBot BFF')
    .setDescription('Backend For Frontend pour Developer Hub API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 8080;
  const healthPort = process.env.HEALTH_PORT || 8081;
  await app.listen(port);
  await healthApp.listen(healthPort);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
  console.log(`Health check is running on: http://localhost:${healthPort}`);
}

bootstrap();
