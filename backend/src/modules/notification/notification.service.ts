import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
  getSummary() {
    return {
      pending: 0,
      sentToday: 0,
    };
  }
}
