export class SubscriptionConfigData {
  key: string;
  subscribeCommand: string;
  unsubscribeCommand: string;

  constructor(key: string, subscribeCommand: string, unsubscribeCommand: string) {
    this.key = key;
    this.subscribeCommand = subscribeCommand;
    this.unsubscribeCommand = unsubscribeCommand;
  }
}
