import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // CORS configuration
  const corsOrigins = process.env.CORS_ORIGIN;
  const origins = corsOrigins
    ? corsOrigins.split(',').map((origin) => origin.trim()).filter(Boolean)
    : true;
  app.enableCors({ origin: origins });

  // Validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non déclarées
      forbidNonWhitelisted: true, // Erreur si propriétés inconnues
      transform: true, // Transforme les payloads en instances de DTO
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Timeout global pour les requêtes
  const server = await app.listen(process.env.PORT ?? 3000);
  server.setTimeout(30000); // 30 secondes

  logger.log(`Application running on port ${process.env.PORT ?? 3000}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
