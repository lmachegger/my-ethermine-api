import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  console.log('application running on port ' + process.env.PORT);
  await app.listen(process.env.PORT || '80');
}
bootstrap();
