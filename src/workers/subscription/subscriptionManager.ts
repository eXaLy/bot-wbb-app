import { Bot } from '../../bot/bot';
import { MessageData } from '../../bot/messageData';
import { BehaviorSubject, Observable } from 'rxjs';
import logger from '../../utils/logger';

const TAG = '[Subscription]';

export class SubscriptionManager {

  private bot: Bot;
  private key: string;
  private subscribeCommand: string;
  private unsubscribeCommand: string;
  private activeChannelIds = [] as string[];

  private hasSubscribers = new BehaviorSubject(false);

  constructor(bot: Bot, key: string, subscribeCommand: string, unsubscribeCommand: string) {
    this.bot = bot;
    this.key = key;
    this.subscribeCommand = subscribeCommand;
    this.unsubscribeCommand = unsubscribeCommand;
    this.listenToMessages();
  }

  public isActive = new Observable<boolean>((observer) => {
    this.hasSubscribers.subscribe({
      next: hasSubscribers => observer.next(hasSubscribers),
    });
  });

  public getActiveChannelIds() : string[] {
    return this.activeChannelIds.map(x => Object.assign({}, x));
  }

  private listenToMessages() : void {
    this.bot.messages.subscribe({
      next: data => this.onMessage(data),
    });
  }

  private onMessage(data: MessageData) : void {
    if (data.message.contains(this.subscribeCommand)) {
      this.addChannel(data.channelId);
      this.updateState();
    } else if (data.message.contains(this.unsubscribeCommand)) {
      this.deleteChannel(data.channelId);
      this.updateState();
    }
  }

  private updateState() {
    if (this.activeChannelIds.length > 0 && !this.hasSubscribers.getValue) {
      this.hasSubscribers.next(true);
      logger.info(TAG + ' Has active subscribers on [' + this.key + ']');
    } else if (this.hasSubscribers.getValue) {
      this.hasSubscribers.next(false);
      logger.info(TAG + ' No active subscribers on [' + this.key + ']');
    }
  }

  private addChannel(channelId: string) : void {
    if (this.activeChannelIds.indexOf(channelId) > -1) {
      this.activeChannelIds.push(channelId);
      logger.info(TAG + ' Added channel: [' + channelId + '] on [' + this.key + ']');
    }
    logger.info(TAG + ' Channel already added: [' + channelId + '] on [' + this.key + ']');
  }

  private deleteChannel(channelId: string) : void {
    const index = this.activeChannelIds.indexOf(channelId);
    if (index !== -1) {
      this.activeChannelIds.splice(index, 1);
      logger.info(TAG + ' Deleted channel: [' + channelId + '] on [' + this.key + ']');
    }
    logger.info(TAG + ' Channel already deleted: [' + channelId + '] on [' + this.key + ']');
  }
}
