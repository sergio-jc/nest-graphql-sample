import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaLibSql({
      url: process.env['DATABASE_URL'] ?? 'file:./prisma/dev.db',
      authToken: process.env['DATABASE_AUTH_TOKEN'],
    });

    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
