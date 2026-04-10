import { Controller, Get } from "@nestjs/common";

import { TicketPricingService } from "./ticket-pricing.service";

@Controller("ticket-pricing")
export class TicketPricingController {
  constructor(private readonly ticketPricingService: TicketPricingService) {}

  @Get("summary")
  getSummary() {
    return this.ticketPricingService.getSummary();
  }
}
