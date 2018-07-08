import './utils/stringExt';
import { Bot } from './bot/bot';
import { ListenToReplyManager } from './workers/listenToReply/listenToReplyManager';
import { ListenToReplyProcessor } from './workers/listenToReply/listenToReplyProcessor';
import { SubscriptionManager } from './workers/subscription/subscriptionManager';
import { FeedManager } from './workers/feed/feedManager';
import { FeedRunner } from './workers/feed/feedRunner';
import { FeedProcessor } from './workers/feed/feedProcessor';

class App {

  constructor() {

    const bot = new Bot();

    new ListenToReplyManager(bot, new ListenToReplyProcessor());

    new FeedManager(
      bot,
      new SubscriptionManager(bot, 'soccer-feed', '!startsoccer', '!stopsoccer'),
      new FeedRunner(new FeedProcessor()),
    );
  }
}

export default new App();
