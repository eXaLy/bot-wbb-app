export class ConfigHandler {

  public getBotToken() : string {
    return process.env.npm_package_config_bottoken;
  }
}
