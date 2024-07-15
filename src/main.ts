import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { AUTH_PACKAGE_NAME } from './grpc/types/auth/auth';

async function bootstrap() {
  const appLogger = new Logger('Auth service gRPC');

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

  await app
    .startAllMicroservices()
    .then(() => appLogger.log('Start gRPC on port: 3002'));
  await app.listen(3000).then(() => appLogger.log('Start app on port: 3000'));
}
bootstrap();
