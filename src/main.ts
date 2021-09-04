import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: ['http://localhost:3001'],
    }
  });

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
