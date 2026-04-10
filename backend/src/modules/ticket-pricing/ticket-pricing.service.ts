import { Injectable } from "@nestjs/common";

@Injectable()
export class TicketPricingService {
  getSummary() {
    return {
      openTickets: 0,
      activePriceRules: 0,
    };
  }
}
