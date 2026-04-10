import { Injectable } from "@nestjs/common";

@Injectable()
export class MarketDataService {
  getSnapshot() {
    return {
      trackedAssets: 0,
      lastUpdatedAt: null,
    };
  }
}
