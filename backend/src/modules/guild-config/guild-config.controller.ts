import { Controller, Get, Param } from "@nestjs/common";

import { GuildConfigService } from "./guild-config.service";

@Controller("guilds")
export class GuildConfigController {
  constructor(private readonly guildConfigService: GuildConfigService) {}

  @Get(":guildId/config")
  getGuildConfig(@Param("guildId") guildId: string) {
    return this.guildConfigService.getGuildConfig(guildId);
  }
}
