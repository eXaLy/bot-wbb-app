import { Bot } from '../../bot/bot';
import { MessageData } from '../../bot/messageData';
import { BehaviorSubject, Observable } from 'rxjs';
import logger from '../../utils/logger';
import { SubscriptionConfigData } from './subscriptionConfigData';

const TAG = '[SubscriptionManager]';

export class SubscriptionManager {

  private bot: Bot;
  private config: SubscriptionConfigData;
  private activeChannelIds = [] as string[];
  private hasSubscribers = new BehaviorSubject<boolean>(false);

  public isActive = new Observable<boolean>((observer) => {
    this.hasSubscribers.subscribe({
      next: hasSubscribers => observer.next(hasSubscribers),
    });
  });

  constructor(bot: Bot, config: SubscriptionConfigData) {
    this.bot = bot;
    this.config = config;
    this.listenToMessages();
  }

  public getActiveChannelIds() : string[] {
    return this.activeChannelIds.map(x => Object.assign({}, x));
  }

  private listenToMessages() : void {
    this.bot.messages.subscribe({
      next: data => this.onMessage(data),
    });
  }

  private onMessage(data: MessageData) : void {
    if (data.message.contains(this.config.subscribeCommand)) {
      this.addChannel(data.channelId);
      this.updateState();
    } else if (data.message.contains(this.config.unsubscribeCommand)) {
      this.deleteChannel(data.channelId);
      this.updateState();
    }
  }

  private updateState() {
    if (this.activeChannelIds.length > 0) {
      if (!this.hasSubscribers.value) {
        this.hasSubscribers.next(true);
        logger.info(TAG + ' Has active subscribers on [' + this.config.key + ']');
      }
    } else {
      if (this.hasSubscribers.value) {
        this.hasSubscribers.next(false);
        logger.info(TAG + ' No active subscribers on [' + this.config.key + ']');
      }
    }
  }

  private addChannel(channelId: string) : void {
    if (this.activeChannelIds.indexOf(channelId) === -1) {
      this.activeChannelIds.push(channelId);
      logger.info(TAG + ' Added channel: [' + channelId + '] on [' + this.config.key + ']');
    } else {
      logger.info(TAG + ' Channel already added: [' + channelId + '] on [' + this.config.key + ']');
    }
  }

  private deleteChannel(channelId: string) : void {
    const index = this.activeChannelIds.indexOf(channelId);
    if (index !== -1) {
      this.activeChannelIds.splice(index, 1);
      logger.info(TAG + ' Deleted channel: [' + channelId + '] on [' + this.config.key + ']');
    } else {
      logger.info(TAG + ' Channel already deleted: [' + channelId + ']'
      + ' on [' + this.config.key + ']');
    }
  }
}
