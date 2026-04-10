import { Global, Module } from "@nestjs/common";
import { prisma } from "@discord-tts-bot/database";

import { DatabaseService } from "./database.service";
import { PRISMA } from "./database.constants";

@Global()
@Module({
  providers: [
    {
      provide: PRISMA,
      useValue: prisma,
    },
    DatabaseService,
  ],
  exports: [PRISMA, DatabaseService],
})
export class DatabaseModule {}
