import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Global API Prefix
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
}
bootstrap();
