import { Controller, Get } from "@nestjs/common";

import { DatabaseService } from "./database/database.service";

@Controller()
export class HealthController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get("health")
  getHealth() {
    return {
      service: "backend",
      status: "ok",
      database: Boolean(this.databaseService.client),
    };
  }
}
