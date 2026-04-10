import { Controller, Get } from "@nestjs/common";

import { NotificationService } from "./notification.service";

@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get("summary")
  getSummary() {
    return this.notificationService.getSummary();
  }
}
