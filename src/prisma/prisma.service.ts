import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

let listenersAdded = false;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('PrismaService');

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });
  }

  async onModuleInit() {
    if (!listenersAdded) {
      process.on('error', (event: any) => {
        this.logger.error(event);
      });
      process.on('warn', (event: any) => {
        this.logger.warn(event);
      });
      process.on('info', (event: any) => {
        this.logger.verbose(event);
      });
      process.on('query', ({ query, params }: any) => {
        this.logger.log(`Query: ${query} with Parameters: ${params}`);
      });

      listenersAdded = true;
    }

    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
