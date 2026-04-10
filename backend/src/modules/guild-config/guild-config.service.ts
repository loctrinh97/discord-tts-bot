import { Injectable } from "@nestjs/common";

import { DatabaseService } from "../../database/database.service";

@Injectable()
export class GuildConfigService {
  constructor(private readonly databaseService: DatabaseService) {}

  getGuildConfig(guildId: string) {
    return {
      guildId,
      botSetupComplete: false,
      features: {
        tickets: true,
        pricing: true,
        notifications: true,
      },
      persistence: {
        connected: Boolean(this.databaseService.client),
      },
    };
  }
}
