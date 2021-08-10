import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, { cors: true });

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  logger.log('Application is running on port: 3000');
}
bootstrap();
