import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from './grpc/types/auth/auth';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: AUTH_PACKAGE_NAME,
      protoPath: [join(__dirname, 'grpc/proto/auth/auth.proto')],
      url: '127.0.0.1:3002',
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  await app
    .startAllMicroservices()
    .then(() => console.log('Start gRPC on port: 3002'));
}
bootstrap();
