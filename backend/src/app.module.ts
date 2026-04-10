import { Module } from "@nestjs/common";

import { DatabaseModule } from "./database/database.module";
import { HealthController } from "./health.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { GuildConfigModule } from "./modules/guild-config/guild-config.module";
import { MarketDataModule } from "./modules/market-data/market-data.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { TicketPricingModule } from "./modules/ticket-pricing/ticket-pricing.module";

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    GuildConfigModule,
    TicketPricingModule,
    MarketDataModule,
    NotificationModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
