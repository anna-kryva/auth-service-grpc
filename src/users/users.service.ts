import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User> {
    return this.prisma.user.findFirstOrThrow({
      where: { email: { equals: email } },
    });
  }
}
