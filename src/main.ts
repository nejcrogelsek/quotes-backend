import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, { cors: true });

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe());
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
