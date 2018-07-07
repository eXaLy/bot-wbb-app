import { Bot } from '../../bot/bot';
import { MessageData } from '../../bot/messageData';
import { SoccerVideosFeedProcessor } from './soccerVideosFeedProcessor';
import { SubscriptionManager } from '../subscription/subscriptionManager';

export class SoccerVideosFeedManager {

  private bot: Bot;
  private subscriptionManager: SubscriptionManager;
  private processor: SoccerVideosFeedProcessor;

  constructor(
    bot: Bot,
    subscriptionManager: SubscriptionManager,
    processor: SoccerVideosFeedProcessor,
  ) {
    this.bot = bot;
    this.subscriptionManager = subscriptionManager;
    this.processor = processor;
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
      this.processor.enable();
    } else {
      this.processor.disable();
    }
  }

  private listenToFeed() : void {
    this.processor.feed.subscribe({
      next: text => this.onFeed(text),
    });
  }

  private onFeed(text: string) : void {
    const channels = this.subscriptionManager.getActiveChannelIds;
    for (const channelId of channels.arguments) {
      this.bot.reply(new MessageData(null, channelId, text));
    }
  }
}
