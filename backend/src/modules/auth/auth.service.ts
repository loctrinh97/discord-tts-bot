import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  getDiscordAuthConfig() {
    return {
      provider: "discord",
      clientId: process.env.CLIENT_ID || null,
      redirectUri: process.env.DISCORD_REDIRECT_URI || null,
    };
  }
}
