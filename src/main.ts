import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });


  // app.enableCors({
  //   origin: true,
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true,
  // });

  app.enableCors()

  // app.enableCors({
  //   origin: [
  //     'http://localhost:3005/',
  //     'http://localhost:3001',
  //     'http://localhost:5000',
  //     //   'http://localhost:3001',
  //   ],
  // })

  // app.enableCors();
  //await app.listen(4005);
  await app.listen(3001);
  //coment
}
bootstrap();
