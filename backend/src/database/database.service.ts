import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import type { PrismaClient } from "@discord-tts-bot/database";

import { PRISMA } from "./database.constants";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  constructor(@Inject(PRISMA) private readonly prismaClient: PrismaClient) {}

  get client(): PrismaClient {
    return this.prismaClient;
  }

  async onModuleDestroy() {
    await this.prismaClient.$disconnect();
  }
}
