import { Bot } from '../../bot/bot';
import { MessageData } from '../../bot/messageData';
import { FeedRunner } from './feedRunner';
import { SubscriptionManager } from '../../subscription/subscriptionManager';

export class FeedManager {

  private bot: Bot;
  private subscriptionManager: SubscriptionManager;
  private runner: FeedRunner;

  constructor(
    bot: Bot,
    subscriptionManager: SubscriptionManager,
    runner: FeedRunner,
  ) {
    this.bot = bot;
    this.subscriptionManager = subscriptionManager;
    this.runner = runner;
    this.listenToActiveSubscriptions();
    this.listenToFeed();
  }

  private listenToActiveSubscriptions() : void {
    this.subscriptionManager.isActive.subscribe({
      next: data => this.onActive(data),
    });
  }

  private onActive(isActive: boolean) : void {
    if (isActive) {
      this.runner.enable();
    } else {
      this.runner.disable();
    }
  }

  private listenToFeed() : void {
    this.runner.feed.subscribe({
      next: text => this.onFeed(text),
    });
  }

  private onFeed(text: string) : void {
    const channels = this.subscriptionManager.getActiveChannelIds();
    for (const channelId of channels) {
      this.bot.reply(new MessageData(null, channelId, text));
    }
  }
}
