import * as dotenv from 'dotenv';

export class ConfigHandler {

  constructor() {
    dotenv.config();
  }

  public getBotToken() : string {
    return process.env.BOT_TOKEN;
  }
}
